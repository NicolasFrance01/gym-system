import re

# 1. Add Activity to backend/models.py
with open('backend/models.py', 'r', encoding='utf-8') as f:
    models_content = f.read()

if 'class Activity' not in models_content:
    models_content += """

class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    code = Column(String)
    color = Column(String)
"""
    with open('backend/models.py', 'w', encoding='utf-8') as f:
        f.write(models_content)

# 2. Add ActivitySchema to backend/schemas.py
with open('backend/schemas.py', 'r', encoding='utf-8') as f:
    schemas_content = f.read()

if 'class ActivitySchema' not in schemas_content:
    schemas_content += """

class ActivitySchema(BaseModel):
    id: Optional[int] = None
    name: str
    code: str
    color: str
"""
    # ensure Optional is imported
    if 'from typing import ' in schemas_content and 'Optional' not in schemas_content:
        schemas_content = schemas_content.replace('from typing import ', 'from typing import Optional, ')
    elif 'from typing import' not in schemas_content:
        schemas_content = 'from typing import Optional, List\n' + schemas_content
        
    with open('backend/schemas.py', 'w', encoding='utf-8') as f:
        f.write(schemas_content)


# 3. Add /activities routes to backend/admin_routes.py
with open('backend/admin_routes.py', 'r', encoding='utf-8') as f:
    routes_content = f.read()

if '@router.get("/activities")' not in routes_content:
    routes_to_add = """

@router.get("/activities")
def get_activities(db: Session = Depends(get_db)):
    activities = db.query(models.Activity).all()
    if not activities:
        defaults = [
            {"name": "Entrenamiento Funcional", "code": "EF", "color": "#3b82f6"},
            {"name": "Pilates en Suelo", "code": "PS", "color": "#f97316"},
            {"name": "Entrenamiento Personalizado", "code": "EP", "color": "#ec4899"},
            {"name": "Salsa y Bachata", "code": "SB", "color": "#eab308"},
            {"name": "Zumba", "code": "ZB", "color": "#ef4444"},
            {"name": "Reguetón Juvenil", "code": "RJ", "color": "#06b6d4"}
        ]
        for d in defaults:
            db.add(models.Activity(name=d["name"], code=d["code"], color=d["color"]))
        db.commit()
        activities = db.query(models.Activity).all()
    return activities

@router.post("/activities")
def create_activity(activity: schemas.ActivitySchema, db: Session = Depends(get_db)):
    new_act = models.Activity(name=activity.name, code=activity.code, color=activity.color)
    db.add(new_act)
    db.commit()
    db.refresh(new_act)
    return new_act

@router.delete("/activities/{activity_id}")
def delete_activity(activity_id: int, db: Session = Depends(get_db)):
    act = db.query(models.Activity).filter(models.Activity.id == activity_id).first()
    if act:
        db.delete(act)
        db.commit()
    return {"ok": True}
"""
    routes_content += routes_to_add
    with open('backend/admin_routes.py', 'w', encoding='utf-8') as f:
        f.write(routes_content)

# 4. Modify frontend AdminDashboard.tsx to properly use dbActivities
with open('frontend/src/AdminDashboard.tsx', 'r', encoding='utf-8') as f:
    frontend_content = f.read()

# Replace allActivities definition block
old_all_activities_regex = r"const defaultActivities = \[\s*\{ name: 'Entrenamiento Funcional'[\s\S]*?\];\s*const allActivities = dbActivities\.length > 0 \? dbActivities : defaultActivities;"
frontend_content = re.sub(old_all_activities_regex, "const allActivities = dbActivities;", frontend_content)

with open('frontend/src/AdminDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(frontend_content)

