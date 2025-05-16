import { messaging, getToken, onMessage } from '../firebase';
import { useEffect } from 'react';

const NotificationSetup = () => {
    useEffect(() => {
        // Request notification permission
        Notification.requestPermission()
            .then((permission) => {
                if (permission === 'granted') {
                    // Get FCM token
                    getToken(messaging, {
                        vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY
                    })
                        .then((currentToken) => {
                            if (currentToken) {
                                console.log('FCM Token:', currentToken);
                                // TODO: Send token to your backend server
                                localStorage.setItem('fcmToken', currentToken);
                            } else {
                                console.log('No registration token available.');
                            }
                        })
                        .catch((err) => {
                            console.log('An error occurred while retrieving token. ', err);
                        });
                }
            });

        // Handle foreground messages
        onMessage(messaging, (payload) => {
            console.log('Foreground notification:', payload);
            // Create and show notification
            const notificationTitle = payload.notification.title;
            const notificationOptions = {
                body: payload.notification.body,
                icon: '/favicon.ico'
            };

            new Notification(notificationTitle, notificationOptions);
        });
    }, []);

    return null;
};

export default NotificationSetup; 