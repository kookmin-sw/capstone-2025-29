import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TopBar.module.css";

export default function Topbar({ title }) {
    const navigate = useNavigate();

    return (
        <div className={styles.topBar}>
            <button className={styles.backBtn} onClick={() => navigate(-1)}>
                <img src='../../public/backarrow.svg' alt="뒤로가기" className={styles.icon} />
            </button>
            <h1 className={styles.title}>{title}</h1>
        </div>
    );
}
