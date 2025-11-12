from fastapi import FastAPI
from fastapi.responses import JSONResponse
from datetime import date, timedelta
import random

app = FastAPI(title="Mock Sentiment API")

def gen_headlines(ticker):
    today = date.today()
    out = []
    for i in range(30):
        d = today - timedelta(days=29 - i)
        score = round(random.uniform(-0.6, 0.6), 3)
        headline = f"{ticker} news headline sample {i}"
        out.append({"date": str(d), "headline": headline, "sentiment_score": score})
    return out

@app.get("/sentiment/get_sentiment")
def get_sentiment(ticker: str):
    headlines = gen_headlines(ticker)
    agg = []
    for h in headlines:
        agg.append({
            "date": h["date"],
            "ticker": ticker,
            "sentiment_score": h["sentiment_score"],
            "headline_count": 1
        })
    return JSONResponse(agg)

@app.get("/sentiment/get_headlines")
def get_headlines(ticker: str):
    return JSONResponse(gen_headlines(ticker))
