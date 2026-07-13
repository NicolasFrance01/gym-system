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

    if member.status != "INACTIVO" and member.joined_at:
        now = datetime.datetime.utcnow()
        days_since = (now - member.joined_at).days
        if days_since >= 30:
            new_status = "DEUDA"
        elif days_since >= 23:
            new_status = "POR VENCER"
        else:
            new_status = "ACTIVO"
        
        if member.status != new_status:
            member.status = new_status
            db.commit()
            db.refresh(member)

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
