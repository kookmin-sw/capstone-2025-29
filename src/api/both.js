import axios from 'axios';

// ✅ 환경에 따라 API_BASE 설정
const API_BASE = import.meta.env.MODE === 'production'
    ? import.meta.env.VITE_API_URL
    : ''; // 로컬에서는 프록시 사용을 위해 빈 문자열

// ✅ 로그인 API
export const login = async (username, password, userType) => {
    try {
        const response = await axios.get(`http://54.180.122.49:8080/api/login`, {
            params: { username, password, userType },
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            withCredentials: false
        });

        if (!response.data?.accessToken) {
            throw { status: 400, message: '로그인 실패: 서버 응답에 토큰이 없습니다.' };
        }

        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('userType', userType);
    } catch (error) {
        const errorMessage = error.response?.data?.message ||
            (error.response ? '로그인에 실패했습니다.' :
                (error.request ? '서버와의 통신에 실패했습니다.' :
                    '로그인 요청 중 오류가 발생했습니다.'));
        throw {
            status: error.response?.status || 0,
            message: errorMessage
        };
    }
};

// ✅ 아이디 중복 확인 API
export const checkUsername = async (username, userType) => {
    try {
        const response = await axios.get(`${API_BASE}/api/user/username`, {
            params: { username, userType },
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return response;
    } catch (error) {
        const errorMessage = error.response?.data?.message ||
            (error.response ? '아이디 중복 확인에 실패했습니다.' :
                (error.request ? '서버와의 통신에 실패했습니다.' :
                    '요청 중 오류가 발생했습니다.'));
        throw {
            status: error.response?.status || 0,
            message: errorMessage
        };
    }
};

// ✅ 회원가입 API
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE}/api/user`, userData, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: false,
        });
        return response;
    } catch (error) {
        const errorMessage = error.response?.data?.message ||
            (error.response ? '회원가입에 실패했습니다.' :
                (error.request ? '서버와의 통신에 실패했습니다.' :
                    '요청 중 오류가 발생했습니다.'));
        throw {
            status: error.response?.status || 0,
            message: errorMessage
        };
    }
};

// ✅ 유저 정보 불러오기 API
export const fetchUserInfo = async (userType) => {
    const accessToken = localStorage.getItem("accessToken");

    try {
        const response = await axios.get(`${API_BASE}/api/user`, {
            params: { userType },
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });

        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || '유저 정보를 불러오는 데 실패했습니다.';
        throw {
            status: error.response?.status || 0,
            message: errorMessage
        };
    }
};

// ✅ 유저 정보 수정 API
export const updateUserInfo = async (userData) => {
    const accessToken = localStorage.getItem("accessToken");

    try {
        const response = await axios.put(`${API_BASE}/api/user`, userData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });

        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || '유저 정보 수정에 실패했습니다.';
        throw {
            status: error.response?.status || 0,
            message: errorMessage
        };
    }
};

// ✅ 현재 비밀번호 확인 API
export const checkPassword = async (password, userType) => {
    const accessToken = localStorage.getItem("accessToken");

    try {
        const response = await axios.get(`${API_BASE}/api/user/password`, {
            params: { password, userType },
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || '현재 비밀번호가 올바르지 않습니다.';
        throw {
            status: error.response?.status || 0,
            message: errorMessage
        };
    }
};

// ✅ 비밀번호 변경 API
export const updatePassword = async (password, userType) => {
    const accessToken = localStorage.getItem("accessToken");

    try {
        const response = await axios.patch(`${API_BASE}/api/user`, {
            password,
            userType
        }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || '비밀번호 변경에 실패했습니다.';
        throw {
            status: error.response?.status || 0,
            message: errorMessage
        };
    }
};
