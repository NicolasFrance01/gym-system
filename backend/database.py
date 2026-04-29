from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Hardcoded connection string exactly as requested to prevent parsing errors
DATABASE_URL = "postgresql://neondb_owner:npg_eCrGKbztO9h2@ep-orange-cell-am4zmpka-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require"

try:
    engine = create_engine(DATABASE_URL)
    # Fast test
    with engine.connect() as conn:
        pass
    print("Database connection successful.")
except Exception as e:
    print(f"CRITICAL ERROR: Failed to connect to database: {e}")
    raise

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
