import os
import sys

sys.path.append(os.path.join(os.getcwd(), "backend"))
from database import SessionLocal
import models

db = SessionLocal()
schedules = db.query(models.ClassSchedule).all()
print([s.start_time for s in schedules])
db.close()
