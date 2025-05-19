import React, { useState, useEffect } from "react";
import styles from "./CompleteReview.module.css";
<<<<<<< HEAD
import Topbar from "../../components/Topbar";
import MatchCard from "../../components/MatchCard";
import { useNavigate } from "react-router-dom";
import { getCompletedReviews } from "../../api/VolunteerApi";

export default function CompleteReview() {
    const navigate = useNavigate();
    const [completeMatchData, setCompleteMatchData] = useState([]);

    useEffect(() => {
        const fetchCompletedReviews = async () => {
            try {
                const data = await getCompletedReviews();
                console.log("완료된 후기 데이터:", data);

                const sortedData = data.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

                setCompleteMatchData(sortedData);
            } catch (err) {
                console.error("fetchCompletedReviews 에러:", err);
=======

import Topbar from "../../components/Topbar";              // 상단바 컴포넌트
import MatchCard from "../../components/MatchCard";        // 봉사 매칭 카드 컴포넌트
import { useNavigate } from "react-router-dom";            // 페이지 이동 훅
import { getCompletedReviews } from "../../api/VolunteerApi"; // 완료된 후기 데이터 가져오는 API
import LoadingModal from "../../components/LoadingModal";  // 로딩 중 표시 컴포넌트 (미사용 상태)

export default function CompleteReview() {
    const navigate = useNavigate();

    // ✅ 상태 정의
    const [completeMatchData, setCompleteMatchData] = useState([]); // 후기 포함된 완료된 매칭 리스트
    const [isLoading, setIsLoading] = useState(true);               // 로딩 상태 표시 여부

    // ✅ 컴포넌트 마운트 시 완료된 후기 데이터 불러오기
    useEffect(() => {
        const fetchCompletedReviews = async () => {
            try {
                const data = await getCompletedReviews(); // 서버에서 데이터 가져오기
                const sortedData = data.sort(
                    (a, b) => new Date(b.startTime) - new Date(a.startTime)
                ); // 시작시간 기준 내림차순 정렬
                setCompleteMatchData(sortedData); // 상태에 저장
            } catch (err) {
                console.error("fetchCompletedReviews 에러:", err);
            } finally {
                setIsLoading(false); // 로딩 완료
>>>>>>> main
            }
        };

        fetchCompletedReviews();
    }, []);

<<<<<<< HEAD
=======
    // ✅ 카드 클릭 시 리뷰 상세 페이지로 이동
>>>>>>> main
    const handleCardClick = (reviewId) => {
        navigate("/reviewdetail", { state: { reviewId } });
    };

<<<<<<< HEAD
=======
    // ✅ 매칭 유형에 따라 아이콘 경로 반환
>>>>>>> main
    const getIconByType = (type) => {
        switch (type) {
            case "HEALTH": return "/medical.svg";
            case "EDUCATION": return "/education.svg";
            case "HOUSING": return "/housing.svg";
            case "CULTURE": return "/culture.svg";
            default: return "/default.svg";
        }
    };

    return (
        <div className={styles.container}>
<<<<<<< HEAD
            <Topbar title="완료 및 후기" />
            {completeMatchData.length === 0 ? (
                <div className={styles.noData}>후기가 없습니다</div>
            ) : (
                completeMatchData.map((match) => (
                    <MatchCard
                        key={match.reviewId}
                        id={match.reviewId}
                        name={match.elderlyName}
                        date={new Date(match.startTime).toLocaleDateString("ko-KR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                        time={new Date(match.startTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                        tags={[match.type, match.districtType]}
                        icon={getIconByType(match.type)}
                        onClick={() => handleCardClick(match.reviewId)}
                    />
                ))
=======
            {/* ✅ 상단바 */}
            <Topbar title="완료 및 후기" />

            {/* ✅ 로딩 중일 때는 아무것도 안 보여줌 (필요하면 LoadingModal 대체 가능) */}
            {(
                completeMatchData.length === 0 ? (
                    <div className={styles.noData}>후기가 없습니다</div> // ✅ 데이터 없을 때 메시지
                ) : (
                    // ✅ 후기가 있을 경우 리스트 렌더링
                    completeMatchData.map((match) => (
                        <MatchCard
                            key={match.reviewId} // 고유 키
                            id={match.reviewId} // 리뷰 ID
                            name={match.elderlyName} // 어르신 이름
                            date={new Date(match.startTime).toLocaleDateString("ko-KR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })} // 날짜 형식: YYYY년 MM월 DD일
                            time={new Date(match.startTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })} // 시간 형식: HH:MM
                            tags={[match.type, match.districtType]} // 매칭 유형, 지역 태그
                            icon={getIconByType(match.type)}        // 유형에 따른 아이콘
                            onClick={() => handleCardClick(match.reviewId)} // 클릭 시 상세 페이지로 이동
                        />
                    ))
                )
>>>>>>> main
            )}
        </div>
    );
}
