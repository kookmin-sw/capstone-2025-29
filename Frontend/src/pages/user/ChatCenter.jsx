import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Topbar from "../../components/Topbar";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import styles from "./ChatCenter.module.css";
import { fetchSentimentAnalysis } from "../../api/ChatApi";
import LoadingModal from "../../components/LoadingModal";

// Chart.js 요소 등록
ChartJS.register(ArcElement, Tooltip, Legend);

// 7가지 고정 색상
const fixedColors = [
    '#5D47FF', // 보라
    '#FF6B6B', // 빨강
    '#FFD93D', // 노랑
    '#6BCB77', // 초록
    '#4D96FF', // 파랑
    '#FFB5E8', // 핑크
    '#C084FC'  // 연보라
];

const ChatCenter = () => {
    const navigate = useNavigate();
    const [emotionData, setEmotionData] = useState([]);
    const [feedback, setFeedback] = useState('');
    const [chatBotName, setChatBotName] = useState('');
    const [loading, setLoading] = useState(true);

    const userName = localStorage.getItem('chatBotName') || '홍길동';

    // ✅ 전달 기준 날짜 포맷
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
    const formattedDate = `${lastMonth.getFullYear()}년 ${lastMonth.getMonth() + 1}월`;

    useEffect(() => {
        const loadSentimentData = async () => {
            try {
                const data = await fetchSentimentAnalysis();

                const mappedData = Object.entries(data.sentimentPercentages)
                    .map(([label, value], idx) => ({
                        label,
                        value,
                        color: fixedColors[idx % fixedColors.length]
                    }))
                    .sort((a, b) => b.value - a.value); // ✅ value 기준 내림차순 정렬

                setEmotionData(mappedData);
                setFeedback(data.feedback);
                setChatBotName(data.chatBotName);
            } catch (error) {
                console.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadSentimentData();
    }, []);

    const handleChatClick = () => {
        navigate('/ChatPage');
    };

    return (
        <div className={styles.container}>
            <Topbar title="채팅센터" />

            <div className={styles.cardwrapper}>
                {/* 채팅 카드 */}
                <div className={styles.chatCard}>
                    <div className={styles.textSection}>
                        <h2>{userName}</h2>
                        <p>지금 바로 연결해 드릴게요.</p>
                    </div>
                    <div className={styles.imageWrapper}>
                        <img src="/chat-icon.svg" alt="채팅 아이콘" className={styles.rightImg} />
                    </div>
                    <button className={styles.chatBtn} onClick={handleChatClick}>채팅 시작하기</button>
                </div>

                {/* 감정 분석 카드 */}
                <div className={styles.analysisSection}>
                    <h3 className={styles.analysisTitle}>지난달의 감정분석 결과</h3>

                    <div className={styles.analysisCard}>
                        <div className={styles.chartAndLegend}>
                            <div className={styles.chartSection}>
                                <p className={styles.analysisDate}>{formattedDate}</p>
                                <div className={styles.chartWrapper}>
                                    <Pie
                                        data={{
                                            labels: emotionData.map(e => e.label),
                                            datasets: [{
                                                data: emotionData.map(e => e.value),
                                                backgroundColor: emotionData.map(e => e.color),
                                                borderWidth: 0,
                                            }],
                                        }}
                                        options={{
                                            plugins: {
                                                legend: { display: false },
                                                tooltip: { enabled: false },
                                            },
                                            maintainAspectRatio: false,
                                        }}
                                    />
                                </div>
                            </div>

                            <ul className={styles.legendBox}>
                                {emotionData.map((item, i) => (
                                    <li key={i} className={styles.legendItem}>
                                        <span className={styles.colorDot} style={{ backgroundColor: item.color }}></span>
                                        <span className={styles.label}>{item.label}</span>
                                        <span className={styles.percent}>{item.value}%</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {emotionData.length > 0 && feedback && (
                            <div className={styles.feedbackBox}>
                                <p className={styles.feedbackText}>{`" ${feedback} "`}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <LoadingModal isOpen={loading} />
        </div>
    );
};

export default ChatCenter;
