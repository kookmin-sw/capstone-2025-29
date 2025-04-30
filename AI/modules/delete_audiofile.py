import time
import os

def delete_file_after_delay(file_path: str, delay: int = 600):
    time.sleep(delay)  
    if os.path.exists(file_path):
        os.remove(file_path)