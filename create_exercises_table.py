import os
from sqlalchemy import create_engine
from backend.models import Base, Exercise

DATABASE_URL = "postgresql://neondb_owner:npg_eCrGKbztO9h2@ep-orange-cell-am4zmpka-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require"
engine = create_engine(DATABASE_URL)

try:
    print("Creando tabla exercises...")
    Base.metadata.create_all(bind=engine, tables=[Exercise.__table__])
    print("Tabla exercises creada.")
except Exception as e:
    print("Error:", e)
