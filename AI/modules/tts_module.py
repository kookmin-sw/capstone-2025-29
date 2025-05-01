import httpx
import uuid
import os
import shutil

GRADIO_API_URL = "https://76a5f5b27ca059f649.gradio.live/synthesize"  

def synthesize(text: str, output_dir="tts_output") -> str:
    payload = {
        "data": [text, "KR", "KR", 1.0]  # 순서: text, speaker_id, language, speed
    }

    try:
        response = httpx.post(GRADIO_API_URL, json=payload)
        response.raise_for_status()
        temp_audio_path = response.json()["data"][0]

        os.makedirs(output_dir, exist_ok=True)
        filename = f"tts_{uuid.uuid4().hex[:8]}.wav"
        final_path = os.path.join(output_dir, filename)

        shutil.move(temp_audio_path, final_path)
        return final_path

    except Exception as e:
        raise RuntimeError(f"TTS 요청 실패: {e}")