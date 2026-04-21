import cv2
import customtkinter as ctk
from PIL import Image, ImageTk
import threading
import time
import os
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

# Global UI Scaling Fix for High DPI
ctk.set_appearance_mode("Dark")
ctk.set_default_color_theme("blue")
ctk.set_widget_scaling(1.0)
ctk.set_window_scaling(1.0)

class SplashScreen(ctk.CTkToplevel):
    def __init__(self):
        super().__init__()
        self.title("GYM-ATLAS Boot")
        self.geometry("400x500")
        self.overrideredirect(True)
        self.attributes("-topmost", True)
        self.configure(fg_color="#050505")
        
        # Center Window
        sw = self.winfo_screenwidth()
        sh = self.winfo_screenheight()
        x = (sw // 2) - 200
        y = (sh // 2) - 250
        self.geometry(f"+{x}+{y}")

        # UI Elements
        self.label = ctk.CTkLabel(self, text="GYM-ATLAS", font=ctk.CTkFont(size=36, weight="bold", family="Helvetica"))
        self.label.pack(pady=(120, 20))
        
        self.status = ctk.CTkLabel(self, text="Inicializando...", font=ctk.CTkFont(size=14), text_color="#666")
        self.status.pack(pady=10)
        
        self.progress = ctk.CTkProgressBar(self, width=280, height=10, corner_radius=5)
        self.progress.pack(pady=20)
        self.progress.set(0)

    def update_status(self, val, text):
        self.progress.set(val)
        self.status.configure(text=text)
        self.update()

class GymDesktopKiosk:
    def __init__(self, root):
        self.root = root
        self.root.title("GYM-ATLAS | Smart Access Control")
        self.root.geometry("1280x800")
        self.root.configure(fg_color="#000000")
        self.root.withdraw()

        # Start loading sequence
        self.show_splash()

    def show_splash(self):
        self.splash = SplashScreen()
        threading.Thread(target=self._initialization_thread, daemon=True).start()

    def _initialization_thread(self):
        # Phase 1: DB
        self.splash.update_status(0.2, "Estableciendo conexión con la nube...")
        time.sleep(0.5)
        
        # Phase 2: API
        self.splash.update_status(0.4, "Iniciando Bridge API sincronizado...")
        threading.Thread(target=lambda: uvicorn.run(fastapi_app, host="0.0.0.0", port=8000, log_level="error"), daemon=True).start()
        time.sleep(0.5)
        
        # Phase 3: AI Engine
        self.splash.update_status(0.7, "Activando Motor IA YOLOv8...")
        self.cv_engine = CVEngine()
        self.cv_engine.start()
        
        # Phase 4: Finalize
        self.splash.update_status(0.9, "Cargando Interfaz Premium...")
        time.sleep(0.8)
        
        self.root.after(0, self.launch_main_ui)

    def launch_main_ui(self):
        if self.splash:
            self.splash.destroy()
        
        self.setup_layout()
        self.root.deiconify()
        self.update_video_loop()

    def setup_layout(self):
        # 2-Column Grid: Sidebar (400px), Camera (Auto)
        self.root.grid_columnconfigure(0, weight=0, minsize=400)
        self.root.grid_columnconfigure(1, weight=1)
        self.root.grid_rowconfigure(0, weight=1)

        # SIDEBAR (LEFT)
        self.sidebar = ctk.CTkFrame(self.root, fg_color="#0a0a0a", corner_radius=0, border_width=0)
        self.sidebar.grid(row=0, column=0, sticky="nsew")
        
        # CAMERA (RIGHT)
        self.camera_frame = ctk.CTkFrame(self.root, fg_color="black", corner_radius=0, border_width=0)
        self.camera_frame.grid(row=0, column=1, sticky="nsew")
        
        self.video_label = ctk.CTkLabel(self.camera_frame, text="")
        self.video_label.pack(expand=True, fill="both")

        # Sidebar Elements
        ctk.CTkLabel(self.sidebar, text="GYM-ATLAS", font=ctk.CTkFont(size=36, weight="bold")).pack(pady=(80, 20))
        ctk.CTkLabel(self.sidebar, text="CONTROL DE ACCESO", font=ctk.CTkFont(size=14, weight="bold"), text_color="#333").pack(pady=(0, 40))

        # DNI INPUT (GLASS STYLE)
        self.input_card = ctk.CTkFrame(self.sidebar, fg_color="#1a1a1a", corner_radius=20, border_width=1, border_color="#333")
        self.input_card.pack(pady=20, padx=40, fill="x")
        
        ctk.CTkLabel(self.input_card, text="INGRESE DNI", font=ctk.CTkFont(size=10, weight="bold"), text_color="#555").pack(pady=(15, 0))
        self.dni_entry = ctk.CTkEntry(self.input_card, placeholder_text="00.000.000", 
                                      height=70, font=ctk.CTkFont(size=34, weight="bold"),
                                      fg_color="transparent", border_width=0, justify="center")
        self.dni_entry.pack(pady=(5, 15), padx=20, fill="x")
        self.dni_entry.bind("<Return>", self.on_check_in)
        self.dni_entry.focus_set()

        # STATUS DISPLAY
        self.status_box = ctk.CTkFrame(self.sidebar, fg_color="#111", height=320, corner_radius=24, border_width=2, border_color="#1a1a1a")
        self.status_box.pack(pady=40, padx=40, fill="x")
        self.status_box.pack_propagate(False)

        self.indicator = ctk.CTkLabel(self.status_box, text="●", font=ctk.CTkFont(size=50), text_color="#222")
        self.indicator.pack(pady=(40, 0))

        self.status_label = ctk.CTkLabel(self.status_box, text="ESPERANDO", font=ctk.CTkFont(size=36, weight="bold"), text_color="#444")
        self.status_label.pack(expand=True)
        
        self.name_label = ctk.CTkLabel(self.sidebar, text="BIENVENIDO", font=ctk.CTkFont(size=18, weight="bold"), text_color="#111")
        self.name_label.pack(pady=10)

        # Versioning
        ctk.CTkLabel(self.sidebar, text="ATLAS ENGINE v2.6 | SYNC: ONLINE", font=ctk.CTkFont(size=9), text_color="#1a1a1a").pack(side="bottom", pady=20)

    def on_check_in(self, event=None):
        dni = self.dni_entry.get().strip()
        if not dni: return
        
        self.dni_entry.delete(0, 'end')
        self.status_label.configure(text="VERIFICANDO...")
        
        threading.Thread(target=self._perform_verification, args=(dni,), daemon=True).start()

    def _perform_verification(self, dni):
        db = SessionLocal()
        try:
            member = db.query(models.Member).filter(models.Member.dni == dni).first()
            if member:
                self.cv_engine.set_member_status(member.name, member.status)
                self.root.after(0, lambda: self.render_status_result(member.name, member.status))
            else:
                self.root.after(0, lambda: self.render_status_result("ERROR", "NO EXISTE"))
        except Exception:
            self.root.after(0, lambda: self.render_status_result("ERROR", "DB ERROR"))
        finally:
            db.close()

    def render_status_result(self, name, status):
        color = "#ff3333" # Default error
        bg = "#1a0000"
        
        if status == "ACTIVO" or status == "AL DIA":
            color = "#00ff99"
            bg = "#001a0f"
            winsound.Beep(1000, 250)
        elif status == "DEUDA":
            color = "#ff4444"
            bg = "#260000"
            threading.Thread(target=self.trigger_alarm_sound).start()
        elif status == "POR VENCER":
            color = "#ffcc00"
            bg = "#262200"
            winsound.Beep(700, 400)

        self.status_box.configure(fg_color=bg, border_color=color)
        self.status_label.configure(text=status, text_color=color)
        self.indicator.configure(text_color=color)
        self.name_label.configure(text=name, text_color=color)
        
        # Reset after 8s
        self.root.after(8000, self.return_to_idle)

    def trigger_alarm_sound(self):
        for _ in range(3):
            winsound.Beep(500, 600)
            time.sleep(0.1)

    def return_to_idle(self):
        self.status_box.configure(fg_color="#111", border_color="#1a1a1a")
        self.status_label.configure(text="ESPERANDO", text_color="#444")
        self.indicator.configure(text_color="#222")
        self.name_label.configure(text="BIENVENIDO", text_color="#111")
        self.cv_engine.set_member_status("", "IDLE")

    def update_video_loop(self):
        frame = self.cv_engine.output_frame
        if frame is not None:
            # OpenCV to PIL
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            img = Image.fromarray(rgb_frame)
            
            # Scale to fit window
            w = self.video_label.winfo_width()
            h = self.video_label.winfo_height()
            if w > 100 and h > 100:
                ctk_img = ctk.CTkImage(light_image=img, dark_image=img, size=(w, h))
                self.video_label.configure(image=ctk_img)
        
        self.root.after(20, self.update_video_loop)

if __name__ == "__main__":
    root = ctk.CTk()
    app = GymDesktopKiosk(root)
    root.mainloop()
