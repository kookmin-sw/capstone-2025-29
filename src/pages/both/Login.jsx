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

    const [userType, setUserType] = useState('volunteer'); // 기본값은 봉사자

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLogin = async () => {
        try {
            await login(formValues.username, formValues.password, userType);

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
            <div className={styles.topHalf}>
                <img src={ongi_login} alt="" className={styles.logo} />
            </div>

            <div className={styles.bottomHalf}>
                
                {/* 사용자 타입 선택 토글 */}
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

                <button className={styles.loginBtn} onClick={handleLogin}>
                    로그인
                </button>

                <div className={styles.authButtons}>
                    <button className={styles.signupBtn} onClick={() => navigate("/roleselect")}>
                        회원가입
                    </button>
                </div>

                <button className={styles.kakaoBtn}>
                    <img src="/login_kakko.svg" alt="" className={styles.icon} />
                    카카오로 시작하기
                </button>
            </div>
        </div>
    );
}
