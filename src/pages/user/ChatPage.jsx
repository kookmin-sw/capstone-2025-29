import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Topbar from "../../components/Topbar";
import styles from "./ChatPage.module.css";

// 예시 채팅 데이터
const exampleMessages = [
    {
        id: 1,
        sender: "ai",
        content: "네, 말씀하신 내용에 대해 더 자세히\n이야기해주시겠어요?",
        timestamp: "오전 10:30",
        name: "홍길동"
    },
    {
        id: 2,
        sender: "user",
        content: "으르르르",
        timestamp: "오전 10:31"
    },
    {
        id: 3,
        sender: "ai",
        content: "네, 말씀하신 내용에 대해 더 자세히\n이야기해주시겠어요?",
        timestamp: "오전 10:31",
        name: "홍길동"
    },
    {
        id: 4,
        sender: "user",
        content: "르르르",
        timestamp: "오전 10:32"
    },
    {
        id: 5,
        sender: "ai",
        content: "네, 말씀하신 내용에 대해 더 자세히\n이야기해주시겠어요?",
        timestamp: "오전 10:32",
        name: "홍길동"
    }
];

const ChatPage = () => {
    const navigate = useNavigate();
    const { chatId } = useParams();
    const [messages, setMessages] = useState(exampleMessages);
    const [input, setInput] = useState("");
    const messageEndRef = useRef(null);

    // 로컬 스토리지에서 사용자 이름 가져오기
    const userName = localStorage.getItem('userName') || '홍길동';

    // 메시지 전송 핸들러
    const sendMessage = () => {
        if (input.trim() === '') return;

        const newMessage = {
            id: messages.length + 1,
            sender: "user",
            content: input,
            timestamp: new Date().toLocaleTimeString('ko-KR', { hour: 'numeric', minute: 'numeric', hour12: true })
        };

        setMessages(prev => [...prev, newMessage]);
        setInput("");

        // AI 응답 시뮬레이션
        setTimeout(() => {
            const aiResponse = {
                id: messages.length + 2,
                sender: "ai",
                content: "네, 말씀하신 내용에 대해 더 자세히\n이야기해주시겠어요?",
                timestamp: new Date().toLocaleTimeString('ko-KR', { hour: 'numeric', minute: 'numeric', hour12: true }),
                name: "홍길동"
            };
            setMessages(prev => [...prev, aiResponse]);
        }, 1000);
    };

    // 메시지 입력 핸들러
    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    // Enter 키 입력 핸들러
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // 스크롤을 항상 최신 메시지로 이동
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className={styles.container}>
            <Topbar title={userName + ' ai'} />

            <div className={styles.chatContainer}>
                <div className={styles.messages}>
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`${styles.messageRow} ${message.sender === 'user' ? styles.userMessageRow : styles.aiMessageRow}`}
                        >
                            {message.sender === 'ai' && (
                                <div className={styles.profileSection}>
                                    <div className={styles.profileImage}>
                                        <img src="../../public/ai-icon.svg" alt="AI 프로필" />
                                    </div>
                                    <span className={styles.profileName}>{userName}</span>
                                </div>
                            )}
                            <div className={`${styles.message} ${message.sender === 'user' ? styles.userMessage : styles.aiMessage}`}>
                                <div className={styles.messageContent}>
                                    <p>{message.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messageEndRef} />
                </div>

                <div className={styles.centerMic}>
                    <button className={styles.micButton}>
                        <img src="../../public/mike-icon.svg" alt="음성 입력" />
                    </button>
                </div>

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
                            <img src="../../public/send-icon.svg" alt="전송" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
