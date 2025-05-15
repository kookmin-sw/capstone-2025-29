import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function RedirectHandler() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);

        const accessToken = params.get('accessToken');
        const refreshToken = params.get('refreshToken');
        const userType = params.get('userType');

        const userInfo = {
            name: params.get('name') || "",
            profileImage: params.get('profileImage') || "",
            phone: params.get('phone') || "",
            address: params.get('address') || ""
        };

        // ✅ localStorage 저장
        if (accessToken) localStorage.setItem('accessToken', accessToken);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
        if (userType) localStorage.setItem('userType', userType);

        console.log('accessToken:', accessToken);
        console.log('userType:', userType);
        console.log('userInfo:', userInfo);

        // ✅ navigate 시 userInfo를 state로 전달
        if (userType === 'elderly') {
            navigate('/usermain', { state: { from: 'redirect', userInfo } });
        } else {
            navigate('/volunteermain', { state: { from: 'redirect', userInfo } });
        }
    }, [location.search, navigate]);

    return null;
}
