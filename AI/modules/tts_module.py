from gradio_client import Client
import uuid, os, shutil

GRADIO_URL = "http://52.78.135.32:8888/"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(BASE_DIR, "..", "tts_output")  

def synthesize(text: str, output_dir=OUTPUT_DIR) -> str:
    client = Client(GRADIO_URL)

    try:
        result = client.predict(
            speaker="KR",          
            text=text,
            speed=1.0,
            language="KR",
            api_name="/synthesize"
        )

        os.makedirs(output_dir, exist_ok=True)
        filename = f"tts_{uuid.uuid4().hex[:8]}.wav"
        final_path = os.path.join(output_dir, filename)

        print(f"[DEBUG] Gradio로부터 받은 임시 파일 경로: {result}")
        print(f"[DEBUG] 최종 저장될 위치: {final_path}")
        print(f"[DEBUG] 현재 작업 디렉토리: {os.getcwd()}")

        shutil.move(result, final_path)
        return final_path

    except Exception as e:
        raise RuntimeError(f"TTS 요청 실패: {e}")