import React from "react";
import styles from "./CompleteReview.module.css";
import Topbar from "../../components/Topbar";
import MatchCard from "../../components/MatchCard";
import { useNavigate } from "react-router-dom";

export default function CompleteReview() {
    const navigate = useNavigate();

    const goToWriteReview = () => {
        // 후기 작성 페이지로 이동
        navigate("/ReviewDetail");
    };

    const completeMatchData = [
        {
            id: 1,
            name: "홍길동",
            date: "2025년 10월 11일",
            time: "14:30",
            tags: ["의료", "강남구", "의료", "강남구", "의료"],
            icon: "/book.svg",
        },
        {
            id: 2,
            name: "홍길동",
            date: "2025년 10월 11일",
            time: "14:30",
            tags: ["의료", "강남구"],
            icon: "/housing.svg",
        },
        {
            id: 3,
            name: "홍길동",
            date: "2025년 10월 11일",
            time: "14:30",
            tags: ["의료", "강남구", "의료"],
            icon: "/medical.svg",
        },
    ];

    return (
        <div className={styles.container}>
            <Topbar title="완료 및 후기" />
            {completeMatchData.map((match, index) => (
                <MatchCard key={match.id}
                    {...match}
                    onClick={goToWriteReview}
                />
            ))}
        </div>
    );
}
