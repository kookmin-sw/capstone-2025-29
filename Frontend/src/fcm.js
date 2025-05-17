// src/fcm.js
import { messaging, getToken } from './firebase';

export const requestFCMToken = async () => {
    alert(`fcmtoken!!!!!!!!! ', ${fcmToken}`)
    try {
        const currentToken = await getToken(messaging, {
            vapidKey: "BPmZvGshmU9engJbGw4Ny05svrAhclGNLlgUXfsjw9_EJp0jX80M0wzra6bcN9fXD0WVG2WMale74xxbQGQL3tw"
        });

        
        localStorage.setItem('fcmToken', currentToken); // 토큰을 로컬 스토리지에 저장

    } catch (err) {
        console.error('An error occurred while retrieving token. ', err);
    }
};
