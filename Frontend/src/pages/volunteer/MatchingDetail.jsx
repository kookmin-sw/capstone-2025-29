import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
<<<<<<< HEAD
import Topbar from "../../components/Topbar";
import MatchCard from "../../components/MatchCard";
import styles from "./MatchingDetail.module.css";
import { fetchMatchingDetail, cancelMatching } from "../../api/VolunteerApi";
=======

import Topbar from "../../components/Topbar";         // 상단 네비게이션 바
import MatchCard from "../../components/MatchCard";   // 매칭 카드 컴포넌트
import styles from "./MatchingDetail.module.css";

import {
    fetchMatchingDetail, // 매칭 상세 정보 불러오기 API
    cancelMatching        // 매칭 취소 API
} from "../../api/VolunteerApi";
>>>>>>> main

export default function MatchingDetail() {
    const location = useLocation();
    const navigate = useNavigate();
<<<<<<< HEAD
    const { matchId } = location.state || {};
    const [detailData, setDetailData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

=======

    // ✅ 이전 페이지에서 전달된 matchId 추출
    const { matchId } = location.state || {};

    const [detailData, setDetailData] = useState(null);  // 상세 데이터
    const [loading, setLoading] = useState(true);        // 로딩 상태
    const [error, setError] = useState(null);            // 에러 상태

    // ✅ 영문 주소 district → 한글 변환용 맵
>>>>>>> main
    const districtMap = {
        GANGNAM: "강남구", GANGDONG: "강동구", GANGBUK: "강북구", GANGSEO: "강서구",
        GWANAK: "관악구", GWANGJIN: "광진구", GURO: "구로구", GEUMCHEON: "금천구",
        NOWON: "노원구", DOBONG: "도봉구", DONGDAEMUN: "동대문구", DONGJAK: "동작구",
        MAPO: "마포구", SEODAEMUN: "서대문구", SEOCHO: "서초구", SEONGDONG: "성동구",
        SEONGBUK: "성북구", SONGPA: "송파구", YANGCHEON: "양천구", YEONGDEUNGPO: "영등포구",
        YONGSAN: "용산구", EUNPYEONG: "은평구", JONGNO: "종로구"
    };

<<<<<<< HEAD
=======
    // ✅ 반려동물 타입 맵
>>>>>>> main
    const animalTypeMap = {
        dog: "개",
        cat: "고양이",
        etc: "기타",
        none: "없음"
    };

<<<<<<< HEAD
=======
    // ✅ 날짜 포맷 변환 함수 (yyyy년 mm월 dd일)
>>>>>>> main
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, "0")}월 ${String(date.getDate()).padStart(2, "0")}일`;
    };

<<<<<<< HEAD
=======
    // ✅ 컴포넌트 마운트 시 상세 데이터 불러오기
>>>>>>> main
    useEffect(() => {
        const loadMatchingDetail = async () => {
            try {
                if (!matchId) throw new Error("유효한 matchId가 없습니다.");
<<<<<<< HEAD
                const data = await fetchMatchingDetail(matchId);
                setDetailData(data);
            } catch (err) {
                console.error("Failed to fetch matching detail:", err);
                setError(err.message);
            } finally {
                setLoading(false);
=======
                const data = await fetchMatchingDetail(matchId);  // API 호출

                console.log("Fetched matching detail:", data);
                setDetailData(data); // 상태 저장
            } catch (err) {
                console.error("Failed to fetch matching detail:", err);
                setError(err.message); // 에러 저장
            } finally {
                setLoading(false); // 로딩 완료
>>>>>>> main
            }
        };

        loadMatchingDetail();
    }, [matchId]);

<<<<<<< HEAD
    const handleCancelRequest = async () => {
        try {
            if (!matchId) {
                alert("유효한 matchId가 없습니다.");
                return;
            }
            await cancelMatching(matchId);
            alert("취소 요청이 완료되었습니다.");
            navigate("/volunteermain");
=======
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
>>>>>>> main
        } catch (err) {
            console.error("Failed to cancel matching:", err);
            alert("취소 요청에 실패했습니다. 다시 시도해주세요.");
        }
    };

<<<<<<< HEAD
    if (loading || error || !detailData) return null;

=======
    // ✅ 데이터 로딩 중이거나 에러거나 데이터 없으면 렌더링 안함
    if (loading || error || !detailData) return null;

    // ✅ 한글 변환 및 상태 판단
>>>>>>> main
    const koreanDistrict = districtMap[detailData.address.district] || detailData.address.district;
    const koreanAnimalType = animalTypeMap[detailData.animalType] || "정보 없음";

    const now = new Date();
    const startTime = new Date(detailData.startTime);
<<<<<<< HEAD
    const isPastStartTime = now >= startTime;  // ✅ 현재 시간이 시작 시간 이후인지 체크



    return (
        <div className={styles.container}>
            <Topbar title="내역상세" />

=======
    const isPastStartTime = now >= startTime;  // 현재 시간이 시작 시간 이후인지 확인

    return (
        <div className={styles.container}>
            {/* ✅ 상단바 */}
            <Topbar title="내역상세" />

            {/* ✅ 매칭 카드 */}
>>>>>>> main
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

<<<<<<< HEAD
=======
            {/* ✅ 주소 표시 */}
>>>>>>> main
            <div className={styles.address}>
                <p>{`서울특별시 ${koreanDistrict}`}</p>
                <p>{detailData.address.detail}</p>
            </div>

<<<<<<< HEAD
=======
            {/* ✅ 반려동물 정보 */}
>>>>>>> main
            <div className={styles.section}>
                <h3 className={styles.label}>반려동물 여부</h3>
                <p>{koreanAnimalType}</p>
            </div>

<<<<<<< HEAD
=======
            {/* ✅ 추가 요청사항 */}
>>>>>>> main
            <div className={styles.section}>
                <h3 className={styles.label}>추가 요청사항</h3>
                <p className={styles.requestText}>{detailData.addDescription || "요청사항 없음"}</p>
            </div>

<<<<<<< HEAD
            {!isPastStartTime && ( // ✅ 시간이 지나지 않았을 때만 버튼 표시
=======
            {/* ✅ 매칭 시작 시간이 지나지 않았을 경우에만 취소 버튼 표시 */}
            {!isPastStartTime && (
>>>>>>> main
                <button className={styles.cancelBtn} onClick={handleCancelRequest}>
                    취소요청
                </button>
            )}
        </div>
    );
}
