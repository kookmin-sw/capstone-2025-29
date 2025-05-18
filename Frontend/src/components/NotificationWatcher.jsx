import { useEffect, useRef } from "react";
import { fetchUserNotifications } from "../api/both";

export default function NotificationWatcher({ onNewNotification }) {
    const lastTimestampRef = useRef(null);

    useEffect(() => {


        const userType = localStorage.getItem("userType") || "volunteer";

        const checkNewNotifications = async () => {
            try {
                const data = await fetchUserNotifications(userType);
                console.log("📬 가져온 알림:", data);

                if (!Array.isArray(data) || data.length === 0) return;

                const latest = data.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                )[0];
                const latestTime = new Date(latest.createdAt).getTime();

                if (!lastTimestampRef.current || latestTime > lastTimestampRef.current) {
                    lastTimestampRef.current = latestTime;

                    const storedTime = localStorage.getItem("lastNotificationTime");
                    if (!storedTime || latestTime > new Date(storedTime).getTime()) {
                        // ✅ 새 알림 감지됨
                        localStorage.setItem("isNewNotification", "true");
                        localStorage.setItem("lastNotificationTime", new Date(latestTime).toISOString());

                        if (typeof onNewNotification === "function") {
                            onNewNotification(); // 🔔 종 아이콘 업데이트
                        }

                        // ✅ 여기서 alert 띄우기
                        alert(`🔔 ${latest.title}\n${latest.body || ''}`);
                    }
                }

            } catch (err) {
                console.error("❌ 알림 감시 에러:", err);
            }
        };

        checkNewNotifications();
        const interval = setInterval(checkNewNotifications, 30000);
        return () => clearInterval(interval);
    }, [onNewNotification]);

    return null;
}
