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
    const dummyAudioRef = useRef(null);

    const getTime = () => new Date().toLocaleTimeString("ko-KR", { hour: "numeric", minute: "numeric", hour12: true });

    useEffect(() => {
        const stopRecognition = () => {
            if (isListening && recognition.current) {
                console.log("🚫 음성 인식 중지 (cleanup)");
                recognition.current.stop();
                setIsListening(false);
            }
        };

        // 창 닫기, 새로고침
        const handleBeforeUnload = (e) => {
            stopRecognition();
        };

        // 브라우저 뒤로가기/앞으로가기
        const handlePopState = (e) => {
            stopRecognition();
        };

        // 등록
        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('popstate', handlePopState);

        // React Router effect cleanup (컴포넌트 언마운트)
        return () => {
            stopRecognition();
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('popstate', handlePopState);
        };
    }, [isListening]);

    
    useEffect(() => {
        recognition.current = new SpeechRecognition();
        recognition.current.continuous = false;
        recognition.current.interimResults = false;
        recognition.current.lang = "ko-KR";

        dummyAudioRef.current = new Audio();
        dummyAudioRef.current.src = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=";
        dummyAudioRef.current.volume = 0;

        return () => {
            if (isListening && recognition.current) {
                recognition.current.stop();
                setIsListening(false);
            }
        };
    }, [isListening]);

    useEffect(() => {
        const storedUserName = localStorage.getItem("userName") || "사용자";
        const storedBotName = localStorage.getItem("chatBotName") || "AI";
        const storedBotImage = localStorage.getItem("chatBotProfileImage") || "/ai-icon.svg";

        setUserName(storedUserName);
        setChatBotName(storedBotName);
        setChatBotProfileImage(storedBotImage);

        setMessages([{
            id: 1,
            sender: "ai",
            content: "안녕하세요\n챗봇과 대화하며 마음을 나누고,\n감정을 분석해보세요.",
            timestamp: getTime(),
            name: storedBotName,
            profileImage: storedBotImage
        }]);
    }, []);

    const toggleListening = () => {
        if (!recognition.current) return;

        if (isListening) {
            recognition.current.stop();
        } else {
            recognition.current.start();
            setIsListening(true);

            recognition.current.onresult = (event) => {
                const lastResult = event.results[event.results.length - 1];
                if (lastResult.isFinal) {
                    const transcript = lastResult[0].transcript.trim();
                    setInput(transcript);
                    setIsListening(false);
                }
            };

            recognition.current.onend = () => setIsListening(false);

            recognition.current.onerror = (event) => {
                console.error("음성 인식 오류:", event.error);
                setIsListening(false);
            };
        }
    };

    const sendMessage = async () => {
        if (!input.trim() || isSending) return;

        setIsSending(true);
        setIsLoading(true);

        const userMessage = {
            id: ++lastMessageId.current,
            sender: "user",
            content: input,
            timestamp: getTime(),
            name: userName
        };
        setMessages(prev => [...prev, userMessage]);
        setInput("");

        try {
            const response = await sendChatMessage(input, accessToken);
            const { text, audioUrl } = response;

            if (text) {
                const aiMessage = {
                    id: ++lastMessageId.current,
                    sender: "ai",
                    content: text,
                    audioPath: audioUrl,
                    timestamp: getTime(),
                    name: chatBotName,
                    profileImage: chatBotProfileImage
                };
                setMessages(prev => [...prev, aiMessage]);

                if (audioUrl) {
                    const audio = new Audio(audioUrl);
                    await audio.play().catch(err => console.error("오디오 재생 오류:", err));
                }
            }

        } catch (error) {
            console.error("Chat API Error:", error);
            const errorMessage = {
                id: ++lastMessageId.current,
                sender: "ai",
                content: "죄송합니다. 현재 요청을 처리할 수 없습니다.",
                timestamp: getTime(),
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
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const unlockAudioContext = () => {
        dummyAudioRef.current?.play().catch((e) => {
            console.log('Dummy Audio play blocked:', e);
        });
    };

    return (
        <div className={styles.container}>
            <Topbar title="챗봇" />
            <div className={styles.chatContainer}>
                <div className={styles.messages}>
                    {messages.map((message) => (
                        <div key={message.id} className={`${styles.messageRow} ${message.sender === "user" ? styles.userMessageRow : styles.aiMessageRow}`}>
                            {message.sender === "ai" && (
                                <div className={styles.profileSection}>
                                    <div className={styles.profileImage}>
                                        <img src={message.profileImage} alt="AI 프로필" />
                                    </div>
                                    <span className={styles.profileName}>{message.name}</span>
                                </div>
                            )}
                            <div className={`${styles.message} ${message.sender === "user" ? styles.userMessage : styles.aiMessage}`}>
                                <div className={styles.messageContent}><p>{message.content}</p></div>
                            </div>
                        </div>
                    ))}
                    <div ref={messageEndRef} />
                </div>

                <div className={styles.centerMic}>
                    <button className={`${styles.micButton} ${isListening ? styles.activeMic : ""}`} onClick={() => { unlockAudioContext(); toggleListening(); }}>
                        <img src="/mike-icon.svg" alt="음성 입력" />
                    </button>
                </div>

                <div className={styles.inputContainer}>
                    <div className={styles.inputWrapper}>
                        <textarea
                            className={styles.input}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="대화를 입력해 주세요"
                            rows={1}
                        />
                        <button className={styles.sendButton} onClick={() => { unlockAudioContext(); sendMessage(); }}>
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
