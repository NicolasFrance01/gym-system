import os
import sys

# Add frontend/api to path so we can import database
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'frontend', 'api')))

from database import engine
from sqlalchemy import text

commands = [
    "ALTER TABLE exercises ADD COLUMN IF NOT EXISTS mechanics VARCHAR;",
    "ALTER TABLE exercises ADD COLUMN IF NOT EXISTS equipment VARCHAR;",
    "ALTER TABLE exercises ADD COLUMN IF NOT EXISTS video_url VARCHAR;",
    "ALTER TABLE exercises ADD COLUMN IF NOT EXISTS instructions VARCHAR;",
    "ALTER TABLE exercises ADD COLUMN IF NOT EXISTS rpe VARCHAR;",
    "ALTER TABLE exercises ADD COLUMN IF NOT EXISTS rir VARCHAR;"
]

try:
    with engine.begin() as conn:
        for cmd in commands:
            conn.execute(text(cmd))
            print(f"Executed: {cmd}")
    print("All columns added successfully.")
except Exception as e:
    print("Error:", e)
