import React, { useState, useEffect,useRef } from "react";
import Topbar from "../../components/Topbar";
import NotificationCard from "../../components/NotificationCard";
import styles from "./NotificationPage.module.css";
import { fetchUserNotifications } from "../../api/both"; // API 호출 함수 가져오기 

export default function NotificationPage() {
    const [notifications, setNotifications] = useState([]);
    const prevLengthRef = useRef(0); // 이전 알림 개수 저장용

    useEffect(() => {
        const loadNotifications = async () => {
            try {
                const userType = localStorage.getItem('userType') || 'elderly';
                const data = await fetchUserNotifications(userType);

                const formatted = data.map((item, index) => ({
                    id: item.id || index,
                    icon: "/alarm.svg",
                    title: item.title || "알림 제목 없음",
                    date: new Date(item.createdAt).toLocaleString('ko-KR', {
                        year: 'numeric', month: 'long', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                    }),
                    subtitle: item.body || "",
                    timeAgo: getTimeAgo(item.createdAt)
                }));

                // 🔥 이전 길이보다 많아졌으면 alert
                if (prevLengthRef.current > 0 && formatted.length > prevLengthRef.current) {
                    const newCount = formatted.length - prevLengthRef.current;
                    alert(`🔔 새로운 알림 ${newCount}개가 도착했습니다.`);
                }

                prevLengthRef.current = formatted.length;
                setNotifications(formatted);
            } catch (err) {
                console.error('알림 불러오기 실패:', err);
            }
        };

        loadNotifications();
        const interval = setInterval(loadNotifications, 10000);
        return () => clearInterval(interval);
    }, []);


    const getTimeAgo = (dateString) => {
        const now = new Date();
        const past = new Date(dateString);
        const diffMs = now - past;

        const diffMinutes = Math.floor(diffMs / 1000 / 60);
        if (diffMinutes < 1) return "방금 전";
        if (diffMinutes < 60) return `${diffMinutes}분 전`;
        const diffHours = Math.floor(diffMinutes / 60);
        if (diffHours < 24) return `${diffHours}시간 전`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}일 전`;
    };

    return (
        <div className={styles.container}>
            <Topbar title="알림" />
            <div className={styles.notificationList}>
                {notifications.length === 0 ? (
                    <p className={styles.noData}>알림이 없습니다.</p>
                ) : (
                    notifications.map((notification) => (
                        <NotificationCard
                            key={`${notification.id}-${notification.date}`}
                            {...notification}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
