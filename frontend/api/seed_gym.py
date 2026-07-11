from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
import datetime

def seed():
    # Clear existing tables to apply new schema
    models.Base.metadata.drop_all(bind=engine)
    models.Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Seed ClassSchedules from Gym Schedule Image
    class_schedules = [
        # Lunes (0)
        models.ClassSchedule(name="Entrenamiento Funcional", code="EF", day_of_week=0, start_time="08:30", end_time="09:30", color="#3b82f6", capacity=15),
        models.ClassSchedule(name="Entrenamiento Personalizado", code="EP", day_of_week=0, start_time="10:00", end_time="11:00", color="#ec4899", capacity=10),
        models.ClassSchedule(name="Entrenamiento Funcional", code="EF", day_of_week=0, start_time="18:15", end_time="19:15", color="#3b82f6", capacity=15),
        models.ClassSchedule(name="Pilates en Suelo", code="PS", day_of_week=0, start_time="18:15", end_time="19:15", color="#f97316", capacity=12),
        models.ClassSchedule(name="Entrenamiento Funcional", code="EF", day_of_week=0, start_time="19:30", end_time="20:30", color="#3b82f6", capacity=15),
        
        # Martes (1)
        models.ClassSchedule(name="Pilates en Suelo", code="PS", day_of_week=1, start_time="08:50", end_time="09:50", color="#f97316", capacity=12),
        models.ClassSchedule(name="Entrenamiento Funcional", code="EF", day_of_week=1, start_time="10:00", end_time="11:00", color="#3b82f6", capacity=15),
        models.ClassSchedule(name="Salsa y Bachata", code="SB", day_of_week=1, start_time="17:30", end_time="18:30", color="#eab308", capacity=20),
        models.ClassSchedule(name="Zumba", code="ZB", day_of_week=1, start_time="18:30", end_time="19:30", color="#ef4444", capacity=20),
        models.ClassSchedule(name="Reguetón Juvenil", code="RJ", day_of_week=1, start_time="19:30", end_time="20:30", color="#06b6d4", capacity=20),
        
        # Miércoles (2)
        models.ClassSchedule(name="Entrenamiento Funcional", code="EF", day_of_week=2, start_time="08:30", end_time="09:30", color="#3b82f6", capacity=15),
        models.ClassSchedule(name="Entrenamiento Personalizado", code="EP", day_of_week=2, start_time="10:00", end_time="11:00", color="#ec4899", capacity=10),
        models.ClassSchedule(name="Entrenamiento Funcional", code="EF", day_of_week=2, start_time="18:15", end_time="19:15", color="#3b82f6", capacity=15),
        models.ClassSchedule(name="Pilates en Suelo", code="PS", day_of_week=2, start_time="18:15", end_time="19:15", color="#f97316", capacity=12),
        models.ClassSchedule(name="Entrenamiento Funcional", code="EF", day_of_week=2, start_time="19:30", end_time="20:30", color="#3b82f6", capacity=15),
        
        # Jueves (3)
        models.ClassSchedule(name="Pilates en Suelo", code="PS", day_of_week=3, start_time="08:50", end_time="09:50", color="#f97316", capacity=12),
        models.ClassSchedule(name="Entrenamiento Funcional", code="EF", day_of_week=3, start_time="10:00", end_time="11:00", color="#3b82f6", capacity=15),
        models.ClassSchedule(name="Salsa y Bachata", code="SB", day_of_week=3, start_time="17:30", end_time="18:30", color="#eab308", capacity=20),
        models.ClassSchedule(name="Zumba", code="ZB", day_of_week=3, start_time="18:30", end_time="19:30", color="#ef4444", capacity=20),
        models.ClassSchedule(name="Reguetón Juvenil", code="RJ", day_of_week=3, start_time="19:30", end_time="20:30", color="#06b6d4", capacity=20),
        
        # Viernes (4)
        models.ClassSchedule(name="Entrenamiento Funcional", code="EF", day_of_week=4, start_time="08:30", end_time="09:30", color="#3b82f6", capacity=15),
        models.ClassSchedule(name="Entrenamiento Personalizado", code="EP", day_of_week=4, start_time="10:00", end_time="11:00", color="#ec4899", capacity=10),
        models.ClassSchedule(name="Entrenamiento Funcional", code="EF", day_of_week=4, start_time="18:15", end_time="19:15", color="#3b82f6", capacity=15),
        models.ClassSchedule(name="Entrenamiento Funcional", code="EF", day_of_week=4, start_time="19:30", end_time="20:30", color="#3b82f6", capacity=15)
    ]
    db.add_all(class_schedules)
    db.commit()
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
