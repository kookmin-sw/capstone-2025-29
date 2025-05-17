import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Topbar from "../../components/Topbar";
import MatchCard from "../../components/MatchCard";
import styles from "./MatchingDetail.module.css";
import { fetchMatchingDetail, cancelMatching } from "../../api/VolunteerApi";

export default function MatchingDetail() {
    const location = useLocation();
    const navigate = useNavigate();
    const { matchId } = location.state || {};
    const [detailData, setDetailData] = useState(null);
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

    const animalTypeMap = {
        dog: "개",
        cat: "고양이",
        etc: "기타",
        none: "없음"
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, "0")}월 ${String(date.getDate()).padStart(2, "0")}일`;
    };

    useEffect(() => {
        const loadMatchingDetail = async () => {
            try {
                if (!matchId) throw new Error("유효한 matchId가 없습니다.");
                const data = await fetchMatchingDetail(matchId);

                console.log("Fetched matching detail:", data);
                setDetailData(data);
            } catch (err) {
                console.error("Failed to fetch matching detail:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadMatchingDetail();
    }, [matchId]);

    const handleCancelRequest = async () => {
        try {
            if (!matchId) {
                alert("유효한 matchId가 없습니다.");
                return;
            }
            await cancelMatching(matchId);
            alert("취소 요청이 완료되었습니다.");
            navigate("/volunteermain", { state: { updated: true } });
        } catch (err) {
            console.error("Failed to cancel matching:", err);
            alert("취소 요청에 실패했습니다. 다시 시도해주세요.");
        }
    };

    if (loading || error || !detailData) return null;

    const koreanDistrict = districtMap[detailData.address.district] || detailData.address.district;
    const koreanAnimalType = animalTypeMap[detailData.animalType] || "정보 없음";

    const now = new Date();
    const startTime = new Date(detailData.startTime);
    const isPastStartTime = now >= startTime;  // ✅ 현재 시간이 시작 시간 이후인지 체크

    
    return (
        <div className={styles.container}>
            <Topbar title="내역상세" />

            <MatchCard
                id={detailData.id}
                name={detailData.elderlyName}
                date={formatDate(detailData.startTime)}
                time={startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                tags={[detailData.type, koreanDistrict]}
                icon={
                    detailData.type === "EDUCATION" ? "/education.svg" :
                        detailData.type === "HOUSING" ? "/housing.svg" :
                            detailData.type === "CULTURE" ? "/culture.svg" :
                                "/medical.svg"
                }
            />

            <div className={styles.address}>
                <p>{`서울특별시 ${koreanDistrict}`}</p>
                <p>{detailData.address.detail}</p>
            </div>

            <div className={styles.section}>
                <h3 className={styles.label}>반려동물 여부</h3>
                <p>{koreanAnimalType}</p>
            </div>

            <div className={styles.section}>
                <h3 className={styles.label}>추가 요청사항</h3>
                <p className={styles.requestText}>{detailData.addDescription || "요청사항 없음"}</p>
            </div>

            {!isPastStartTime && ( // ✅ 시간이 지나지 않았을 때만 버튼 표시
                <button className={styles.cancelBtn} onClick={handleCancelRequest}>
                    취소요청
                </button>
            )}
        </div>
    );
}
