class MassClassScheduleSchema:
    def __init__(self, configs, capacity, name, code, color):
        self.configs = configs
        self.capacity = capacity
        self.name = name
        self.code = code
        self.color = color

class Config:
    def __init__(self, day, start_hour, end_hour, interval_hours):
        self.day = day
        self.start_hour = start_hour
        self.end_hour = end_hour
        self.interval_hours = interval_hours

configs = [Config(day=1, start_hour=7, end_hour=23, interval_hours=1)]
payload = MassClassScheduleSchema(configs, 20, "Test", "TE", "#fff")

created_schedules = []
for config in payload.configs:
    current_hour = config.start_hour
    while current_hour < config.end_hour:
        start_time = f"{current_hour:02d}:00"
        
        next_hour = current_hour + config.interval_hours
        if next_hour > config.end_hour:
            next_hour = config.end_hour
            
        end_time = f"{next_hour:02d}:00"
        
        print(f"Creating for day {config.day}: {start_time} to {end_time}")
        created_schedules.append(start_time)
        
        current_hour += config.interval_hours
        
print(f"Created {len(created_schedules)} classes.")
