import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Topbar from "../../components/Topbar";         // 상단 네비게이션 바
import MatchCard from "../../components/MatchCard";   // 매칭 카드 컴포넌트
import styles from "./MatchingDetail.module.css";

import {
    fetchMatchingDetail, // 매칭 상세 정보 불러오기 API
    cancelMatching        // 매칭 취소 API
} from "../../api/VolunteerApi";

export default function MatchingDetail() {
    const location = useLocation();
    const navigate = useNavigate();

    // ✅ 이전 페이지에서 전달된 matchId 추출
    const { matchId } = location.state || {};

    const [detailData, setDetailData] = useState(null);  // 상세 데이터
    const [loading, setLoading] = useState(true);        // 로딩 상태
    const [error, setError] = useState(null);            // 에러 상태

    // ✅ 영문 주소 district → 한글 변환용 맵
    const districtMap = {
        GANGNAM: "강남구", GANGDONG: "강동구", GANGBUK: "강북구", GANGSEO: "강서구",
        GWANAK: "관악구", GWANGJIN: "광진구", GURO: "구로구", GEUMCHEON: "금천구",
        NOWON: "노원구", DOBONG: "도봉구", DONGDAEMUN: "동대문구", DONGJAK: "동작구",
        MAPO: "마포구", SEODAEMUN: "서대문구", SEOCHO: "서초구", SEONGDONG: "성동구",
        SEONGBUK: "성북구", SONGPA: "송파구", YANGCHEON: "양천구", YEONGDEUNGPO: "영등포구",
        YONGSAN: "용산구", EUNPYEONG: "은평구", JONGNO: "종로구"
    };

    // ✅ 반려동물 타입 맵
    const animalTypeMap = {
        dog: "개",
        cat: "고양이",
        etc: "기타",
        none: "없음"
    };

    // ✅ 날짜 포맷 변환 함수 (yyyy년 mm월 dd일)
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, "0")}월 ${String(date.getDate()).padStart(2, "0")}일`;
    };

    // ✅ 컴포넌트 마운트 시 상세 데이터 불러오기
    useEffect(() => {
        const loadMatchingDetail = async () => {
            try {
                if (!matchId) throw new Error("유효한 matchId가 없습니다.");
                const data = await fetchMatchingDetail(matchId);  // API 호출

                console.log("Fetched matching detail:", data);
                setDetailData(data); // 상태 저장
            } catch (err) {
                console.error("Failed to fetch matching detail:", err);
                setError(err.message); // 에러 저장
            } finally {
                setLoading(false); // 로딩 완료
            }
        };

        loadMatchingDetail();
    }, [matchId]);

    // ✅ 매칭 취소 버튼 클릭 핸들러
    const handleCancelRequest = async () => {
        if (!matchId) {
            alert("유효한 matchId가 없습니다.");
            return;
        }

        const confirmed = window.confirm("신청 취소하시겠습니까?");
        if (!confirmed) return; // 사용자 취소

        try {
            await cancelMatching(matchId); // API 호출
            alert("취소 요청이 완료되었습니다.");
            navigate("/volunteermain", { state: { updated: true } }); // 메인으로 이동
        } catch (err) {
            console.error("Failed to cancel matching:", err);
            alert("취소 요청에 실패했습니다. 다시 시도해주세요.");
        }
    };

    // ✅ 데이터 로딩 중이거나 에러거나 데이터 없으면 렌더링 안함
    if (loading || error || !detailData) return null;

    // ✅ 한글 변환 및 상태 판단
    const koreanDistrict = districtMap[detailData.address.district] || detailData.address.district;
    const koreanAnimalType = animalTypeMap[detailData.animalType] || "정보 없음";

    const now = new Date();
    const startTime = new Date(detailData.startTime);
    const isPastStartTime = now >= startTime;  // 현재 시간이 시작 시간 이후인지 확인

    return (
        <div className={styles.container}>
            {/* ✅ 상단바 */}
            <Topbar title="내역상세" />

            {/* ✅ 매칭 카드 */}
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

            {/* ✅ 주소 표시 */}
            <div className={styles.address}>
                <p>{`서울특별시 ${koreanDistrict}`}</p>
                <p>{detailData.address.detail}</p>
            </div>

            {/* ✅ 반려동물 정보 */}
            <div className={styles.section}>
                <h3 className={styles.label}>반려동물 여부</h3>
                <p>{koreanAnimalType}</p>
            </div>

            {/* ✅ 추가 요청사항 */}
            <div className={styles.section}>
                <h3 className={styles.label}>추가 요청사항</h3>
                <p className={styles.requestText}>{detailData.addDescription || "요청사항 없음"}</p>
            </div>

            {/* ✅ 매칭 시작 시간이 지나지 않았을 경우에만 취소 버튼 표시 */}
            {!isPastStartTime && (
                <button className={styles.cancelBtn} onClick={handleCancelRequest}>
                    취소요청
                </button>
            )}
        </div>
    );
}
