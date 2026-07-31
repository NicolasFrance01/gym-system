import re

def update_user_app():
    with open('frontend/src/UserApp.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Add toast state if not exists
    if 'const [toast, setToast]' not in content:
        # Find where states are declared, e.g. const [isLoading, setIsLoading] = useState(false);
        state_idx = content.find('const [isLoading, setIsLoading] = useState(false);')
        if state_idx != -1:
            toast_state = "const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null);\n  const showToast = (message: string, type: 'success'|'error' = 'success') => {\n    setToast({message, type});\n    setTimeout(() => setToast(null), 3500);\n  };\n  "
            content = content[:state_idx] + toast_state + content[state_idx:]
    
    # 2. Add Toast UI component at the end of the return
    if 'id="toast-container"' not in content:
        # Find the last </div> before export default
        toast_ui = """
      {/* Toast Notification */}
      {toast && (
        <div id="toast-container" className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-300">
          <div className={`px-6 py-3 rounded-2xl flex items-center gap-3 backdrop-blur-xl border shadow-[0_0_20px_rgba(0,0,0,0.5)] ${toast.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
            {toast.type === 'success' ? <CheckCircle2 size={18} /> : <X size={18} />}
            <span className="text-[11px] font-black uppercase tracking-wider">{toast.message}</span>
          </div>
        </div>
      )}
"""
        # Find the main container closing div
        last_div_idx = content.rfind('</div>\n    </div>\n  );\n}')
        if last_div_idx != -1:
            content = content[:last_div_idx] + toast_ui + content[last_div_idx:]
        else:
            print("Could not find insertion point for toast UI")

    # 3. Replace alert(...) with showToast(...)
    # Note: alert("...") -> showToast("...")
    # Handle single and double quotes
    content = re.sub(r'alert\((["\'].*?["\'])\)', r'showToast(\1, "success")', content) # Defaults to success, we can tweak if it has 'Error'
    
    # Let's fix specific error alerts
    content = content.replace('showToast("Error", "success")', 'showToast("Error", "error")')
    content = content.replace('showToast("Error al ingresar", "success")', 'showToast("Error al ingresar", "error")')
    content = content.replace('showToast("Error de conexión con el servidor", "success")', 'showToast("Error de conexión con el servidor", "error")')
    content = content.replace('showToast(data.detail || "Error al ingresar", "success")', 'showToast(data.detail || "Error al ingresar", "error")')
    
    # Add CheckCircle2 import if missing
    if 'CheckCircle2' not in content:
        content = content.replace('import { Search,', 'import { Search, CheckCircle2,')

    with open('frontend/src/UserApp.tsx', 'w', encoding='utf-8') as f:
        f.write(content)

update_user_app()
