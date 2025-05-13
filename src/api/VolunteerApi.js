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
        console.log('data', data)
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

// 봉사자 매칭 리스트 조회 API
export const fetchMatchingList = async () => {
    try {
        const accessToken = localStorage.getItem("accessToken"); // 로컬스토리지에서 토큰 가져오기
        const response = await axios.get("/api/volunteerActivity/matching", {
            headers: {
                Authorization: `Bearer ${accessToken}`, // Authorization 헤더에 토큰 추가
            },
        });
        console.log('매칭 리스트:', response.data); // 매칭 리스트 데이터 확인
        return response.data; // API 응답 데이터 반환
    } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            (error.response
                ? "매칭 리스트를 가져오는 데 실패했습니다."
                : error.request
                    ? "서버와의 통신에 실패했습니다."
                    : "요청 중 오류가 발생했습니다.");
        throw {
            status: error.response?.status || 0,
            message: errorMessage,
        };
    }
};

// 매칭 상세 조회 API
export const fetchMatchingDetail = async (volunteerActivityId) => {
    try {
        const accessToken = localStorage.getItem("accessToken"); // 로컬스토리지에서 토큰 가져오기
        const response = await axios.get(`/api/volunteerActivity/matching/${volunteerActivityId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`, // Authorization 헤더에 토큰 추가
            },
        });
        return response.data; // API 응답 데이터 반환
    } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            (error.response
                ? "매칭 상세 정보를 가져오는 데 실패했습니다."
                : error.request
                    ? "서버와의 통신에 실패했습니다."
                    : "요청 중 오류가 발생했습니다.");
        throw {
            status: error.response?.status || 0,
            message: errorMessage,
        };
    }
};

// 매칭 취소 API
export const cancelMatching = async (matchingId) => {
    try {
        const accessToken = localStorage.getItem("accessToken"); // 로컬스토리지에서 토큰 가져오기
        const response = await axios.delete(`/api/volunteer/matching/${matchingId}`, {
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

// 후기 작성 API
export const submitReview = async (reviewData) => {
    try {
        const accessToken = localStorage.getItem("accessToken"); // 로컬스토리지에서 토큰 가져오기
        // 후기 작성 API 호출
        const response = await axios.post("/api/review", reviewData, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`, // Authorization 헤더에 토큰 추가
            },
        });
        return response.data; // 성공적으로 작성된 후기 데이터 반환
    } catch (error) {
        console.error("후기 작성 실패:", error);
        throw error.response?.data || { message: "후기 작성 중 오류가 발생했습니다." };
    }
};

// 완료된 후기 조회 API
export const getCompletedReviews = async () => {
    try {
        const accessToken = localStorage.getItem("accessToken"); // 로컬스토리지에서 토큰 가져오기
        const response = await axios.get("/api/review", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`, // Authorization 헤더에 토큰 추가
            },
        });
        return response.data; // 서버에서 반환된 데이터
    } catch (error) {
        console.error("getCompletedReviews 에러:", error);
        throw error.response?.data || { message: "후기 데이터를 불러오는 중 문제가 발생했습니다." };
    }
};

// 리뷰 상세 조회 API
export const getReviewDetail = async (volunteerActivityId) => {
    try {
        console.log("리뷰 ID:", volunteerActivityId); // 리뷰 ID 확인
        const accessToken = localStorage.getItem("accessToken"); // 로컬스토리지에서 토큰 가져오기
        const response = await axios.get(`/api/review/${volunteerActivityId}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`, // Authorization 헤더에 토큰 추가
            },
        });
        return response.data; // 서버에서 반환된 데이터
    } catch (error) {
        console.error("getReviewDetail 에러:", error);
        throw error.response?.data || { message: "리뷰 데이터를 불러오는 중 문제가 발생했습니다." };
    }
};
