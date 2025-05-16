from openai import OpenAI
import re
from dotenv import load_dotenv
import os
load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def analyze_emotion(chat_history, labels) -> str:
    messages = chat_history + [{
        "role": "system",
        "content": f"전체 대화를 바탕으로 감정을 분석해줘. 감정: {', '.join(labels)} 중 하나로 '감정: [감정]' 형식으로 말해줘."
    }]
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=messages,
        max_tokens=300,
        temperature=0.7,
    )
    content = response.choices[0].message.content
    match = re.search(r"감정:\s*(\w+)", content)
    return match.group(1) if match else "분석 실패"