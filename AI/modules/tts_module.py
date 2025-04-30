from melo.api import TTS
import os

device = "cuda:0" if os.environ.get("USE_CUDA") == "1" else "cpu"
speed = 1.0

# 모델은 앱 실행 시 1회 로딩
tts_model = TTS(language='KR', device=device)
speaker_ids = tts_model.hps.data.spk2id

def synthesize(text: str, output_path: str = "output.wav") -> str:
    tts_model.tts_to_file(text, speaker_ids['KR'], output_path, speed=speed)
    return output_path