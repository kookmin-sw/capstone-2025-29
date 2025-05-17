import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { updateFcmToken } from '../api/both'; // ✅ FCM 토큰 등록 API
import { messaging } from '../firebase'; // ✅ firebase.js 에서 messaging 가져오기
import { getToken } from 'firebase/messaging'; // ✅ getToken 직접 import

export default function RedirectHandler() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const accessToken = params.get('accessToken');
        const refreshToken = params.get('refreshToken');
        const userType = params.get('userType');

        // ✅ localStorage 저장
        if (accessToken) localStorage.setItem('accessToken', accessToken);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
        if (userType) localStorage.setItem('userType', userType);

        const init = async () => {
            try {
                // ✅ 1. 서비스워커 등록
                const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
                alert('✅ Service Worker 등록 성공:', registration);

                // ✅ 2. 알림 권한 확인
                // if (Notification.permission === 'default') {
                //     await Notification.requestPermission();
                // }

                // if (Notification.permission !== 'granted') {
                //     alert('❌ 알림 권한이 없어 FCM 토큰 발급이 불가합니다.');
                //     return;
                // }

                // ✅ 3. FCM 토큰 발급
                const fcmToken = await getToken(messaging, {
                    vapidKey: 'BPmZvGshmU9engJbGw4Ny05svrAhclGNLlgUXfsjw9_EJp0jX80M0wzra6bcN9fXD0WVG2WMale74xxbQGQL3tw',
                    serviceWorkerRegistration: registration,
                });

                if (!fcmToken) {
                    alert('❌ FCM 토큰이 발급되지 않았습니다.');
                    return;
                }

                alert('✅ FCM 토큰 발급:', fcmToken);

                // ✅ 4. 서버에 FCM 토큰 저장
                await updateFcmToken(userType, accessToken, fcmToken);
                alert('✅ FCM 토큰 저장 성공');

                // ✅ 5. 사용자 타입에 따라 이동
                if (userType === 'elderly') {
                    navigate('/usermain');
                } else {
                    navigate('/volunteermain');
                }
            } catch (error) {
                alert(`❌ 초기화 실패: ${error.message}`);
                console.error(error);
            }
        };

        if (accessToken && userType) {
            init();
        }
    }, [location.search, navigate]);

    return null;
}
