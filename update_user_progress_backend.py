import re

with open('frontend/api/user_routes.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Add /user/{dni}/progress endpoint
progress_endpoint = """
@router.get("/{dni}/progress")
def get_user_progress(dni: str, db: Session = Depends(get_db)):
    member = db.query(models.Member).filter(models.Member.dni == dni).first()
    if not member:
        raise HTTPException(status_code=404, detail="Socio no encontrado")
        
    bookings = db.query(models.Booking).filter(
        models.Booking.member_id == member.id,
        models.Booking.status == 'attended',
        models.Booking.exercises_done != None
    ).order_by(models.Booking.start_time.asc()).all()
    
    # Structure to build historical data per month/date
    # Output format for Recharts: [{ date: "YYYY-MM", "Press de Banca": 40, "Sentadilla": 60 }, ...]
    # We also return a history of uncompleted exercises
    
    progress_data_map = {}
    uncompleted_history = []
    
    for b in bookings:
        month_key = b.start_time.strftime("%b %Y") # e.g. "Jul 2026"
        if month_key not in progress_data_map:
            progress_data_map[month_key] = {"date": month_key}
            
        routine = b.exercises_done
        if isinstance(routine, list):
            for day in routine:
                if 'exercises' in day:
                    for ex in day['exercises']:
                        # Uncompleted history
                        if ex.get('completed') == False or ex.get('uncompleted_reason'):
                            uncompleted_history.append({
                                "date": b.start_time.isoformat() + "Z",
                                "exercise": ex.get('name'),
                                "reason": ex.get('uncompleted_reason', 'No especificado')
                            })
                        else:
                            # Completed exercise: update max kg lifted in this month
                            kg = ex.get('kg', 0)
                            name = ex.get('name')
                            if kg > 0 and name:
                                current_max = progress_data_map[month_key].get(name, 0)
                                if kg > current_max:
                                    progress_data_map[month_key][name] = kg

    progress_chart_data = list(progress_data_map.values())
    
    return {
        "status": "success",
        "chart_data": progress_chart_data,
        "uncompleted_history": sorted(uncompleted_history, key=lambda x: x["date"], reverse=True)
    }
"""

if "get_user_progress" not in content:
    content += progress_endpoint

with open('frontend/api/user_routes.py', 'w', encoding='utf-8') as f:
    f.write(content)
