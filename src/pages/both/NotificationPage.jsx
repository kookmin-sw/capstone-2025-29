import React, { useState, useEffect } from "react";
import Topbar from "../../components/Topbar";
import NotificationCard from "../../components/NotificationCard";
import styles from "./NotificationPage.module.css";

export default function NotificationPage() {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            icon: "../../public/medical.svg",
            title: "새로운 봉사 일정이 생겼어요!",
            date: "2025년 12월 42일 00:00",
            subtitle: "고길동님과의 일정",
            timeAgo: "3분전"
        },
        {
            id: 2,
            icon: "../../public/housing.svg",
            title: "새로운 봉사 일정이 생겼어요!",
            date: "2025년 12월 42일 00:00",
            subtitle: "고길동님과의 일정",
            timeAgo: "3분전"
        },
        {
            id: 3,
            icon: "../../public/book.svg",
            title: "새로운 봉사 일정이 생겼어요!",
            date: "2025년 12월 42일 00:00",
            subtitle: "고길동님과의 일정",
            timeAgo: "3분전"
        }
    ]);

    // useEffect(() => {
    //     // WebSocket 연결 설정
    //     const ws = new WebSocket('ws://your-backend-url/notifications');
        
    //     // 메시지 수신 시 처리
    //     ws.onmessage = (event) => {
    //         const newNotification = JSON.parse(event.data);
    //         setNotifications(prev => [newNotification, ...prev]);
    //     };

    //     // 연결 에러 처리
    //     ws.onerror = (error) => {
    //         console.error('WebSocket error:', error);
    //     };

    //     // 컴포넌트 언마운트 시 연결 종료
    //     return () => {
    //         ws.close();
    //     };
    // }, []);

    return (
        <div className={styles.container}>
            <Topbar title="알림" />
            <div className={styles.notificationList}>
                {notifications.map((notification) => (
                    <NotificationCard
                        key={notification.id}
                        {...notification}
                    />
                ))}
            </div>
        </div>
    );
}
