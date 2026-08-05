import re

# 1. Update backend/admin_routes.py to auto-seed activities and add DELETE route
with open('backend/admin_routes.py', 'r', encoding='utf-8') as f:
    routes_content = f.read()

# Auto-seed logic for GET /activities
old_get_activities = """@router.get("/activities")
def get_activities(db: Session = Depends(get_db)):
    return db.query(models.Activity).all()"""

new_get_activities = """@router.get("/activities")
def get_activities(db: Session = Depends(get_db)):
    activities = db.query(models.Activity).all()
    if not activities:
        # Seed default activities
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

@router.delete("/activities/{activity_id}")
def delete_activity(activity_id: int, db: Session = Depends(get_db)):
    activity = db.query(models.Activity).filter(models.Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Actividad no encontrada")
    db.delete(activity)
    db.commit()
    return {"ok": True}
"""
routes_content = routes_content.replace(old_get_activities, new_get_activities)

with open('backend/admin_routes.py', 'w', encoding='utf-8') as f:
    f.write(routes_content)

# 2. Update frontend/src/AdminDashboard.tsx
with open('frontend/src/AdminDashboard.tsx', 'r', encoding='utf-8') as f:
    frontend_content = f.read()

# Remove defaultActivities and use dbActivities
old_all_activities = """  const defaultActivities = [
    { name: 'Entrenamiento Funcional', code: 'EF', color: '#3b82f6' },
    { name: 'Pilates en Suelo', code: 'PS', color: '#f97316' },
    { name: 'Entrenamiento Personalizado', code: 'EP', color: 'ec4899' },
    { name: 'Salsa y Bachata', code: 'SB', color: '#eab308' },
    { name: 'Zumba', code: 'ZB', color: '#ef4444' },
    { name: 'Reguetón Juvenil', code: 'RJ', color: '#06b6d4' }
  ];
  const allActivities = dbActivities.length > 0 ? dbActivities : defaultActivities;"""
  
# It might have different indentation or text. Let's use regex
frontend_content = re.sub(r'const defaultActivities = \[.*?\];\s*const allActivities = [^;]+;', 'const allActivities = dbActivities;', frontend_content, flags=re.DOTALL)

# Add delete function
delete_func = """  const handleDeleteActivity = async (id: number) => {
    if (window.confirm("¿Seguro que deseas eliminar esta actividad?")) {
      try {
        const res = await fetch(`${API_URL}/admin/activities/${id}`, { method: 'DELETE' });
        if (res.ok) {
          fetchActivities();
        } else {
          alert("Error al eliminar la actividad");
        }
      } catch (e) {
        console.error(e);
      }
    }
  };
"""

# Insert delete function before fetchActivities
frontend_content = frontend_content.replace('const fetchActivities = async () => {', delete_func + '\n  const fetchActivities = async () => {')

# Add trash icon in the legend
old_legend_item = """              <span className="text-[9px] font-black uppercase tracking-wider" style={{ color: act.color, textShadow: '0px 1px 2px rgba(0,0,0,0.8)' }}>
                {act.name} ({act.code})
              </span>
            </div>"""

new_legend_item = """              <span className="text-[9px] font-black uppercase tracking-wider" style={{ color: act.color, textShadow: '0px 1px 2px rgba(0,0,0,0.8)' }}>
                {act.name} ({act.code})
              </span>
              {act.id && (
                <button onClick={() => handleDeleteActivity(act.id)} className="text-gray-500 hover:text-red-500 transition-colors ml-1" title="Eliminar Actividad">
                  <Trash2 size={10} />
                </button>
              )}
            </div>"""
frontend_content = frontend_content.replace(old_legend_item, new_legend_item)

with open('frontend/src/AdminDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(frontend_content)
