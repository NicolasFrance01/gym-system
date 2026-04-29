from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime

class MemberBase(BaseModel):
    dni: str
    name: str
    email: Optional[str] = None
    status: str = "ACTIVO"
    photo_url: Optional[str] = None
    phone: Optional[str] = None
    password: Optional[str] = "123"
    membership_type: Optional[str] = None
    wellness_data: Optional[Dict] = None

class MemberCreate(MemberBase):
    pass

class PaymentSchema(BaseModel):
    id: int
    amount: float
    currency: str
    status: str
    created_at: datetime
    method: Optional[str] = "Efectivo"

    class Config:
        from_attributes = True

class MemberSchema(MemberBase):
    id: int
    joined_at: datetime
    last_checkin: Optional[datetime] = None
    payments: List[PaymentSchema] = []

    class Config:
        from_attributes = True

class StaffBase(BaseModel):
    name: str
    role: str
    shift: Optional[str] = "Mañana"
    dni: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    status: str = "ACTIVO"

class StaffCreate(StaffBase):
    pass

class StaffSchema(StaffBase):
    id: int
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    dni: str
    password: str

class PasswordChange(BaseModel):
    new_password: str

class BookingSchema(BaseModel):
    id: int
    class_name: str
    start_time: datetime
    status: str

    class Config:
        from_attributes = True
