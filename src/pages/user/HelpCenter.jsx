import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HelpCenter.module.css";
import Topbar from "../../components/Topbar";
import { fetchElderlyMatching, completeMatching, cancelMatching } from "../../api/UserApi";


function HelpCenter() {
    const navigate = useNavigate();

    // 상태 관리: 매칭 정보
    const [volunteerStatus, setVolunteerStatus] = useState(null); // 초기 상태를 null로 설정
    const [matchName, setMatchName] = useState("");
    const [matchDate, setMatchDate] = useState("");
    const [matchTime, setMatchTime] = useState("");
    const [matchingId, setMatchingId] = useState(null); // 매칭 ID 저장

    // 컴포넌트가 마운트될 때 API 호출
    useEffect(() => {
        const loadMatchingData = async () => {
            try {
                const data = await fetchElderlyMatching(); // API 호출

                console.log("매칭 데이터:", data); // API 응답 데이터 확인
                if (data.currentMatching) {
                    setVolunteerStatus(data.currentMatching.status); // 상태 설정
                    setMatchName(data.currentMatching.otherName);
                    setMatchingId(data.currentMatching.matchingId); // 매칭 ID 저장

                    // 날짜를 "2025년 05월 01일" 형식으로 변환
                    setMatchDate(
                        new Date(data.currentMatching.startTime).toLocaleDateString("ko-KR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })
                    );

                    setMatchTime(
                        new Date(data.currentMatching.startTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })
                    );
                } else {
                    setVolunteerStatus(null); // 매칭 데이터가 없으면 null로 설정
                }
            } catch (error) {
                console.error("Failed to load matching data:", error);
            }
        };

        loadMatchingData();
    }, []);

    // 완료 버튼 클릭 핸들러
    const handleComplete = async () => {
        if (!matchingId) return; // 매칭 ID가 없으면 실행하지 않음

        try {
            await completeMatching(matchingId); // 완료 API 호출
            alert("봉사가 완료되었습니다."); // 성공 메시지 표시
            setVolunteerStatus(null); // 상태를 초기화하여 카드 숨기기
        } catch (error) {
            console.error("Failed to complete matching:", error);
            alert("매칭 완료에 실패했습니다. 다시 시도해주세요."); // 실패 메시지 표시
        }
    };

    // 요청서 확인 버튼 클릭 핸들러
    const handleRequestForm = () => {
        if (!matchingId) return; // 매칭 ID가 없으면 실행하지 않음
        navigate("/applyingdetail", { state: { matchId: matchingId } }); // matchId를 state로 전달
    };

    // 매칭 취소 버튼 클릭 핸들러
    const handleCancel = async () => {
        if (!matchingId) return;

        try {
            await cancelMatching(matchingId);
            alert("신청이 취소되었습니다.");
            setVolunteerStatus(null);
        } catch (error) {
            console.error("Failed to cancel matching:", error);
            alert(error.message || "신청 취소에 실패했습니다.");
        }
    };



    return (
        <div className={styles.container}>
            {/* 상단 네비게이션 바 */}
            <Topbar title="도움센터" navigateTo={'/usermain'} />

            {/* 상단 액션 버튼 영역 */}
            <div className={styles.topButtons}>
                <div onClick={() => navigate('/RequestForm')} className={`${styles.actionBtn} ${styles.squareBtn}`}>
                    <img src="/icon-plus.svg" alt="새 신청" className={styles.iconImage} />
                    <span>새 신청</span>
                </div>
                <div onClick={() => navigate('/ApplyingList')} className={`${styles.actionBtn} ${styles.squareBtn}`}>
                    <img src="/icon-list.svg" alt="매칭내역" className={styles.iconImage} />
                    <span>신청내역</span>
                </div>
            </div>

            {/* 매칭 정보 카드 */}
            <div className={styles.matchCard}>
                {volunteerStatus === "NOT_STARTED" && (
                    <>
                        <p className={styles.matchName}><strong>{matchName}</strong> 님과의 매칭</p>
                        <p className={styles.matchTime}>{matchDate}  <span> | </span> {matchTime}</p>
                        <button className={styles.reviewBtn} onClick={handleRequestForm}>요청서 확인</button>
                        <p className={styles.reviewInfo}>오늘의 일정! 한번 더 확인하고 만나요!</p>
                    </>
                )}
                {volunteerStatus === "STARTED" && (
                    <>
                        <p className={styles.matchName}><strong>{matchName}</strong> 님과의 매칭</p>
                        <p className={styles.matchTime}>{matchDate}  <span> | </span>  {matchTime}</p>
                        <button className={styles.reviewBtn} onClick={handleComplete}>완료</button>
                        <p className={styles.reviewInfo}>일정이 끝나면 완료버튼을 꼭! 눌러주세요.</p>
                    </>
                )}
                {volunteerStatus === 'COMPLETED' && (
                    <>
                        <p className={styles.matchName}>오늘 봉사가 완료됐습니다.</p>
                        <button className={styles.reviewBtn} onClick={() => navigate("/ApplyingList")}>신청내역</button>
                        <p className={styles.reviewInfo}>오늘의 일정은 더이상 없습니다.</p>
                    </>
                )}
                {volunteerStatus === 'NOT_MATCHING' && (
                    <>
                        <p className={styles.matchName}>매칭 진행중입니다</p>
                        <button className={styles.reviewBtn} onClick={() => {
                            const confirmCancel = window.confirm("매칭을 취소하시겠습니까?");
                            if (confirmCancel) {
                                handleCancel(); // ✅ 반드시 함수 호출해야 합니다
                            }
                        }}>신청 취소</button>
                        <p className={styles.reviewInfo}>
                            {matchDate} 봉사 신청
                        </p>
                    </>
                )}

                {volunteerStatus === null && (
                    <>
                        <p className={styles.matchName}>오늘의 일정이 없습니다.</p>
                        <button className={styles.reviewBtn} onClick={() => navigate("/ApplyingList")}>매칭내역</button>
                        <p className={styles.reviewInfo}>매칭내역을 확인해주세요.</p>
                    </>
                )}

            </div>

            {/* 사용 방법 가이드 섹션 */}
            <div className={styles.guideSection}>
                <p className={styles.guideTitle}>어떻게 사용하나요?</p>
                <div className={styles.videoBox}>
                    <div className={styles.playIcon}>▶</div>
                    <button className={styles.guideBtn}>가이드 영상 보러가기</button>
                </div>
            </div>
        </div>
    );
}

export default HelpCenter;
