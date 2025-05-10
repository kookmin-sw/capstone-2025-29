import axios from "axios";

const BASE_URL = "http://3.38.149.99:8000"; 

export const sendChatMessage = async (text, accessToken) => {
    try {
        // 텍스트 응답 받기
        const response = await axios.post(
            `${BASE_URL}/chat/text`,
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

        // 전체 오디오 경로 구성
        const audioUrl = `${BASE_URL}${audio_path}`;

        // 오디오 파일 fetch + blob 생성
        let audioBlobUrl = null;
        try {
            const audioResponse = await fetch(audioUrl, {
                headers: {
                    "ngrok-skip-browser-warning": "true"
                }
            });

            if (!audioResponse.ok) {
                throw new Error("오디오 fetch 실패");
            }

            const blob = await audioResponse.blob();
            audioBlobUrl = URL.createObjectURL(blob); // blob → 재생 가능한 URL

        } catch (fetchError) {
            console.error("오디오 fetch 실패:", fetchError);
        }

        return {
            text: responseText,
            audioUrl: audioBlobUrl // blob URL 반환
        };
    } catch (error) {
        console.error("채팅 API 호출 실패:", error.response?.data || error.message);
        throw new Error("채팅 API 호출 중 오류가 발생했습니다.");
    }
};
