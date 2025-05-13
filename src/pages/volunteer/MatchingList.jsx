import React, { useEffect, useState } from "react";
import styles from "./MatchingList.module.css";
import Topbar from "../../components/Topbar";
import MatchCard from "../../components/MatchCard";
import { useNavigate } from "react-router-dom";
import { fetchMatchingList } from "../../api/VolunteerApi"; // API 호출 함수 가져오기

// 날짜 형식 변환 함수
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, "0")}월 ${String(date.getDate()).padStart(2, "0")}일`;
};

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
                const now = Date.now(); // 현재 시간 (타임스탬프)

                const formattedData = data.map((item) => ({
                    id: item.id,
                    name: item.elderlyName,
                    date: formatDate(item.startTime), // 날짜 형식 변환
                    time: new Date(item.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    tags: [item.type, item.districtType],
                    icon: item.type === "CULTURE" ? "/culture.svg" : item.type === "HOUSING" ? "/housing.svg" : "/medical.svg",
                    timestamp: new Date(item.startTime).getTime(), // 타임스탬프 추가
                }));

                // 현재 날짜보다 이전의 데이터 필터링
                const filteredData = formattedData.filter((item) => item.timestamp >= now);

                // 현재 날짜와 가까운 순으로 정렬
                const sortedData = filteredData.sort((a, b) => Math.abs(a.timestamp - now) - Math.abs(b.timestamp - now));

                setMatchData(sortedData);
                setLoading(false);
            } catch (err) {
                console.error("Failed to load matching list:", err);
                setError(err.message);
                setLoading(false);
            }
        };

        loadMatchingList();
    }, []); // 빈 배열로 설정

    return (
        <div className={styles.container}>
            <Topbar title="매칭내역" />
            {matchData.length === 0 ? (
                <div className={styles.noData}>매칭 내역이 없습니다</div>
            ) : (
                matchData.map((match) => (
                    <MatchCard
                        key={match.id}
                        {...match}
                        onClick={() => navigate("/matchingdetail", { state: { matchId: match.id } })}
                    />
                ))
            )}
        </div>
    );
}