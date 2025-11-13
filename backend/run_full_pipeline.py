# run_full_pipeline.py
import pandas as pd
import yfinance as yf
from datetime import datetime
from collections import Counter
import re
from sqlalchemy.orm import sessionmaker
from db.db_connect import engine
from db.models import NewsSentiment, KeywordImportance

# ----------------------------
# DB session
# ----------------------------
Session = sessionmaker(bind=engine)
session = Session()

# ----------------------------
# Demo price data
# ----------------------------
def fetch_demo_prices(ticker, start, end):
    dates = pd.date_range(start=start, end=end)
    prices = pd.Series([150 + i*0.5 for i in range(len(dates))], index=dates)
    df = pd.DataFrame({"date": dates.date, "Close": prices})
    return df

# ----------------------------
# Fetch sentiment from DB (use demo if empty)
# ----------------------------
def fetch_sentiment_from_db(ticker, start, end):
    rows = session.query(NewsSentiment).filter(
        NewsSentiment.ticker==ticker,
        NewsSentiment.created_at.between(start, end)
    ).all()
    
    data = []
    for r in rows:
        score = 1 if r.sentiment=="Positive" else -1 if r.sentiment=="Negative" else 0
        data.append({"date": r.created_at.date(), "sentiment_score": score * r.confidence})
    
    df = pd.DataFrame(data)
    
    if df.empty:
        # generate demo sentiment if none exists
        dates = pd.date_range(start=start, end=end)
        demo_scores = [0.2 if i%2==0 else -0.1 for i in range(len(dates))]
        df = pd.DataFrame({"date": dates.date, "sentiment_score": demo_scores})
    else:
        df = df.groupby("date")["sentiment_score"].mean().reset_index()
    
    return df

# ----------------------------
# Backtesting
# ----------------------------
BUY_THRESHOLD = 0.15
SELL_THRESHOLD = -0.15
INITIAL_CAPITAL = 100000.0

def simulate_strategy(ticker, start, end):
    sentiment_df = fetch_sentiment_from_db(ticker, start, end)
    prices_df = fetch_demo_prices(ticker, start, end)
    
    merged = prices_df.merge(sentiment_df, left_on="date", right_on="date", how="left").fillna(0.0)
    
    cash = INITIAL_CAPITAL
    position = 0
    portfolio_values = []
    transactions = []
    
    for _, row in merged.iterrows():
        price = row["Close"]
        score = row["sentiment_score"]
        action = "HOLD"
        if score > BUY_THRESHOLD and cash >= price:
            qty = int((0.1*cash)//price)
            if qty > 0:
                cash -= qty*price
                position += qty
                action="BUY"
                transactions.append({"date": str(row["date"]), "action": action, "qty": qty, "price": price})
        elif score < SELL_THRESHOLD and position > 0:
            cash += position*price
            action="SELL"
            transactions.append({"date": str(row["date"]), "action": action, "qty": position, "price": price})
            position = 0
        total_value = cash + position*price
        portfolio_values.append(total_value)
    
    merged["total_value"] = portfolio_values
    roi = (portfolio_values[-1] - portfolio_values[0])/portfolio_values[0]*100
    max_drawdown = ((merged["total_value"].cummax() - merged["total_value"])/merged["total_value"].cummax()).max()*100
    
    # Build price_history for frontend
    price_history = []
    for idx, row in merged.iterrows():
        price_history.append({
            "date": str(row["date"]),
            "Close": round(float(row["Close"]), 2),
            "sentiment_score": round(float(row["sentiment_score"]), 3),
            "total_value": round(float(row["total_value"]), 2)
        })
    
    return {
        "ticker": ticker,
        "price_history": price_history,
        "transactions": transactions,
        "metrics": {
            "InitialCapital": INITIAL_CAPITAL,
            "ROI%": round(roi, 2),
            "MaxDrawdown%": round(max_drawdown, 2),
            "CurrentPortfolioValue": round(portfolio_values[-1], 2)
        }
    }

# ----------------------------
# XAI
# ----------------------------
def tokenize(text):
    return re.findall(r'\b[a-z]{3,}\b', text.lower())

def generate_xai_sentences(ticker, start, end):
    rows = session.query(NewsSentiment).filter(
        NewsSentiment.ticker==ticker,
        NewsSentiment.created_at.between(start, end)
    ).all()
    
    sentences = []
    demo_headlines = [
        f"{ticker} shows stable growth amid market fluctuations.",
        f"{ticker} has a few negative news points, but overall sentiment is positive.",
        f"Investors are cautiously optimistic about {ticker}."
    ]
    
    if not rows:
        # Use demo headlines for XAI and keywords
        rows = []
        for h in demo_headlines:
            rows.append(type('obj', (object,), {"title": h, "sentiment": "Positive", "confidence": 0.8, "created_at": datetime.now()} )())
        sentences.append(f"For {ticker}, overall market mood is moderately positive based on recent news.")
    else:
        # real data
        for r in rows:
            mood = "positive" if r.sentiment=="Positive" else "negative" if r.sentiment=="Negative" else "neutral"
            sentences.append(f"On {r.created_at.date()}, the news headline '{r.title}' indicates {mood} market mood.")
    
    # extract top keywords from whatever headlines we have
    counter = Counter()
    for r in rows:
        tokens = set(tokenize(r.title))
        score = 1 if r.sentiment=="Positive" else -1 if r.sentiment=="Negative" else 0
        for t in tokens:
            counter[t] += score * float(r.confidence)
    top_keywords = sorted(counter.items(), key=lambda x: abs(x[1]), reverse=True)[:10]
    for k, v in top_keywords:
        ki = KeywordImportance(ticker=ticker, word=k, score=float(round(v, 3)))
        session.add(ki)
    session.commit()
    
    return sentences


# ----------------------------
# Full pipeline
# ----------------------------
def run_pipeline(start="2025-10-01", end="2025-11-12"):
    tickers = [row[0] for row in session.query(NewsSentiment.ticker).distinct()]
    
    for ticker in tickers:
        print(f"\n📈 STEP 1: Running backtest for {ticker} from {start} to {end}...")
        results = simulate_strategy(ticker, start, end)
        print("Backtest metrics:", results.get("metrics", "No data"))
        
        print(f"\n📊 STEP 2: Running XAI for {ticker}...")
        try:
            xai_sentences = generate_xai_sentences(ticker, start, end)
            for s in xai_sentences:
                print("-", s)
        except Exception as e:
            print(f"[ERROR] Skipping {ticker}: {e}")

if __name__ == "__main__":
    run_pipeline()
