import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Topbar from "../../components/Topbar";
import MatchCard from "../../components/MatchCard";
import styles from "./ApplyingDetail.module.css";
import { fetchApplyingDetail, cancelMatching } from "../../api/UserApi"; // API 호출 함수 가져오기

export default function ApplyingDetail() {
    const location = useLocation();
    const navigate = useNavigate();
    const { matchId } = location.state || {}; // ApplyingList에서 전달된 matchId 가져오기
    const [activityDetail, setActivityDetail] = useState(null); // API 데이터 상태
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태

    useEffect(() => {
        const loadActivityDetail = async () => {
            try {
                if (!matchId) {
                    throw new Error("유효한 데이터가 없습니다.");
                }
                const data = await fetchApplyingDetail(matchId); // API 호출

                setActivityDetail(data); // 데이터 저장
            } catch (err) {
                console.error("Failed to fetch activity detail:", err);
                setError(err.message); // 에러 메시지 저장
            } finally {
                setLoading(false); // 로딩 상태 해제
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
            await cancelMatching(matchId); // 취소 API 호출
            alert("취소 요청이 완료되었습니다.");
            navigate("/helpcenter"); // 취소 후 목록 페이지로 이동
        } catch (err) {
            console.error("Failed to cancel matching:", err);
            alert("취소 요청에 실패했습니다. 다시 시도해주세요.");
        }
    };

    if (loading) return <></>;
    if (error) return <></>;
    if (!activityDetail) <></>;

    return (
        <div className={styles.container}>
            <Topbar title="신청 상세 내역" />

            {/* 매칭 카드 컴포넌트 */}
            <MatchCard
                id={activityDetail.id}
                name={activityDetail.matchedUserInfo?.volunteerName || "정보 없음"}
                date={new Date(activityDetail.startTime).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })}
                time={new Date(activityDetail.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                })}
                tags={[activityDetail.type, activityDetail.animalType]}
                icon="/book.svg"
            />

            {/* 주소 섹션 */}
            <div className={styles.address}>
                <p>{activityDetail.address1 || "주소 정보 없음"}</p>
                <p>{activityDetail.address2 || "상세 주소 정보 없음"}</p>
            </div>

            {/* 반려동물 여부 섹션 */}
            <div className={styles.section}>
                <h3 className={styles.label}>반려동물 여부</h3>
                <p>{activityDetail.animalType || "정보 없음"}</p>
            </div>

            {/* 추가 요청사항 섹션 */}
            <div className={styles.section}>
                <h3 className={styles.label}>추가 요청사항</h3>
                <p className={styles.requestText}>{activityDetail.addDescription || "요청사항 없음"}</p>
            </div>

            {/* 취소하기 버튼 */}
            <button className={styles.cancelBtn} onClick={handleCancelRequest}>
                취소요청
            </button>
        </div>
    );
}
