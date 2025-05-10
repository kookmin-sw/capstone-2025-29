import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // useNavigate 추가
import { submitReview } from "../../api/VolunteerApi"; // API 호출 함수 가져오기
import styles from "./WriteReview.module.css";
import Topbar from "../../components/Topbar";

export default function WriteReview() {
    const location = useLocation();
    const navigate = useNavigate(); // useNavigate 훅 초기화
    const { currentMatching } = location.state || {}; // VolunteerMain에서 전달된 데이터
    const [showModal, setShowModal] = useState(false);
    const [reviewText, setReviewText] = useState("");
    const [images, setImages] = useState([]); // 이미지 URL 배열

    const handleAttachClick = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleSubmit = async () => {
        if (!currentMatching?.matchingId) {
            console.error("매칭 ID가 없습니다.");
            return;
        }

        // 이미지가 없으면 기본 이미지 사용
        const reviewData = {
            volunteerActivityId: currentMatching.matchingId,
            content: reviewText,
            imageUrls: images.length > 0 ? images : ["/imgex.png"], // 기본 이미지 경로
        };

        try {
            const response = await submitReview(reviewData);
            console.log("후기 작성 성공:", response);
            // 성공 메시지 출력
            console.log("후기가 성공적으로 작성되었습니다.");
            navigate("/volunteermain"); // VolunteerMain 페이지로 이동
        } catch (error) {
            console.error("후기 작성 실패:", error);
            // 실패 메시지 출력
            console.error(error.message || "후기 작성에 실패했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <div className={styles.container}>
            <Topbar title="후기작성" />

            {/* 매칭 정보 */}
            <div className={styles.matchInfo}>
                <img src="/book.svg" className={styles.matchIcon} />
                <div>
                    <div className={styles.matchText}>
                        <strong>{currentMatching?.otherName || "이름 없음"}</strong> 님과의 매칭
                    </div>
                    <div className={styles.matchDate}>
                        {currentMatching
                            ? new Date(currentMatching.startTime).toLocaleDateString("ko-KR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })
                            : "날짜 없음"}{" "}
                        &nbsp; | &nbsp;{" "}
                        {currentMatching
                            ? new Date(currentMatching.startTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })
                            : "시간 없음"}
                    </div>
                </div>
            </div>

            {/* 태그 목록 */}
            <div className={styles.tagList}>
                {["의료", "강남구", "의료", "강남구", "의료"].map((tag, idx) => (
                    <span key={idx} className={styles.tag}>
                        {tag}
                    </span>
                ))}
            </div>

            {/* 사진/동영상 첨부 */}
            <button className={styles.attachBtn} onClick={handleAttachClick}>
                사진/동영상 첨부하기
            </button>

            {/* 이미지 미리보기 */}
            <div className={styles.imageScroll}>
                {images.length > 0 ? (
                    images.map((src, idx) => (
                        <img key={idx} src={src} className={styles.previewImage} alt={`preview-${idx}`} />
                    ))
                ) : (
                    <img src="/imgex.png" className={styles.previewImage} alt="기본 이미지" />
                )}
            </div>

            {/* 모달 */}
            {showModal && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <p className={styles.modalTitle}>사진 첨부</p>
                        <button className={styles.modalBtn}>앨범에서 사진 선택</button>
                        <button className={styles.modalBtn}>기본 이미지 적용</button>
                        <button className={styles.cancelBtn} onClick={closeModal}>
                            취소
                        </button>
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
                <button className={styles.submitBtn} onClick={handleSubmit}>
                    완료
                </button>
            </div>
        </div>
    );
}
