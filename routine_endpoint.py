
@router.put("/{dni}/routine")
def update_routine(dni: str, payload: dict, db: Session = Depends(get_db)):
    member = db.query(models.Member).filter(models.Member.dni == dni).first()
    if not member:
        raise HTTPException(status_code=404, detail="Socio no encontrado")
        
    member.routine = payload.get("routine", [])
    db.commit()
    return {"status": "success", "message": "Rutina actualizada"}
