import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Topbar from "../../components/Topbar";
import MatchCard from "../../components/MatchCard";
import styles from "./MatchingDetail.module.css";
import { fetchMatchingDetail, cancelMatching } from "../../api/VolunteerApi"; // API 호출 함수 가져오기

export default function MatchingDetail() {
    const location = useLocation();
    const navigate = useNavigate();
    const { matchId } = location.state || {}; // MatchingList에서 전달된 matchId 가져오기
    const [detailData, setDetailData] = useState(null); // API 데이터 상태
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태

    useEffect(() => {
        const loadMatchingDetail = async () => {
            try {
                if (!matchId) {
                    throw new Error("유효한 matchId가 없습니다.");
                }
                const data = await fetchMatchingDetail(matchId); // API 호출
                setDetailData(data); // 데이터 저장
            } catch (err) {
                console.error("Failed to fetch matching detail:", err);
                setError(err.message); // 에러 메시지 저장
            } finally {
                setLoading(false); // 로딩 상태 해제
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
            await cancelMatching(matchId); // 취소 API 호출
            alert("취소 요청이 완료되었습니다.");
            navigate("/voluteermain"); // 취소 후 목록 페이지로 이동
        } catch (err) {
            console.error("Failed to cancel matching:", err);
            alert("취소 요청에 실패했습니다. 다시 시도해주세요.");
        }
    };

    if (loading) return <></>; // 로딩 상태일 때 처리
    if (error) return <></>
    if (!detailData) return <></>

    return (
        <div className={styles.container}>
            <Topbar title="내역상세" />

            {/* 매칭 카드 */}
            <MatchCard
                id={detailData.id}
                name={detailData.elderlyName}
                date={new Date(detailData.startTime).toLocaleDateString()}
                time={new Date(detailData.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                tags={[detailData.type, detailData.address.district]}
                icon={detailData.type === "EDUCATION" ? "/education.svg" : detailData.type === "HOUSING" ? "/housing.svg" : detailData.type === "CULTURE" ? "/culture.svg":"/medical.svg"}
            />

            {/* 주소 */}
            <div className={styles.address}>
                <p>{detailData.address.district}</p>
                <p>{detailData.address.detail}</p>
            </div>

            {/* 반려동물 여부 */}
            <div className={styles.section}>
                <h3 className={styles.label}>반려동물 여부</h3>
                <p>{detailData.animalType || "정보 없음"}</p>
            </div>

            {/* 요청사항 */}
            <div className={styles.section}>
                <h3 className={styles.label}>추가 요청사항</h3>
                <p className={styles.requestText}>{detailData.addDescription || "요청사항 없음"}</p>
            </div>

            {/* 취소하기 버튼 */}
            <button className={styles.cancelBtn} onClick={handleCancelRequest}>
                취소요청
            </button>
        </div>
    );
}
