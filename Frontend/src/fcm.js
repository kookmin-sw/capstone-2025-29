// src/fcm.js
import { messaging, getToken } from './firebase';

<<<<<<< HEAD
export const requestFCMToken = async () => {
    try {
        const currentToken = await getToken(messaging, {
            vapidKey: "BPmZvGshmU9engJbGw4Ny05svrAhclGNLlgUXfsjw9_EJp0jX80M0wzra6bcN9fXD0WVG2WMale74xxbQGQL3tw"
        });

        localStorage.setItem('fcmToken', currentToken); // 토큰을 로컬 스토리지에 저장

    } catch (err) {
        console.error('An error occurred while retrieving token. ', err);
=======

export const requestFCMToken = async () => {
    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

    alert("token 발급중!")
    try {
        const currentToken = await getToken(messaging, {
            vapidKey: vapidKey
        });

        if (currentToken) {
            localStorage.setItem('fcmToken', currentToken);
        } else {
            throw new Error("FCM 토큰이 존재하지 않습니다. 권한이 거부되었을 수 있습니다.");
        }
    } catch (err) {
        console.error('❌ FCM 토큰 발급 실패:', err);
        throw err;
>>>>>>> main
    }
};
