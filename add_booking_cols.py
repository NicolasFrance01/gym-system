import os
from sqlalchemy import create_engine, text

DATABASE_URL = "postgresql://neondb_owner:npg_eCrGKbztO9h2@ep-orange-cell-am4zmpka-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require"
engine = create_engine(DATABASE_URL)

try:
    with engine.begin() as conn:
        try:
            conn.execute(text("ALTER TABLE bookings ADD COLUMN class_schedule_id INTEGER"))
            print("Column 'class_schedule_id' added successfully to bookings.")
        except Exception as e:
            print("Skipped class_schedule_id:", e)
            
        try:
            conn.execute(text("ALTER TABLE bookings ADD COLUMN exercises_done JSON"))
            print("Column 'exercises_done' added successfully to bookings.")
        except Exception as e:
            print("Skipped exercises_done:", e)

except Exception as e:
    print("Error:", e)
