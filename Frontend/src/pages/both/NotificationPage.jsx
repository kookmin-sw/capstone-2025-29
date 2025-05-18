import React, { useState, useEffect } from "react";
import Topbar from "../../components/Topbar";
import NotificationCard from "../../components/NotificationCard";
import styles from "./NotificationPage.module.css";
import { fetchUserNotifications } from "../../api/both"; // API 호출 함수 가져오기 

export default function NotificationPage({ setIsNewNotification }) {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        localStorage.setItem("isNewNotification", "false");
    }, []);

    useEffect(() => {
        const loadNotifications = async () => {
            try {
                const userType = localStorage.getItem('userType') || 'elderly';
                const data = await fetchUserNotifications(userType);

                // ✅ data가 배열이므로 바로 map 처리
                const formattedNotifications = data.map((item, index) => ({
                    id: item.id || index,
                    icon: "/alarm.svg", // ✅ 고정 아이콘 사용
                    title: item.title || "알림 제목 없음",
                    date: new Date(item.createdAt).toLocaleString('ko-KR', {
                        year: 'numeric', month: 'long', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                    }),
                    subtitle: item.body || "",
                    timeAgo: getTimeAgo(item.createdAt)
                }));

                setNotifications(formattedNotifications);
            } catch (error) {
                console.error("알림 불러오기 실패:", error);
            }
        };

        loadNotifications();
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
                            key={`${notification.id}-${notification.createdAt}`}
                            {...notification}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
