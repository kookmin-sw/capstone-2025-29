import React, { useEffect, useState } from "react";
import styles from "./ApplyingList.module.css";
import Topbar from "../../components/Topbar";
import MatchCard from "../../components/MatchCard";
import { useNavigate } from "react-router-dom";
import { fetchApplyingList } from "../../api/UserApi"; // API 호출 함수 가져오기

export default function ApplyingList() {
    const navigate = useNavigate();
    const [matchData, setMatchData] = useState([]); // 신청 내역 데이터 상태
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태

    // 신청 내역 데이터 로드
    useEffect(() => {
        const loadApplyingList = async () => {
            try {
                const data = await fetchApplyingList(); // API 호출
                const formattedData = data.map((item) => ({
                    id: item.id,
                    name: item.volunteerName,
                    date: new Date(item.time).toLocaleDateString(),
                    time: new Date(item.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    tags: [item.type, item.districtType],
                    icon: item.type === "HEALTH" ? "/medical.svg" : "/housing.svg",
                    timestamp: new Date(item.time).getTime(),
                }));

                const now = Date.now();
                const sortedData = formattedData
                    .filter((item) => item.timestamp >= now) // 현재 날짜보다 이전 날짜 필터링
                    .sort((a, b) => Math.abs(a.timestamp - now) - Math.abs(b.timestamp - now));

                setMatchData(sortedData);
                setLoading(false);
            } catch (err) {
                console.error("Failed to load applying list:", err);
                setError(err.message);
                setLoading(false);
            }
        };

        loadApplyingList();
    }, []); // 빈 배열로 설정

    console.log("matchData", matchData);
    return (
        <div className={styles.container}>
            <Topbar title="나의 신청내역" />
            {matchData
                .filter((match) => match.name !== null) // name이 null이 아닌 데이터만 필터링
                .map((match) => (
                    <MatchCard
                        key={match.id}
                        {...match}
                        onClick={() => navigate("/applyingdetail", { state: { matchId: match.id } })} // match.id를 state로 전달
                    />
                ))}
        </div>
    );
}
