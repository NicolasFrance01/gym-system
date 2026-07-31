import os
from sqlalchemy import create_engine, MetaData, Table
from sqlalchemy.orm import sessionmaker

# Assuming DATABASE_URL is somehow accessible, or we import database
import sys
sys.path.append('frontend/api')
from database import engine, SessionLocal
from models import Member, Booking

db = SessionLocal()
try:
    member = db.query(Member).filter(Member.dni == "00000").first()
    if member:
        # Clear exercises_done in all bookings for this member
        bookings = db.query(Booking).filter(Booking.member_id == member.id).all()
        for b in bookings:
            b.exercises_done = None
        
        # Also clear any routine just in case (optional, maybe not)
        # member.routine = []
        
        db.commit()
        print(f"Cleared exercises_done for member {member.name} (00000)")
    else:
        print("Member 00000 not found")
except Exception as e:
    print(f"Error: {e}")
finally:
    db.close()
