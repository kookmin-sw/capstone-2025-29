import axios from "axios";

// ✅ 공통 헤더 함수
const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
});

// ✅ 봉사활동 추천X 매칭 신청 API
export const requestElderlyMatching = async (matchingId) => {
    const response = await axios.post(`/api/elderly/matching`, matchingId, { headers: getAuthHeaders() });
    return response.data;
};

// ✅ 봉사탭 메인 페이지 데이터 가져오기 API
export const fetchElderlyMatching = async () => {
    const response = await axios.get(`/api/elderly`, { headers: getAuthHeaders() });
    return response.data;
};

// ✅ 나의 신청 내역 조회 API
export const fetchApplyingList = async () => {
    const response = await axios.get(`/api/volunteerActivity/registration`, { headers: getAuthHeaders() });
    return response.data;
};

// ✅ 봉사 신청 상세 내역 조회 API
export const fetchApplyingDetail = async (volunteerActivityId) => {
    const response = await axios.get(`/api/volunteerActivity/registration/${volunteerActivityId}`, { headers: getAuthHeaders() });
    return response.data;
};

// ✅ 매칭 완료 API
export const completeMatching = async (matchingId) => {
    const response = await axios.post(`/api/elderly/matching/${matchingId}`, {}, { headers: getAuthHeaders() });
    return response.data;
};

// ✅ 봉사 취소 API
export const cancelMatching = async (matchingId) => {
    const response = await axios.delete(`/api/elderly/matching/${matchingId}`, { headers: getAuthHeaders() });
    return response.data;
};


// ✅ 추천 봉사자 API (에러 시 alert 띄우기)
export const fetchRecommendedVolunteers = async (data) => {
    try {
        const response = await axios.post(`/api/elderly/recommend`, data, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error('추천 봉사자 API 오류:', error);

        // ✅ 에러 메시지 추출 (응답 데이터에서 가져오기)
        const errorMessage =
            error.response?.data?.message ||
            error.message ||
            '추천 봉사자 요청 중 오류가 발생했습니다.';

        alert(errorMessage);

        // 필요 시 에러를 다시 throw 해도 됨 (호출부에서 처리 원할 시)
        throw new Error(errorMessage);
    }
};


// ✅ 추천된 봉사자 선택 API
export const recommendVolunteerMatching = async ({ volunteerId, matchingId }) => {
    const response = await axios.post(`/api/elderly/recommend/matching`, { volunteerId, matchingId }, { headers: getAuthHeaders() });
    return response.data;
};


// ✅ keepalive용 매칭 취소 API (fetch 사용)
export const cancelMatchingKeepalive = async (matchingId) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/elderly/matching/${matchingId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
            },
            keepalive: true,
        });
        if (!response.ok) {
            throw new Error('keepalive 매칭 취소 실패');
        }
        console.log("✅ 매칭 취소 성공 (keepalive)");
    } catch (err) {
        console.error("❌ 매칭 취소 실패 (keepalive):", err);
    }
};
