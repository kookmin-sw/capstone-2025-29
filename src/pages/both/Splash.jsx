import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Splash.module.css";

export default function Splash() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/login"); // 로그인 페이지로 이동
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className={styles.container}>
            <div className={styles.logoBox}>
                <img src="/splash-logo.svg" alt="온기 로고" className={styles.logo} />
            </div>
        </div>
    );
}
