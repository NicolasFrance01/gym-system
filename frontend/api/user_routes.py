from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .database import get_db
from . import models
from . import schemas
import datetime

router = APIRouter(prefix="/user", tags=["User"])

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

@router.post("/{dni}/book")
def book_class(dni: str, class_name: str, db: Session = Depends(get_db)):
    member = db.query(models.Member).filter(models.Member.dni == dni).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    
    new_booking = models.Booking(
        member_id=member.id,
        class_name=class_name,
        start_time=datetime.datetime.utcnow(),
        status="reserved"
    )
    db.add(new_booking)
    db.commit()
    return {"status": "success", "booking_id": new_booking.id}
