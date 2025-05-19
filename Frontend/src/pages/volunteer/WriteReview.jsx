import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
<<<<<<< HEAD
import { submitReview } from "../../api/VolunteerApi";
import axios from "axios";
import styles from "./WriteReview.module.css";
import Topbar from "../../components/Topbar";
import { getReviewPreSignedUrls } from "../../api/ImgApi";
=======

import { submitReview } from "../../api/VolunteerApi";               // 후기 제출 API
import { getReviewPreSignedUrls } from "../../api/ImgApi";          // 이미지 업로드용 presigned URL 요청 API
import axios from "axios";                                          // 이미지 업로드용 HTTP 클라이언트

import styles from "./WriteReview.module.css";                      // CSS 모듈
import Topbar from "../../components/Topbar";                       // 상단바
>>>>>>> main

export default function WriteReview() {
    const location = useLocation();
    const navigate = useNavigate();
<<<<<<< HEAD
    const { currentMatching } = location.state || {};

    const [reviewText, setReviewText] = useState("");
    const [images, setImages] = useState([]);

    const handleAttachClick = () => {
        const input = document.createElement("input");
=======

    // ✅ 매칭 정보 (매칭 ID, 대상 이름, 날짜 등)
    const { currentMatching } = location.state || {};

    // ✅ 후기 텍스트, 이미지 URL 상태
    const [reviewText, setReviewText] = useState("");       // 후기 텍스트
    const [images, setImages] = useState([]);               // 업로드된 이미지 URL 목록

    // ✅ "사진/동영상 첨부하기" 버튼 클릭 시
    const handleAttachClick = () => {
        const input = document.createElement("input");     // 파일 선택 input 생성
>>>>>>> main
        input.type = "file";
        input.accept = "image/*";
        input.multiple = true;

<<<<<<< HEAD
        input.onchange = async (e) => {
            const files = Array.from(e.target.files);
            if (files.length === 0) return;

            try {
                const urlsData = await getReviewPreSignedUrls(files.length);
                console.log("PreSigned URLs:", urlsData);

                const uploadedUrls = [];

=======
        // ✅ 파일 선택 완료 시 처리
        input.onchange = async (e) => {
            const files = Array.from(e.target.files);       // 선택된 파일 배열로 변환
            if (files.length === 0) return;

            try {
                // 서버로부터 presigned URL 받아오기
                const urlsData = await getReviewPreSignedUrls(files.length);
                const uploadedUrls = [];

                // ✅ 파일 업로드 루프
>>>>>>> main
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const { preSignedUrl, key } = urlsData[i];

<<<<<<< HEAD
=======
                    // S3에 PUT 요청으로 업로드
>>>>>>> main
                    await axios.put(preSignedUrl, file, {
                        headers: { 'Content-Type': file.type || 'application/octet-stream' }
                    });

<<<<<<< HEAD
                    const imageUrl = `https://ongi-s3.s3.ap-northeast-2.amazonaws.com/${key}`;

                    console.log("imageUrl URLs:", imageUrl);

                    
                    uploadedUrls.push(imageUrl);
                }

=======
                    // 업로드된 이미지 접근 URL 생성
                    const imageUrl = `${import.meta.env.VITE_S3_BASE_URL}/${key}`;
                    console.log("imageUrl URLs:", imageUrl);

                    uploadedUrls.push(imageUrl);
                }

                // ✅ 기존 이미지들과 함께 상태 업데이트
>>>>>>> main
                setImages((prev) => [...prev, ...uploadedUrls]);
            } catch (error) {
                console.error("이미지 업로드 실패:", error);
                alert("이미지 업로드 실패: " + error.message);
            }
        };

<<<<<<< HEAD
        input.click();
    };

=======
        input.click(); // 파일 선택창 열기
    };

    // ✅ 후기 제출 버튼 클릭 시
>>>>>>> main
    const handleSubmit = async () => {
        if (!currentMatching?.matchingId) {
            alert("매칭 ID가 없습니다.");
            return;
        }

<<<<<<< HEAD
        const reviewData = {
            volunteerActivityId: currentMatching.matchingId,
            content: reviewText,
            imageUrls: images,
        };

        try {
            await submitReview(reviewData);
            alert("후기가 성공적으로 작성되었습니다.");
            navigate("/volunteermain");
=======
        if (images.length === 0) {
            alert("하나 이상의 사진을 첨부해주세요.");
            return;
        }
        
        const reviewData = {
            volunteerActivityId: currentMatching.matchingId, // 매칭 ID
            content: reviewText,                             // 작성된 후기 텍스트
            imageUrls: images                                // 첨부된 이미지 URL들
        };

        try {
            await submitReview(reviewData);                  // 서버에 후기 데이터 전송
            alert("후기가 성공적으로 작성되었습니다.");
            navigate("/volunteermain", { state: { updated: true } }); // 메인으로 이동
>>>>>>> main
        } catch (error) {
            console.error("후기 작성 실패:", error);
            alert(error.message || "후기 작성에 실패했습니다.");
        }
    };

    return (
        <div className={styles.container}>
<<<<<<< HEAD
            <Topbar title="후기작성" />

=======
            {/* ✅ 상단바 */}
            <Topbar title="후기작성" />

            {/* ✅ 매칭된 상대 정보 표시 */}
>>>>>>> main
            <div className={styles.matchInfo}>
                <img src="/check.svg" className={styles.matchIcon} alt="체크" />
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
                        &nbsp; | &nbsp;
                        {currentMatching
                            ? new Date(currentMatching.startTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })
                            : "시간 없음"}
                    </div>
                </div>
            </div>

<<<<<<< HEAD
=======
            {/* ✅ 첨부 버튼 */}
>>>>>>> main
            <button className={styles.attachBtn} onClick={handleAttachClick}>
                사진/동영상 첨부하기
            </button>

<<<<<<< HEAD
            <div className={styles.imageScroll}>
                {images.map((src, idx) => (
                    <img key={idx} src={src} className={styles.previewImage} alt={`preview-${idx}`} />
                ))}
            </div>

=======
            {/* ✅ 이미지 미리보기 영역 */}
            <div className={styles.imageScroll}>
                {images.map((src, idx) => (
                    <img
                        key={idx}
                        src={src}
                        className={styles.previewImage}
                        alt={`preview-${idx}`}
                    />
                ))}
            </div>

            {/* ✅ 후기 입력 섹션 */}
>>>>>>> main
            <div className={styles.reviewSection}>
                <label>후기 작성</label>
                <textarea
                    placeholder="후기를 입력해주세요"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                />
            </div>

<<<<<<< HEAD
=======
            {/* ✅ 제출 버튼 */}
>>>>>>> main
            <div className={styles.submitArea}>
                <button className={styles.submitBtn} onClick={handleSubmit}>
                    완료
                </button>
            </div>
        </div>
    );
}
