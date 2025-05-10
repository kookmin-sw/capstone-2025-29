from gradio_client import Client
import uuid, os, shutil

GRADIO_URL = "http://43.202.0.116:8888"

def synthesize(text: str, output_dir="tts_output") -> str:
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

        shutil.move(result, final_path)
        return final_path

    except Exception as e:
        raise RuntimeError(f"TTS 요청 실패: {e}")