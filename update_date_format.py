import re

def update_date_format(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the line
    content = content.replace('month_key = b.start_time.strftime("%b %Y") # e.g. "Jul 2026"', 'month_key = b.start_time.strftime("%Y-%m-%d")')
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

update_date_format('frontend/api/user_routes.py')
update_date_format('frontend/api/totem_routes.py')
