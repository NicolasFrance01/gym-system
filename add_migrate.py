with open("frontend/api/admin_routes.py", "a", encoding="utf-8") as f:
    f.write("\n\n@router.get('/force_migrate')\ndef force_migrate():\n    from .migrate_db import migrate\n    migrate()\n    return {'status': 'migrated'}\n")
