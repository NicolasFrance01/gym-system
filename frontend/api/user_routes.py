from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from .database import get_db
from . import models
from . import schemas
import datetime

router = APIRouter(prefix="/user", tags=["User"])

@router.post("/login")
def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    member = db.query(models.Member).filter(models.Member.dni == credentials.dni).first()
    if not member:
        raise HTTPException(status_code=404, detail="Socio no encontrado")
    
    if member.password != credentials.password:
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")
    
    return {
        "status": "success",
        "member": {
            "id": member.id,
            "name": member.name,
            "dni": member.dni,
            "phone": member.phone,
            "email": member.email,
            "membership_type": member.membership_type,
            "status": member.status,
            "routine": member.routine
        }
    }

@router.put("/{dni}/password")
def change_password(dni: str, data: schemas.PasswordChange, db: Session = Depends(get_db)):
    member = db.query(models.Member).filter(models.Member.dni == dni).first()
    if not member:
        raise HTTPException(status_code=404, detail="Socio no encontrado")
    
    member.password = data.new_password
    db.commit()
    return {"status": "success", "message": "Contraseña actualizada correctamente"}

@router.get("/{dni}/wellness")
def get_wellness_score(dni: str, db: Session = Depends(get_db)):
    member = db.query(models.Member).filter(models.Member.dni == dni).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    
    # AI Logic placeholder for wellness score
    wellness = member.wellness_data or {"hrv": 0, "sleep": 0, "fatigue": 0}
    score = (wellness.get("hrv", 0) + (wellness.get("sleep", 0) * 100)) / 2
    
    return {
        "score": round(score, 1),
        "metrics": wellness,
        "suggestions": ["Take a rest day", "Focus on hydration"] if score < 50 else ["High intensity session recommended"]
    }

@router.get("/class_schedules")
def get_user_class_schedules(date: str, db: Session = Depends(get_db)):
    try:
        query_date = datetime.datetime.strptime(date, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Formato de fecha inválido")
        
    weekday = query_date.weekday()
    schedules = db.query(models.ClassSchedule).filter(models.ClassSchedule.day_of_week == weekday).all()
    
    result = []
    for s in schedules:
        bookings_count = db.query(models.Booking).filter(
            models.Booking.class_schedule_id == s.id,
            func.date(models.Booking.start_time) == query_date,
            models.Booking.status != "cancelled"
        ).count()
        
        result.append({
            "id": s.id,
            "name": s.name,
            "code": s.code,
            "start_time": s.start_time,
            "end_time": s.end_time,
            "color": s.color,
            "capacity": s.capacity,
            "bookings_count": bookings_count
        })
    return result

@router.get("/holidays")
def get_user_holidays(db: Session = Depends(get_db)):
    return db.query(models.Holiday).order_by(models.Holiday.date).all()

@router.get("/{dni}/bookings")
def get_user_bookings(dni: str, db: Session = Depends(get_db)):
    member = db.query(models.Member).filter(models.Member.dni == dni).first()
    if not member:
        raise HTTPException(status_code=404, detail="Socio no encontrado")
        
    bookings = db.query(models.Booking).filter(
        models.Booking.member_id == member.id
    ).order_by(models.Booking.start_time.desc()).all()
    
    result = []
    for b in bookings:
        result.append({
            "id": b.id,
            "class_schedule_id": b.class_schedule_id,
            "class_name": b.class_name,
            "start_time": b.start_time.isoformat() + "Z",
            "status": b.status,
            "exercises_done": b.exercises_done
        })
    return result

@router.post("/{dni}/book")
def book_class(dni: str, payload: dict, db: Session = Depends(get_db)):
    schedule_id = payload.get("class_schedule_id")
    date_str = payload.get("date")
    
    member = db.query(models.Member).filter(models.Member.dni == dni).first()
    if not member:
        raise HTTPException(status_code=404, detail="Socio no encontrado")
        
    schedule = db.query(models.ClassSchedule).filter(models.ClassSchedule.id == schedule_id).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Horario de clase no encontrado")
        
    try:
        class_date = datetime.datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Formato de fecha inválido")
        
    holiday = db.query(models.Holiday).filter(models.Holiday.date == date_str).first()
    if holiday:
        raise HTTPException(status_code=400, detail=f"No se puede reservar en un día no laborable: {holiday.description}")
        
    bookings_count = db.query(models.Booking).filter(
        models.Booking.class_schedule_id == schedule_id,
        func.date(models.Booking.start_time) == class_date,
        models.Booking.status != "cancelled"
    ).count()
    
    if bookings_count >= schedule.capacity:
        raise HTTPException(status_code=400, detail="La clase está completa para este día")
        
    existing = db.query(models.Booking).filter(
        models.Booking.member_id == member.id,
        models.Booking.class_schedule_id == schedule_id,
        func.date(models.Booking.start_time) == class_date
    ).first()
    
    if existing:
        if existing.status == "cancelled":
            existing.status = "reserved"
            db.commit()
            return {"status": "success", "booking_id": existing.id, "message": "Reserva reactivada"}
        else:
            raise HTTPException(status_code=400, detail="Ya tenés una reserva para esta clase en este día")

    plan = db.query(models.Plan).filter(models.Plan.name == member.membership_type, models.Plan.is_active == True).first()
    max_days = plan.days_per_week if plan else 3
    
    start_of_week = class_date - datetime.timedelta(days=class_date.weekday())
    end_of_week = start_of_week + datetime.timedelta(days=6)
    
    weekly_bookings = db.query(models.Booking).filter(
        models.Booking.member_id == member.id,
        func.date(models.Booking.start_time) >= start_of_week,
        func.date(models.Booking.start_time) <= end_of_week,
        models.Booking.status != "cancelled"
    ).count()
    
    if weekly_bookings >= max_days:
        raise HTTPException(
            status_code=400, 
            detail=f"Límite semanal de reservas alcanzado ({max_days} días por semana según tu plan)"
        )
        
    time_parts = schedule.start_time.split(":")
    start_dt = datetime.datetime.combine(class_date, datetime.time(int(time_parts[0]), int(time_parts[1])))
    
    new_booking = models.Booking(
        member_id=member.id,
        class_schedule_id=schedule.id,
        class_name=schedule.name,
        start_time=start_dt,
        status="reserved"
    )
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    return {"status": "success", "booking_id": new_booking.id}

@router.delete("/{dni}/bookings/{booking_id}")
def cancel_booking(dni: str, booking_id: int, db: Session = Depends(get_db)):
    member = db.query(models.Member).filter(models.Member.dni == dni).first()
    if not member:
        raise HTTPException(status_code=404, detail="Socio no encontrado")
        
    booking = db.query(models.Booking).filter(
        models.Booking.id == booking_id,
        models.Booking.member_id == member.id
    ).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Reserva no encontrada")
        
    booking.status = "cancelled"
    db.commit()
    return {"status": "success", "message": "Reserva cancelada"}

@router.put("/bookings/{booking_id}/workout")
def save_workout_history(booking_id: int, payload: dict, db: Session = Depends(get_db)):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Reserva no encontrada")
        
    booking.exercises_done = payload.get("exercises")
    db.commit()
    return {"status": "success", "message": "Entrenamiento guardado"}
