from db.db_connect import SessionLocal
from db.models import KeywordImportance

def store_keywords(ticker, keywords):
    """
    keywords: List[dict] -> [{"word": "market", "score": 0.85}, ...]
    """
    db = SessionLocal()
    for k in keywords:
        db.add(KeywordImportance(ticker=ticker, word=k["word"], score=k["score"]))
    db.commit()
    db.close()
