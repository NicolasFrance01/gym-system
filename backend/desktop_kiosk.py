import cv2
import tkinter as tk
from tkinter import font
from PIL import Image, ImageTk
import threading
import time
import os
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
from cv_engine import CVEngine

# Load environment variables
load_dotenv()

class GymDesktopKiosk:
    def __init__(self, root):
        self.root = root
        self.root.title("GYM-ATLAS | Control de Acceso 2026")
        self.root.geometry("1100x700")
        self.root.configure(bg="#050505")
        
        self.cv_engine = CVEngine()
        self.cv_engine.start()
        
        self.setup_ui()
        self.update_video()

    def setup_ui(self):
        # Premium Fonts
        self.title_font = font.Font(family="Helvetica", size=24, weight="bold")
        self.status_font = font.Font(family="Helvetica", size=48, weight="bold")
        self.detail_font = font.Font(family="Helvetica", size=14)

        # Left Panel: Video
        self.video_frame = tk.Frame(self.root, bg="#050505", width=700, height=525)
        self.video_frame.pack(side="left", padx=20, pady=20)
        
        self.video_label = tk.Label(self.video_frame, bg="black")
        self.video_label.pack()

        # Right Panel: Controls
        self.control_frame = tk.Frame(self.root, bg="#0a0a0a", width=350)
        self.control_frame.pack(side="right", fill="both", expand=True, padx=20, pady=20)
        
        tk.Label(self.control_frame, text="GYM-ATLAS", font=self.title_font, bg="#0a0a0a", fg="white").pack(pady=30)
        
        tk.Label(self.control_frame, text="Ingrese DNI Socio:", font=self.detail_font, bg="#0a0a0a", fg="#666").pack(pady=5)
        self.dni_entry = tk.Entry(self.control_frame, font=self.title_font, justify="center", bg="#1a1a1a", fg="white", insertbackground="white", borderwidth=0)
        self.dni_entry.pack(pady=10, padx=20, fill="x")
        self.dni_entry.bind("<Return>", self.check_member)
        self.dni_entry.focus_set()

        # Status Circle/Area
        self.status_box = tk.Label(self.control_frame, text="ESPERANDO", font=self.status_font, bg="#1a1a1a", fg="#444", pady=40)
        self.status_box.pack(pady=30, padx=20, fill="x")
        
        self.member_name_label = tk.Label(self.control_frame, text="", font=self.detail_font, bg="#0a0a0a", fg="white")
        self.member_name_label.pack(pady=10)

        # Footer
        tk.Label(self.root, text="YOLOv8 Real-time Engine Active | DB Connected", bg="#050505", fg="#333", font=("Helvetica", 8)).place(relx=1.0, rely=1.0, anchor="se", x=-10, y=-10)

    def check_member(self, event=None):
        dni = self.dni_entry.get().strip()
        if not dni: return
        
        self.dni_entry.delete(0, tk.END)
        self.status_box.config(text="BUSCANDO...", fg="white", bg="#222")
        self.root.update()

        # Database lookup in a separate thread to avoid UI freeze
        threading.Thread(target=self._db_lookup, args=(dni,), daemon=True).start()

    def _db_lookup(self, dni):
        db = SessionLocal()
        try:
            member = db.query(models.Member).filter(models.Member.dni == dni).first()
            if member:
                self.cv_engine.set_member_status(member.name, member.status)
                self.update_status_ui(member.name, member.status)
            else:
                self.update_status_ui("NO ENCONTRADO", "ERROR")
        except Exception as e:
            print(f"Error en DB: {e}")
            self.update_status_ui("DB ERROR", "ERROR")
        finally:
            db.close()

    def update_status_ui(self, name, status):
        color = "#888"
        bg_color = "#1a1a1a"
        
        if status == "ACTIVO":
            color = "#00ff00"
            bg_color = "#003300"
        elif status == "DEUDA":
            color = "#ff0000"
            bg_color = "#330000"
        elif status == "POR VENCER":
            color = "#ffff00"
            bg_color = "#333300"
        else:
            color = "#ff4400"
            
        self.status_box.config(text=status, fg=color, bg=bg_color)
        self.member_name_label.config(text=name)
        
        # Auto-reset after 5 seconds
        self.root.after(5000, self.reset_ui)

    def reset_ui(self):
        self.status_box.config(text="ESPERANDO", fg="#444", bg="#1a1a1a")
        self.member_name_label.config(text="")
        self.cv_engine.set_member_status("", "IDLE")

    def update_video(self):
        frame = self.cv_engine.output_frame
        if frame is not None:
            # Convert OpenCV BGR to RGB
            cv2image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGBA)
            img = Image.fromarray(cv2image)
            # Resize for UI
            img = img.resize((700, 525), Image.Resampling.LANCZOS)
            imgtk = ImageTk.PhotoImage(image=img)
            self.video_label.imgtk = imgtk
            self.video_label.configure(image=imgtk)
        
        self.root.after(10, self.update_video)

    def on_closing(self):
        self.cv_engine.stop()
        self.root.destroy()

if __name__ == "__main__":
    root = tk.Tk()
    app = GymDesktopKiosk(root)
    root.protocol("WM_DELETE_WINDOW", app.on_closing)
    root.mainloop()
