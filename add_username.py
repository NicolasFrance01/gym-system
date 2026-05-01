import sys
sys.path.append('backend')
from database import engine
from sqlalchemy import text

def add_username_column():
    try:
        with engine.begin() as conn:
            conn.execute(text("ALTER TABLE staff ADD COLUMN username VARCHAR;"))
            conn.execute(text("CREATE UNIQUE INDEX ix_staff_username ON staff (username);"))
        print("Successfully added username column.")
    except Exception as e:
        print(f"Error (column might already exist): {e}")

if __name__ == "__main__":
    add_username_column()
