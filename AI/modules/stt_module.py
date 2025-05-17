import torch
from transformers import AutoModelForSpeechSeq2Seq, AutoProcessor, pipeline

device = "cuda:0" if torch.cuda.is_available() else "cpu"
stt_model_id = "openai/whisper-small"
stt_model = AutoModelForSpeechSeq2Seq.from_pretrained(stt_model_id).to(device)
stt_processor = AutoProcessor.from_pretrained(stt_model_id)

stt_pipe = pipeline(
    "automatic-speech-recognition",
    model=stt_model,
    tokenizer=stt_processor.tokenizer,
    feature_extractor=stt_processor.feature_extractor,
    device=device,
)

def transcribe(audio_path: str) -> str:
    result = stt_pipe(audio_path)
    return result["text"]