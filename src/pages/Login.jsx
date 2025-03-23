import React from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Login.module.css";
import ongi from '../assets/ongi.svg';

export default function Login() {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            {/* 상단 여백 */}
            <div className={styles.topHalf}>
                <img src={ongi} alt="" className={styles.logo} />
            </div>

            {/* 하단 로그인 폼 */}
            <div className={styles.bottomHalf}>
                {/* 아이디 입력 */}
                <div className={styles.inputField}>
                    <img src="/public/login_id.svg" alt="" className={styles.icon} />
                    <input type="text" placeholder="아이디" />
                </div>

                {/* 비밀번호 입력 */}
                <div className={styles.inputField}>
                    <img src="/public/login_pw.svg" alt="" className={styles.icon} />
                    <input type="password" placeholder="비밀번호" />
                </div>

                {/* 로그인 버튼 */}
                <button className={styles.loginBtn}>로그인</button>

                {/* 이메일 로그인 / 회원가입 버튼 */}
                <div className={styles.authButtons}>
                    <button className={styles.signupBtn} onClick={() => navigate("/signup")}>
                        회원가입
                    </button>
                </div>

                {/* 카카오 로그인 버튼 */}
                <button className={styles.kakaoBtn}>
                    <img src="/public/login_kakko.svg" alt="" className={styles.icon} />
                    카카오로 시작하기
                </button>
            </div>
        </div>
    );
}
