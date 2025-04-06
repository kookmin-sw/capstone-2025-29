from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
import shutil
import os
import httpx
from modules.stt_module import transcribe
from modules.ttr_module import add_user_message, add_assistant_message, get_chat_response, get_chat_history
from modules.emotion_module import analyze_emotion
import uuid

app = FastAPI()

# 음성 입력 채팅
@app.post("/chat/audio/")
async def chat_with_audio(file: UploadFile = File(...)):

    temp_path = f"temp_{uuid.uuid4().hex}.wav"
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        text = transcribe(temp_path)
        add_user_message(text)
        response = get_chat_response()
        add_assistant_message(response)

        return {"user_input": text, "assistant_response": response}
    finally:
        # Clean up temporary files
        if os.path.exists(temp_path):
            os.remove(temp_path)

# 텍스트 입력 채팅
@app.post("/chat/text/")
async def chat_with_text(text: str):
   
    add_user_message(text)
    response = get_chat_response()
    add_assistant_message(response)
    
    return {
        "user_input": text,
        "assistant_response": response
    }

# TTS음성 파일 변환
@app.get("/audio/{filename}")
async def get_audio(filename: str):
   
    if not os.path.exists(filename):
        raise HTTPException(status_code=404, detail="Audio file not found")
    return FileResponse(filename)

# 감정분석
@app.post("/end-chat/")
async def end_chat(backend_url: str):
    # Analyze emotion from chat history
    emotion = analyze_emotion(get_chat_history(), ["기쁨", "슬픔", "외로움", "두려움", "평온", "설렘", "신남", "분노"])
    
    # Send emotion analysis to backend without waiting for response
    async with httpx.AsyncClient() as client:
        await client.post(
            backend_url,
            json={
                "emotion": emotion,
                "chat_history": get_chat_history()
            }
        )
    
    return {"status": "success", "emotion": emotion}
