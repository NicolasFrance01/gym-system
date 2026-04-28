from database import SessionLocal, engine
import models
from sqlalchemy.orm import Session

models.Base.metadata.create_all(bind=engine)

def seed():
    db = SessionLocal()
    
    # Check if we already have members
    if db.query(models.Member).first():
        print("Database already seeded")
        return

    members = [
        models.Member(dni="1111", name="Nicolas Pagado", status="AL DIA", photo_url="https://i.pravatar.cc/300?img=11"),
        models.Member(dni="2222", name="Ana Por Vencer", status="POR VENCER", photo_url="https://i.pravatar.cc/300?img=5"),
        models.Member(dni="3333", name="Carlos Deudor", status="DEUDA", photo_url="https://i.pravatar.cc/300?img=12")
    ]
    
    db.add_all(members)
    db.commit()
    print("Database seeded with sample members!")

if __name__ == "__main__":
    seed()
