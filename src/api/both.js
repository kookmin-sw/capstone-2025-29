import axios from 'axios';
import { useNavigate } from 'react-router-dom';  


// 로그인 API
export const login = async (username, password, userType) => {
    try {

        const response = await axios.get('/api/login', {
            params: {
                username : username,
                password : password,
                userType : userType
            },
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            withCredentials: false 
        });

        if (!response.data?.accessToken) {
            throw { status: 400, message: '로그인 실패: 서버 응답에 토큰이 없습니다.' };
        }

        // JWT 저장
        localStorage.setItem('accessToken', response.data.accessToken);


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

// 아이디 중복 확인 API
export const checkUsername = async (username, userType) => {
    try {
        const response = await axios.get('/api/user/username', {
            params: { username, userType },
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return response.data;
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

// 회원가입 API
export const registerUser = async (userData) => {
    try {
        const response = await axios.post('/api/user', userData, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: false,
        });
        return response.data;
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

