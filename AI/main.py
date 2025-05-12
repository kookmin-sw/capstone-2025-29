from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, BackgroundTasks, Query
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles
import shutil
import os
import httpx
import uuid

from modules.stt_module import transcribe
from modules.tts_module import synthesize
from modules.ttr_module import add_user_message, add_assistant_message, get_chat_response, get_chat_history
from modules.emotion_module import analyze_emotion
from modules.auth import get_current_user
from modules.delete_audiofile import delete_file_after_delay
from modules.logger_module import load_logs_from_s3
from modules.logger_module import log_to_s3
from datetime import datetime


#배포테스트
app = FastAPI()
app.mount("/audio", StaticFiles(directory="tts_output"), name="audio")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/healthcheck")
def healthcheck():
    return {"status": "ok"}

@app.get("/auth/check")
async def check_auth(username: str = Depends(get_current_user)):
    return {
        "status": "authorized",
        "username": username,
        "message": "JWT 토큰 인증 성공!"
    }


@app.post("/chat/audio/")
async def chat_with_audio(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    username: str = Depends(get_current_user)   
):
    temp_path = f"temp_{uuid.uuid4().hex}.wav"
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        text = transcribe(temp_path)

        add_user_message(text)
        gpt_response = get_chat_response()
        add_assistant_message(gpt_response)

        return {
            "status": "success",
            "username": username,
            "data": {
                "input": {
                    "type": "audio",
                    "text": text
                },
                "response": {
                    "text": gpt_response,
                    # "audio_path": f"/audio/{tts_filename}"
                }
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"오디오 채팅 처리 중 오류: {str(e)}")
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)


class TextInput(BaseModel):
    text: str

@app.post("/chat/text")
async def chat_with_text(
    background_tasks: BackgroundTasks,
    data: TextInput,
    username: str = Depends(get_current_user)
):
    try:
        text = data.text
        add_user_message(text)
        gpt_response = get_chat_response()
        add_assistant_message(gpt_response)

        log_to_s3(username, text, gpt_response)

        tts_path = synthesize(gpt_response)

        background_tasks.add_task(delete_file_after_delay, tts_path)

        return {
            "status": "success",
            "username": username,
            "data": {
                "input": {
                    "type": "text",
                    "text": text
                },
                "response": {
                    "text": gpt_response,
                    "audio_path": f"/audio/{os.path.basename(tts_path)}"
                }
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"텍스트 채팅 처리 중 오류: {str(e)}")


@app.get("/audio/{filename}")
async def get_audio(
    filename: str,
    username: str = Depends(get_current_user)
):
    try:
        if not os.path.exists(filename):
            raise HTTPException(status_code=404, detail="오디오 파일이 존재하지 않습니다.")
        return FileResponse(filename)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"오디오 파일 반환 중 오류: {str(e)}")
    

@app.get("/emotion/test")
async def test_emotion_from_s3(
    username: str = Query(...),
    date: str = Query(...)
):
    try:
        messages = load_logs_from_s3(username, date)

        if not messages:
            raise HTTPException(status_code=404, detail="해당 날짜에 대한 로그가 없습니다.")

        history = []
        for entry in messages:
            history.append({"role": "user", "content": entry["user"]})
            history.append({"role": "assistant", "content": entry["assistant"]})

        emotion = analyze_emotion(history, ["기쁨", "슬픔", "외로움", "두려움", "평온", "설렘", "신남", "분노"])

        return {
            "status": "success",
            "username": username,
            "emotion": emotion,
            "date": date
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"테스트용 감정 분석 실패: {str(e)}")


@app.post("/emotion/")
async def emotion(
    backend_url: str,
    username: str = Depends(get_current_user)
):
    try:
        today = datetime.now().strftime("%Y-%m-%d")
        messages = load_logs_from_s3(username, today)

        history = []
        for entry in messages:
            history.append({"role": "user", "content": entry["user"]})
            history.append({"role": "assistant", "content": entry["assistant"]})

        emotion = analyze_emotion(history, ["기쁨", "슬픔", "외로움", "두려움", "평온", "설렘", "신남", "분노"])

        async with httpx.AsyncClient() as client:
            await client.post(
                backend_url,
                json={
                    "username": username,
                    "emotion": emotion,
                    "date": today
                }
            )

        return {"status": "success", "emotion": emotion}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"감정 분석 실패: {str(e)}")