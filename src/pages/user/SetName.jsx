import React, { useState } from "react";
import Topbar from "../../components/Topbar";
import styles from "./SetName.module.css";
import { useNavigate } from "react-router-dom";

/* 사용자 이름 설정 컴포넌트 */
export default function SetName() {
    const navigate = useNavigate();
    // 상태 관리
    const [showModal, setShowModal] = useState(false); // 모달 표시 여부
    const [name, setName] = useState("홍길동 ai"); // 사용자 이름
    const [previewImg, setPreviewImg] = useState("/public/profile.svg"); // 프로필 이미지 미리보기

    // 모달 관련 함수
    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    // 이름 설정 완료 핸들러
    const handleSubmit = () => {
        // 로컬 스토리지에 이름 저장
        localStorage.setItem('userName', name);
        // ChatCenter 페이지로 이동
        navigate('/ChatCenter');
    };

    return (
        <div className={styles.container}>
            {/* 상단 네비게이션 바 */}
            <Topbar />

            {/* 안내 문구 */}
            <p className={styles.title}>이름을 정해주세요</p>

            {/* 프로필 이미지 미리보기 영역 */}
            <div className={styles.imageWrapper} onClick={openModal}>
                <img src={previewImg} alt="프로필 미리보기" className={styles.profileImg} />
            </div>

            {/* 이름 입력 필드 */}
            <input
                className={styles.nameInput}
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            {/* 완료 버튼 */}
            <div className={styles.BtnWrapper}>
                <button className={styles.submitBtn} onClick={handleSubmit}>완료</button>
            </div>

            {/* 프로필 이미지 설정 모달 */}
            {showModal && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <p className={styles.modalTitle}>프로필 사진 설정</p>
                        <button className={styles.modalBtn}>앨범에서 사진 선택</button>
                        <button className={styles.modalBtn}>기본 이미지 적용</button>
                        <button className={styles.cancelBtn} onClick={closeModal}>취소</button>
                    </div>
                </div>
            )}
        </div>
    );
}
