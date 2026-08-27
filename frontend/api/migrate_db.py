from .database import engine
from sqlalchemy import text
from . import models

def migrate():
    print("Iniciando migración de base de datos...")
    models.Base.metadata.create_all(bind=engine)
    
    try:
        with engine.connect() as conn:
            conn.execute(text("CREATE TABLE IF NOT EXISTS system_configs (id SERIAL PRIMARY KEY, key VARCHAR UNIQUE, value JSON)"))
            conn.commit()
    except Exception as e:
        print("Error creating system_configs", e)
        
    columns_to_add = [
        ("members", "phone", "VARCHAR"),
        ("members", "password", "VARCHAR DEFAULT '123'"),
        ("members", "additional_plans", "JSON DEFAULT '[]'"),
        ("plans", "allow_unification", "BOOLEAN DEFAULT FALSE"),
        ("payments", "plan_details", "JSON")
    ]
    
    for table_name, col_name, col_type in columns_to_add:
        try:
            with engine.connect() as conn:
                print(f"Intentando agregar columna {col_name} en {table_name}...")
                conn.execute(text(f"ALTER TABLE {table_name} ADD COLUMN {col_name} {col_type}"))
                conn.commit()
                print(f"Columna {col_name} en {table_name} agregada con éxito.")
        except Exception as e:
            print(f"Aviso: La columna {col_name} en {table_name} podría ya existir o se ignoró error: {e}")
            
    print("Migración finalizada.")

if __name__ == "__main__":
    migrate()
