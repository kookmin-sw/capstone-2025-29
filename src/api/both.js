import axios from 'axios';




// ✅ 로그인 API
export const login = async (username, password, userType) => {
    try {
        const response = await axios.get(`/api/login`, {
            params: { username, password, userType },
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (!response.data?.accessToken) {
            throw { status: 400, message: '로그인 실패: 서버 응답에 토큰이 없습니다.' };
        }

        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('userType', userType);

        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || '로그인에 실패했습니다.';
        throw {
            status: error.response?.status || 0,
            message: errorMessage
        };
    }
};

// ✅ 아이디 중복 확인 API
export const checkUsername = async (username, userType) => {
    try {
        const response = await axios.get(`/api/user/username`, {
            params: { username, userType },
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return response;
    } catch (error) {
        const errorMessage = error.response?.data?.message || '아이디 중복 확인에 실패했습니다.';
        throw {
            status: error.response?.status || 0,
            message: errorMessage
        };
    }
};

// ✅ 회원가입 API
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`/api/user`, userData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;
    } catch (error) {
        const errorMessage = error.response?.data?.message || '회원가입에 실패했습니다.';
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
        const response = await axios.get(`/api/user`, {
            params: { userType },
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
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
        const response = await axios.put(`/api/user`, userData, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
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
        const response = await axios.get(`/api/user/password`, {
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
        const response = await axios.patch(`/api/user`, {
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

// ✅ 유저 알림 목록 가져오기 API
export const fetchUserNotifications = async (userType) => {
    const accessToken = localStorage.getItem("accessToken");

    try {
        const response = await axios.get(`/api/user/notification`, {
            params: { userType },
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || '알림을 불러오는 데 실패했습니다.';
        throw {
            status: error.response?.status || 0,
            message: errorMessage
        };
    }
};


// ✅ 카카오 로그인 API
export const kakaoLogin = async () => {
    try {
        const response = await axios.get('/api/oauth2/authorization/kakao');
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || '카카오 로그인에 실패했습니다.';
        throw {
            status: error.response?.status || 0,
            message: errorMessage
        };
    }
};
