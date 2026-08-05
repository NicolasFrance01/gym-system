with open('frontend/api/models.py', 'a', encoding='utf-8') as f:
    f.write("\nclass Activity(Base):\n")
    f.write("    __tablename__ = 'activities'\n")
    f.write("    id = Column(Integer, primary_key=True, index=True)\n")
    f.write("    name = Column(String, index=True)\n")
    f.write("    code = Column(String)\n")
    f.write("    color = Column(String)\n")
