import axios from 'axios';



// 유저 정보 가져오기
export const getUserInfo = async () => {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get('/api/volunteer', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        if (!response.data) {
            throw { status: 400, message: '유저 정보를 가져오는데 실패했습니다.' };
        }

        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            localStorage.removeItem('accessToken');
            throw { status: 401, message: '세션이 만료되었습니다. 다시 로그인해주세요.' };
        }
        throw {
            status: error.response?.status || 0,
            message: error.response?.data?.message || '서버와의 통신에 실패했습니다.'
        };
    }
};

// 봉사 가능 시간 설정
export const setAvailableTimes = async (data) => {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.post('/api/volunteer/schedule',
            {
                "schedules": data.schedules,
                "category": data.category
            },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/json'
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};
