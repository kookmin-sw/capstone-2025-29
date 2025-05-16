import React, { useState } from "react";
import Topbar from "../../components/Topbar";
import styles from "./SetName.module.css";
import { useNavigate } from "react-router-dom";
import { saveChatBotName } from "../../api/ChatApi"; // 챗봇 이름 저장 API

export default function SetName() {
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState("홍길동 ai");
    const [previewImg, setPreviewImg] = useState("/profile.svg");

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const handleSubmit = async () => {
        try {
            // ✅ API 호출로 서버에 이름과 이미지 저장
            await saveChatBotName(name, previewImg);

            // ✅ 성공 시 로컬스토리지에 저장
            localStorage.setItem('chatBotName', name);
            localStorage.setItem('chatBotProfileImage', previewImg);

            // ✅ ChatCenter로 이동
            navigate('/ChatCenter');
        } catch (error) {
            alert(error.message || "저장 실패");
        }
    };

    return (
        <div className={styles.container}>
            <Topbar />
            <p className={styles.title}>이름을 정해주세요</p>

            <div className={styles.imageWrapper} onClick={openModal}>
                <img src={previewImg} alt="프로필 미리보기" className={styles.profileImg} />
            </div>

            <input
                className={styles.nameInput}
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <div className={styles.BtnWrapper}>
                <button className={styles.submitBtn} onClick={handleSubmit}>완료</button>
            </div>

            {showModal && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <p className={styles.modalTitle}>프로필 사진 설정</p>
                        <button className={styles.modalBtn}>앨범에서 사진 선택</button>
                        <button className={styles.modalBtn} onClick={() => setPreviewImg("/profile.svg")}>기본 이미지 적용</button>
                        <button className={styles.cancelBtn} onClick={closeModal}>취소</button>
                    </div>
                </div>
            )}
        </div>
    );
}
