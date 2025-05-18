import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { submitReview } from "../../api/VolunteerApi";
import axios from "axios";
import styles from "./WriteReview.module.css";
import Topbar from "../../components/Topbar";
import { getReviewPreSignedUrls } from "../../api/ImgApi";

export default function WriteReview() {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentMatching } = location.state || {};

    const [reviewText, setReviewText] = useState("");
    const [images, setImages] = useState([]);

    const handleAttachClick = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.multiple = true;

        input.onchange = async (e) => {
            const files = Array.from(e.target.files);
            if (files.length === 0) return;

            try {
                const urlsData = await getReviewPreSignedUrls(files.length);
                console.log("PreSigned URLs:", urlsData);

                const uploadedUrls = [];

                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const { preSignedUrl, key } = urlsData[i];

                    await axios.put(preSignedUrl, file, {
                        headers: { 'Content-Type': file.type || 'application/octet-stream' }
                    });

                    const imageUrl = `https://ongi-s3.s3.ap-northeast-2.amazonaws.com/${key}`;

                    console.log("imageUrl URLs:", imageUrl);


                    uploadedUrls.push(imageUrl);
                }

                setImages((prev) => [...prev, ...uploadedUrls]);
            } catch (error) {
                console.error("이미지 업로드 실패:", error);
                alert("이미지 업로드 실패: " + error.message);
            }
        };

        input.click();
    };

    const handleSubmit = async () => {
        if (!currentMatching?.matchingId) {
            alert("매칭 ID가 없습니다.");
            return;
        }

        const reviewData = {
            volunteerActivityId: currentMatching.matchingId,
            content: reviewText,
            imageUrls: images,
        };

        try {
            await submitReview(reviewData);
            alert("후기가 성공적으로 작성되었습니다.");
            navigate("/volunteermain", { state: { updated: true } });
        } catch (error) {
            console.error("후기 작성 실패:", error);
            alert(error.message || "후기 작성에 실패했습니다.");
        }
    };

    return (
        <div className={styles.container}>
            <Topbar title="후기작성" />

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

            <button className={styles.attachBtn} onClick={handleAttachClick}>
                사진/동영상 첨부하기
            </button>

            <div className={styles.imageScroll}>
                {images.map((src, idx) => (
                    <img key={idx} src={src} className={styles.previewImage} alt={`preview-${idx}`} />
                ))}
            </div>

            <div className={styles.reviewSection}>
                <label>후기 작성</label>
                <textarea
                    placeholder="후기를 입력해주세요"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                />
            </div>

            <div className={styles.submitArea}>
                <button className={styles.submitBtn} onClick={handleSubmit}>
                    완료
                </button>
            </div>
        </div>
    );
}
