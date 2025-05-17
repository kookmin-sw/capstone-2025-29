import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import ongi_login from '../../assets/ongi_login.svg';
import { login } from '../../api/both';

export default function Login() {
    const navigate = useNavigate();

    const [formValues, setFormValues] = useState({
        username: '',
        password: ''
    });

    const [userType, setUserType] = useState('volunteer'); // 기본값 봉사자

    // ✅ 아이디/비번 입력 핸들러
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // ✅ 일반 로그인 핸들러
    const handleLogin = async () => {
        try {
            const requestData = await login(formValues.username, formValues.password, userType);

            console.log('로그인 성공:', requestData);

            localStorage.setItem('userName', requestData.name);
            localStorage.setItem('userAddress', JSON.stringify(requestData.address));

            // 사용자 타입에 따라 이동
            if (userType === 'volunteer') {
                navigate('/volunteermain');
            } else {
                navigate('/usermain');
            }
        } catch (error) {
            console.error('로그인 실패:', error);
            alert(error.message);
        }
    };

    // ✅ 카카오 로그인 리다이렉트 핸들러
    const handleKakaoLogin = () => {
        const kakaoAuthUrl = 'https://coffeesupliers.shop/oauth2/authorization/kakao';
        window.location.href = kakaoAuthUrl;
    };


    return (
        <div className={styles.container}>
            <div className={styles.topHalf}>
                <img src={ongi_login} alt="로고" className={styles.logo} />
            </div>

            <div className={styles.bottomHalf}>

                {/* 사용자 타입 토글 */}
                <div className={styles.toggleWrapper}>
                    <button
                        className={`${styles.toggleBtn} ${userType === 'volunteer' ? styles.active : ''}`}
                        onClick={() => setUserType('volunteer')}
                    >
                        봉사자
                    </button>
                    <button
                        className={`${styles.toggleBtn} ${userType === 'elderly' ? styles.active : ''}`}
                        onClick={() => setUserType('elderly')}
                    >
                        이용자
                    </button>
                </div>

                {/* 아이디 입력 */}
                <div className={styles.inputField}>
                    <img src="/login_id.svg" alt="아이디 아이콘" className={styles.icon} />
                    <input
                        type="text"
                        placeholder="아이디"
                        name="username"
                        value={formValues.username}
                        onChange={handleInputChange}
                    />
                </div>

                {/* 비밀번호 입력 */}
                <div className={styles.inputField}>
                    <img src="/login_pw.svg" alt="비밀번호 아이콘" className={styles.icon} />
                    <input
                        type="password"
                        placeholder="비밀번호"
                        name="password"
                        value={formValues.password}
                        onChange={handleInputChange}
                    />
                </div>

                {/* 일반 로그인 버튼 */}
                <button className={styles.loginBtn} onClick={handleLogin}>
                    로그인
                </button>

                {/* 회원가입 버튼 */}
                <div className={styles.authButtons}>
                    <button className={styles.signupBtn} onClick={() => navigate("/roleselect")}>
                        회원가입
                    </button>
                </div>

                {/* ✅ 카카오 로그인 버튼 */}
                <button className={styles.kakaoBtn} onClick={handleKakaoLogin}>
                    <img src="/login_kakko.svg" alt="카카오 아이콘" className={styles.icon} />
                    카카오로 시작하기
                </button>
            </div>
        </div>
    );
}
