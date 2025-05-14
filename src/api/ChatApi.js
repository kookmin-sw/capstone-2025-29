import axios from "axios";

// ✅ 채팅 API 서버 전용 프록시 경로
//const CHAT_API_BASE = import.meta.env.MODE === "production" ? "/chatapi" : "";
const CHAT_API_BASE = 'https://aiserver.store';

// 채팅 요청
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

        console.log("API 응답:", response.data.data.response);
        const { text: responseText, audio_path } = response.data.data.response;

        // 오디오도 같은 경로로 프록시 경유
        const audioUrl = `${CHAT_API_BASE}${audio_path}`;

        let audioBlobUrl = null;
        try {
            const audioResponse = await fetch(audioUrl);
            if (!audioResponse.ok) {
                throw new Error("오디오 fetch 실패");
            }
            const blob = await audioResponse.blob();
            audioBlobUrl = URL.createObjectURL(blob);
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
