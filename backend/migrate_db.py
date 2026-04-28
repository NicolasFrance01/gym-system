from database import engine
from sqlalchemy import text

def migrate():
    print("Iniciando migración de base de datos...")
    with engine.connect() as conn:
        # Check if columns exist (different syntax for SQLite and PostgreSQL)
        is_postgres = engine.url.drivername.startswith("postgresql")
        
        columns_to_add = [
            ("phone", "VARCHAR"),
            ("password", "VARCHAR DEFAULT '123'")
        ]
        
        for col_name, col_type in columns_to_add:
            try:
                print(f"Intentando agregar columna {col_name}...")
                conn.execute(text(f"ALTER TABLE members ADD COLUMN {col_name} {col_type}"))
                conn.commit()
                print(f"Columna {col_name} agregada con éxito.")
            except Exception as e:
                # If column already exists, just ignore
                print(f"Aviso: La columna {col_name} podría ya existir o hubo un error: {e}")
                
    print("Migración finalizada.")

if __name__ == "__main__":
    migrate()
