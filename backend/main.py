from fastapi import FastAPI, HTTPException
from strategy.backtest import simulate_strategy
from strategy.explainable_ai import get_keyword_importance

app = FastAPI(title="Sentiment Hedge Fund Simulator - Strategy")

@app.get("/simulate_strategy")
def simulate_strategy_endpoint(ticker: str, start: str = None, end: str = None):
    try:
        result = simulate_strategy(ticker, start, end)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/get_xai")
def get_xai_endpoint(ticker: str, start: str = None, end: str = None, top_n: int = 10):
    try:
        result = get_keyword_importance(ticker, start, end, top_n)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
