import React, { useEffect, useState } from "react";
import styles from "./ApplyingList.module.css";
import Topbar from "../../components/Topbar";
import MatchCard from "../../components/MatchCard";
import { useNavigate } from "react-router-dom";
import { fetchApplyingList } from "../../api/UserApi";
import LoadingModal from "../../components/LoadingModal";
import { fi } from "date-fns/locale/fi";

export default function ApplyingList() {
    const navigate = useNavigate();
    const [matchData, setMatchData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadApplyingList = async () => {
            try {
                const data = await fetchApplyingList();
                const now = Date.now();

                const formattedData = data.map((item) => {
                    const time = new Date(item.time);
                    const isMatched = item.volunteerName !== null;

                    return {
                        id: item.id,
                        name: isMatched ? item.volunteerName : null,
                        date: time.toLocaleDateString(),
                        time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                        tags: [item.type, item.districtType],
                        icon: isMatched
                            ? (item.type === "HEALTH" ? "/medical.svg" : "/housing.svg")
                            : "/cancel-icon.svg",
                        title: isMatched ? `${item.volunteerName} 님과의 매칭` : "매칭 중 입니다.",
                        timestamp: time.getTime(),
                        isMatched: isMatched
                    };
                });

                const sortedData = formattedData
                    .filter(item => item.timestamp >= now)
                    .sort((a, b) => {
                        // 매칭된 항목을 먼저, 이후 시간 순서대로 정렬
                        if (a.isMatched !== b.isMatched) {
                            return a.isMatched ? -1 : 1;
                        }
                        return a.timestamp - b.timestamp;
                    });

                setMatchData(sortedData);
                setLoading(false);
            } catch (err) {
                console.error("Failed to load applying list:", err);
                setError(err.message);
                setLoading(false);
            } finally {
                setIsLoading(false); // 로딩 상태 종료
            }
        };

        loadApplyingList();
    }, []);

    console.log("matchData", matchData);
    return (
        <div className={styles.container}>
            <Topbar title="나의 매칭내역" />
            {loading ? (
                <p className={styles.message}>내역이 없습니다.</p>
            ) : matchData.length === 0 ? (
                <p className={styles.message}>매칭 내역이 없습니다</p>
            ) : (
                matchData.map((match) => (
                    <MatchCard
                        key={match.id}
                        {...match}
                        onClick={() => navigate("/applyingdetail", { state: { matchId: match.id } })} // match.id를 state로 전달
                    />
                ))
            )}

            <LoadingModal isLoading={isLoading} message="" />
        </div>
    );
}
