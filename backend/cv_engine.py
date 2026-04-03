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
        self.current_color = (0, 255, 0) # BGR: Green by default
        self.current_status = "AL DIA"

    def set_member_status(self, status: str):
        self.current_status = status
        if status == "DEUDA":
            self.current_color = (0, 0, 255) # Red
        elif status == "POR VENCER":
            self.current_color = (0, 255, 255) # Yellow
        else:
            self.current_color = (0, 255, 0) # Green

    def start(self):
        self.cap = cv2.VideoCapture(0) # Open first webcam
        self.is_running = True
        self.thread = threading.Thread(target=self._run_loop)
        self.thread.daemon = True
        self.thread.start()

    def _run_loop(self):
        while self.is_running and self.cap.isOpened():
            ret, frame = self.cap.read()
            if not ret:
                time.sleep(0.1)
                continue

            # Run YOLO Person detection
            results = self.model(frame, classes=[0], verbose=False) # class 0 is person

            annotated_frame = frame.copy()
            
            for r in results:
                boxes = r.boxes
                for box in boxes:
                    x1, y1, x2, y2 = box.xyxy[0].cpu().numpy().astype(int)
                    # Draw bounding box based on current status color
                    cv2.rectangle(annotated_frame, (x1, y1), (x2, y2), self.current_color, 3)
                    cv2.putText(annotated_frame, f"Person - {self.current_status}", (x1, y1 - 10), 
                                cv2.FONT_HERSHEY_SIMPLEX, 0.9, self.current_color, 2)

            with self.lock:
                self.output_frame = annotated_frame

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
