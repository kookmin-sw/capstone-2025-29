from fastapi import FastAPI, File, UploadFile
import shutil
import os
from modules.stt_module import transcribe
from modules.ttr_module import add_user_message, add_assistant_message, get_chat_response, get_chat_history
from modules.emotion_module import analyze_emotion

app = FastAPI()

@app.post("/chat/")
async def chat_with_audio(file: UploadFile = File(...)):
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    text = transcribe(temp_path)
    add_user_message(text)
    response = get_chat_response()
    add_assistant_message(response)

    os.remove(temp_path)
    return {"user_input": text, "assistant_response": response}

@app.get("/emotion/")
async def get_emotion():
    emotion = analyze_emotion(get_chat_history(), ["기쁨", "슬픔", "외로움", "두려움", "평온", "설렘", "신남", "분노"])
    return {"emotion": emotion}