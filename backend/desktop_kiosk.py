import cv2
import customtkinter as ctk
from PIL import Image, ImageTk
import threading
import time
import os
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from database import SessionLocal
import models
from cv_engine import CVEngine

# Load environment variables
load_dotenv()

# UI Settings
ctk.set_appearance_mode("Dark")
ctk.set_default_color_theme("blue")

class GymDesktopKiosk:
    def __init__(self, root):
        self.root = root
        self.root.title("GYM-ATLAS 2026 | Smart Access Control")
        
        # Responsive setup
        self.width = 1200
        self.height = 750
        self.root.geometry(f"{self.width}x{self.height}")
        self.root.configure(fg_color="#050505")
        
        # Initialize Engine
        self.cv_engine = CVEngine()
        self.cv_engine.start()
        
        self.setup_ui()
        self.update_video()

    def setup_ui(self):
        # Grid layout: Column 0 (Large - Video), Column 1 (Fixed - Stats/Input)
        self.root.grid_columnconfigure(0, weight=3)
        self.root.grid_columnconfigure(1, weight=1)
        self.root.grid_rowconfigure(0, weight=1)

        # Left Panel: Video Display
        self.video_frame = ctk.CTkFrame(self.root, fg_color="black", corner_radius=30, border_width=1, border_color="#1a1a1a")
        self.video_frame.grid(row=0, column=0, padx=20, pady=20, sticky="nsew")
        
        self.video_label = ctk.CTkLabel(self.video_frame, text="")
        self.video_label.pack(expand=True, fill="both", padx=5, pady=5)

        # Right Panel: Sidebar Controls
        self.sidebar = ctk.CTkFrame(self.root, fg_color="#0a0a0a", corner_radius=30, border_width=1, border_color="#1a1a1a")
        self.sidebar.grid(row=0, column=1, padx=20, pady=20, sticky="nsew")
        
        # Header
        self.logo_label = ctk.CTkLabel(self.sidebar, text="GYM-ATLAS", font=ctk.CTkFont(size=28, weight="bold", family="Outfit"))
        self.logo_label.pack(pady=(40, 10))
        self.sub_label = ctk.CTkLabel(self.sidebar, text="Real-time AI Sentinel", font=ctk.CTkFont(size=12), text_color="#444")
        self.sub_label.pack(pady=(0, 40))

        # Input Area
        self.input_label = ctk.CTkLabel(self.sidebar, text="VERIFICACIÓN DE SOCIO", font=ctk.CTkFont(size=14, weight="bold"), text_color="white")
        self.input_label.pack(pady=(10, 5))
        
        self.dni_entry = ctk.CTkEntry(self.sidebar, placeholder_text="Número de DNI", 
                                      height=60, width=280, font=ctk.CTkFont(size=24, weight="bold"),
                                      fg_color="#1a1a1a", border_color="#333", corner_radius=15, 
                                      justify="center")
        self.dni_entry.pack(pady=10, padx=20)
        self.dni_entry.bind("<Return>", self.check_member)
        self.dni_entry.focus_set()

        # Status Display
        self.status_card = ctk.CTkFrame(self.sidebar, fg_color="#1a1a1a", height=250, corner_radius=25)
        self.status_card.pack(pady=40, padx=20, fill="x")
        self.status_card.pack_propagate(False)

        self.status_text = ctk.CTkLabel(self.status_card, text="ESPERANDO", 
                                        font=ctk.CTkFont(size=36, weight="bold"))
        self.status_text.pack(expand=True)
        
        self.name_label = ctk.CTkLabel(self.sidebar, text="", font=ctk.CTkFont(size=18), text_color="#888")
        self.name_label.pack(pady=10)

        # Telemetry
        self.telemetry_label = ctk.CTkLabel(self.sidebar, text="YOLOv8: ACTIVE | NEON DB: ONLINE", 
                                           font=ctk.CTkFont(size=10), text_color="#111")
        self.telemetry_label.pack(side="bottom", pady=20)

    def check_member(self, event=None):
        dni = self.dni_entry.get().strip()
        if not dni: return
        
        self.dni_entry.delete(0, tk.END)
        self.status_card.configure(fg_color="#222")
        self.status_text.configure(text="SOCIO...")
        self.root.update()

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
            print(f"Error en DB: {e}")
            self.root.after(0, lambda: self.update_status_ui("DB ERROR", "ERROR"))
        finally:
            db.close()

    def update_status_ui(self, name, status):
        color = "#888"
        bg_color = "#1a1a1a"
        text_color = "white"
        
        if status == "ACTIVO":
            bg_color = "#004d00" # Deep Emerald
            text_color = "#00ff00"
        elif status == "DEUDA":
            bg_color = "#4d0000" # Deep Crimson
            text_color = "#ff4444"
        elif status == "POR VENCER":
            bg_color = "#4d4d00" # Amber
            text_color = "#ffff00"
            
        self.status_card.configure(fg_color=bg_color)
        self.status_text.configure(text=status, text_color=text_color)
        self.name_label.configure(text=name)
        
        self.root.after(5000, self.reset_ui)

    def reset_ui(self):
        self.status_card.configure(fg_color="#1a1a1a")
        self.status_text.configure(text="ESPERANDO", text_color="#333")
        self.name_label.configure(text="")
        self.cv_engine.set_member_status("", "IDLE")

    def update_video(self):
        frame = self.cv_engine.output_frame
        if frame is not None:
            # Convert OpenCV BGR to RGB
            cv2image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            img = Image.fromarray(cv2image)
            
            # Use CTkImage for scaling and quality
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
    import tkinter as tk # for event binding
    root = ctk.CTk()
    app = GymDesktopKiosk(root)
    root.protocol("WM_DELETE_WINDOW", app.on_closing)
    root.mainloop()
