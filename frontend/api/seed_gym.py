from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
import datetime

def seed():
    # Clear existing tables to apply new schema
    models.Base.metadata.drop_all(bind=engine)
    models.Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    # Create members
    members = [
        models.Member(
            dni="1111", 
            name="Nicolas France", 
            email="nicolas@example.com", 
            status="ACTIVO", 
            membership_type="Elite",
            wellness_data={"hrv": 72, "sleep": 0.85, "fatigue": 20}
        ),
        models.Member(
            dni="2222", 
            name="Maria Garcia", 
            email="maria@example.com", 
            status="POR VENCER", 
            membership_type="Premium",
            wellness_data={"hrv": 55, "sleep": 0.6, "fatigue": 45}
        ),
        models.Member(
            dni="3333", 
            name="Juan Perez", 
            email="juan@example.com", 
            status="DEUDA", 
            membership_type="Basic",
            wellness_data={"hrv": 40, "sleep": 0.4, "fatigue": 80}
        ),
    ]
    
    for m in members:
        existing = db.query(models.Member).filter(models.Member.dni == m.dni).first()
        if not existing:
            db.add(m)
    
    db.commit()
    
    # Add some payments
    member1 = db.query(models.Member).filter(models.Member.dni == "1111").first()
    if member1:
        payments = [
            models.Payment(member_id=member1.id, amount=99.99, status="paid", created_at=datetime.datetime.utcnow()),
            models.Payment(member_id=member1.id, amount=99.99, status="paid", created_at=datetime.datetime.utcnow() - datetime.timedelta(days=30)),
        ]
        db.add_all(payments)
    
    db.commit()
    print("Database seeded successfully!")
    db.close()

if __name__ == "__main__":
    seed()
