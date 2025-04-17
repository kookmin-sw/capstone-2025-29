import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

// Firebase 설정
const firebaseConfig = {
    // Firebase 콘솔에서 가져온 설정값을 여기에 입력
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// FCM 토큰 가져오기
export const getFCMToken = async () => {
    try {
        // 알림 권한 요청
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            // FCM 토큰 가져오기
            const token = await getToken(messaging, {
                vapidKey: 'YOUR_VAPID_KEY' // Firebase 콘솔에서 생성한 VAPID 키
            });
            return token;
        } else {
            throw new Error('알림 권한이 거부되었습니다.');
        }
    } catch (error) {
        console.error('FCM 토큰 가져오기 실패:', error);
        throw error;
    }
};

export default app; 