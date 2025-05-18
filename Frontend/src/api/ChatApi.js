import axios from "axios";


const CHAT_API_BASE = import.meta.env.VITE_CHAT_API_BASE;

// ✅ AI 챗봇 서버 - 채팅 메시지 전송
export const sendChatMessage = async (text, accessToken) => {
    try {
        const response = await axios.post(
            `${CHAT_API_BASE}/chat/text`,
            { text },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const { text: responseText, audio_path } = response.data.data.response;

        const audioUrl = `${CHAT_API_BASE}${audio_path}`;
        let audioBlobUrl = null;

        try {
            const audioResponse = await fetch(audioUrl);
            if (audioResponse.ok) {
                const blob = await audioResponse.blob();
                audioBlobUrl = URL.createObjectURL(blob);
            } else {
                throw new Error("오디오 fetch 실패");
            }
        } catch (fetchError) {
            console.error("오디오 fetch 실패:", fetchError);
        }

        return {
            text: responseText,
            audioUrl: audioBlobUrl
        };
    } catch (error) {
        console.error("채팅 API 호출 실패:", error.response?.data || error.message);
        throw new Error("채팅 API 호출 중 오류가 발생했습니다.");
    }
};

// ✅ 백엔드 서버 - 사용자 전용 챗봇 이름 불러오기
export const fetchChatBotName = async () => {
    const accessToken = localStorage.getItem('accessToken');
    try {
        const response = await axios.get(
            `/api/elderly/chatBot`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const data = response.data;
        if (!data?.name) {
            throw new Error("챗봇 이름이 없습니다.");
        }

        // 로컬스토리지에 저장
        localStorage.setItem('chatBotName', data.name);
        localStorage.setItem('chatBotProfileImage', data.profileImage);
        return response.data;
    } catch (error) {
        console.error("❌ 챗봇 이름 저장 실패:", error);
        if (error.response) {
            console.error("서버 응답 에러:", error.response.data);
        } else if (error.request) {
            console.error("요청은 갔지만 응답 없음:", error.request);
        } else {
            console.error("설정 오류:", error.message);
        }
        throw new Error(error.response?.data?.message || "챗봇 이름 저장 중 오류가 발생했습니다.");
    }

};

// ✅ 채팅봇 이름 저장 API (PATCH 요청)
export const saveChatBotName = async (name, profileImage) => {
    const accessToken = localStorage.getItem('accessToken');

    try {
        const response = await axios.patch(
            `/api/elderly`,
            { name, profileImage },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("❌ 챗봇 이름 저장 실패:", error.response?.data || error.message);
        console.error("상세 오류:", {
            url: `/api/elderly`,
            method: "PATCH",
            payload: { name, profileImage },
            status: error.response?.status,
            response: error.response?.data
        });

        throw new Error(error.response?.data?.message || "챗봇 이름 저장 중 오류가 발생했습니다.");
    }
};


// ✅ 감정 분석 결과 불러오기 API
export const fetchSentimentAnalysis = async () => {
    const accessToken = localStorage.getItem('accessToken');

    try {
        const response = await axios.get(`/api/sentimentAnalysis`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        const status = error.response?.status || 0;
        const message = error.response?.data?.message || error.message || "알 수 없는 오류";

        // ✅ 에러 코드별 상세 처리
        if (status === 0) {
            console.error("❌ [Network Error] 서버와의 연결 자체가 실패했습니다.");
            alert("서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.");
        } else if (status === 401) {
            console.error("❌ [401 Unauthorized] 인증 실패:", message);
            alert("인증이 만료되었습니다. 다시 로그인해주세요.");
        } else if (status === 403) {
            console.error("❌ [403 Forbidden] 접근 권한이 없습니다:", message);
            alert("접근 권한이 없습니다.");
        } else if (status === 404) {
            console.error("❌ [404 Not Found] API 경로를 찾을 수 없습니다:", message);
            alert("요청한 데이터를 찾을 수 없습니다. 관리자에게 문의하세요.");
        } else if (status === 500) {
            console.error("❌ [500 Internal Server Error] 서버 오류:", message);
            alert("서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        } else {
            console.error(`❌ [${status}] 기타 오류:`, message);
            alert(`오류가 발생했습니다. (에러코드: ${status})`);
        }

        // 항상 예외 던지기 (상위에서 useEffect 등에서 캐치 가능)
        throw new Error(`감정 분석 데이터를 불러오는 중 오류 (status: ${status})`);
    }
};