import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TopBar.module.css";

export default function Topbar({ title, navigateTo }) {
    const navigate = useNavigate();

    const handleBack = () => {
        if (navigateTo) {
            navigate(navigateTo);
        } else {
            navigate(-1); // 기본값으로 뒤로가기
        }
    };

    return (
        <div className={styles.topBar}>
            <button className={styles.backBtn} onClick={handleBack}>
                <img src='../../public/backarrow.svg' alt="뒤로가기" className={styles.icon} />
            </button>
            <h1 className={styles.title}>{title}</h1>
        </div>
    );
}
