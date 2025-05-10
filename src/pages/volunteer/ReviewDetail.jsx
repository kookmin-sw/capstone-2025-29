import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Topbar from "../../components/Topbar";
import MatchCard from "../../components/MatchCard";
import styles from "./ReviewDetail.module.css";
import { getReviewDetail } from "../../api/VolunteerApi"; // API 호출 함수 가져오기

export default function ReviewDetail() {
    const location = useLocation();
    const { reviewId } = location.state || {}; // CompleteReview에서 전달된 reviewId
    const [reviewData, setReviewData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviewDetail = async () => {
            console.log("리뷰 ID:", reviewId);
            try {
                const data = await getReviewDetail(reviewId); // API 호출
                console.log("리뷰 상세 데이터:", data);
                setReviewData({
                    name: data.elderlyName,
                    date: new Date(data.startTime).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    }),
                    time: new Date(data.startTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                    tags: [data.type, data.districtType],
                    icon: "/book.svg", // 아이콘은 고정
                    images: data.images || [], // 이미지 배열
                    content: data.content || "내용이 없습니다.", // 후기 내용
                });
                setError(null);
            } catch (err) {
                console.error("fetchReviewDetail 에러:", err);
                setError("리뷰 데이터를 불러오는 중 문제가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        if (reviewId) {
            fetchReviewDetail();
        }
    }, [reviewId]);

    if (loading) return 
    if (error) return 
    if (!reviewData) return

    return (
        <div className={styles.container}>
            <Topbar title="후기 상세" />
            <MatchCard {...reviewData} showDivider={false} />

            {/* 이미지 미리보기 */}
            <div className={styles.imageScroll}>
                {reviewData.images.map((src, idx) => (
                    <img key={idx} src={src} className={styles.previewImage} alt={`preview-${idx}`} />
                ))}
            </div>

            {/* 후기 텍스트 */}
            <p className={styles.reviewText}>
                {reviewData.content}
            </p>
        </div>
    );
}
