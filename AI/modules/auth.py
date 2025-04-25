from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt
from typing import Optional

# 백엔드와 공유된 시크릿 키
SECRET_KEY = "your-shared-secret-key"  # 실제 프로덕션에서는 환경 변수로 관리
ALGORITHM = "HS256"

security = HTTPBearer()

def verify_token(token: str) -> str:
    """
    JWT 토큰을 검증하고 사용자 ID를 반환합니다.
    
    Args:
        token (str): 검증할 JWT 토큰
        
    Returns:
        str: 토큰에서 추출한 사용자 ID
        
    Raises:
        HTTPException: 토큰이 유효하지 않은 경우
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        userId: str = payload.get("userId")
        if userId is None:
            raise HTTPException(status_code=401, detail="Invalid token payload")
        return userId
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """
    현재 요청의 사용자 ID를 반환합니다.
    
    Args:
        credentials (HTTPAuthorizationCredentials): Authorization 헤더의 인증 정보
        
    Returns:
        str: 사용자 ID
        
    Raises:
        HTTPException: 토큰이 유효하지 않은 경우
    """
    return verify_token(credentials.credentials) 