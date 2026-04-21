from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime

class MemberBase(BaseModel):
    dni: str
    name: str
    email: Optional[str] = None
    status: str
    photo_url: Optional[str] = None
    membership_type: Optional[str] = None
    wellness_data: Optional[Dict] = None

class MemberSchema(MemberBase):
    id: int

    class Config:
        from_attributes = True

class PaymentSchema(BaseModel):
    id: int
    amount: float
    currency: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class BookingSchema(BaseModel):
    id: int
    class_name: str
    start_time: datetime
    status: str

    class Config:
        from_attributes = True
