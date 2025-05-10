import React, { useState, useEffect } from "react";
import styles from "./CompleteReview.module.css";
import Topbar from "../../components/Topbar";
import MatchCard from "../../components/MatchCard";
import { useNavigate } from "react-router-dom";
import { getCompletedReviews } from "../../api/VolunteerApi"; // API 호출 함수 가져오기

export default function CompleteReview() {
    const navigate = useNavigate();
    const [completeMatchData, setCompleteMatchData] = useState([]); // API 데이터 저장
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCompletedReviews = async () => {
            try {
                const data = await getCompletedReviews(); // API 호출
                console.log("완료된 후기 데이터:", data);

                // 날짜순으로 정렬 (가까운 날짜부터)
                const sortedData = data.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
                setCompleteMatchData(sortedData); // 정렬된 데이터를 상태에 저장
                setError(null);
            } catch (err) {
                console.error("fetchCompletedReviews 에러:", err);
                setError("후기 데이터를 불러오는 중 문제가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchCompletedReviews();
    }, []);

    const handleCardClick = (reviewId) => {
        // reviewId를 ReviewDetail로 전달
        navigate("/reviewdetail", { state: { reviewId } });
    };

    const getIconByType = (type) => {
        switch (type) {
            case "HEALTH":
                return "/medical.svg";
            case "EDUCATION":
                return "/education.svg";
            case "HOUSING":
                return "/housing.svg";
            case "CULTURE":
                return "/culture.svg";
        }
    };

    if (loading) return
    if (error) return 

    return (
        <div className={styles.container}>
            <Topbar title="완료 및 후기" />
            {completeMatchData.map((match) => (
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
                    tags={[match.type, match.districtType]} // 태그 배열 생성
                    icon={getIconByType(match.type)} // type에 따라 아이콘 설정
                    onClick={() => handleCardClick(match.reviewId)} // reviewId 전달
                />
            ))}
        </div>
    );
}
