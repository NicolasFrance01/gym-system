import os
import sys
import re

# Add backend directory to sys.path so we can import models and database
sys.path.append(os.path.join(os.path.dirname(__file__), "backend"))

from database import SessionLocal
import models

def clean_database():
    db = SessionLocal()
    try:
        schedules = db.query(models.ClassSchedule).all()
        count = 0
        for s in schedules:
            # Check if start_time or end_time is valid HH:MM
            pattern = re.compile(r'^(?:[01]\d|2[0-3]):[0-5]\d$')
            if not pattern.match(s.start_time) or not pattern.match(s.end_time):
                print(f"Deleting invalid schedule: {s.start_time} - {s.end_time} (ID: {s.id})")
                
                # delete associated bookings first if needed
                db.query(models.Booking).filter(models.Booking.class_schedule_id == s.id).delete()
                db.delete(s)
                count += 1
                
        db.commit()
        print(f"Deleted {count} invalid schedules.")
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    clean_database()
