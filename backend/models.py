from sqlalchemy import Column, Integer, String
from database import Base

class Member(Base):
    __tablename__ = "members"

    id = Column(Integer, primary_key=True, index=True)
    dni = Column(String, unique=True, index=True)
    name = Column(String)
    status = Column(String)
    photo_url = Column(String, nullable=True)
