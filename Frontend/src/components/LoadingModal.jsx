import React from "react";
import Modal from "react-modal";
import styles from "./LoadingModal.module.css";

Modal.setAppElement("#root"); // React Modal 접근성 설정

export default function LoadingModal({ isOpen, message = "잠시만 기다려주세요..." }) {
    return (
        <Modal
            isOpen={isOpen}
            className={styles.modal}
            overlayClassName={styles.overlay}
            shouldCloseOnOverlayClick={false} // 로딩 중에는 닫히지 않도록 설정
        >
            <div className={styles.content}>
                <div className={styles.spinner}></div>
                <p className={styles.message}>{message}</p>
            </div>
        </Modal>
    );
}