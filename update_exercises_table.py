import os
import psycopg2
from dotenv import load_dotenv

load_dotenv('frontend/.env')

DATABASE_URL = os.environ.get("DATABASE_URL")

commands = [
    "ALTER TABLE exercises ADD COLUMN IF NOT EXISTS mechanics VARCHAR;",
    "ALTER TABLE exercises ADD COLUMN IF NOT EXISTS equipment VARCHAR;",
    "ALTER TABLE exercises ADD COLUMN IF NOT EXISTS video_url VARCHAR;",
    "ALTER TABLE exercises ADD COLUMN IF NOT EXISTS instructions VARCHAR;",
    "ALTER TABLE exercises ADD COLUMN IF NOT EXISTS rpe VARCHAR;",
    "ALTER TABLE exercises ADD COLUMN IF NOT EXISTS rir VARCHAR;"
]

conn = psycopg2.connect(DATABASE_URL)
cur = conn.cursor()

try:
    for cmd in commands:
        cur.execute(cmd)
        print(f"Executed: {cmd}")
    conn.commit()
    print("All columns added successfully.")
except Exception as e:
    conn.rollback()
    print("Error:", e)
finally:
    cur.close()
    conn.close()
