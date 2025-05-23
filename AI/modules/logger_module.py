import boto3
import os
import json
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

s3 = boto3.client(
    's3',
    aws_access_key_id=os.getenv("AWS_S3_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_S3_SECRET_ACCESS_KEY"),
    region_name="ap-northeast-2"
)

BUCKET_NAME = "ai-emotion"

def log_to_s3(username: str, user_msg: str, assistant_msg: str):
    today = datetime.now().strftime("%Y-%m-%d")
    key = f"{username}/{today}.jsonl"

    record = {
        "user": user_msg,
        "assistant": assistant_msg,
        "timestamp": datetime.now().isoformat()
    }

    try:
        obj = s3.get_object(Bucket=BUCKET_NAME, Key=key)
        lines = obj["Body"].read().decode("utf-8").splitlines()
    except s3.exceptions.NoSuchKey:
        lines = []

    lines.append(json.dumps(record))

    s3.put_object(Bucket=BUCKET_NAME, Key=key, Body="\n".join(lines).encode("utf-8"))

def load_logs_from_s3(username: str, date: str):
    key = f"{username}/{date}.jsonl"

    try:
        obj = s3.get_object(Bucket=BUCKET_NAME, Key=key)
        lines = obj["Body"].read().decode("utf-8").splitlines()
        return [json.loads(line) for line in lines]
    except s3.exceptions.NoSuchKey:
        return []

def list_usernames():
    response = s3.list_objects_v2(Bucket=BUCKET_NAME, Delimiter='/')
    prefixes = response.get('CommonPrefixes', [])
    return [prefix['Prefix'].rstrip('/') for prefix in prefixes]