import React, { useState, useEffect } from "react";
import styles from "./CompleteReview.module.css";
import Topbar from "../../components/Topbar";
import MatchCard from "../../components/MatchCard";
import { useNavigate } from "react-router-dom";
import { getCompletedReviews } from "../../api/VolunteerApi";
import LoadingModal from "../../components/LoadingModal"; // 로딩 모달도 함께 적용

export default function CompleteReview() {
    const navigate = useNavigate();
    const [completeMatchData, setCompleteMatchData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCompletedReviews = async () => {
            try {
                const data = await getCompletedReviews();
                const sortedData = data.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
                setCompleteMatchData(sortedData);
            } catch (err) {
                console.error("fetchCompletedReviews 에러:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCompletedReviews();
    }, []);

    const handleCardClick = (reviewId) => {
        navigate("/reviewdetail", { state: { reviewId } });
    };

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
            <Topbar title="완료 및 후기" />
            
            {isLoading ? null : (
                completeMatchData.length === 0 ? (
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
                )
            )}

        </div>
    );
}
