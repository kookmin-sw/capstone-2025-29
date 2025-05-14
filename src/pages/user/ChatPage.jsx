import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../../components/Topbar";
import LoadingModal from "../../components/LoadingModal"; // ✅ 여기 추가
import styles from "./ChatPage.module.css";
import { sendChatMessage } from "../../api/ChatApi";

const ChatPage = () => {
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userName, setUserName] = useState("");
    const [chatBotName, setChatBotName] = useState("AI");
    const [chatBotProfileImage, setChatBotProfileImage] = useState("/ai-icon.svg");

    const messageEndRef = useRef(null);
    const lastMessageId = useRef(1);
    const inputRef = useRef(null);
    const accessToken = localStorage.getItem("accessToken");

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = useRef(null);
    const transcriptRef = useRef("");

    useEffect(() => {
        recognition.current = new SpeechRecognition();
        recognition.current.continuous = true;
        recognition.current.interimResults = true;
        recognition.current.lang = "ko-KR";
    }, []);

    const toggleListening = () => {
        if (!recognition.current) return;

        if (isListening) {
            recognition.current.stop();
            recognition.current.onend = () => {
                setIsListening(false);
                transcriptRef.current = "";
            };
        } else {
            transcriptRef.current = "";
            recognition.current.start();
            setIsListening(true);

            recognition.current.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map((result) => result[0].transcript)
                    .join("");
                
                transcriptRef.current = transcript;
                setInput(transcript);
            };

            recognition.current.onerror = (event) => {
                console.error("음성 인식 오류:", event.error);
                setIsListening(false);
            };
        }
    };

    useEffect(() => {
        const storedUserName = localStorage.getItem("userName") || "사용자";
        const storedBotName = localStorage.getItem("chatBotName") || "AI";
        const storedBotImage = localStorage.getItem("chatBotProfileImage") || "/ai-icon.svg";

        setUserName(storedUserName);
        setChatBotName(storedBotName);
        setChatBotProfileImage(storedBotImage);

        setMessages([
            {
                id: 1,
                sender: "ai",
                content: "안녕하세요\n챗봇과 대화하며 마음을 나누고,\n감정을 분석해보세요.",
                timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "numeric", minute: "numeric", hour12: true }),
                name: storedBotName,
                profileImage: storedBotImage
            },
        ]);
    }, []);

    const sendMessage = async () => {
        if (input.trim() === "" || isSending) return;

        if (isListening && recognition.current) {
            recognition.current.stop();
            recognition.current.onresult = null;
            setIsListening(false);
        }

        setIsSending(true);
        setIsLoading(true); 

        const userMessage = {
            id: lastMessageId.current + 1,
            sender: "user",
            content: input,
            timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "numeric", minute: "numeric", hour12: true }),
            name: userName,
        };
        setMessages((prev) => [...prev, userMessage]);
        lastMessageId.current += 1;

        setInput("");
        setTimeout(() => setInput(""), 0);

        try {
            const response = await sendChatMessage(input, accessToken);
            const text = response.text;
            const audio_path = response.audioUrl;

            const aiMessage = {
                id: lastMessageId.current + 1,
                sender: "ai",
                content: text,
                audioPath: audio_path,
                timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "numeric", minute: "numeric", hour12: true }),
                name: chatBotName,
                profileImage: chatBotProfileImage
            };
            setMessages((prev) => [...prev, aiMessage]);
            lastMessageId.current += 1;

            const audio = new Audio(audio_path);
            audio.play();
        } catch (error) {
            const errorMessage = {
                id: lastMessageId.current + 1,
                sender: "ai",
                content: "죄송합니다. 현재 요청을 처리할 수 없습니다.",
                timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "numeric", minute: "numeric", hour12: true }),
                name: chatBotName,
                profileImage: chatBotProfileImage
            };
            setMessages((prev) => [...prev, errorMessage]);
            lastMessageId.current += 1;
        } finally {
            setIsSending(false);
            setIsLoading(false); // ✅ 로딩 모달 끄기
        }
    };

    const handleInputChange = (e) => setInput(e.target.value);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div className={styles.container}>
            <Topbar title="챗봇" navigateTo="/ChatCenter" />

            <div className={styles.chatContainer}>
                <div className={styles.messages}>
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`${styles.messageRow} ${message.sender === "user" ? styles.userMessageRow : styles.aiMessageRow}`}
                        >
                            {message.sender === "ai" && (
                                <div className={styles.profileSection}>
                                    <div className={styles.profileImage}>
                                        <img src={message.profileImage} alt="AI 프로필" />
                                    </div>
                                    <span className={styles.profileName}>{message.name}</span>
                                </div>
                            )}
                            <div
                                className={`${styles.message} ${message.sender === "user" ? styles.userMessage : styles.aiMessage}`}
                            >
                                <div className={styles.messageContent}>
                                    <p>{message.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messageEndRef} />
                </div>

                <div className={styles.centerMic}>
                    <button
                        className={`${styles.micButton} ${isListening ? styles.activeMic : ""}`}
                        onClick={toggleListening}
                    >
                        <img src="/mike-icon.svg" alt="음성 입력" />
                    </button>
                </div>

                <div className={styles.inputContainer}>
                    <div className={styles.inputWrapper}>
                        <textarea
                            ref={inputRef}
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

            <LoadingModal isOpen={isLoading} message="답변을 생성 중입니다..." />

        </div>
    );
};

export default ChatPage;
