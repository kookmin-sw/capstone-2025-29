from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
import shutil
import os
import httpx
from modules.stt_module import transcribe
from modules.ttr_module import add_user_message, add_assistant_message, get_chat_response, get_chat_history
from modules.emotion_module import analyze_emotion
import uuid

# 음성 입력 채팅
@app.post("/chat/audio/")
async def chat_with_audio(file: UploadFile = File(...)):
    temp_path = f"temp_{uuid.uuid4().hex}.wav"
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # STT: 음성을 텍스트로 변환
        text = transcribe(temp_path)
        
        # TTR: GPT 응답 생성
        add_user_message(text)  # 채팅 기록에 사용자 메시지 추가
        gpt_response = get_chat_response()  # GPT 응답 생성
        add_assistant_message(gpt_response)  # 채팅 기록에 AI 응답 추가

        return {
            "status": "success",
            "data": {
                "input": {
                    "type": "audio",
                    "text": text
                },
                "response": {
                    "text": gpt_response,
                    "audio_path": None  # TTS 구현 시 추가
                }
            }
        }
    finally:
        # Clean up temporary files
        if os.path.exists(temp_path):
            os.remove(temp_path)


# 텍스트 입력 채팅
@app.post("/chat/text/")
async def chat_with_text(text: str):
    # TTR: GPT 응답 생성
    add_user_message(text)  # 채팅 기록에 사용자 메시지 추가
    gpt_response = get_chat_response()  # GPT 응답 생성
    add_assistant_message(gpt_response)  # 채팅 기록에 AI 응답 추가
    
    return {
        "status": "success",
        "data": {
            "input": {
                "type": "text",
                "text": text
            },
            "response": {
                "text": gpt_response,
                "audio_path": None  # TTS 구현 시 추가
            }
        }
    }


# TTS음성 파일 변환
@app.get("/audio/{filename}")
async def get_audio(filename: str):
   
    if not os.path.exists(filename):
        raise HTTPException(status_code=404, detail="Audio file not found")
    return FileResponse(filename)