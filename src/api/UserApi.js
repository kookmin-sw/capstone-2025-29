import axios from "axios";

// 봉사활동 추천x 매칭 신청 API 
export const requestElderlyMatching = async (matchingId) => {
    try {
        const accessToken = localStorage.getItem('accessToken');

        const response = await axios.post("/api/elderly/matching", matchingId,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                }
            }
        );
        console.log('api', response)
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message ||
            (error.response ? '신청에 실패했습니다.' :
                (error.request ? '서버와의 통신에 실패했습니다.' :
                    '요청 중 오류가 발생했습니다.'));
        throw {
            status: error.response?.status || 0,
            message: errorMessage
        };
    }
};

// 봉사탭 메인 페이지 데이터 가져오기 API
export const fetchElderlyMatching = async () => {
    try {

        const accessToken = localStorage.getItem('accessToken'); // 로컬스토리지에서 토큰 가져오기
        const response = await axios.get("/api/elderly", {
            headers: {
                Authorization: `Bearer ${accessToken}`, // Authorization 헤더에 토큰 추가
            },

        });
        return response.data; // API 응답 데이터 반환
    } catch (error) {
        const errorMessage = error.response?.data?.message ||
            (error.response ? '데이터를 가져오는 데 실패했습니다.' :
                (error.request ? '서버와의 통신에 실패했습니다.' :
                    '요청 중 오류가 발생했습니다.'));
        throw {
            status: error.response?.status || 0,
            message: errorMessage,
        };
    }
};

// 나의 신청 내역 조회 API
export const fetchApplyingList = async () => {
    try {
        const accessToken = localStorage.getItem('accessToken'); // 로컬스토리지에서 토큰 가져오기
        const response = await axios.get("/api/volunteerActivity/registration", {
            headers: {
                Authorization: `Bearer ${accessToken}`, // Authorization 헤더에 토큰 추가
            },
        });
        return response.data; // API 응답 데이터 반환
    } catch (error) {
        const errorMessage = error.response?.data?.message ||
            (error.response ? '데이터를 가져오는 데 실패했습니다.' :
                (error.request ? '서버와의 통신에 실패했습니다.' :
                    '요청 중 오류가 발생했습니다.'));
        throw {
            status: error.response?.status || 0,
            message: errorMessage,
        };
    }
};

// 봉사 신청 상세 내역 조회 API
export const fetchApplyingDetail = async (volunteerActivityId) => {
    try {
        const accessToken = localStorage.getItem('accessToken'); // 로컬스토리지에서 토큰 가져오기
        const response = await axios.get(`/api/volunteerActivity/registration/${volunteerActivityId}`, {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`, // Authorization 헤더에 토큰 추가
            },

        });
        return response.data; // API 응답 데이터 반환
    } catch (error) {
        const errorMessage = error.response?.data?.message ||
            (error.response ? '데이터를 가져오는 데 실패했습니다.' :
                (error.request ? '서버와의 통신에 실패했습니다.' :
                    '요청 중 오류가 발생했습니다.'));
        throw {
            status: error.response?.status || 0,
            message: errorMessage,
        };
    }
};

// 매칭 완료 API
export const completeMatching = async (matchingId) => {
    try {

        const accessToken = localStorage.getItem('accessToken'); // 로컬스토리지에서 토큰 가져오기
        console.log('matchingId', matchingId)
        const response = await axios.post(
            `/api/elderly/matching/${matchingId}`, // API 경로
            {}, // 요청 본문 (필요한 경우 데이터 추가)
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`, // Authorization 헤더에 토큰 추가
                },
            }
        );
        console.log('api', response)
        return response.data; // API 응답 데이터 반환
    } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            (error.response
                ? "매칭 완료 요청에 실패했습니다."
                : error.request
                    ? "서버와의 통신에 실패했습니다."
                    : "요청 중 오류가 발생했습니다.");
        throw {
            status: error.response?.status || 0,
            message: errorMessage,
        };
    }
};

// 봉사 취소 API
export const cancelMatching = async (matchingId) => {
    try {
        const accessToken = localStorage.getItem("accessToken"); // 로컬스토리지에서 토큰 가져오기
        const response = await axios.delete(`/api/elderly/matching/${matchingId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`, // Authorization 헤더에 토큰 추가
            },
        });
        return response.data; // API 응답 데이터 반환
    } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            (error.response
                ? "취소 요청에 실패했습니다."
                : error.request
                    ? "서버와의 통신에 실패했습니다."
                    : "요청 중 오류가 발생했습니다.");
        throw {
            status: error.response?.status || 0,
            message: errorMessage,
        };
    }
};

// 추천 봉사자 API
export const fetchRecommendedVolunteers = async (data) => {
    try {
        const accessToken = localStorage.getItem("accessToken"); // 로컬스토리지에서 토큰 가져오기
        const response = await axios.post("/api/elderly/recommend", data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`, // Authorization 헤더에 토큰 추가
            },
        });
        return response.data; // 추천 봉사자 데이터 반환
    } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            (error.response
                ? "추천 봉사자 데이터를 가져오는 데 실패했습니다."
                : error.request
                ? "서버와의 통신에 실패했습니다."
                : "요청 중 오류가 발생했습니다.");
        throw {
            status: error.response?.status || 0,
            message: errorMessage,
        };
    }
};

