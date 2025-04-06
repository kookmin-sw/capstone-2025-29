from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

chat_history = [{"role": "system", "content": "너는 독거노인과 따뜻하게 대화하는 친구야."}]

def add_user_message(msg: str):
    chat_history.append({"role": "user", "content": msg})

def add_assistant_message(msg: str):
    chat_history.append({"role": "assistant", "content": msg})

def get_chat_response() -> str:
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=chat_history,
        max_tokens=500,
        temperature=0.7,
    )
    return response.choices[0].message.content

def get_chat_history():
    return chat_history