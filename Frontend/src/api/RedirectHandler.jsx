import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
<<<<<<< HEAD
import { updateFcmToken  } from '../api/both'; // ✅ FCM, Elderly 정보 API
import { fetchElderlyMatching } from '../api/UserApi'; // ✅ Elderly 정보 API
=======
import { updateFcmToken } from '../api/both'; // ✅ FCM 토큰 등록 API
import { messaging } from '../firebase'; // ✅ firebase.js 에서 messaging 가져오기
import { getToken } from 'firebase/messaging'; // ✅ getToken 직접 import

>>>>>>> main
export default function RedirectHandler() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const accessToken = params.get('accessToken');
        const refreshToken = params.get('refreshToken');
        const userType = params.get('userType');

<<<<<<< HEAD
        // ✅ localStorage 저장 (토큰 및 userType)
        if (accessToken) localStorage.setItem('accessToken', accessToken);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
        if (userType) localStorage.setItem('userType', userType)

        const init = async () => {
            try {
                // ✅ FCM 토큰 등록
                await updateFcmToken(userType, accessToken);
                console.log('✅ FCM 토큰 등록 성공');

                // ✅ elderly인 경우: 나의 정보 조회
=======
        // ✅ localStorage 저장
        if (accessToken) localStorage.setItem('accessToken', accessToken);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
        if (userType) localStorage.setItem('userType', userType);

        const init = async () => {
            try {
                // // ✅ 1. 서비스워커 등록
                // const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
                // alert('✅ Service Worker 등록 성공:', registration);


                
                // //✅ 2. 알림 권한 확인
                // if (Notification.permission === 'default') {
                //     await Notification.requestPermission();
                // }

                // if (Notification.permission !== 'granted') {
                //     alert('❌ 알림 권한이 없어 FCM 토큰 발급이 불가합니다.');
                //     return;
                // }

                // // ✅ 3. FCM 토큰 발급
                // const fcmToken = await getToken(messaging, {
                //     vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
                // });

                // if (!fcmToken) {
                //     alert('❌ FCM 토큰이 발급되지 않았습니다.');
                //     return;
                // }

                // alert('✅ FCM 토큰 발급:', fcmToken);

                // // ✅ 4. 서버에 FCM 토큰 저장
                // await updateFcmToken(userType, accessToken, fcmToken);
                // alert('✅ FCM 토큰 저장 성공');

                // ✅ 5. 사용자 타입에 따라 이동
>>>>>>> main
                if (userType === 'elderly') {
                    navigate('/usermain');
                } else {
                    navigate('/volunteermain');
                }
            } catch (error) {
<<<<<<< HEAD
                console.error('초기화 실패:', error.message);
                alert('로그인 중 오류가 발생했습니다.');
=======
                alert(`❌ 초기화 실패: ${error.message}`);
                console.error(error);
>>>>>>> main
            }
        };

        if (accessToken && userType) {
            init();
        }
<<<<<<< HEAD

    }, [location.search, navigate]);

    return 
=======
    }, [location.search, navigate]);

    return null;
>>>>>>> main
}
