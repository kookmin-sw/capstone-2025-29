import React from "react";
import styles from "./NotificationCard.module.css";

export default function NotificationCard({ icon, title, date, subtitle, timeAgo }) {
    return (
        <div className={styles.card}>
            <div className={styles.top}>
                <img src={icon} alt="notification icon" className={styles.icon} />
                <div>
                    <div className={styles.title}>{title}</div>
                    <div className={styles.date}>{date}</div>
                    <div className={styles.subtitle}>{subtitle}</div>
                </div>

            </div>
            <div className={styles.divider}></div>
        </div>
    );
} 