FROM python:3.10-slim

WORKDIR /app

COPY . .

ENV TMPDIR=/var/tmp

RUN apt-get update && apt-get install -y \
    build-essential libsndfile1 curl \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]