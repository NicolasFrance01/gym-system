from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
import datetime
import random

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
    
    # Names for generating mock members
    first_names = ["Juan", "Maria", "Carlos", "Ana", "Luis", "Sofia", "Jorge", "Lucia", "Diego", "Valentina", "Pedro", "Camila"]
    last_names = ["Gomez", "Perez", "Rodriguez", "Fernandez", "Lopez", "Martinez", "Gonzalez", "Romero", "Sosa", "Torres"]
    
    members = []
    # Create 30 random members
    for i in range(1, 31):
        status = random.choice(["ACTIVO", "ACTIVO", "ACTIVO", "ACTIVO", "DEUDA", "POR VENCER"])
        membership = random.choice(["Basic", "Premium", "Elite"])
        m = models.Member(
            dni=f"{1000 + i}",
            name=f"{random.choice(first_names)} {random.choice(last_names)}",
            email=f"user{i}@example.com",
            status=status,
            membership_type=membership,
            joined_at=datetime.datetime.utcnow() - datetime.timedelta(days=random.randint(10, 365)),
            wellness_data={"hrv": random.randint(40, 90), "sleep": round(random.uniform(0.4, 0.9), 2), "fatigue": random.randint(10, 90)}
        )
        members.append(m)
        db.add(m)
    
    db.commit()

    # Add Staff
    staff = [
        models.Staff(name="Master Admin", username="master", password="Ndf010399", role="Gerente"),
        models.Staff(name="Martin Ruiz", role="Trainer"),
        models.Staff(name="Lorena Diaz", role="Reception"),
        models.Staff(name="Ricardo Vega", role="Manager")
    ]
    db.add_all(staff)
    db.commit()

    # Generate Payments for the last 6 months to create a nice chart
    all_members = db.query(models.Member).all()
    
    for month_offset in range(6):
        month_date = datetime.datetime.utcnow() - datetime.timedelta(days=month_offset * 30)
        
        # In past months, let's say 80% of members paid
        for m in all_members:
            if random.random() < 0.8:
                amount = 29.99 if m.membership_type == "Basic" else 49.99 if m.membership_type == "Premium" else 99.99
                # Add some randomness to payment dates within the month
                payment_date = month_date - datetime.timedelta(days=random.randint(1, 28))
                p = models.Payment(member_id=m.id, amount=amount, status="paid", created_at=payment_date)
                db.add(p)

    db.commit()
    print("Database seeded successfully with extensive mock data!")
    db.close()

if __name__ == "__main__":
    seed()
