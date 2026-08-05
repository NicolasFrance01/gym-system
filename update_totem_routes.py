import re

with open('frontend/api/totem_routes.py', 'r', encoding='utf-8') as f:
    content = f.read()

# I want to inject `last_weights_map = {}`
content = content.replace('    progress_data_map = {}\n    uncompleted_history = []', '    progress_data_map = {}\n    uncompleted_history = []\n    last_weights_map = {}')

# And I want to update last_weights_map when kg > 0
logic = """                            # Completed exercise: update max kg lifted in this month
                            kg = ex.get('kg', 0)
                            name = ex.get('name')
                            if kg > 0 and name:
                                current_max = progress_data_map[month_key].get(name, 0)
                                if kg > current_max:
                                    progress_data_map[month_key][name] = kg
                                
                                last_weights_map[name] = kg"""

content = content.replace("""                            # Completed exercise: update max kg lifted in this month
                            kg = ex.get('kg', 0)
                            name = ex.get('name')
                            if kg > 0 and name:
                                current_max = progress_data_map[month_key].get(name, 0)
                                if kg > current_max:
                                    progress_data_map[month_key][name] = kg""", logic)

# And return `last_weights_map` in the response
return_dict = """            "plan": member.membership_type,
            "routine": member.routine,
            "evolution": progress_chart_data,
            "streak": streak_count,
            "streak_message": streak_msg"""
new_return_dict = """            "plan": member.membership_type,
            "routine": member.routine,
            "evolution": progress_chart_data,
            "last_weights": last_weights_map,
            "streak": streak_count,
            "streak_message": streak_msg"""

content = content.replace(return_dict, new_return_dict)

with open('frontend/api/totem_routes.py', 'w', encoding='utf-8') as f:
    f.write(content)
