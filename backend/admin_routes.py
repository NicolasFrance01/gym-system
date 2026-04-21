from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas # I'll create this next
from typing import List

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/stats")
def get_gym_stats(db: Session = Depends(get_db)):
    active_members = db.query(models.Member).filter(models.Member.status == "ACTIVO").count()
    revenue = db.query(models.Payment).filter(models.Payment.status == "paid").all()
    total_revenue = sum(p.amount for p in revenue)
    
    # Churn prediction placeholder logic
    churn_risk = db.query(models.Member).filter(models.Member.status == "DEUDA").count()
    
    return {
        "active_members": active_members,
        "total_revenue": total_revenue,
        "churn_risk_count": churn_risk,
        "alerts": [
            {"type": "churn", "message": f"{churn_risk} members at risk of cancellation"}
        ]
    }

@router.get("/members", response_model=List[schemas.MemberSchema])
def get_all_members(db: Session = Depends(get_db)):
    return db.query(models.Member).all()

@router.post("/members", response_model=schemas.MemberSchema)
def create_member(member: schemas.MemberCreate, db: Session = Depends(get_db)):
    db_member = models.Member(**member.dict())
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    return db_member

@router.post("/payments")
def record_payment(member_id: int, amount: float, db: Session = Depends(get_db)):
    payment = models.Payment(member_id=member_id, amount=amount, status="paid", method="card")
    db.add(payment)
    # Also update member status to ACTIVO if they were in debt
    member = db.query(models.Member).get(member_id)
    if member:
        member.status = "ACTIVO"
        member.payment_status = "paid"
    db.commit()
    return {"status": "payment recorded"}

@router.get("/pricing/dynamic")
def calculate_dynamic_price(db: Session = Depends(get_db)):
    # Real logic: increase price if active members > 80
    active_count = db.query(models.Member).filter(models.Member.status == "ACTIVO").count()
    base_price = 49.99
    demand_factor = 1.0 + (max(0, active_count - 50) * 0.01)
    return {"calculated_price": round(base_price * demand_factor, 2), "demand_factor": round(demand_factor, 2)}
