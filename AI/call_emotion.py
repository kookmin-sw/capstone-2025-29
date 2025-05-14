import os
import httpx
from dotenv import load_dotenv

load_dotenv()

BACKEND = os.getenv("BACKEND_API_BASE")
LOGIN_ID = os.getenv("LOGIN_ID")
LOGIN_PW = os.getenv("LOGIN_PW")
USER_TYPE = os.getenv("USER_TYPE")

def get_access_token():
    login_url = f"{BACKEND}/api/login"
    params = {
        "username": LOGIN_ID,
        "password": LOGIN_PW,
        "userType": USER_TYPE
    }
    response = httpx.post(login_url, params=params)
    response.raise_for_status()
    return response.json()["accessToken"]

def call_emotion_api(token):
    url = "https://aiserver.store//emotion/"
    headers = {"Authorization": f"Bearer {token}"}
    res = httpx.post(url, headers=headers)
    res.raise_for_status()
    print("[SUCCESS] 감정 분석 실행 완료")
    print(res.json())

if __name__ == "__main__":
    token = get_access_token()
    call_emotion_api(token)