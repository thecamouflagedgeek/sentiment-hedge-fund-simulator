 
import requests
import pandas as pd
import yfinance as yf
from datetime import datetime, timedelta
import os

# Base URL for Hazel's sentiment API (or mock_sentiment)
SENTIMENT_API_BASE = os.environ.get("SENTIMENT_API_BASE", "http://localhost:8000")

# Strategy constants
BUY_THRESHOLD = 0.2
SELL_THRESHOLD = -0.2
INITIAL_CAPITAL = 100000.0


def fetch_sentiment(ticker, start=None, end=None):
    """Fetch sentiment data for a given ticker from Hazel's API"""
    url = f"{SENTIMENT_API_BASE}/sentiment/get_sentiment"
    params = {"ticker": ticker}
    if start:
        params["start"] = start
    if end:
        params["end"] = end

    resp = requests.get(url, params=params, timeout=10)
    resp.raise_for_status()
    df = pd.DataFrame(resp.json())

    if df.empty:
        print(f"[WARN] No sentiment data for {ticker}")
        return pd.DataFrame(columns=["sentiment_score"])

    # Normalize index
    df["date"] = pd.to_datetime(df["date"]).dt.date
    df = df.set_index("date").sort_index()
    df.index = pd.to_datetime(df.index)
    df.index.name = "date"
    return df


def fetch_prices(ticker, start, end):
    """Fetch and clean historical stock prices using Yahoo Finance"""
    data = yf.download(ticker, start=start, end=end, progress=False)
    if data.empty:
        raise ValueError(f"No price data found for {ticker}")

    # ✅ FIX: handle MultiIndex columns like ('AAPL', 'Close')
    if isinstance(data.columns, pd.MultiIndex):
        # flatten multi-index into single column names like 'AAPL_Close'
        data.columns = ["_".join(col).strip() for col in data.columns.values]

        # try to locate the Close column dynamically
        close_col = [c for c in data.columns if "Close" in c][0]
        data = data[[close_col]].rename(columns={close_col: "Close"})
    else:
        # regular single index case
        if "Close" not in data.columns:
            raise ValueError(f"Expected 'Close' column not found for {ticker}")
        data = data[["Close"]].copy()

    # ✅ clean up index
    data = data.reset_index()
    data["date"] = pd.to_datetime(data["Date"]).dt.date
    data = data[["date", "Close"]]
    data = data.set_index("date")
    return data


def compute_metrics(portfolio_values):
    """Compute ROI and Max Drawdown"""
    start_val = portfolio_values.iloc[0]
    end_val = portfolio_values.iloc[-1]
    roi = (end_val - start_val) / start_val * 100.0

    running_max = portfolio_values.cummax()
    drawdown = (portfolio_values - running_max) / running_max
    max_drawdown = drawdown.min() * 100.0

    return {"ROI%": round(roi, 2), "MaxDrawdown%": round(max_drawdown, 2)}


def simulate_strategy(ticker, start=None, end=None):
    """Run sentiment-based trading simulation"""
    # Default to last 30 days
    if end is None:
        end_date = datetime.utcnow().date()
    else:
        end_date = datetime.strptime(end, "%Y-%m-%d").date()

    if start is None:
        start_date = end_date - timedelta(days=30)
    else:
        start_date = datetime.strptime(start, "%Y-%m-%d").date()

    print(f"[INFO] Running simulation for {ticker} from {start_date} to {end_date}")

    # Fetch prices and sentiment
    prices = fetch_prices(ticker, start_date.isoformat(), end_date.isoformat())
    sentiment = fetch_sentiment(ticker, start_date.isoformat(), end_date.isoformat())

    # ✅ Safe merge using reset_index
    prices.index = pd.to_datetime(prices.index)
    sentiment.index = pd.to_datetime(sentiment.index)
    prices.index.name = "date"
    sentiment.index.name = "date"

    merged = prices.reset_index().merge(
        sentiment.reset_index(), on="date", how="left"
    ).fillna(0.0)

    df = merged.set_index("date")

    # Initialize portfolio
    cash = INITIAL_CAPITAL
    position = 0
    portfolio_values = []
    transactions = []

    for date, row in df.iterrows():
        price = row["Close"]
        sent_score = row["sentiment_score"]
        action = "HOLD"

        # Buy logic
        if sent_score > BUY_THRESHOLD and cash >= price:
            qty = int((0.1 * cash) // price)
            if qty > 0:
                cash -= qty * price
                position += qty
                action = "BUY"
                transactions.append({
                    "date": str(date.date()),
                    "action": action,
                    "qty": qty,
                    "price": round(price, 2),
                    "sentiment": round(sent_score, 3)
                })

        # Sell logic
        elif sent_score < SELL_THRESHOLD and position > 0:
            cash += position * price
            action = "SELL"
            transactions.append({
                "date": str(date.date()),
                "action": action,
                "qty": position,
                "price": round(price, 2),
                "sentiment": round(sent_score, 3)
            })
            position = 0

        total_value = cash + position * price
        portfolio_values.append(total_value)

    # Record metrics
    df["total_value"] = portfolio_values
    metrics = compute_metrics(df["total_value"])

    print(f"[RESULT] {ticker} ROI={metrics['ROI%']}%, MaxDrawdown={metrics['MaxDrawdown%']}%")

    return {
        "ticker": ticker,
        "start": str(start_date),
        "end": str(end_date),
        "initial_capital": INITIAL_CAPITAL,
        "metrics": metrics,
        "transactions": transactions,
        "portfolio_values": df[["Close", "sentiment_score", "total_value"]]
            .reset_index()
            .to_dict(orient="records")
    }

