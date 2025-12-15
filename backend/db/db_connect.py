from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "postgresql+psycopg2://postgresql://aura_db_l0o9_user:46aAh2aKai98VZiwsSlUOgfH5gJgvlEI@dpg-d501maemcj7s73e177d0-a.virginia-postgres.render.com/aura_db_l0o9"

engine=create_engine(DATABASE_URL,echo=True)
SessionLocal = sessionmaker(autocommit=False,autoflush = False,bind=engine)

Base = declarative_base()
def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()

