import React, { useEffect, useState } from "react";
import styles from "./MatchingList.module.css";
import Topbar from "../../components/Topbar";
import MatchCard from "../../components/MatchCard";
import { useNavigate } from "react-router-dom";
import { fetchMatchingList } from "../../api/VolunteerApi"; // API 호출 함수 가져오기

export default function MatchingList() {
    const navigate = useNavigate();
    const [matchData, setMatchData] = useState([]); // 매칭 내역 데이터 상태
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태

    // 매칭 내역 데이터 로드
    useEffect(() => {
        const loadMatchingList = async () => {
            try {

                const data = await fetchMatchingList(); // API 호출
                console.log("Matching data:", data);
                const formattedData = data.map((item) => ({
                    id: item.id,
                    name: item.elderlyName,
                    date: new Date(item.startTime).toLocaleDateString(),
                    time: new Date(item.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    tags: [item.type, item.districtType],
                    icon: item.type === "CULTURE" ? "/book.svg" : item.type === "HOUSING" ? "/housing.svg" : "/medical.svg",
                }));

                setMatchData(formattedData);
                setLoading(false);
            } catch (err) {
                console.error("Failed to load matching list:", err);
                setError(err.message);
                setLoading(false);
            }
        };

        loadMatchingList();
    }, []); // 빈 배열로 설정

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>에러 발생: {error}</div>;

    return (
        <div className={styles.container}>
            <Topbar title="매칭내역" />
            {matchData.map((match) => (
                <MatchCard
                    key={match.id}
                    {...match}
                    onClick={() => navigate("/matchingdetail", { state: { matchId: match.id } })} // match.id를 state로 전달
                />
            ))}
        </div>
    );
}