// src/fcm.js
import { messaging, getToken } from './firebase';

export const requestFCMToken = async () => {
    try {
        const currentToken = await getToken(messaging, {
            vapidKey: "BPmZvGshmU9engJbGw4Ny05svrAhclGNLlgUXfsjw9_EJp0jX80M0wzra6bcN9fXD0WVG2WMale74xxbQGQL3tw"
        });

        if (currentToken) {
            localStorage.setItem('fcmToken', currentToken);
            console.log('📌 FCM 토큰 발급 완료:', currentToken);
        } else {
            throw new Error("FCM 토큰이 존재하지 않습니다. 권한이 거부되었을 수 있습니다.");
        }
    } catch (err) {
        console.error('❌ FCM 토큰 발급 실패:', err);
        throw err;
    }
};
