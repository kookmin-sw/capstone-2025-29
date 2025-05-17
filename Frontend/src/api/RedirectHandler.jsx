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

        // ✅ localStorage 저장 (토큰 및 userType)
        if (accessToken) localStorage.setItem('accessToken', accessToken);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
        if (userType) localStorage.setItem('userType', userType)

        const init = async () => {

            alert('init은 실행')
            alert("params :", params)
            alert("accessToken :",accessToken)
            alert("refreshToken :",refreshToken)
            alert("userType :",userType)
    try {
        // ✅ FCM 토큰 등록
        await updateFcmToken(userType, accessToken);
        alert('fcm 저장 성공')
        console.log('✅ FCM 토큰 등록 성공');

        // ✅ elderly인 경우: 나의 정보 조회

        if (userType === 'elderly') {
            alert('이용자 로그인까지는 ok')
            navigate('/usermain');
        } else {
            alert('봉사자 로그인까지는 ok')
            navigate('/volunteermain');
        }
    } catch (error) {

        const e = error.message;
        alert('초기화 실패:', e);
    }
};

if (accessToken && userType) {
    init();
}

    }, [location.search, navigate]);

return 
}

