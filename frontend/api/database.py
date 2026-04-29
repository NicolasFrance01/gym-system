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

try:
    # Clean up URL (remove quotes, whitespace, and potential 'DATABASE_URL=' prefix)
    if DATABASE_URL:
        DATABASE_URL = DATABASE_URL.strip().strip("'").strip('"')
        if DATABASE_URL.startswith("DATABASE_URL="):
            DATABASE_URL = DATABASE_URL.replace("DATABASE_URL=", "", 1)
        
        if DATABASE_URL.startswith("postgres://"):
            DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
        elif not DATABASE_URL.startswith("postgresql://") and not DATABASE_URL.startswith("sqlite"):
            # Some users forget the protocol when pasting
            DATABASE_URL = "postgresql://" + DATABASE_URL

    from sqlalchemy.engine import url
    # Test if it's parseable
    url.make_url(DATABASE_URL)
    engine = create_engine(DATABASE_URL)
except Exception as e:
    # On Vercel, we MUST use :memory: if SQLite fallback is needed because the disk is read-only
    print(f"DATABASE_URL parsing failed for URL of length {len(DATABASE_URL) if DATABASE_URL else 0}: {e}")
    DATABASE_URL = "sqlite:///:memory:"
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
