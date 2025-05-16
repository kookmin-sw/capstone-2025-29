import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { updateFcmToken  } from '../api/both'; // ✅ FCM, Elderly 정보 API
import { fetchElderlyMatching,fetchUserInfo } from '../api/UserApi'; // ✅ Elderly 정보 API
export default function RedirectHandler() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        console.log('location', location)
        console.log('params', params)
        const accessToken = params.get('accessToken');
        const refreshToken = params.get('refreshToken');
        const userType = params.get('userType');

        console.log('accessToken', accessToken, 'refreshToken', refreshToken, 'userType', userType)
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
                if (userType === 'elderly') {
                    const elderlyInfo = await fetchUserInfo(accessToken);

                    console.log('elderlyInfo:', elderlyInfo);


                    // ✅ 이름, 주소 로컬스토리지 저장
                    if (elderlyInfo.name) localStorage.setItem('userName', elderlyInfo.name);
                    if (elderlyInfo.address) localStorage.setItem('userAddress', JSON.stringify(elderlyInfo.address));

                    // ✅ 이동 (state는 그대로 넘겨도 됨)
                    navigate('/usermain', { state: { from: 'redirect', userInfo: elderlyInfo } });
                } else {
                    navigate('/volunteermain');
                }
            } catch (error) {
                console.error('초기화 실패:', error.message);
                alert('로그인 중 오류가 발생했습니다.');
            }
        };

        if (accessToken && userType) {
            init();
        }

    }, [location.search, navigate]);

    return null; // 렌더링할 내용이 없으므로 null 반환
}
