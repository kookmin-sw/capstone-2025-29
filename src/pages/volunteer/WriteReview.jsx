import React, { useState } from "react";
import styles from "./WriteReview.module.css";
import Topbar from "../../components/Topbar";

export default function WriteReview() {
    const [showModal, setShowModal] = useState(false);
    const [reviewText, setReviewText] = useState("");

    const handleAttachClick = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };


    const reviewData = {
        images: [
            "/public/imgex.png",
            "/public/imgex.png",
            "/public/imgex.png"
        ]
    }

    return (
        <div className={styles.container}>
            <Topbar title="후기작성" />

            {/* 매칭 정보 */}
            <div className={styles.matchInfo}>
                <img src="/book.svg" className={styles.matchIcon} />
                <div>
                    <div className={styles.matchText}><strong>홍길동</strong> 님과의 매칭</div>
                    <div className={styles.matchDate}>2025년 10월 11일 &nbsp; | &nbsp; 14:30</div>
                </div>
            </div>

            {/* 태그 목록 */}
            <div className={styles.tagList}>
                {["의료", "강남구", "의료", "강남구", "의료"].map((tag, idx) => (
                    <span key={idx} className={styles.tag}>{tag}</span>
                ))}
            </div>

            {/* 사진/동영상 첨부 */}
            <button className={styles.attachBtn} onClick={handleAttachClick}>
                사진/동영상 첨부하기
            </button>


            {/* 이미지 미리보기 */}
            <div className={styles.imageScroll}>
                {reviewData.images.map((src, idx) => (
                    <img key={idx} src={src} className={styles.previewImage} alt={`preview-${idx}`} />
                ))}
            </div>

            {/* 모달 */}
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





            {/* 후기 작성 */}
            <div className={styles.reviewSection}>
                <label>후기 작성</label>
                <textarea
                    placeholder="후기를 입력해주세요"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                />
            </div>

            {/* 완료 버튼 */}
            <div className={styles.submitArea}>
                <button className={styles.submitBtn}>완료</button>
            </div>

            <img src="/star.svg" alt="별점" className={styles.star} />
            <img src="/star.svg" alt="별점" className={styles.star} />
            <img src="/star.svg" alt="별점" className={styles.star} />
            <img src="/star.svg" alt="별점" className={styles.star} />
            <img src="/star.svg" alt="별점" className={styles.star} />
            <img src="/star.svg" alt="별점" className={styles.star} />
            <img src="/star.svg" alt="별점" className={styles.star} />
            <img src="/star.svg" alt="별점" className={styles.star} />
            <img src="/star.svg" alt="별점" className={styles.star} />
            <img src="/star.svg" alt="별점" className={styles.star} />

        </div>
    );
}
