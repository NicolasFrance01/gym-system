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

    # Add Plans
    plans_list = [
        models.Plan(name="Basic", price=35.00, days_per_week=3, classes=["EF", "PS"]),
        models.Plan(name="Premium", price=55.00, days_per_week=5, classes=["EF", "PS", "ZB"]),
        models.Plan(name="Elite", price=85.00, days_per_week=7, classes=["EF", "PS", "ZB", "EP", "SB", "RJ"])
    ]
    db.add_all(plans_list)
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

    # Add specific checkin/booking attendance history for key test members
    today = datetime.datetime.utcnow().replace(hour=10, minute=0, second=0, microsecond=0)
    
    # Member 1 (DNI 1001): Attended today, yesterday, 2 days ago (Streak = 3)
    m1 = db.query(models.Member).filter(models.Member.dni == "1001").first()
    if m1:
        m1.joined_at = today - datetime.timedelta(days=15)
        # Totem Checkin today
        db.add(models.Checkin(member_id=m1.id, checkin_at=today))
        # Booking attended yesterday
        db.add(models.Booking(member_id=m1.id, class_name="Entrenamiento Funcional", start_time=today - datetime.timedelta(days=1), status="attended"))
        # Totem Checkin 2 days ago
        db.add(models.Checkin(member_id=m1.id, checkin_at=today - datetime.timedelta(days=2)))
        # Totem Checkin 5 days ago (not consecutive, breaks here)
        db.add(models.Checkin(member_id=m1.id, checkin_at=today - datetime.timedelta(days=5)))

    # Member 2 (DNI 1002): Attended yesterday, 2 days ago (Missed today, but on day 1 of missing, Streak = 2)
    m2 = db.query(models.Member).filter(models.Member.dni == "1002").first()
    if m2:
        m2.joined_at = today - datetime.timedelta(days=15)
        db.add(models.Checkin(member_id=m2.id, checkin_at=today - datetime.timedelta(days=1)))
        db.add(models.Booking(member_id=m2.id, class_name="Zumba", start_time=today - datetime.timedelta(days=2), status="attended"))

    # Member 3 (DNI 1003): Attended 2 days ago, 3 days ago (Missed today and yesterday, day 2 of missing, Streak = 2)
    m3 = db.query(models.Member).filter(models.Member.dni == "1003").first()
    if m3:
        m3.joined_at = today - datetime.timedelta(days=15)
        db.add(models.Checkin(member_id=m3.id, checkin_at=today - datetime.timedelta(days=2)))
        db.add(models.Checkin(member_id=m3.id, checkin_at=today - datetime.timedelta(days=3)))

    # Member 4 (DNI 1004): Attended 3 days ago, 4 days ago (Missed today, yesterday, and 2 days ago: day 3 of missing, Streak = 0)
    m4 = db.query(models.Member).filter(models.Member.dni == "1004").first()
    if m4:
        m4.joined_at = today - datetime.timedelta(days=15)
        db.add(models.Checkin(member_id=m4.id, checkin_at=today - datetime.timedelta(days=3)))
        db.add(models.Checkin(member_id=m4.id, checkin_at=today - datetime.timedelta(days=4)))

    db.commit()
    print("Database seeded successfully with extensive mock data, plans, and attendance stories!")
    db.close()

if __name__ == "__main__":
    seed()
