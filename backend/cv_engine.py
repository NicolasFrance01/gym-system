import cv2
from ultralytics import YOLO
import threading
import time

class CVEngine:
    def __init__(self):
        # Using the smallest YOLOv8 model for faster real-time detection on CPU
        self.model = YOLO('yolov8n.pt')
        self.cap = None
        self.is_running = False
        self.lock = threading.Lock()
        self.output_frame = None
        
        # State from frontend
        self.current_color = (128, 128, 128) # BGR: Gray by default
        self.current_status = "IDLE"
        self.current_name = ""
        self.is_alarm_active = False
        self.last_update_time = time.time()

    def set_member_status(self, name: str, status: str):
        self.current_name = name
        self.current_status = status
        self.last_update_time = time.time()
        if status == "DEUDA":
            self.current_color = (0, 0, 255) # Red
        elif status == "POR VENCER":
            self.current_color = (0, 255, 255) # Yellow
        elif status in ["AL DIA", "ACTIVO"]:
            self.current_color = (0, 255, 0) # Green
        else:
            self.current_color = (128, 128, 128) # Gray

    def start(self):
        self.cap = cv2.VideoCapture(0) # Open first webcam
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
        self.is_running = True
        self.thread = threading.Thread(target=self._run_loop)
        self.thread.daemon = True
        self.thread.start()

    def _run_loop(self):
        while self.is_running and self.cap.isOpened():
            # Auto reset to IDLE after 8 seconds
            if time.time() - self.last_update_time > 8 and self.current_status != "IDLE":
                self.current_status = "IDLE"
                self.current_name = ""
                self.current_color = (128, 128, 128) # Back to Gray
                self.is_alarm_active = False

            ret, frame = self.cap.read()
            if not ret:
                time.sleep(0.1)
                continue
            
            # Flip horizontally to fix mirroring
            frame = cv2.flip(frame, 1)

            # Run YOLO Person detection
            results = self.model(frame, classes=[0], verbose=False) # class 0 is person

            annotated_frame = frame.copy()
            
            person_detected = False
            for r in results:
                boxes = r.boxes
                if len(boxes) > 0:
                    person_detected = True
                for box in boxes:
                    x1, y1, x2, y2 = box.xyxy[0].cpu().numpy().astype(int)
                    # Draw bounding box based on current status color
                    cv2.rectangle(annotated_frame, (x1, y1), (x2, y2), self.current_color, 3)
                    
                    label_text = f"Persona Detectada" if self.current_status == "IDLE" else f"{self.current_name} - {self.current_status}"
                    cv2.putText(annotated_frame, label_text, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, self.current_color, 2)

            with self.lock:
                self.output_frame = annotated_frame
                self.is_alarm_active = person_detected and self.current_status == "DEUDA"

    def stop(self):
        self.is_running = False
        if self.cap:
            self.cap.release()

    def get_frame(self):
        with self.lock:
            if self.output_frame is None:
                return None
            ret, buffer = cv2.imencode('.jpg', self.output_frame)
            return buffer.tobytes() if ret else None
