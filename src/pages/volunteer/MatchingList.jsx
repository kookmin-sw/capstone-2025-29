import React from "react";
import styles from "./MatchingList.module.css"
import Topbar from "../../components/Topbar";
import MatchCard from "../../components/MatchCard";
import { useNavigate } from "react-router-dom";

export default function MatchingList() {
    // 예시 데이터

    const navigate = useNavigate();

    const MatchingDetail = () => {
        navigate('/MatchingDetail')
    }

    const matchData = [
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
        {
            id: 4,
            name: "홍길동",
            date: "2025년 10월 11일",
            time: "14:30",
            tags: ["의료", "강남구", "의료", "강남구", "의료"],
            icon: "/book.svg",
        },
        {
            id: 5,
            name: "홍길동",
            date: "2025년 10월 11일",
            time: "14:30",
            tags: ["의료", "강남구"],
            icon: "/housing.svg",
        },
        {
            id: 6,
            name: "홍길동",
            date: "2025년 10월 11일",
            time: "14:30",
            tags: ["의료", "강남구", "의료"],
            icon: "/medical.svg",
        },
    ];

    return (
        <div className={styles.container}>
            <Topbar title="매칭내역" />
            {matchData.map((match, index) => (
                <MatchCard
                    key={match.id}
                    {...match}
                    onClick={MatchingDetail}
                />
            ))}

        </div>
    );
}
