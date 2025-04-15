import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HelpCenter.module.css";
import Topbar from "../../components/Topbar";

/* 도움센터 메인 페이지 컴포넌트 */
function HelpCenter(props) {
    // 페이지 이동을 위한 navigate 훅
    const navigate = useNavigate();

    // 매칭 정보 props (기본값 설정)
    const volunteerStatus = props.volunteerStatus || "done"; // matched: 매칭됨, done: 완료, none: 없음
    const matchName = props.matchName || "홍길동";
    const matchDate = props.matchDate || "2025년 10월 11일";
    const matchTime = props.matchTime || "14:30";


    return (
        <div className={styles.container}>
            {/* 상단 네비게이션 바 */}
            <Topbar title="도움센터" navigateTo={'/usermain'} />

            {/* 상단 액션 버튼 영역 */}
            <div className={styles.topButtons}>
                {/* 새 신청 버튼 */}
                <div onClick={() => navigate('/RequestForm')} className={`${styles.actionBtn} ${styles.squareBtn}`}>
                    <img src="/icon-plus.svg" alt="새 신청" className={styles.iconImage} />
                    <span>새 신청</span>
                </div>
                {/* 신청내역 버튼 */}
                <div onClick={() => navigate('/ApplyingList')} className={`${styles.actionBtn} ${styles.highlight} ${styles.squareBtn}`}>
                    <img src="/icon-list.svg" alt="신청내역" className={styles.iconImage} />
                    <span>신청내역</span>
                </div>
            </div>

            {/* 매칭 정보 카드 */}
            <div className={styles.matchCard}>
                {/* 매칭된 상태일 때 */}
                {volunteerStatus === "matched" && (
                    <>
                        <p className={styles.matchName}><strong>{matchName}</strong> 님과의 매칭</p>
                        <p className={styles.matchTime}>{matchDate}  |  {matchTime}</p>
                        <button className={styles.reviewBtn}>요청서 확인</button>
                        <p className={styles.reviewInfo}>오늘의 일정! 한번 더 확인하고 만나요!</p>
                    </>
                )}
                {/* 완료된 상태일 때 */}
                {volunteerStatus === "done" && (
                    <>
                        <p className={styles.matchName}><strong>{matchName}</strong> 님과의 매칭</p>
                        <p className={styles.matchTime}>{matchDate}  |  {matchTime}</p>
                        <button className={styles.reviewBtn} onClick={() => navigate("/writereview")}>완료</button>
                        <p className={styles.reviewInfo}>일정이 끝나면 완료버튼을 꼭! 눌러주세요.</p>
                    </>
                )}
                {/* 매칭이 없는 상태일 때 */}
                {volunteerStatus === "none" && (
                    <>
                        <p className={styles.matchName}>진행 중인 신청이 없습니다</p>
                        <button className={styles.reviewBtn}>신청내역</button>
                        <p className={styles.reviewInfo}>오늘의 일정은 더이상 없습니다.</p>
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
