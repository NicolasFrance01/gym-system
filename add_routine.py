import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

DATABASE_URL = "postgresql://neondb_owner:npg_eCrGKbztO9h2@ep-orange-cell-am4zmpka-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require"
engine = create_engine(DATABASE_URL)

try:
    with engine.begin() as conn:
        conn.execute(text("ALTER TABLE members ADD COLUMN routine JSON"))
        print("Column 'routine' added successfully.")
except Exception as e:
    print("Error:", e)
