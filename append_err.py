with open("frontend/api/admin_routes.py", "a", encoding="utf-8") as f:
    f.write("\n\n@router.get('/debug_err')\ndef debug_err(db: Session = Depends(get_db)):\n    try:\n        return {'status': 'ok', 'val': db.query(models.SystemConfig).first().key if db.query(models.SystemConfig).first() else 'none'}\n    except Exception as e:\n        return {'error': str(e)}\n")
