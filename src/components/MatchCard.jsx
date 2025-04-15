import React from "react";
import styles from "./MatchCard.module.css";

export default function MatchCard({ icon, name, date, time, tags, onClick }) {
    return (
        <div className={styles.card} onClick={onClick}>
            <div className={styles.top}>
                <img src={icon} className={styles.icon} />
                <div>
                    <div className={styles.name}><strong>{name}</strong> 님과의 매칭</div>
                    <div className={styles.date}>{date}  |  {time}</div>
                </div>
            </div>
            <div className={styles.tags}>
                {tags.map((tag, idx) => (
                    <span key={idx} className={styles.tag}>{tag}</span>
                ))}
            </div>
        </div>


    );
}
