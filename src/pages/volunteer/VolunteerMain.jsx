import React, { useState, useEffect } from 'react';
import styles from "./VolunteerMain.module.css";
import { useNavigate } from "react-router-dom";
import ongi from '../../assets/ongi.svg';
import { getUserInfo } from '../../api/VolunteerApi';

// 전화번호 포맷팅 함수
const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return '전화번호 없음';
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length !== 11) return phoneNumber;
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
};

// 시간 문자열을 시간과 분으로 파싱하는 함수
const parseTime = (timeString) => {
    if (!timeString) return { hour: 0, minute: 0 };
    const [hours, minutes] = timeString.split(':');
    return {
        hour: parseInt(hours, 10),
        minute: parseInt(minutes, 10)
    };
};

// 시간 형식 변환 함수
const formatTime = (time) => {
    if (typeof time === 'string') {
        const parsed = parseTime(time);
        return parsed;
    }
    return time;
};

export default function VolunteerMain() {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const data = await getUserInfo();
                console.log('서버 응답:', data);
                setUserInfo(data);
                setError(null);
            } catch (err) {
                setError(err);
                if (err.status === 401) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [navigate]);

    return (
        <div className={styles.container}>
            {/* 상단바: 로고 + 버튼 */}
            <div className={styles.topbar}>
                <button className={styles.logo}>
                    <img src={ongi} alt="Logo" />
                </button>
                <div className={styles.topRightButtons}>
                    <button className={styles.iconBtn} onClick={() => navigate('/edit')}>
                        <img src="/profileedit.svg" alt="Edit Profile" />
                    </button>
                    <button className={styles.iconBtn} onClick={() => navigate('/notification')}>
                        <img src="/alarm.svg" alt="Notifications" />
                    </button>
                </div>
            </div>

            {/* 프로필 카드 */}
            <div className={styles.profileCard}>
                <img 
                    src={userInfo?.volunteerInfo?.profileImage || "/profile.svg"} 
                    className={styles.profileImage} 
                    alt="Profile" 
                />
                <div className={styles.profileInfo}>
                    <div className={styles.name}>{userInfo?.volunteerInfo?.name || '이름 없음'} 님</div>
                    <div className={styles.hours}>봉사시간 <strong>{userInfo?.volunteerInfo?.volunteerHours || 0}</strong> 시간</div>
                    <div className={styles.phone}>{formatPhoneNumber(userInfo?.volunteerInfo?.phone)}</div>
                </div>
            </div>

            {/* 나의 봉사 가능한 시간 */}
            <div className={styles.section}>
                <p className={styles.sectionTitle}>나의 봉사 가능한 시간</p>
                <div className={styles.divider} />
                <div className={styles.dayTimeBox}>
                    {[
                        { id: 'MONDAY', display: 'Mon' },
                        { id: 'TUESDAY', display: 'Tue' },
                        { id: 'WEDNESDAY', display: 'Wed' },
                        { id: 'THURSDAY', display: 'Thu' },
                        { id: 'FRIDAY', display: 'Fri' },
                        { id: 'SATURDAY', display: 'Sat' },
                        { id: 'SUNDAY', display: 'Sun' }
                    ].map((day) => {
                        const availableTime = userInfo?.availableTimes?.find(
                            time => time.dayOfWeek === day.id
                        );

                        const timeInfo = availableTime ? formatTime(availableTime.time) : null;

                        return (
                            <div className={styles.dayItem} key={day.id}>
                                <div 
                                    className={`${styles.dayCircle} ${availableTime ? styles.active : styles.inactive}`}
                                >
                                    {day.display}
                                </div>
                                {timeInfo && (
                                    <div className={styles.timeList}>
                                        <span>
                                            {`${String(timeInfo.hour).padStart(2, '0')}:${String(timeInfo.minute).padStart(2, '0')}`}
                                        </span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 매칭 정보 카드 */}
            <div className={styles.matchCard}>
                {!userInfo?.currentMatching ? (
                    // 매칭이 없는 경우
                    <>
                        <p className={styles.matchName}>진행 중인 신청이 없습니다</p>
                        <button className={styles.reviewBtn} onClick={() => navigate('/matchinglist')}>
                            매칭내역
                        </button>
                        <p className={styles.reviewInfo}>오늘의 일정은 더이상 없습니다.</p>
                    </>
                ) : userInfo.currentMatching.status === 'REVIEWING' ? (
                    // 매칭 검토 중인 경우
                    <>
                        <p className={styles.matchName}>
                            <strong>{userInfo.currentMatching.otherName}</strong> 님과의 매칭
                        </p>
                        <p className={styles.matchTime}>
                            {new Date(userInfo.currentMatching.startTime).toLocaleDateString()}  |  
                            {new Date(userInfo.currentMatching.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <button 
                            className={styles.reviewBtn}
                            onClick={() => navigate('/review-request')}
                        >
                            요청서 확인
                        </button>
                        <p className={styles.reviewInfo}>
                            오늘의 일정! 한번 더 확인하고 방문해요!
                        </p>
                    </>
                ) : (
                    // 매칭이 완료된 경우
                    <>
                        <p className={styles.matchName}>
                            <strong>{userInfo.currentMatching.otherName}</strong> 님과의 매칭
                        </p>
                        <p className={styles.matchTime}>
                            {new Date(userInfo.currentMatching.startTime).toLocaleDateString()}  |  
                            {new Date(userInfo.currentMatching.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <button 
                            className={styles.reviewBtn}
                            onClick={() => navigate('/writereview')}
                        >
                            후기 작성
                        </button>
                        <p className={styles.reviewInfo}>
                            후기를 완료 후 1시간 내에 작성해야 봉사시간이 인정됩니다.
                        </p>
                    </>
                )}
            </div>

            {/* 하단 네비게이션 버튼 */}
            <div className={styles.bottomNav}>
                <div className={styles.navBox} onClick={() => navigate('/availableTime')}>
                    <img src="/clock.svg" alt="My Schedule" />
                    <span>나의 일정</span>
                </div>
                <div className={styles.navBox} onClick={() => navigate('/matchinglist')}>
                    <img src="/check.svg" alt="Matching History" />
                    <span>매칭내역</span>
                </div>
                <div className={styles.navBox} onClick={() => navigate('/completereview')}>
                    <img src="/note.svg" alt="Completed Reviews" />
                    <span>완료/후기</span>
                </div>
            </div>
        </div>
    );
}
