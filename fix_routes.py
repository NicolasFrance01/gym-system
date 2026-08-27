import os
import re

def update_route(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # The new logic to replace the loop
    if 'payload.configs' in content:
        # this is backend/admin_routes.py
        old_loop = """    for config in payload.configs:
        current_hour = config.start_hour
        while current_hour < config.end_hour:
            # Create start and end times
            start_time = f"{current_hour:02d}:00"
            
            next_hour = current_hour + config.interval_hours
            if next_hour > config.end_hour:
                next_hour = config.end_hour
            
            end_time = f"{next_hour:02d}:00"
            
            # Check if exists
            existing = db.query(models.ClassSchedule).filter(
                models.ClassSchedule.day_of_week == config.day,
                models.ClassSchedule.start_time == start_time
            ).first()
            
            if not existing:
                new_schedule = models.ClassSchedule(
                    name=payload.name,
                    code=payload.code,
                    day_of_week=config.day,
                    start_time=start_time,
                    end_time=end_time,
                    color=payload.color,
                    capacity=payload.capacity
                )
                db.add(new_schedule)
                created_schedules.append(new_schedule)
            
            current_hour += config.interval_hours"""
            
        new_loop = """    for config in payload.configs:
        try:
            start_h, start_m = map(int, config.start_time.split(':'))
            end_h, end_m = map(int, config.end_time.split(':'))
        except ValueError:
            continue
            
        current_minutes = start_h * 60 + start_m
        end_minutes = end_h * 60 + end_m
        
        while current_minutes < end_minutes:
            start_time_str = f"{current_minutes // 60:02d}:{current_minutes % 60:02d}"
            next_minutes = current_minutes + config.interval_minutes
            if next_minutes > end_minutes:
                next_minutes = end_minutes
            end_time_str = f"{next_minutes // 60:02d}:{next_minutes % 60:02d}"
            
            existing = db.query(models.ClassSchedule).filter(
                models.ClassSchedule.day_of_week == config.day,
                models.ClassSchedule.start_time == start_time_str
            ).first()
            
            if not existing:
                new_schedule = models.ClassSchedule(
                    name=payload.name,
                    code=payload.code,
                    day_of_week=config.day,
                    start_time=start_time_str,
                    end_time=end_time_str,
                    color=payload.color,
                    capacity=payload.capacity
                )
                db.add(new_schedule)
                created_schedules.append(new_schedule)
                
            current_minutes += config.interval_minutes"""
        
        content = content.replace(old_loop, new_loop)
        
    elif 'configs = data.get("configs", [])' in content:
        # this is frontend/api/admin_routes.py
        old_loop = """    for config in configs:
        day = config.get("day")
        start_hour = config.get("start_hour", 7)
        end_hour = config.get("end_hour", 23)
        interval_hours = config.get("interval_hours", 1)
        
        current_h = start_hour
        while current_h < end_hour:
            start_str = f"{current_h:02d}:00"
            end_h = current_h + interval_hours
            if end_h > end_hour:
                end_h = end_hour
            end_str = f"{end_h:02d}:00"
            
            existing = db.query(models.ClassSchedule).filter(
                models.ClassSchedule.day_of_week == day,
                models.ClassSchedule.start_time == start_str
            ).first()
            
            if not existing:
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
            current_h += interval_hours"""
            
        new_loop = """    for config in configs:
        day = config.get("day")
        start_time = config.get("start_time", "07:00")
        end_time = config.get("end_time", "23:00")
        interval_minutes = int(config.get("interval_minutes", 60))
        
        try:
            start_h, start_m = map(int, start_time.split(':'))
            end_h, end_m = map(int, end_time.split(':'))
        except ValueError:
            continue
            
        current_minutes = start_h * 60 + start_m
        end_minutes = end_h * 60 + end_m
        
        while current_minutes < end_minutes:
            start_str = f"{current_minutes // 60:02d}:{current_minutes % 60:02d}"
            next_minutes = current_minutes + interval_minutes
            if next_minutes > end_minutes:
                next_minutes = end_minutes
            end_str = f"{next_minutes // 60:02d}:{next_minutes % 60:02d}"
            
            existing = db.query(models.ClassSchedule).filter(
                models.ClassSchedule.day_of_week == day,
                models.ClassSchedule.start_time == start_str
            ).first()
            
            if not existing:
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
                
            current_minutes += interval_minutes"""
        
        content = content.replace(old_loop, new_loop)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)


import sys
update_route(os.path.join(os.path.dirname(__file__), 'backend', 'admin_routes.py'))
update_route(os.path.join(os.path.dirname(__file__), 'frontend', 'api', 'admin_routes.py'))
print("Routes updated successfully.")
