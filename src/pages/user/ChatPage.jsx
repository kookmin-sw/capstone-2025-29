import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Topbar from "../../components/Topbar";
import styles from "./ChatPage.module.css";

// 예시 채팅 데이터 - 초기 대화 내용을 정의
const exampleMessages = [
    {
        id: 1,
        sender: "ai",
        content: "안녕하세요\n챗봇과 대화하며 마음을 나누고,\n감정을 분석해보세요.",
        timestamp: "오전 10:30",
        name: "홍길동"
    },
    {
        id: 2,
        sender: "user",
        content: "안녕하세요",
        timestamp: "오전 10:31"
    },
    {
        id: 3,
        sender: "ai",
        content: "안녕하세요",
        timestamp: "오전 10:31",
        name: "홍길동"
    },
   
];

const ChatPage = () => {
    // 라우터 관련 훅
    const navigate = useNavigate();
    const { chatId } = useParams();

    // 상태 관리
    const [messages, setMessages] = useState(exampleMessages);  // 채팅 메시지 목록
    const [input, setInput] = useState("");                     // 입력 중인 메시지
    const messageEndRef = useRef(null);                         // 메시지 스크롤을 위한 ref
    const lastMessageId = useRef(exampleMessages.length);  // 마지막 메시지 ID를 추적하기 위한 ref
    const [isSending, setIsSending] = useState(false);  // 메시지 전송 중 상태 추가

    // 로컬 스토리지에서 사용자 이름 가져오기
    const userName = localStorage.getItem('userName') || '홍길동';

    // 메시지 전송 핸들러
    const sendMessage = () => {
        if (input.trim() === '' || isSending) return;  // 전송 중이거나 빈 메시지면 리턴

        setIsSending(true);  // 전송 시작

        const newMessageId = lastMessageId.current + 1;
        const newMessage = {
            id: newMessageId,
            sender: "user",
            content: input,
            timestamp: new Date().toLocaleTimeString('ko-KR', { hour: 'numeric', minute: 'numeric', hour12: true })
        };

        lastMessageId.current = newMessageId;
        setMessages(prev => [...prev, newMessage]);
        setInput("");

        // AI 응답 시뮬레이션
        setTimeout(() => {
            const aiResponseId = lastMessageId.current + 1;
            const aiResponse = {
                id: aiResponseId,
                sender: "ai",
                content: "네, 말씀하신 내용에 대해 더 자세히\n이야기해주시겠어요?",
                timestamp: new Date().toLocaleTimeString('ko-KR', { hour: 'numeric', minute: 'numeric', hour12: true }),
                name: userName
            };
            lastMessageId.current = aiResponseId;
            setMessages(prev => [...prev, aiResponse]);
            setIsSending(false);  // 전송 완료
        }, 1000);
    };

    // 메시지 입력 필드 변경 핸들러
    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    // Enter 키 입력 핸들러
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!isSending) {  // 전송 중이 아닐 때만 메시지 전송
                sendMessage();
            }
        }
    };

    // 새로운 메시지가 추가될 때마다 스크롤을 최신 메시지로 이동
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className={styles.container}>
            {/* 상단 네비게이션 바 */}
            <Topbar title={userName} navigateTo ="/ChatCenter" />

            {/* 채팅 메시지 컨테이너 */}
            <div className={styles.chatContainer}>
                {/* 메시지 목록 */}
                <div className={styles.messages}>
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`${styles.messageRow} ${message.sender === 'user' ? styles.userMessageRow : styles.aiMessageRow}`}
                        >
                            {/* AI 메시지인 경우 프로필 섹션 표시 */}
                            {message.sender === 'ai' && (
                                <div className={styles.profileSection}>
                                    <div className={styles.profileImage}>
                                        <img src="/ai-icon.svg" alt="AI 프로필" />
                                    </div>
                                    <span className={styles.profileName}>{userName}</span>
                                </div>
                            )}
                            {/* 메시지 내용 */}
                            <div className={`${styles.message} ${message.sender === 'user' ? styles.userMessage : styles.aiMessage}`}>
                                <div className={styles.messageContent}>
                                    <p>{message.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* 스크롤을 위한 빈 div */}
                    <div ref={messageEndRef} />
                </div>

                {/* 음성 입력 버튼 */}
                <div className={styles.centerMic}>
                    <button className={styles.micButton}>
                        <img src="/mike-icon.svg" alt="음성 입력" />
                    </button>
                </div>

                {/* 메시지 입력 영역 */}
                <div className={styles.inputContainer}>
                    <div className={styles.inputWrapper}>
                        <textarea
                            className={styles.input}
                            value={input}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="대화를 입력해 주세요"
                            rows={1}
                        />
                        <button className={styles.sendButton} onClick={sendMessage}>
                            <img src="/send-icon.svg" alt="전송" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
