import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
0
export default function RedirectHandler() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);

        console.log('params' ,params)
        const accessToken = params.get('accessToken');
        const refreshToken = params.get('refreshToken');
        const userType = params.get('userType');

        if (accessToken) {
            localStorage.setItem('accessToken', accessToken);
        }
        if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
        }
        if (userType) {
            localStorage.setItem('userType', userType);
        }
        console.log('params : ',accessToken)
        // ✅ 저장하고 바로 봉사자 메인으로 이동
        navigate('/volunteermain');
    }, [location.search]);

    return <div>로그인 중입니다...</div>;
}
