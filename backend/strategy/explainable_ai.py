
import requests
from collections import Counter
import re
import os

SENTIMENT_API_BASE = os.environ.get("SENTIMENT_API_BASE", "http://localhost:8000")

def get_headlines(ticker):
    resp = requests.get(f"{SENTIMENT_API_BASE}/sentiment/get_headlines", params={"ticker": ticker})
    resp.raise_for_status()
    return resp.json()

def tokenize(text):
    text = text.lower()
    return re.findall(r'\b[a-z]{3,}\b', text)

def get_keyword_importance(ticker, start=None, end=None, top_n=10):
    data = get_headlines(ticker)
    counter = Counter()
    for item in data:
        tokens = set(tokenize(item['headline']))
        for t in tokens:
            counter[t] += item.get('sentiment_score', 0)
    keywords = sorted(counter.items(), key=lambda x: abs(x[1]), reverse=True)[:top_n]
    return {"ticker": ticker, "keywords": [{"word": k, "score": round(v, 3)} for k, v in keywords]} 

