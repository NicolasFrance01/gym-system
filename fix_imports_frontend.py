import os
import glob
import re

def fix_imports(dir_path):
    for filepath in glob.glob(os.path.join(dir_path, '*.py')):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace 'from database import' -> 'from .database import'
        content = re.sub(r'^from database import', 'from .database import', content, flags=re.MULTILINE)
        content = re.sub(r'^from models import', 'from .models import', content, flags=re.MULTILINE)
        content = re.sub(r'^from schemas import', 'from .schemas import', content, flags=re.MULTILINE)
        content = re.sub(r'^from cv_engine import', 'from .cv_engine import', content, flags=re.MULTILINE)
        content = re.sub(r'^import models$', 'from . import models', content, flags=re.MULTILINE)
        content = re.sub(r'^import schemas$', 'from . import schemas', content, flags=re.MULTILINE)
        content = re.sub(r'^import database$', 'from . import database', content, flags=re.MULTILINE)

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

fix_imports("frontend/api")
