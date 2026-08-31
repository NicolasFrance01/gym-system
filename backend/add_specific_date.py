from database import engine
from sqlalchemy import text

def upgrade():
    try:
        with engine.connect() as conn:
            conn.execute(text("ALTER TABLE class_schedules ADD COLUMN specific_date VARCHAR;"))
            conn.commit()
            print("Successfully added specific_date column to class_schedules")
    except Exception as e:
        print(f"Error (maybe column already exists?): {e}")

if __name__ == "__main__":
    upgrade()
