from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
import os
from dotenv import load_dotenv

# Use absolute path for .env to ensure consistency
base_dir = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(base_dir, ".env"))

DATABASE_URL = os.getenv("DATABASE_URL")

# Robust fallback for empty, None, or string "None"/"undefined"
if not DATABASE_URL or DATABASE_URL.strip() in ("", "None", "undefined", "null"):
    DATABASE_URL = "sqlite:///./gym.db"

# Clean up URL (remove quotes, whitespace, and potential 'DATABASE_URL=' prefix)
DATABASE_URL = DATABASE_URL.strip().strip("'").strip('"')
if DATABASE_URL.startswith("DATABASE_URL="):
    DATABASE_URL = DATABASE_URL.replace("DATABASE_URL=", "", 1)

if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

try:
    engine = create_engine(DATABASE_URL)
    # Quick check to see if it's even a valid URL format for SQLAlchemy
    from sqlalchemy.engine import url
    url.make_url(DATABASE_URL)
except Exception as e:
    print(f"DATABASE_URL parsing failed: {e}. Falling back to SQLite.")
    DATABASE_URL = "sqlite:///./gym.db"
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
