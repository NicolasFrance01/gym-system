import cv2
import customtkinter as ctk
from PIL import Image, ImageTk
import threading
import time
import os
import subprocess
import winsound
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from database import SessionLocal
import models
from cv_engine import CVEngine
import uvicorn
from main import app as fastapi_app

# Load environment variables
load_dotenv()

# UI Settings
ctk.set_appearance_mode("Dark")
ctk.set_default_color_theme("blue")

class SplashScreen(ctk.CTkToplevel):
    def __init__(self):
        super().__init__()
        self.title("GYM-ATLAS Boot")
        self.geometry("400x500")
        self.overrideredirect(True) # Remove title bar
        self.configure(fg_color="#050505")
        
        # Center on screen
        screen_width = self.winfo_screenwidth()
        screen_height = self.winfo_screenheight()
        x = (screen_width // 2) - 200
        y = (screen_height // 2) - 250
        self.geometry(f"+{x}+{y}")

        self.label = ctk.CTkLabel(self, text="GYM-ATLAS", font=ctk.CTkFont(size=32, weight="bold"))
        self.label.pack(pady=(100, 20))
        
        self.status = ctk.CTkLabel(self, text="Inicializando Motor de IA...", font=ctk.CTkFont(size=14), text_color="#555")
        self.status.pack(pady=10)
        
        self.progress = ctk.CTkProgressBar(self, width=300)
        self.progress.pack(pady=20)
        self.progress.set(0)

    def update_progress(self, val, status_text):
        self.progress.set(val)
        self.status.configure(text=status_text)
        self.update()

class GymDesktopKiosk:
    def __init__(self, root):
        self.root = root
        self.root.title("GYM-ATLAS 2026")
        self.root.geometry("1200x800")
        self.root.configure(fg_color="#050505")
        self.root.withdraw() # Hide main window during splash

        self.show_splash()

    def show_splash(self):
        self.splash = SplashScreen()
        
        # Start processes in background
        threading.Thread(target=self.initialize_system, daemon=True).start()

    def initialize_system(self):
        self.splash.update_progress(0.2, "Conectando con Base de Datos...")
        time.sleep(1) # Visual effect
        
        self.splash.update_progress(0.4, "Iniciando Servidor API en segundo plano...")
        # Start uvicorn in a thread
        threading.Thread(target=lambda: uvicorn.run(fastapi_app, host="0.0.0.0", port=8000, log_level="error"), daemon=True).start()
        
        self.splash.update_progress(0.6, "Cargando Red Neuronal YOLOv8...")
        self.cv_engine = CVEngine()
        self.cv_engine.start()
        
        self.splash.update_progress(0.9, "Preparando Interfaz Premium...")
        time.sleep(1)
        
        self.root.after(0, self.launch_main_app)

    def launch_main_app(self):
        self.splash.destroy()
        self.root.deiconify() # Show main window
        self.setup_ui()
        self.update_video()
        self.check_alarm_loop()

    def setup_ui(self):
        self.root.grid_columnconfigure(0, weight=3)
        self.root.grid_columnconfigure(1, weight=1)
        self.root.grid_rowconfigure(0, weight=1)

        # Left Panel: Video Display
        self.video_frame = ctk.CTkFrame(self.root, fg_color="black", corner_radius=30, border_width=1, border_color="#1a1a1a")
        self.video_frame.grid(row=0, column=0, padx=20, pady=20, sticky="nsew")
        
        self.video_label = ctk.CTkLabel(self.video_frame, text="")
        self.video_label.pack(expand=True, fill="both", padx=5, pady=5)

        # Right Panel: Sidebar
        self.sidebar = ctk.CTkFrame(self.root, fg_color="#0a0a0a", corner_radius=30, border_width=1, border_color="#1a1a1a")
        self.sidebar.grid(row=0, column=1, padx=20, pady=20, sticky="nsew")
        
        ctk.CTkLabel(self.sidebar, text="GYM-ATLAS", font=ctk.CTkFont(size=28, weight="bold")).pack(pady=(40, 40))

        # DNI Input with Glow Border
        self.input_container = ctk.CTkFrame(self.sidebar, fg_color="transparent")
        self.input_container.pack(pady=10, padx=20, fill="x")
        
        ctk.CTkLabel(self.input_container, text="DNI SOCIO", font=ctk.CTkFont(size=12, weight="bold"), text_color="#333").pack(anchor="w", padx=10)
        self.dni_entry = ctk.CTkEntry(self.input_container, placeholder_text="00000000", 
                                      height=70, font=ctk.CTkFont(size=32, weight="bold"),
                                      fg_color="#111", border_color="#222", corner_radius=20, 
                                      justify="center")
        self.dni_entry.pack(pady=5, fill="x")
        self.dni_entry.bind("<Return>", self.check_member)
        self.dni_entry.focus_set()

        # Premium Status Indicator
        self.status_card = ctk.CTkFrame(self.sidebar, fg_color="#111", height=300, corner_radius=30, border_width=2, border_color="#1a1a1a")
        self.status_card.pack(pady=40, padx=20, fill="x")
        self.status_card.pack_propagate(False)

        self.status_indicator = ctk.CTkLabel(self.status_card, text="●", font=ctk.CTkFont(size=40), text_color="#333")
        self.status_indicator.pack(pady=(30, 0))

        self.status_text = ctk.CTkLabel(self.status_card, text="ESPERANDO", 
                                        font=ctk.CTkFont(size=32, weight="bold"))
        self.status_text.pack(expand=True)
        
        self.name_label = ctk.CTkLabel(self.sidebar, text="SISTEMA ACTIVO", font=ctk.CTkFont(size=16), text_color="#222")
        self.name_label.pack(pady=10)

        # Bottom Info
        self.info_label = ctk.CTkLabel(self.sidebar, text="v2.0 | CLOUD SYNC: ON", font=ctk.CTkFont(size=10), text_color="#111")
        self.info_label.pack(side="bottom", pady=20)

    def check_member(self, event=None):
        dni = self.dni_entry.get().strip()
        if not dni: return
        
        self.dni_entry.delete(0, 'end')
        self.status_text.configure(text="VERIFICANDO...")
        self.status_indicator.configure(text_color="#555")
        
        threading.Thread(target=self._db_lookup, args=(dni,), daemon=True).start()

    def _db_lookup(self, dni):
        db = SessionLocal()
        try:
            member = db.query(models.Member).filter(models.Member.dni == dni).first()
            if member:
                self.cv_engine.set_member_status(member.name, member.status)
                self.root.after(0, lambda: self.update_status_ui(member.name, member.status))
            else:
                self.root.after(0, lambda: self.update_status_ui("NO ENCONTRADO", "ERROR"))
        except Exception as e:
            self.root.after(0, lambda: self.update_status_ui("DATABASE ERROR", "ERROR"))
        finally:
            db.close()

    def update_status_ui(self, name, status):
        color = "#333"
        bg_color = "#111"
        border_color = "#1a1a1a"
        
        if status == "ACTIVO":
            color = "#00ff88"
            bg_color = "#001a0d"
            border_color = "#00ff88"
            winsound.Beep(1000, 200) # Quick success beep
        elif status == "DEUDA":
            color = "#ff3333"
            bg_color = "#1a0000"
            border_color = "#ff3333"
            # Sound alarm for debt
            threading.Thread(target=self.play_debt_alarm).start()
        elif status == "POR VENCER":
            color = "#ffcc00"
            bg_color = "#1a1500"
            border_color = "#ffcc00"
            winsound.Beep(600, 400)
            
        self.status_card.configure(fg_color=bg_color, border_color=border_color)
        self.status_text.configure(text=status, text_color=color)
        self.status_indicator.configure(text_color=color)
        self.name_label.configure(text=name, text_color=color)
        
        self.root.after(8000, self.reset_ui)

    def play_debt_alarm(self):
        for _ in range(3):
            winsound.Beep(440, 500)
            time.sleep(0.1)

    def reset_ui(self):
        self.status_card.configure(fg_color="#111", border_color="#1a1a1a")
        self.status_text.configure(text="ESPERANDO", text_color="#444")
        self.status_indicator.configure(text_color="#333")
        self.name_label.configure(text="SISTEMA ACTIVO", text_color="#222")
        self.cv_engine.set_member_status("", "IDLE")

    def check_alarm_loop(self):
        # Trigger alarm if person detected in DNI status
        if self.cv_engine.is_alarm_active:
            # This is handled by CV engine via camera overlay usually, 
            # but we can add more desktop-specific effects here.
            pass
        self.root.after(500, self.check_alarm_loop)

    def update_video(self):
        frame = self.cv_engine.output_frame
        if frame is not None:
            cv2image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            img = Image.fromarray(cv2image)
            
            width = self.video_label.winfo_width()
            height = self.video_label.winfo_height()
            if width > 1 and height > 1:
                ctk_img = ctk.CTkImage(light_image=img, dark_image=img, size=(width, height))
                self.video_label.configure(image=ctk_img)
        
        self.root.after(15, self.update_video)

    def on_closing(self):
        self.cv_engine.stop()
        self.root.destroy()

if __name__ == "__main__":
    root = ctk.CTk()
    app = GymDesktopKiosk(root)
    root.protocol("WM_DELETE_WINDOW", app.on_closing)
    root.mainloop()
