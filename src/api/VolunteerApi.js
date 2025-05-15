import axios from 'axios';

// ✅ API BASE 설정 (production/개발 상관없이 고정)
const API_BASE = import.meta.env.VITE_API_BASE || "https://coffeesupliers.shop";

// ✅ 공통 헤더 함수
const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
});

// ✅ 유저 정보 가져오기
export const getUserInfo = async () => {
    try {
        const response = await axios.get(`${API_BASE}/api/volunteer`, { headers: getAuthHeaders() });

        if (!response.data) throw { status: 400, message: '유저 정보를 가져오는데 실패했습니다.' };
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) localStorage.removeItem('accessToken');
        throw {
            status: error.response?.status || 0,
            message: error.response?.data?.message || '서버와의 통신에 실패했습니다.'
        };
    }
};

// ✅ 봉사 가능 시간 설정
export const setAvailableTimes = async (data) => {
    const response = await axios.post(`/api/volunteer/schedule`, {
        schedules: data.schedules,
        category: data.category
    }, { headers: getAuthHeaders() });
    return response.data;
};

// ✅ 봉사자 매칭 리스트 조회
export const fetchMatchingList = async () => {
    const response = await axios.get(`/api/volunteerActivity/matching`, { headers: getAuthHeaders() });
    return response.data;
};

// ✅ 매칭 상세 조회
export const fetchMatchingDetail = async (volunteerActivityId) => {
    const response = await axios.get(`/api/volunteerActivity/matching/${volunteerActivityId}`, { headers: getAuthHeaders() });
    return response.data;
};

// ✅ 매칭 취소
export const cancelMatching = async (matchingId) => {
    const response = await axios.delete(`/api/volunteer/matching/${matchingId}`, { headers: getAuthHeaders() });
    return response.data;
};

// ✅ 후기 작성
export const submitReview = async (reviewData) => {
    const response = await axios.post(`/api/review`, reviewData, { headers: getAuthHeaders() });
    return response.data;
};

// ✅ 완료된 후기 리스트 조회
export const getCompletedReviews = async () => {
    const response = await axios.get(`/api/review`, { headers: getAuthHeaders() });
    return response.data;
};

// ✅ 후기 상세 조회
export const getReviewDetail = async (volunteerActivityId) => {
    const response = await axios.get(`/api/review/${volunteerActivityId}`, { headers: getAuthHeaders() });
    return response.data;
};
