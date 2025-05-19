import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../../components/Topbar";
import LoadingModal from "../../components/LoadingModal";
import { sendChatMessage } from "../../api/ChatApi";
import styles from "./ChatPage.module.css";

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
    const accessToken = localStorage.getItem("accessToken");

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = useRef(null);

    useEffect(() => {
        recognition.current = new SpeechRecognition();
        recognition.current.continuous = true;
        recognition.current.interimResults = true;
        recognition.current.lang = "ko-KR";

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
                timestamp: getCurrentTime(),
                name: storedBotName,
                profileImage: storedBotImage
            },
        ]);

<<<<<<< HEAD
        // ✅ 페이지 떠날 때 음성인식 강제 종료
=======
>>>>>>> main
        return () => {
            if (recognition.current) {
                console.log("🔴 페이지 나감 → 음성인식 강제 종료");
                recognition.current.abort();
            }
        };
    }, []);

    const getCurrentTime = () => {
        return new Date().toLocaleTimeString("ko-KR", { hour: "numeric", minute: "numeric", hour12: true });
    };

    const toggleListening = () => {
        if (!recognition.current) return;

        if (isListening) {
            console.log("🛑 음성인식 강제 종료");
            recognition.current.onend = null;
            recognition.current.stop();
            setIsListening(false);
        } else {
            console.log("🎙 음성인식 시작");
            recognition.current.start();
            setIsListening(true);

<<<<<<< HEAD
=======
            recognition.current.onstart = () => {
                console.log("🟢 음성 인식이 시작되었습니다.");
            };

>>>>>>> main
            recognition.current.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map(result => result[0].transcript)
                    .join("");
                setInput(transcript);
            };

            recognition.current.onerror = (event) => {
                console.error("음성 인식 오류:", event.error);
                setIsListening(false);
            };

            recognition.current.onend = () => {
                console.log("🔚 음성인식 종료됨");
                setIsListening(false);
            };
        }
    };

    const sendMessage = async () => {
        if (input.trim() === "" || isSending) return;

<<<<<<< HEAD
        // 음성 중이면 끄기
=======
>>>>>>> main
        if (isListening && recognition.current) {
            recognition.current.onend = null;
            recognition.current.stop();
            setIsListening(false);
        }

        setIsSending(true);
        setIsLoading(true);

        const userMessage = {
            id: ++lastMessageId.current,
            sender: "user",
            content: input,
            timestamp: getCurrentTime(),
            name: userName,
        };
        setMessages(prev => [...prev, userMessage]);
        setInput("");

        try {
            const response = await sendChatMessage(input, accessToken);
            const aiMessage = {
                id: ++lastMessageId.current,
                sender: "ai",
                content: response.text,
                audioPath: response.audioUrl,
                timestamp: getCurrentTime(),
                name: chatBotName,
                profileImage: chatBotProfileImage
            };
            setMessages(prev => [...prev, aiMessage]);

            const audio = new Audio(response.audioUrl);
            await audio.play();
        } catch (error) {
            console.error("❌ AI 응답 오류", error);
            const errorMessage = {
                id: ++lastMessageId.current,
                sender: "ai",
                content: "죄송합니다. 현재 요청을 처리할 수 없습니다.",
                timestamp: getCurrentTime(),
                name: chatBotName,
                profileImage: chatBotProfileImage
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsSending(false);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div className={styles.container}>
            <Topbar title="챗봇" />

            <div className={styles.chatContainer}>
                <div className={styles.messages}>
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`${styles.messageRow} ${msg.sender === "user" ? styles.userMessageRow : styles.aiMessageRow}`}
                        >
                            {msg.sender === "ai" && (
                                <div className={styles.profileSection}>
                                    <div className={styles.profileImage}>
                                        <img src={msg.profileImage} alt="AI 프로필" />
                                    </div>
                                    <span className={styles.profileName}>{msg.name}</span>
                                </div>
                            )}
                            <div
                                className={`${styles.message} ${msg.sender === "user" ? styles.userMessage : styles.aiMessage}`}
                            >
                                <div className={styles.messageContent}>
                                    <p>{msg.content}</p>
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
                            className={styles.input}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    sendMessage();
                                }
                            }}
                            placeholder="대화를 입력해 주세요"
                        />
                        <button
                            className={styles.sendButton}
                            onClick={sendMessage}
                        >
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
