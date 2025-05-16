import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { updateFcmToken } from './both'; // FCM 토큰 등록 API
import { fetchElderlyMatching } from './UserApi'; // elderly API
import { set } from 'date-fns';

export default function RedirectHandler() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);

        const accessToken = params.get('accessToken');
        const refreshToken = params.get('refreshToken');
        const userType = params.get('userType');
        const [userInfo, setUserInfo] = useState({});



        // ✅ localStorage 저장
        if (accessToken) localStorage.setItem('accessToken', accessToken);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
        if (userType) localStorage.setItem('userType', userType);
        if (userInfo.name) localStorage.setItem('userName', userInfo.name);
        if (userInfo.address) localStorage.setItem('userAddress', userInfo.address);
        
        // ✅ FCM 토큰 등록 API 호출
        const registerFcmToken = async () => {
            try {
                await updateFcmToken(userType, accessToken);
                console.log('✅ FCM 토큰 등록 성공');
            } catch (error) {
                console.error('❌ FCM 토큰 등록 실패:', error.message);
            }
        };

        const getElderlyMatching = async () => {

            console.log('Elderly Matching Data:', accessToken);
            try {
                const response = await fetchElderlyMatching();

                console.log('Elderly Matching Data:', response.data);
                localStorage.setItem('userName', response.data.name);
                localStorage.setItem('userAddress', response.data.address);

                console.log('Elderly Matching Data:', response.data);

            } catch (error) {
                console.error('Error fetching elderly matching data:', error);
            }
        }

        if (accessToken && userType) {
            registerFcmToken();
            getElderlyMatching();
        }

        // ✅ navigate 시 userInfo를 state로 전달
        if (userType === 'elderly') {
            navigate('/usermain', { state: { from: 'redirect', userInfo } });
        } else {
            console.log('userInfo:', userInfo);
            navigate('/volunteermain', { state: { from: 'redirect', userInfo } });
        }
    }, [location.search, navigate]);

    return <div>로그인 중입니다...</div>;
}
