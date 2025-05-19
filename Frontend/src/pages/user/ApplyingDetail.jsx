// ✅ React 및 라우팅 훅 import
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// ✅ 공통 컴포넌트 및 스타일 import
import Topbar from "../../components/Topbar";
import MatchCard from "../../components/MatchCard";
import styles from "./ApplyingDetail.module.css";

// ✅ API 함수 import
import { fetchApplyingDetail, cancelMatching } from "../../api/UserApi";

export default function ApplyingDetail() {
    const location = useLocation();
    const navigate = useNavigate();
    const { matchId } = location.state || {}; // 전달받은 matchId

    const [activityDetail, setActivityDetail] = useState(null); // 상세 정보
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태

    // ✅ 사용자 주소 정보 (로컬스토리지)
    const userAddress = JSON.parse(localStorage.getItem('useraddress')) || { district: "", detail: "" };

    // ✅ 지역 코드 → 한글 변환 맵
    const districtMap = {
        GANGNAM: "강남구", GANGDONG: "강동구", GANGBUK: "강북구", GANGSEO: "강서구",
        GWANAK: "관악구", GWANGJIN: "광진구", GURO: "구로구", GEUMCHEON: "금천구",
        NOWON: "노원구", DOBONG: "도봉구", DONGDAEMUN: "동대문구", DONGJAK: "동작구",
        MAPO: "마포구", SEODAEMUN: "서대문구", SEOCHO: "서초구", SEONGDONG: "성동구",
        SEONGBUK: "성북구", SONGPA: "송파구", YANGCHEON: "양천구", YEONGDEUNGPO: "영등포구",
        YONGSAN: "용산구", EUNPYEONG: "은평구", JONGNO: "종로구"
    };

    // ✅ 반려동물 코드 → 한글 변환 맵
    const animalTypeMap = {
        dog: "개",
        cat: "고양이",
        etc: "기타"
    };

    // ✅ 전화번호 포맷 함수 (010-XXXX-XXXX 형식)
    const formatPhoneNumber = (phoneNumber) => {
        if (!phoneNumber) return '전화번호 없음';
        const cleaned = phoneNumber.replace(/\D/g, '');
        return cleaned.length === 11
            ? `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`
            : phoneNumber;
    };

    // ✅ 날짜 포맷 함수 (yyyy년 mm월 dd일)
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "----년 --월 --일";
        return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, "0")}월 ${String(date.getDate()).padStart(2, "0")}일`;
    };

    // ✅ 시간 포맷 함수 (HH:MM)
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "--:--";
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    // ✅ 상세 데이터 로딩
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

    // ✅ 취소 요청 핸들러
    const handleCancelRequest = async () => {
        if (!matchId) return alert("유효한 matchId가 없습니다.");
        if (!window.confirm("신청 취소하시겠습니까?")) return;

        try {
            await cancelMatching(matchId);
            alert("취소 요청이 완료되었습니다.");
            navigate("/helpcenter");
        } catch (err) {
            console.error("Failed to cancel matching:", err);
            alert("취소 요청에 실패했습니다. 다시 시도해주세요.");
        }
    };

    // ✅ 로딩 중 또는 에러 발생 시 렌더링 안함
    if (loading || error || !activityDetail) return null;

    // ✅ 한글 변환 및 매칭 여부
    const koreanDistrict = districtMap[userAddress.district] || userAddress.district;
    const koreanAnimalType = animalTypeMap[activityDetail.animalType] || "없음";
    const isMatched = !!activityDetail.matchedUserInfo?.volunteerName;


    console.log(activityDetail)
    return (
        <div className={styles.container}>
            <Topbar title="신청 상세 내역" />

            {/* ✅ 매칭 카드 */}
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

            {/* ✅ 매칭된 경우에만 상세 내용 표시 */}
            {isMatched && (
                <>
                    <div className={styles.address}>
                        <p>{`서울특별시 ${koreanDistrict}`}</p>
                        <p>{userAddress.detail || "상세 주소 정보 없음"}</p>
                    </div>

                    <div className={styles.section}>
                        <h3 className={styles.label}>반려동물 여부</h3>
                        <p>{koreanAnimalType}</p>
                    </div>

                    <div className={styles.section}>
                        <h3 className={styles.label}>추가 요청사항</h3>
                        <p className={styles.requestText}>{activityDetail.addDescription || "요청사항 없음"}</p>
                    </div>

                    <div className={styles.volunteerCard}>
                        <img
                            src={activityDetail.matchedUserInfo.profileImage || "/profile.svg"}
                            alt="Profile"
                            className={styles.volunteerImage}
                        />
                        <div className={styles.volunteerInfo}>
                            <div className={styles.volunteerName}>
                                {activityDetail.matchedUserInfo.volunteerName} 님
                            </div>
                            <div className={styles.volunteerHours}>
                                봉사시간 <strong>{activityDetail.matchedUserInfo.volunteerActivityTime}</strong> 시간
                            </div>
                            <div className={styles.volunteerPhone}>
                                {formatPhoneNumber(activityDetail.matchedUserInfo.phone)}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* ✅ 취소 버튼 */}
            <button className={styles.cancelBtn} onClick={handleCancelRequest}>
                취소요청
            </button>
        </div>
    );
}
