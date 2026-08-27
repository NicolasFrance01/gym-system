import urllib.request
import urllib.error
import json
import re

API_URL = "https://systemgym.vercel.app/api/admin/class_schedules"

def clean_via_api():
    try:
        req = urllib.request.Request(API_URL, method="GET")
        with urllib.request.urlopen(req) as response:
            schedules = json.loads(response.read().decode('utf-8'))
            
        print(f"Fetched {len(schedules)} schedules.")
        
        pattern = re.compile(r'^(?:[01]\d|2[0-3]):[0-5]\d$')
        
        deleted = 0
        for s in schedules:
            start_time = s.get("start_time", "")
            end_time = s.get("end_time", "")
            
            # Check if invalid
            if not pattern.match(start_time) or not pattern.match(end_time):
                print(f"Deleting bad schedule: {start_time} - {end_time} (ID: {s['id']})")
                delete_req = urllib.request.Request(f"{API_URL}/{s['id']}", method="DELETE")
                try:
                    with urllib.request.urlopen(delete_req) as del_res:
                        deleted += 1
                except urllib.error.URLError as e:
                    print(f"Failed to delete {s['id']}: {e}")
                    
        print(f"Deleted {deleted} bad schedules.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    clean_via_api()
