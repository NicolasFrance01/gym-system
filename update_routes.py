import re

with open('frontend/api/admin_routes.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Add PUT endpoint after delete_exercise
put_endpoint = """
@router.put("/exercises/{ex_id}", response_model=schemas.ExerciseSchema)
def update_exercise(ex_id: int, ex: schemas.ExerciseSchema, db: Session = Depends(get_db)):
    db_ex = db.query(models.Exercise).filter(models.Exercise.id == ex_id).first()
    if not db_ex:
        raise HTTPException(status_code=404, detail="Exercise not found")
    
    update_data = ex.model_dump(exclude_unset=True)
    if "id" in update_data:
        del update_data["id"]
        
    for key, value in update_data.items():
        setattr(db_ex, key, value)
        
    db.commit()
    db.refresh(db_ex)
    return db_ex
"""

content = content.replace('    return {"status": "success"}', '    return {"status": "success"}\n' + put_endpoint)

with open('frontend/api/admin_routes.py', 'w', encoding='utf-8') as f:
    f.write(content)
