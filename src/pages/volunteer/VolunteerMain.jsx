import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import styles from "./VolunteerMain.module.css";
import Topbar from "../../components/Topbar";
import { getUserInfo } from '../../api/VolunteerApi';
import ongi from '../../assets/ongi.svg';

// 포맷 함수들
const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return '전화번호 없음';
    const cleaned = phoneNumber.replace(/\D/g, '');
    return cleaned.length === 11
        ? `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`
        : phoneNumber;
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, '0')}월 ${String(date.getDate()).padStart(2, '0')}일`;
};

const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};


export default function VolunteerMain() {
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState(null);
    const [volunteerStatus, setVolunteerStatus] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await getUserInfo();
                console.log("유저 정보:", data);

                setUserInfo(data);
                setVolunteerStatus(data?.currentMatching?.status || null);
            } catch (error) {
                console.error("유저 정보 불러오기 실패:", error);
                if (error.status === 401) navigate('/login');
            }
        };

        fetchUserData();
    }, []);

    const handleMatchingButton = () => {
        if (volunteerStatus === 'PROGRESS') {
            navigate('/matchingdetail', { state: { matchId: userInfo.currentMatching.matchingId } });
        } else if (volunteerStatus === 'REVIEWING') {
            navigate('/writereview', { state: { currentMatching: userInfo.currentMatching } });
        } else {
            navigate('/matchinglist');
        }
    };


    return (
        <div className={styles.container}>

            {/* 상단 로고 & 아이콘 */}
            <div className={styles.topbar}>
                <button className={styles.logo}><img src={ongi} alt="Logo" /></button>
                <div className={styles.topRightButtons}>
                    <button className={styles.iconBtn} onClick={() => navigate('/edit')}><img src="/profileedit.svg" alt="Edit" /></button>
                    <button className={styles.iconBtn} onClick={() => navigate('/notification')}><img src="/alarm.svg" alt="Alarm" /></button>
                </div>
            </div>

            {/* 프로필 카드 */}
            <div className={styles.profileCard}>
                <img src={userInfo?.volunteerInfo?.profileImage || "/profile.svg"} alt="Profile" className={styles.profileImage} />
                <div className={styles.profileInfo}>
                    <div className={styles.name}>{userInfo?.volunteerInfo?.name || '이름 없음'} 님</div>
                    <div className={styles.hours}>봉사시간 <strong>{userInfo?.volunteerInfo?.volunteerHours || 0}</strong> 시간</div>
                    <div className={styles.phone}>{formatPhoneNumber(userInfo?.volunteerInfo?.phone)}</div>
                </div>
            </div>

            {/* 봉사 가능 시간 */}
            <div className={styles.section}>
                <p className={styles.sectionTitle}>나의 봉사 가능한 시간</p>
                <div className={styles.divider} />
                <div className={styles.dayTimeBox}>
                    {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map(day => {
                        const availableTime = userInfo?.availableTimes?.find(t => t.dayOfWeek === day);
                        return (
                            <div key={day} className={styles.dayItem}>
                                <div className={`${styles.dayCircle} ${availableTime ? styles.active : styles.inactive}`}>{day.slice(0, 3)}</div>
                                {availableTime && <div className={styles.timeList}>{formatTime(availableTime.time)}</div>}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 매칭 카드 */}
            {/* 매칭 카드 */}
            <div className={styles.matchCard}>
                {volunteerStatus === "PROGRESS" && (
                    <>
                        <p className={styles.matchName}>
                            <strong>{userInfo.currentMatching.otherName}</strong> 님과의 매칭
                        </p>
                        <p className={styles.matchTime}>
                            {formatDate(userInfo.currentMatching.startTime)} | {new Date(userInfo.currentMatching.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <button className={styles.reviewBtn} onClick={() => navigate('/matchingdetail', { state: { matchId: userInfo.currentMatching.matchingId } })}>
                            요청서 확인
                        </button>
                        <p className={styles.reviewInfo}>오늘의 일정! 한번 더 확인하고 방문해요!</p>
                    </>
                )}

                {volunteerStatus === "REVIEWING" && (
                    <>
                        <p className={styles.matchName}>
                            <strong>{userInfo.currentMatching.otherName}</strong> 님과의 매칭
                        </p>
                        <p className={styles.matchTime}>
                            {formatDate(userInfo.currentMatching.startTime)} | {new Date(userInfo.currentMatching.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <button className={styles.reviewBtn} onClick={() => navigate('/writereview', { state: { currentMatching: userInfo.currentMatching } })}>
                            후기 작성
                        </button>
                        <p className={styles.reviewInfo}>후기를 남겨주세요!</p>
                    </>
                )}

                {volunteerStatus === "COMPLETED" && (
                    <>
                        <p className={styles.matchName}>오늘 봉사가 완료됐습니다.</p>
                        <button className={styles.reviewBtn} onClick={() => navigate("/completereview")}>
                            후기 확인
                        </button>
                        <p className={styles.reviewInfo}>오늘의 일정은 더이상 없습니다.</p>
                    </>
                )}

                {volunteerStatus === "NOT_MATCHING" && (
                    <>
                        <p className={styles.matchName}>매칭 진행중입니다</p>
                        <button className={styles.reviewBtn} onClick={() => navigate("/matchinglist")}>
                            매칭내역
                        </button>
                        <p className={styles.reviewInfo}>
                            {formatDate(userInfo.currentMatching.startTime)} 봉사 신청
                        </p>
                    </>
                )}

                {volunteerStatus === null && (
                    <>
                        <p className={styles.matchName}>오늘의 일정이 없습니다.</p>
                        <button className={styles.reviewBtn} onClick={() => navigate("/matchinglist")}>
                            매칭내역
                        </button>
                        <p className={styles.reviewInfo}>매칭내역을 확인해주세요.</p>
                    </>
                )}
            </div>

            {/* 하단 네비게이션 */}
            <div className={styles.bottomNav}>
                <div className={styles.navBox} onClick={() => navigate('/availableTime')}>
                    <img src="/clock.svg" alt="My Schedule" /><span>나의 일정</span>
                </div>
                <div className={styles.navBox} onClick={() => navigate('/matchinglist')}>
                    <img src="/check.svg" alt="Matching History" /><span>매칭내역</span>
                </div>
                <div className={styles.navBox} onClick={() => navigate('/completereview')}>
                    <img src="/note.svg" alt="Completed Reviews" /><span>완료/후기</span>
                </div>
            </div>
        </div>
    );
}
