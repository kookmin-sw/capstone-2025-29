import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api'; // API 서버 주소

// API 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // 서버에서 에러 응답이 온 경우
      console.error('API Error:', error.response.data);
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
);

// API 함수들
export const authAPI = {
  // 아이디 중복 확인
  checkId: async (id) => {
    const response = await api.get(`/auth/check-id/${id}`);
    return response.data;
  },

  // 회원가입
  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  // 전화번호 인증 요청
  requestPhoneVerification: async (phone) => {
    const response = await api.post('/auth/verify-phone', { phone });
    return response.data;
  },

  // 인증번호 확인
  verifyCode: async (phone, code) => {
    const response = await api.post('/auth/verify-code', { phone, code });
    return response.data;
  }
}; 