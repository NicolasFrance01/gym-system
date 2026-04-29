from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .database import get_db
from . import models
from . import schemas
from typing import List
import datetime
from sqlalchemy import func

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/stats")
def get_gym_stats(db: Session = Depends(get_db)):
    active_members = db.query(models.Member).filter(models.Member.status == "ACTIVO").count()
    revenue = db.query(models.Payment).filter(models.Payment.status == "paid").all()
    total_revenue = sum(p.amount for p in revenue)
    
    churn_risk = db.query(models.Member).filter(models.Member.status == "DEUDA").count()
    por_vencer = db.query(models.Member).filter(models.Member.status == "POR VENCER").count()
    
    return {
        "active_members": active_members,
        "total_revenue": total_revenue,
        "churn_risk_count": churn_risk,
        "por_vencer_count": por_vencer,
        "alerts": [
            {"type": "churn", "message": f"{churn_risk} members are in debt and at risk of cancellation."},
            {"type": "renewal", "message": f"{por_vencer} memberships are expiring soon."}
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

@router.put("/members/{member_id}", response_model=schemas.MemberSchema)
def update_member(member_id: int, member_data: schemas.MemberCreate, db: Session = Depends(get_db)):
    db_member = db.query(models.Member).filter(models.Member.id == member_id).first()
    if not db_member:
        raise HTTPException(status_code=404, detail="Member not found")
    for key, value in member_data.dict().items():
        setattr(db_member, key, value)
    db.commit()
    db.refresh(db_member)
    return db_member

@router.delete("/members/{member_id}")
def delete_member(member_id: int, db: Session = Depends(get_db)):
    member = db.query(models.Member).get(member_id)
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    db.delete(member)
    db.commit()
    return {"status": "deleted"}

# Staff Endpoints
@router.get("/staff", response_model=List[schemas.StaffSchema])
def get_all_staff(db: Session = Depends(get_db)):
    staff = db.query(models.Staff).all()
    if not staff:
        # Seed some data if empty
        seed = [
            models.Staff(name="Julian Rossi", role="Entrenador", shift="Mañana", dni="20344555", phone="1144556677", status="ACTIVO"),
            models.Staff(name="Marta Gomez", role="Recepción", shift="Tarde", dni="25667888", phone="1133445566", status="ACTIVO"),
            models.Staff(name="Franco Lopez", role="Manager", shift="Noche", dni="30998777", phone="1122334455", status="ACTIVO")
        ]
        for s in seed: db.add(s)
        db.commit()
        return db.query(models.Staff).all()
    return staff

@router.post("/staff", response_model=schemas.StaffSchema)
def create_staff(staff: schemas.StaffCreate, db: Session = Depends(get_db)):
    db_staff = models.Staff(**staff.dict())
    db.add(db_staff)
    db.commit()
    db.refresh(db_staff)
    return db_staff

@router.put("/staff/{staff_id}", response_model=schemas.StaffSchema)
def update_staff(staff_id: int, staff_data: schemas.StaffCreate, db: Session = Depends(get_db)):
    db_staff = db.query(models.Staff).filter(models.Staff.id == staff_id).first()
    if not db_staff:
        raise HTTPException(status_code=404, detail="Staff not found")
    for key, value in staff_data.dict().items():
        setattr(db_staff, key, value)
    db.commit()
    db.refresh(db_staff)
    return db_staff

@router.delete("/staff/{staff_id}")
def delete_staff(staff_id: int, db: Session = Depends(get_db)):
    db_staff = db.query(models.Staff).get(staff_id)
    if not db_staff:
        raise HTTPException(status_code=404, detail="Staff not found")
    db.delete(db_staff)
    db.commit()
    return {"status": "deleted"}

@router.post("/payments")
def record_payment(member_id: int, amount: float, method: str = "Efectivo", db: Session = Depends(get_db)):
    payment = models.Payment(member_id=member_id, amount=amount, status="paid", method=method, created_at=datetime.datetime.utcnow())
    db.add(payment)
    member = db.query(models.Member).get(member_id)
    if member:
        member.status = "ACTIVO"
    db.commit()
    return {"status": "payment recorded"}

@router.get("/finance/summary")
def get_finance_summary(db: Session = Depends(get_db)):
    payments = db.query(models.Payment).all()
    if not payments:
        # Seed some mock payments for visualization if empty
        return {
            "total_revenue": 150000,
            "arpu": 1200,
            "total_expenses": 45000,
            "revenue_breakdown": [
                {"name": "Membresías", "value": 120000},
                {"name": "Suplementos", "value": 20000},
                {"name": "Cafetería", "value": 10000}
            ],
            "monthly_growth": [
                {"month": "Ene", "v": 80000},
                {"month": "Feb", "v": 95000},
                {"month": "Mar", "v": 110000},
                {"month": "Abr", "v": 150000}
            ],
            "cashflow_data": [
                {"month": "Ene", "ingresos": 80000},
                {"month": "Feb", "ingresos": 95000},
                {"month": "Mar", "ingresos": 110000},
                {"month": "Abr", "ingresos": 150000}
            ],
            "recent_payments": []
        }
    
    total_revenue = sum(p.amount for p in payments)
    
    # Group payments by month
    monthly_data = {}
    for p in payments:
        m = p.created_at.strftime("%b")
        monthly_data[m] = monthly_data.get(m, 0) + p.amount
    
    growth = [{"month": k, "v": v} for k, v in monthly_data.items()]
    
    return {
        "total_revenue": total_revenue,
        "arpu": round(total_revenue / max(1, db.query(models.Member).count()), 2),
        "total_expenses": total_revenue * 0.3, # Mock expenses
        "revenue_breakdown": [
            {"name": "Efectivo", "value": sum(p.amount for p in payments if p.method == "Efectivo")},
            {"name": "Transferencia", "value": sum(p.amount for p in payments if p.method == "Transferencia")},
            {"name": "Tarjeta", "value": sum(p.amount for p in payments if p.method == "Tarjeta")},
            {"name": "QR", "value": sum(p.amount for p in payments if p.method == "QR")}
        ],
        "monthly_growth": growth,
        "cashflow_data": [{"month": g["month"], "ingresos": g["v"]} for g in growth],
        "recent_payments": []
    }

@router.get("/analytics/ai")
def get_ai_analytics(db: Session = Depends(get_db)):
    # Mock data for AI Analytics Charts
    return {
        "streaks": [{"name": m.name, "racha": 12, "status": "Bestia", "risk": 5} for m in db.query(models.Member).limit(5).all()],
        "predictions": [
            {"month": "Mayo", "proy": 180000, "socios": 45},
            {"month": "Junio", "proy": 210000, "socios": 52}
        ],
        "performance_radar": [
            {"subject": "Asistencia", "A": 85},
            {"subject": "Retención", "A": 90},
            {"subject": "Ingresos", "A": 75},
            {"subject": "Staff", "A": 95},
            {"subject": "Equipos", "A": 80}
        ]
    }
