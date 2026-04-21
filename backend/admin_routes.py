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

@router.post("/pricing/dynamic")
def calculate_dynamic_price(demand_factor: float = 1.0):
    # Aerolinea-style dynamic pricing logic
    base_price = 10.0
    dynamic_price = base_price * demand_factor
    return {"calculated_price": round(dynamic_price, 2)}
