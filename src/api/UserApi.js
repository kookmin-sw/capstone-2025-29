import axios from "axios";

// ✅ 공통 헤더 함수
const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
});

// ✅ 봉사활동 추천X 매칭 신청 API (400에러 alert 포함)
export const requestElderlyMatching = async (matchingId) => {
    try {
        const response = await axios.post(`/api/elderly/matching`, matchingId, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        if (error.response?.status === 400) {
            const errorMessage = error.response.data?.message || "";
            if (errorMessage.includes("이미 신청")) {
                alert("해당 날짜에 이미 신청을 했습니다.");
            } else {
                alert(errorMessage || "요청 처리 중 오류가 발생했습니다.");
            }
        } else {
            console.error("매칭 신청 실패:", error);
            alert("서버와의 통신 중 오류가 발생했습니다.");
        }
        throw error; // 호출한 쪽에서 후속처리할 수 있도록 re-throw
    }
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

// ✅ 추천 봉사자 API
export const fetchRecommendedVolunteers = async (data) => {
    const response = await axios.post(`/api/elderly/recommend`, data, { headers: getAuthHeaders() });
    return response.data;
};

// ✅ 추천된 봉사자 선택 API
export const recommendVolunteerMatching = async ({ volunteerId, matchingId }) => {
    const response = await axios.post(`/api/elderly/recommend/matching`, { volunteerId, matchingId }, { headers: getAuthHeaders() });
    return response.data;
};
