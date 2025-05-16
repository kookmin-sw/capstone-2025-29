import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Topbar from "../../components/Topbar";
import MatchCard from "../../components/MatchCard";
import styles from "./ApplyingDetail.module.css";
import { fetchApplyingDetail, cancelMatching } from "../../api/UserApi";

export default function ApplyingDetail() {
    const location = useLocation();
    const navigate = useNavigate();
    const { matchId } = location.state || {};
    const [activityDetail, setActivityDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userAddress = JSON.parse(localStorage.getItem('userAddress')) || { district: "", detail: "" };

    const districtMap = {
        GANGNAM: "강남구", GANGDONG: "강동구", GANGBUK: "강북구", GANGSEO: "강서구",
        GWANAK: "관악구", GWANGJIN: "광진구", GURO: "구로구", GEUMCHEON: "금천구",
        NOWON: "노원구", DOBONG: "도봉구", DONGDAEMUN: "동대문구", DONGJAK: "동작구",
        MAPO: "마포구", SEODAEMUN: "서대문구", SEOCHO: "서초구", SEONGDONG: "성동구",
        SEONGBUK: "성북구", SONGPA: "송파구", YANGCHEON: "양천구", YEONGDEUNGPO: "영등포구",
        YONGSAN: "용산구", EUNPYEONG: "은평구", JONGNO: "종로구"
    };

    const animalTypeMap = {
        dog: "개",
        cat: "고양이",
        etc: "기타",
        null: null
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
        const loadActivityDetail = async () => {
            try {
                if (!matchId) throw new Error("유효한 matchId가 없습니다.");
                const data = await fetchApplyingDetail(matchId);
                setActivityDetail(data);
            } catch (err) {
                console.error("Failed to fetch activity detail:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadActivityDetail();
    }, [matchId]);

    const handleCancelRequest = async () => {
        try {
            if (!matchId) {
                alert("유효한 matchId가 없습니다.");
                return;
            }
            await cancelMatching(matchId);
            alert("취소 요청이 완료되었습니다.");
            navigate("/helpcenter");
        } catch (err) {
            console.error("Failed to cancel matching:", err);
            alert("취소 요청에 실패했습니다. 다시 시도해주세요.");
        }
    };

    if (loading || error || !activityDetail) return null;

    const koreanDistrict = districtMap[userAddress.district] || userAddress.district;
    const koreanAnimalType = animalTypeMap[activityDetail.animalType] || null;

    const isMatched = !!activityDetail.matchedUserInfo?.volunteerName;

    console.log("상세 매칭 데이터:", activityDetail);

    return (
        <div className={styles.container}>
            <Topbar title="신청 상세 내역" />

            <MatchCard
                id={activityDetail.id}
                name={isMatched ? activityDetail.matchedUserInfo.volunteerName : null}
                date={formatDate(activityDetail.startTime)}
                time={formatTime(activityDetail.startTime)}
                tags={isMatched ? [activityDetail.type, koreanDistrict] : []}
                icon={
                    isMatched
                        ? (activityDetail.type === "EDUCATION" ? "/education.svg"
                            : activityDetail.type === "HOUSING" ? "/housing.svg"
                            : activityDetail.type === "CULTURE" ? "/culture.svg"
                            : "/medical.svg")
                        : "/cancel-icon.svg"
                }
            />

            {isMatched && (
                <>
                    <div className={styles.address}>
                        <p>{`서울특별시 ${koreanDistrict}`}</p>
                        <p>{userAddress.detail || "상세 주소 정보 없음"}</p>
                    </div>

                    <div className={styles.section}>
                        <h3 className={styles.label}>반려동물 여부</h3>
                        <p>{koreanAnimalType || "없음"}</p>
                    </div>

                    <div className={styles.section}>
                        <h3 className={styles.label}>추가 요청사항</h3>
                        <p className={styles.requestText}>{activityDetail.addDescription || "요청사항 없음"}</p>
                    </div>
                </>
            )}

            <button className={styles.cancelBtn} onClick={handleCancelRequest}>
                취소요청
            </button>
        </div>
    );
}
