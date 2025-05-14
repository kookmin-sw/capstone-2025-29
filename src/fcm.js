// src/fcm.js
import { messaging, getToken } from './firebase';

export const requestFCMToken = async () => {
    try {
        const currentToken = await getToken(messaging, {
            vapidKey: "BPmZvGshmU9engJbGw4Ny05svrAhclGNLlgUXfsjw9_EJp0jX80M0wzra6bcN9fXD0WVG2WMale74xxbQGQL3tw"
        });

        // if (currentToken) {

        //     // ✅ 서버에 토큰 전송 (예시)
        //     await fetch('/api/save-token', {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify({ token: currentToken })
        //     });
        // } else {
        //     console .log('No registration token available. Request permission to generate one.');
        // }
    } catch (err) {
        console.error('An error occurred while retrieving token. ', err);
    }
};
