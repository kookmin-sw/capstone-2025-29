import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Splash.module.css";

export default function Splash() {
    const navigate = useNavigate();

    useEffect(() => {
        const askForNotificationPermission = async () => {
            if ('Notification' in window && Notification.permission === 'default') {
                const wantsNotification = window.confirm('매칭 알림을 허용하시겠습니까?');
                if (wantsNotification) {
                    const permission = await Notification.requestPermission();
                    if (permission === 'granted') {
                        console.log('🔔 알림 권한 허용됨');
                    } else {
                        alert('설정 > Safari > 알림에서 허용해 주세요.');
                    }
                }
            }
        };

        askForNotificationPermission();

        const timer = setTimeout(() => {
            navigate("/login"); // 로그인 페이지로 이동
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className={styles.container}>
            <div className={styles.logoBox}>
                <img src="/splash-logo.svg" alt="온기 로고" className={styles.logo} />
            </div>
        </div>
    );
}
