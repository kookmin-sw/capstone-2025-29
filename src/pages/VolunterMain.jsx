import React from "react";
import styles from "./VolunteerMain.module.css";
import { useNavigate } from "react-router-dom";
import ongi from '../assets/ongi.svg';

export default function VolunteerMain() {
    const navigate = useNavigate();

    const volunteerStatus = "done"; // matched, done, none
    const matchName = "홍길동";
    const matchDate = "2025년 10월 11일";
    const matchTime = "14:30";

    const availableTimes = {
        Sun: ["16:00"],
        Fri: ["09:00"],
        Sat: ["10:10"]
    };

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];



    return (
        <div className={styles.container}>
            {/* 상단바: 로고 + 버튼 */}
            <div className={styles.topbar}>
                <button className={styles.logo}>
                    <img src={ongi} />
                </button>
                <div className={styles.topRightButtons}>
                    <button className={styles.iconBtn}>
                        <img src="../public/profileedit.svg" />
                    </button>
                    <button className={styles.iconBtn}>
                        <img src="../public/alarm.svg" />
                    </button>
                </div>
            </div>

            {/* 프로필 카드 */}
            <div className={styles.profileCard}>
                <img src="/profile.svg" className={styles.profileImage} />
                <div className={styles.profileInfo}>
                    <div className={styles.name}>홍길동 님</div>
                    <div className={styles.hours}>봉사시간 <strong>123</strong> 시간</div>
                    <div className={styles.phone}>010-1234-5678</div>
                </div>
            </div>

            {/* 나의 봉사 가능한 시간 */}
            <div className={styles.section}>
                <p className={styles.sectionTitle}>나의 봉사 가능한 시간</p>
                <div className={styles.divider} />
                <div className={styles.dayTimeBox}>
                    {days.map((day) => (
                        <div className={styles.dayItem} key={day}>
                            <div
                                className={`${styles.dayCircle} ${availableTimes[day] ? styles.active : styles.inactive
                                    }`}
                            >
                                {day}
                            </div>
                            <div className={styles.timeList}>
                                {availableTimes[day]?.map((time, idx) => (
                                    <span key={idx}>{time}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 매칭 정보 카드 */}
            {/* 상태에 따라 카드 분기 렌더링 */}
            <div className={styles.matchCard}>
                {volunteerStatus === "matched" && (
                    <>
                        <p className={styles.matchName}><strong>{matchName}</strong> 님과의 매칭</p>
                        <p className={styles.matchTime}>{matchDate}  |  {matchTime}</p>
                        <button className={styles.reviewBtn}>요청서 확인</button>
                        <p className={styles.reviewInfo}>오늘의 일정! 한번 더 확인하고 방문해요!</p>
                    </>
                )}

                {volunteerStatus === "done" && (
                    <>
                        <p className={styles.matchName}><strong>{matchName}</strong> 님과의 매칭</p>
                        <p className={styles.matchTime}>{matchDate}  |  {matchTime}</p>
                        <button className={styles.reviewBtn} onClick={() => { navigate("/writereview") }}>후기 작성</button>
                        <p className={styles.reviewInfo}>후기를 완료 후 1시간 내에 작성해야 봉사시간이 인정됩니다.</p>
                    </>
                )}

                {volunteerStatus === "none" && (
                    <>
                        <p className={styles.matchName}>진행 중인 신청이 없습니다</p>
                        <button className={styles.reviewBtn}>매칭내역</button>
                        <p className={styles.reviewInfo}>오늘의 일정은 더이상 없습니다.</p>
                    </>
                )}
            </div>

            {/* 하단 네비게이션 버튼 */}
            <div className={styles.bottomNav}>
                <div className={styles.navBox}>
                    <img src="../public/clock.svg" />
                    <span>나의 일정</span>
                </div>
                <div className={`${styles.navBox} ${styles.active}`}>
                    <img src="../public/check.svg" />
                    <span>매칭내역</span>
                </div>
                <div className={styles.navBox}>
                    <img src="../public/note.svg" />
                    <span>완료/후기</span>
                </div>
            </div>


        </div>
    );
}
