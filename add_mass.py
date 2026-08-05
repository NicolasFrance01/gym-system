import re

# 1. Update schemas.py
with open('backend/schemas.py', 'r', encoding='utf-8') as f:
    schemas_content = f.read()

mass_schema = """
class MassClassScheduleSchema(BaseModel):
    days: List[int]
    start_hour: int
    end_hour: int
    interval_hours: int
    capacity: int
    name: str
    code: str
    color: str
"""
if 'class MassClassScheduleSchema' not in schemas_content:
    schemas_content += mass_schema
    with open('backend/schemas.py', 'w', encoding='utf-8') as f:
        f.write(schemas_content)


# 2. Update admin_routes.py
with open('backend/admin_routes.py', 'r', encoding='utf-8') as f:
    routes_content = f.read()

mass_route = """
@router.post("/class_schedules/mass")
def create_mass_class_schedules(payload: schemas.MassClassScheduleSchema, db: Session = Depends(get_db)):
    created_schedules = []
    
    for day in payload.days:
        current_hour = payload.start_hour
        while current_hour < payload.end_hour:
            # Create start and end times
            start_time = f"{current_hour:02d}:00"
            
            next_hour = current_hour + payload.interval_hours
            if next_hour > payload.end_hour:
                next_hour = payload.end_hour
            
            end_time = f"{next_hour:02d}:00"
            
            # Check if exists
            existing = db.query(models.ClassSchedule).filter(
                models.ClassSchedule.day_of_week == day,
                models.ClassSchedule.start_time == start_time
            ).first()
            
            if not existing:
                new_schedule = models.ClassSchedule(
                    name=payload.name,
                    code=payload.code,
                    day_of_week=day,
                    start_time=start_time,
                    end_time=end_time,
                    color=payload.color,
                    capacity=payload.capacity
                )
                db.add(new_schedule)
                created_schedules.append(new_schedule)
            
            current_hour += payload.interval_hours
            
    db.commit()
    return {"message": f"Created {len(created_schedules)} classes."}
"""

if '/class_schedules/mass' not in routes_content:
    routes_content += mass_route
    with open('backend/admin_routes.py', 'w', encoding='utf-8') as f:
        f.write(routes_content)
