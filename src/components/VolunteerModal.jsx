import React from "react";
import Modal from "react-modal";
import styles from "./VolunteerModal.module.css";

Modal.setAppElement("#root"); // 접근성 설정

export default function VolunteerModal({ isOpen, onClose, volunteer }) {
    if (!volunteer) return null; // volunteer 데이터가 없으면 렌더링하지 않음
    console.log(volunteer);
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className={styles.modal}
            overlayClassName={styles.overlay}
        >
            <button className={styles.closeButton} onClick={onClose}>
                ✕
            </button>
            <div className={styles.imageWrapper}>
                <img src={volunteer.profileImageUrl} alt={volunteer.name} className={styles.icon} />
            </div>
            <h2 className={styles.name}>{volunteer.name} 님</h2>
            <p className={styles.hours}>봉사시간 {volunteer.volunteerActivityTime}시간</p>
            <p className={styles.phone}>{volunteer.phone}</p>
            <p className={styles.introduction}>{volunteer.bio}</p>
        </Modal>
    );
}