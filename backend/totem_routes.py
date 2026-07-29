from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.orm.attributes import flag_modified
from database import get_db
import models
import datetime

router = APIRouter(prefix="/totem", tags=["Totem"])


@router.get("/{dni}")
def get_totem_member(dni: str, db: Session = Depends(get_db)):
    member = db.query(models.Member).filter(models.Member.dni == dni).first()
    if not member:
        raise HTTPException(status_code=404, detail="Socio no encontrado")

    wellness = member.wellness_data or {}
    return {
        "id": member.id,
        "dni": member.dni,
        "name": member.name,
        "email": member.email,
        "status": member.status,
        "membership_type": member.membership_type,
        "joined_at": member.joined_at.isoformat() if member.joined_at else None,
        "last_checkin": member.last_checkin.isoformat() if member.last_checkin else None,
        "evolution": wellness.get("evolution", []),
    }


@router.post("/{dni}/evolution")
def save_evolution_entry(dni: str, entry: dict, db: Session = Depends(get_db)):
    member = db.query(models.Member).filter(models.Member.dni == dni).first()
    if not member:
        raise HTTPException(status_code=404, detail="Socio no encontrado")

    wellness = dict(member.wellness_data) if member.wellness_data else {}
    evolution = list(wellness.get("evolution", []))

    today = datetime.date.today().isoformat()
    idx = next((i for i, e in enumerate(evolution) if e.get("date") == today), None)
    if idx is not None:
        evolution[idx] = entry
    else:
        evolution.append(entry)

    wellness["evolution"] = evolution
    member.wellness_data = wellness
    flag_modified(member, "wellness_data")
    db.commit()

    return {"success": True, "evolution": evolution}

@router.post("/{dni}/checkin/adicional")
def checkin_adicional(dni: str, db: Session = Depends(get_db)):
    member = db.query(models.Member).filter(models.Member.dni == dni).first()
    if not member:
        raise HTTPException(status_code=404, detail="Socio no encontrado")
        
    now = datetime.datetime.utcnow()
    # Find any reserved class for this user around current time (e.g. -15 mins to +45 mins)
    # Tolerance: 15 mins before class, 10 mins after class
    start_window = now - datetime.timedelta(minutes=10)
    end_window = now + datetime.timedelta(minutes=15)
    
    booking = db.query(models.Booking).filter(
        models.Booking.member_id == member.id,
        models.Booking.status == "reserved",
        models.Booking.start_time >= start_window,
        models.Booking.start_time <= end_window
    ).first()
    
    if not booking:
        return {"status": "error", "detail": "No tienes clases reservadas para este horario"}
        
    booking.status = "attended"
    db.commit()
    
    return {
        "status": "success", 
        "detail": f"Asistencia confirmada para {booking.class_name}",
        "class_name": booking.class_name,
        "member_name": member.name
    }

