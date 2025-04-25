import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Login.module.css";
import ongi_login from '../../assets/ongi_login.svg';
import { login } from '../../api/both';

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();

    const [formValues, setFormValues] = useState({
        username: '',
        password: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLogin = async () => {
        try {
            const userType = location.state?.userType || 'volunteer'; // location.state에서 userType 가져오기
            console.log('로그인 시도 userType:', userType); // userType 확인용 로그
            
            await login(formValues.username, formValues.password, userType);
            alert('로그인 성공!');
            
            // 사용자 타입에 따라 다른 페이지로 이동
            if (userType === 'volunteer') {
                navigate('/volunteermain');
            } else {
                navigate('/usermain');
            }
        } catch (error) {
            console.error('로그인 에러:', error);
            alert(error.message);
        }
    };

    return (
        <div className={styles.container}>
            {/* 상단 여백 */}
            <div className={styles.topHalf}>
                <img src={ongi_login} alt="" className={styles.logo} />
            </div>

            {/* 하단 로그인 폼 */}
            <div className={styles.bottomHalf}>
                {/* 아이디 입력 */}
                <div className={styles.inputField}>
                    <img src="/login_id.svg" alt="" className={styles.icon} />
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
                    <img src="/login_pw.svg" alt="" className={styles.icon} />
                    <input
                        type="password"
                        placeholder="비밀번호"
                        name="password"
                        value={formValues.password}
                        onChange={handleInputChange}
                    />
                </div>

                {/* 로그인 버튼 */}
                <button
                    className={styles.loginBtn}
                    onClick={handleLogin}
                >
                    로그인
                </button>

                {/* 이메일 로그인 / 회원가입 버튼 */}
                <div className={styles.authButtons}>
                    <button className={styles.signupBtn} onClick={() => navigate("/roleselect")}>
                        회원가입
                    </button>
                </div>

                {/* 카카오 로그인 버튼 */}
                <button className={styles.kakaoBtn}>
                    <img src="/login_kakko.svg" alt="" className={styles.icon} />
                    카카오로 시작하기
                </button>
            </div>
        </div>
    );
}
                                                                                                                                            