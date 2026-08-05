with open('frontend/api/admin_routes.py', 'a', encoding='utf-8') as f:
    f.write('''

# --- Activities ---
@router.get("/activities")
def get_activities(db: Session = Depends(get_db)):
    return db.query(models.Activity).all()

@router.post("/activities")
def create_activity(activity: dict, db: Session = Depends(get_db)):
    db_activity = models.Activity(**activity)
    db.add(db_activity)
    db.commit()
    db.refresh(db_activity)
    return db_activity

@router.delete("/activities/{activity_id}")
def delete_activity(activity_id: int, db: Session = Depends(get_db)):
    activity = db.query(models.Activity).filter(models.Activity.id == activity_id).first()
    if activity:
        db.delete(activity)
        db.commit()
    return {"success": True}

# --- Mass Class Generation ---
@router.post("/class_schedules/mass")
def create_mass_class_schedules(data: dict, db: Session = Depends(get_db)):
    # data: { days: [0, 1, 2], start_hour: 7, end_hour: 23, interval_hours: 1, capacity: 50, name: "Musculación", code: "MUSC", color: "#3b82f6" }
    days = data.get("days", [])
    start_hour = data.get("start_hour", 7)
    end_hour = data.get("end_hour", 23)
    interval_hours = data.get("interval_hours", 1)
    capacity = data.get("capacity", 50)
    name = data.get("name")
    code = data.get("code")
    color = data.get("color")
    
    created = 0
    for day in days:
        current_h = start_hour
        while current_h < end_hour:
            start_str = f"{current_h:02d}:00"
            end_h = current_h + interval_hours
            if end_h > end_hour:
                end_h = end_hour
            end_str = f"{end_h:02d}:00"
            
            new_class = models.ClassSchedule(
                name=name,
                code=code,
                day_of_week=day,
                start_time=start_str,
                end_time=end_str,
                color=color,
                capacity=capacity
            )
            db.add(new_class)
            created += 1
            current_h += interval_hours
            
    db.commit()
    return {"success": True, "created": created}
''')
