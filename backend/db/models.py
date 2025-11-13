
from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from datetime import datetime
from .db_connect import Base

class NewsSentiment(Base):
    __tablename__ = "news_sentiment"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    content = Column(String)
    sentiment = Column(String)
    confidence = Column(Float)
    ticker = Column(String)
    source = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class KeywordImportance(Base):
    __tablename__ = "keyword_importance"
    id = Column(Integer, primary_key=True, index=True)
    ticker = Column(String)
    word = Column(String)
    score = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
