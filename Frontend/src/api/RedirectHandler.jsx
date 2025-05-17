import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { updateFcmToken } from '../api/both'; // ✅ FCM, Elderly 정보 API
import { fetchElderlyMatching } from '../api/UserApi'; // ✅ Elderly 정보 API
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
            alert('✅ init 함수 실행됨');

            alert(`🌐 location.href: ${window.location.href}`);
            alert(`🔍 location.search: ${location.search}`);
            alert(`🔑 accessToken: ${accessToken}`);
            alert(`🔐 refreshToken: ${refreshToken}`);
            alert(`👤 userType: ${userType}`);

            try {

                alert('updatefcmtoken!!')
                // ✅ FCM 토큰 등록
                await updateFcmToken(userType, accessToken);
                alert('✅ FCM 토큰 저장 성공');

                if (userType === 'elderly') {
                    alert('✅ 이용자 로그인 OK');
                    navigate('/usermain');
                } else {
                    alert('✅ 봉사자 로그인 OK');
                    navigate('/volunteermain');
                }
            } catch (error) {
                alert(`❌ 초기화 실패: ${error.message}`);
            }
        };

        if (accessToken && userType) {
            init();
        }

    }, [location.search, navigate]);

    return
}

