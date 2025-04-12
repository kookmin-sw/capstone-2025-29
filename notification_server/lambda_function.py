import firebase_admin as admin
from firebase_admin import credentials
from firebase_admin import messaging
import json

credential = credentials.Certificate('./ongi-fc059-firebase-adminsdk-fbsvc-ee2b758ac8.json')
admin.initialize_app(credential)

# Lambda 메인 핸들러
def lambda_handler(event, context):
    try:
        print("📦 받은 전체 이벤트:")
        print(json.dumps(event, indent=2))  # 여기가 핵심!

        parsed_payload = parse_sqs_message(event)

        print("==== 수신한 메시지 정보 ====")
        print("Title:", parsed_payload['title'])
        print("Body:", parsed_payload['content'])
        print("Token:", parsed_payload['token'])

        return send_notification(parsed_payload)
    except Exception as e:
        print("🚨 오류 발생:", str(e))
        raise e

# 알림 전송 함수
def send_notification(payload):
    message = messaging.Message(
        notification=messaging.Notification(
            title=payload['title'],
            body=payload['content']
        ),
        token=payload['token']
    )
    response = messaging.send(message)
    print("✅ FCM 응답:", response)
    return {"status": "success", "response": response}

# SQS 메시지 파싱 함수
def parse_sqs_message(event):
    record = event['Records'][0]
    attributes = record['messageAttributes']

    title = attributes['title']['stringValue']
    content = attributes['body']['stringValue']
    token = attributes['token']['stringValue']

    return {
        "title": title,
        "content": content,
        "token": token
    }