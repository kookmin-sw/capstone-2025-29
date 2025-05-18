import { useEffect, useRef } from "react";
import { fetchUserNotifications } from "../api/both";

export default function NotificationWatcher({ onNewNotification }) {
    const lastTimestampRef = useRef(null);

    useEffect(() => {


        const userType = localStorage.getItem("userType") || "volunteer";

        const checkNewNotifications = async () => {
            try {
                const data = await fetchUserNotifications(userType);


                if (!Array.isArray(data) || data.length === 0) return;

                const latest = data.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                )[0];
                const latestTime = new Date(latest.createdAt).getTime();

                if (!lastTimestampRef.current) {
                    lastTimestampRef.current = latestTime;
                    return;
                }

                if (latestTime > lastTimestampRef.current) {
                    console.log("🆕 새 알림 감지됨:", latest);
                    lastTimestampRef.current = latestTime;

                    alert(`🔔 ${latest.title}\n${latest.body || ""}`); // ✅ alert 표시


                    // ✅ 로컬 저장소에 상태 저장
                    localStorage.setItem("isNewNotification", "true");

                    if (typeof onNewNotification === "function") {
                        onNewNotification();
                    }
                }
            } catch (err) {
                console.error("❌ 알림 감시 에러:", err);
            }
        };

        checkNewNotifications();
        const interval = setInterval(checkNewNotifications, 10000);
        return () => clearInterval(interval);
    }, [onNewNotification]);

    return null;
}
