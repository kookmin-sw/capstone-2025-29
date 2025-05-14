from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DB_URL = "mysql+pymysql://user:1234qwer1@54.180.122.49:3306/ongi?charset=utf8mb4"

engine = create_engine(DB_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)