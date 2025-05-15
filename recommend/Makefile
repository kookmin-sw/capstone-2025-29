.PHONY: setup run clean test proto grpc-server

# 가상환경 생성 및 패키지 설치
setup:
	python3 -m venv venv
	. venv/bin/activate && pip install --upgrade pip
	. venv/bin/activate && pip install scikit-learn==1.4.0 \
		kiwipiepy==0.18.0 \
		numpy==1.26.4 \
		grpcio==1.62.0 \
		grpcio-tools==1.62.0 \
		protobuf==4.25.2 \
		sqlalchemy==2.0.29 \
		pymysql==1.1.0

# Proto 파일 컴파일
proto:
	. venv/bin/activate && python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. user_recommendation.proto

# FastAPI 서버 실행
run:
	. venv/bin/activate && uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# gRPC 서버 실행
grpc-server:
	. venv/bin/activate && python grpc_server.py

# API 테스트
test:
	. venv/bin/activate && curl -X POST "http://localhost:8000/recommend" \
		-H "Content-Type: application/json" \
		-d '{"elderly_details": "80세 여성, 혼자 사시며 요리와 정원 가꾸기를 좋아하심", "volunteer_bios": ["요리 경험 5년, 노인 돌봄 자원봉사 경험 있음", "정원 가꾸기 전문가, 노인 복지관 봉사 경험 3년"]}'

# 가상환경 삭제
clean:
	rm -rf venv
	rm -f *_pb2.py *_pb2_grpc.py 