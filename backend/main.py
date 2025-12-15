from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
from sqlalchemy.orm import sessionmaker
from db.db_connect import engine
from db.models import NewsSentiment, KeywordImportance
from sqlalchemy import func
from run_full_pipeline import simulate_strategy, generate_xai_sentences, run_pipeline


# ----------------------------
# FastAPI app setup
# ----------------------------
app = FastAPI(title="HedgeFundSim API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Session = sessionmaker(bind=engine)
session = Session()


# ----------------------------
# Request Models
# ----------------------------
class RunPipelineRequest(BaseModel):
    start: str = "2025-10-01"
    end: str = "2025-11-12"


class BacktestRequest(BaseModel):
    ticker: str
    start: str
    end: str


# ----------------------------
# Routes
# ----------------------------

@app.get("/")
def home():
    return {"message": "✅ HedgeFundSim backend is live! Use /fetch_news, /sentiment_score, or /market_mood endpoints."}


# ----------------------------
# 1️⃣ Fetch News API
# ----------------------------
@app.get("/fetch_news/{ticker}")
def fetch_news(ticker: str, days: int = 7):
    """
    Fetch latest news for a ticker from the last 'days' days.
    Automatically adjusts for timezone and missing recent entries.
    """
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)

    # Use DATE() for better matching and avoid timezone mismatch
    news = session.query(NewsSentiment).filter(
        func.lower(NewsSentiment.ticker) == ticker.lower(),
        func.date(NewsSentiment.created_at) >= start_date.date()
    ).order_by(NewsSentiment.created_at.desc()).all()

    if not news:
        return {"status": "success", "data": [], "message": f"No news found for {ticker}"}

    results = [
        {
            "title": n.title,
            "context": n.content,
            "sentiment": n.sentiment,
            "confidence": n.confidence,
            "source": n.source,
            "created_at": n.created_at.strftime("%Y-%m-%d %H:%M:%S")
        } for n in news
    ]

    return {"status": "success", "count": len(results), "data": results}


@app.get("/sentiment_score/{ticker}")
def sentiment_score(ticker: str, days: int = 30):
    """
    Returns the average sentiment score for the given ticker over the last 'days' days.
    """
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)

    rows = session.query(NewsSentiment).filter(
        func.lower(NewsSentiment.ticker) == ticker.lower(),
        func.date(NewsSentiment.created_at) >= start_date.date()
    ).all()

    if not rows:
        return {"ticker": ticker, "average_score": 0.0, "message": "No data found"}

    def to_score(sentiment):
        if sentiment.lower() == "positive":
            return 1
        elif sentiment.lower() == "negative":
            return -1
        return 0

    scores = [to_score(r.sentiment) * r.confidence for r in rows]
    avg_score = round(sum(scores) / len(scores), 3)

    return {"ticker": ticker, "average_score": avg_score, "total_articles": len(rows)}


@app.get("/market_mood/{ticker}")
def market_mood(ticker: str, days: int = 30):
    """
    Returns overall market mood for a ticker based on sentiment data.
    """
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)

    rows = session.query(NewsSentiment).filter(
        func.lower(NewsSentiment.ticker) == ticker.lower(),
        func.date(NewsSentiment.created_at) >= start_date.date()
    ).all()

    if not rows:
        return {"ticker": ticker, "mood": "Neutral", "message": "No sentiment data"}

    sentiment_counts = {"Positive": 0, "Negative": 0, "Neutral": 0}
    for r in rows:
        sentiment_counts[r.sentiment.capitalize()] = sentiment_counts.get(r.sentiment.capitalize(), 0) + 1

    dominant = max(sentiment_counts, key=sentiment_counts.get)
    mood_summary = {
        "Positive": f"{ticker} sentiment is optimistic 🚀",
        "Negative": f"{ticker} sentiment is bearish 📉",
        "Neutral": f"{ticker} sentiment is steady ⚖️"
    }

    return {
        "ticker": ticker,
        "dominant_mood": dominant,
        "counts": sentiment_counts,
        "summary": mood_summary[dominant]
    }
# ----------------------------
# 4️⃣ Run Full Pipeline
# ----------------------------
@app.post("/run_full_pipeline")
def run_full_pipeline_endpoint(req: RunPipelineRequest):
    try:
        run_pipeline(req.start, req.end)
        return {"status": "success", "message": "Pipeline executed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ----------------------------
# 5️⃣ Backtest / Simulate Strategy
# ----------------------------
@app.post("/simulate_strategy")
def run_backtest(req: BacktestRequest):
    try:
        results = simulate_strategy(req.ticker, req.start, req.end)
        return {"status": "success", "results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ----------------------------
# 6️⃣ XAI Endpoint
# ----------------------------
@app.get("/xai/{ticker}")
def explain_ticker(ticker: str):
    try:
        start = "2025-10-01"
        end = "2025-11-12"
        sentences = generate_xai_sentences(ticker, start, end)
        
        # Get top keywords from database
        top_keywords = session.query(KeywordImportance).filter(
            KeywordImportance.ticker == ticker
        ).order_by(KeywordImportance.importance_score.desc()).limit(10).all()
        
        keywords = [
            {"word": k.keyword, "score": float(k.importance_score)}
            for k in top_keywords
        ] if top_keywords else []
        
        return {
            "ticker": ticker,
            "explanations": sentences,
            "keywords": keywords
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
