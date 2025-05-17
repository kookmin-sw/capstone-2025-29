import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Topbar from "../../components/Topbar";
import MatchCard from "../../components/MatchCard";
import styles from "./ReviewDetail.module.css";
import { getReviewDetail } from "../../api/VolunteerApi";

export default function ReviewDetail() {
    const location = useLocation();
    const { reviewId } = location.state || {};
    const [reviewData, setReviewData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const districtMap = {
        GANGNAM: "강남구", GANGDONG: "강동구", GANGBUK: "강북구", GANGSEO: "강서구",
        GWANAK: "관악구", GWANGJIN: "광진구", GURO: "구로구", GEUMCHEON: "금천구",
        NOWON: "노원구", DOBONG: "도봉구", DONGDAEMUN: "동대문구", DONGJAK: "동작구",
        MAPO: "마포구", SEODAEMUN: "서대문구", SEOCHO: "서초구", SEONGDONG: "성동구",
        SEONGBUK: "성북구", SONGPA: "송파구", YANGCHEON: "양천구", YEONGDEUNGPO: "영등포구",
        YONGSAN: "용산구", EUNPYEONG: "은평구", JONGNO: "종로구"
    };

    const volunteerTypeMap = {
        HEALTH: "의료",
        HOUSING: "주거",
        CULTURE: "문화",
        EDUCATION: "교육"
    };

    const volunteerIconMap = {
        HEALTH: "/medical.svg",
        HOUSING: "/housing.svg",
        CULTURE: "/culture.svg",
        EDUCATION: "/education.svg"
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "----년 --월 --일";
        return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, "0")}월 ${String(date.getDate()).padStart(2, "0")}일`;
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "--:--";
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    useEffect(() => {
        const fetchReviewDetail = async () => {
            try {
                const data = await getReviewDetail(reviewId);
                console.log("리뷰 상세 데이터:", data);

                const koreanDistrict = districtMap[data.districtType] || data.districtType;
                const koreanVolunteerType = volunteerTypeMap[data.volunteerType] || data.volunteerType;

                setReviewData({
                    name: data.elderlyName,
                    date: formatDate(data.startTime),
                    time: formatTime(data.startTime),
                    tags: [koreanVolunteerType, koreanDistrict],
                    icon: volunteerIconMap[data.volunteerType] || "/book.svg",
                    images: data.imageUrls || [],
                    content: data.content || "내용이 없습니다."
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

    if (loading) return null;
    if (error) return <p>{error}</p>;
    if (!reviewData) return null;

    return (
        <div className={styles.container}>
            <Topbar title="후기 상세" />

            <MatchCard
                id={reviewId}
                name={reviewData.name}
                date={reviewData.date}
                time={reviewData.time}
                tags={reviewData.tags}
                icon={reviewData.icon}
            />

            {/* 이미지 미리보기 */}
            <div className={styles.imageScroll}>
                {reviewData.images.length > 0 ? (
                    reviewData.images.map((src, idx) => (
                        <img key={idx} src={src} className={styles.previewImage} alt={`preview-${idx}`} />
                    ))
                ) : (
                    <img src="/imgex.png" className={styles.previewImage} alt="기본 이미지" />
                )}
            </div>

            {/* 후기 텍스트 */}
            <p className={styles.reviewText}>
                {reviewData.content}
            </p>
        </div>
    );
}
