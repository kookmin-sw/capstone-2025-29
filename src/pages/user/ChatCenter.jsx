import React from "react";
import { useNavigate } from 'react-router-dom';
import Topbar from "../../components/Topbar";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import styles from "./ChatCenter.module.css";

ChartJS.register(ArcElement, Tooltip, Legend);

// 감정별 색상 매핑
const colorMap = {
    기쁨: '#5D47FF',
    슬픔: '#D9B2FF',
    분노: '#94C6FF',
    불안: '#FF6B91',
    놀람: '#CFFF47',
};

// 서버에서 받은 데이터 (예시)
const serverData = [
    { label: '기쁨', value: 25 },
    { label: '슬픔', value: 25 },
    { label: '분노', value: 15 },
    { label: '불안', value: 10 },
    { label: '놀람', value: 10 },
    { label: '행복', value: 10 },
    { label: '기절', value: 10 },
];

// colorMap을 기준으로 색상 추가
const emotionData = serverData.map(item => ({
    ...item,
    color: colorMap[item.label] || '#999999' // fallback color
}));

const pieData = {
    labels: emotionData.map(e => e.label),
    datasets: [{
        data: emotionData.map(e => e.value),
        backgroundColor: emotionData.map(e => e.color),
        borderWidth: 0,
    }],
};

const ChatCenter = () => {
    const navigate = useNavigate();
    // 로컬 스토리지에서 사용자 이름 가져오기
    const userName = localStorage.getItem('userName') || '홍길동';

    const handleChatClick = () => {
        navigate('/ChatPage');
    };

    return (
        <div className={styles.container}>
            <Topbar title="채팅센터" navigateTo="/helpcenter" />

            <div className={styles.cardwrapper}>
                {/* 채팅 카드 */}
                <div className={styles.chatCard}>
                    <div className={styles.textSection}>
                        <h2>{userName} </h2>
                        <p>지금 바로 연결해 드릴게요.</p>
                    </div>
                    <div className={styles.imageWrapper}>
                        <img src="/chat-icon.svg" alt="채팅 오른쪽" className={styles.rightImg} />
                    </div>
                    <button className={styles.chatBtn} onClick={handleChatClick}>채팅 시작하기</button>
                </div>

                {/* 감정 분석 카드 */}
                <div className={styles.analysisSection}>
                    <h3 className={styles.analysisTitle}>지난달의 감정분석 결과</h3>
                    <div className={styles.analysisCard}>
                        <div className={styles.left}>
                            <p className={styles.analysisDate}>2025년 2월</p>
                            <div className={styles.chartWrapper}>
                                <Pie
                                    data={pieData}
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

                        <ul className={styles.right}>
                            {emotionData.map((item, i) => (
                                <li key={i} className={styles.legendItem}>
                                    <span
                                        className={styles.colorDot}
                                        style={{ backgroundColor: item.color }}
                                    ></span>
                                    <span className={styles.label}>{item.label}</span>
                                    <span className={styles.percent}>{item.value}%</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatCenter;
