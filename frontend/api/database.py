import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

# Use absolute path for .env to ensure consistency
base_dir = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(base_dir, ".env"))

# Fallback DATABASE_URL if not found in environment (e.g. local dev without .env)
FALLBACK_URL = "postgresql://neondb_owner:npg_eCrGKbztO9h2@ep-orange-cell-am4zmpka-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require"

DATABASE_URL = os.getenv("DATABASE_URL", FALLBACK_URL)

# Basic URL cleanups in case of misconfigurations
if DATABASE_URL:
    DATABASE_URL = DATABASE_URL.strip().strip("'").strip('"')
    if DATABASE_URL.startswith("DATABASE_URL="):
        DATABASE_URL = DATABASE_URL.replace("DATABASE_URL=", "", 1)
    if DATABASE_URL.startswith("postgres://") and not DATABASE_URL.startswith("postgresql://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

print(f"Connecting to database... (URL length: {len(DATABASE_URL) if DATABASE_URL else 0})")

try:
    engine = create_engine(DATABASE_URL)
    # Test connection
    with engine.connect() as conn:
        pass
    print("Database connection successful.")
except Exception as e:
    print(f"CRITICAL ERROR: Failed to connect to database: {e}")
    # Raise the exception instead of falling back to sqlite:///:memory: 
    # to avoid silent failures with an empty database.
    raise

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
