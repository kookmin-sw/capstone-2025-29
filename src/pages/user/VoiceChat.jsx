import React, { useState } from "react";
import styles from "./VoiceChat.module.css";

const VoiceChat = () => {
    const [transcript, setTranscript] = useState(""); // 음성 인식 결과를 저장
    const [isListening, setIsListening] = useState(false); // 음성 인식 상태

    // 브라우저의 SpeechRecognition API 설정
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true; // 연속적으로 음성 인식
    recognition.interimResults = false; // 중간 결과를 표시하지 않음
    recognition.lang = "ko-KR"; // 한국어 설정

    const startListening = () => {
        setIsListening(true);
        recognition.start();

        recognition.onresult = (event) => {
            const currentTranscript = Array.from(event.results)
                .map((result) => result[0].transcript)
                .join("");
            setTranscript(currentTranscript); // 음성 인식 결과를 업데이트
        };

        recognition.onerror = (event) => {
            console.error("음성 인식 오류:", event.error);
        };
    };

    const stopListening = () => {
        setIsListening(false);
        recognition.stop();
    };

    return (
        <div className={styles.container}>
            <button
                className={styles.microphoneButton}
                onMouseDown={startListening} // 버튼을 누르면 음성 인식 시작
                onMouseUp={stopListening} // 버튼에서 손을 떼면 음성 인식 종료
                onTouchStart={startListening} // 모바일 터치 시작
                onTouchEnd={stopListening} // 모바일 터치 종료
            >

            </button>
            <div className={styles.transcript}>
                <p>{isListening ? "듣고 있는 중..." : transcript || "여기에 음성 인식 결과가 표시됩니다."}</p>
            </div>
        </div>
    );
};

export default VoiceChat;