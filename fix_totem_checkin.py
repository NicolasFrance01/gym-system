import re
import datetime

with open('frontend/api/totem_routes.py', 'r', encoding='utf-8') as f:
    content = f.read()

# We need to insert the Checkin creation and Booking update inside get_totem_member
insert_code = """
    # Create checkin record automatically when they use the Totem
    new_checkin = models.Checkin(member_id=member.id, checkin_at=datetime.datetime.utcnow())
    db.add(new_checkin)
    
    # Auto-attend today's bookings
    today_start = datetime.datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    today_end = today_start + datetime.timedelta(days=1)
    
    today_bookings = db.query(models.Booking).filter(
        models.Booking.member_id == member.id,
        models.Booking.start_time >= today_start,
        models.Booking.start_time < today_end,
        models.Booking.status == 'reserved'
    ).all()
    
    for b in today_bookings:
        b.status = 'attended'
        
    db.commit()
"""

# We'll inject this right before `wellness = member.wellness_data or {}`
content = content.replace("    wellness = member.wellness_data or {}", insert_code + "\n    wellness = member.wellness_data or {}")

with open('frontend/api/totem_routes.py', 'w', encoding='utf-8') as f:
    f.write(content)
