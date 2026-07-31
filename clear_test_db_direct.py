from sqlalchemy import create_engine, text

DATABASE_URL = "postgresql://neondb_owner:npg_eCrGKbztO9h2@ep-orange-cell-am4zmpka-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
engine = create_engine(DATABASE_URL)

try:
    with engine.connect() as conn:
        # Get member id for 00000
        res = conn.execute(text("SELECT id FROM members WHERE dni = '00000'")).fetchone()
        if res:
            member_id = res[0]
            # Update bookings
            conn.execute(text("UPDATE bookings SET exercises_done = NULL WHERE member_id = :mid"), {"mid": member_id})
            conn.commit()
            print(f"Cleared exercises_done for member_id {member_id} (DNI 00000)")
        else:
            print("Member 00000 not found")
except Exception as e:
    print(f"Error: {e}")
