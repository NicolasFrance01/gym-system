import re

def update_user_app():
    with open('frontend/src/UserApp.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the end of the UserApp return statement
    end_idx = content.find('      )}\n    </div>\n  );\n}')
    
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
    if end_idx != -1:
        content = content[:end_idx+7] + toast_ui + content[end_idx+7:]
    
    with open('frontend/src/UserApp.tsx', 'w', encoding='utf-8') as f:
        f.write(content)

update_user_app()
