def fix_syntax():
    with open('frontend/src/UserApp.tsx', 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    start_idx = -1
    for i, line in enumerate(lines):
        if line.strip() == "){/* Toast Notification */}":
            start_idx = i
            break
        elif line.strip() == ")" and i + 1 < len(lines) and "{/* Toast Notification */}" in lines[i+1]:
            start_idx = i
            break
            
    if start_idx != -1:
        # Delete from start_idx up to the "}" that causes error.
        end_idx = start_idx
        while end_idx < len(lines) and "}" != lines[end_idx].strip():
            end_idx += 1
            
        del lines[start_idx:end_idx+1]
        
        insert_code = [
            "      )}\n",
            "      {/* Toast Notification */}\n",
            "      {toast && (\n",
            "        <div id=\"toast-container\" className=\"fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-300\">\n",
            "          <div className={`px-6 py-3 rounded-2xl flex items-center gap-3 backdrop-blur-xl border shadow-[0_0_20px_rgba(0,0,0,0.5)] ${toast.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>\n",
            "            {toast.type === 'success' ? <CheckCircle2 size={18} /> : <X size={18} />}\n",
            "            <span className=\"text-[11px] font-black uppercase tracking-wider\">{toast.message}</span>\n",
            "          </div>\n",
            "        </div>\n",
            "      )}\n"
        ]
        
        lines = lines[:start_idx] + insert_code + lines[start_idx:]
        
    with open('frontend/src/UserApp.tsx', 'w', encoding='utf-8') as f:
        f.writelines(lines)

fix_syntax()
