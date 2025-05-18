import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import styles from "./VolunteerMain.module.css";
import Topbar from "../../components/Topbar";
import { getUserInfo } from '../../api/VolunteerApi';
import ongi from '../../assets/ongi.svg';

// ✅ 전화번호 포맷팅 함수
const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return '전화번호 없음';
    const cleaned = phoneNumber.replace(/\D/g, '');
    return cleaned.length === 11
        ? `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`
        : phoneNumber;
};

// ✅ 날짜 포맷팅 함수
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, '0')}월 ${String(date.getDate()).padStart(2, '0')}일`;
};

// ✅ 시간 포맷팅 함수
const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};


export default function VolunteerMain() {
    const navigate = useNavigate();
    const location = useLocation();
    const { data: userInfo, isLoading, isError, refetch, isFetching } = useQuery({
        queryKey: ['userInfo'],
        queryFn: getUserInfo,
        onSuccess: (data) => {
            if (data?.currentMatching?.status !== volunteerStatus) {
                refetch(); // 상태가 바뀐 경우만 다시 가져오기
            }
        },
        staleTime: 0,
        refetchOnMount: true,
        refetchOnWindowFocus: true,

    });

    const [profileImageUrl, setProfileImageUrl] = useState("/profile.svg");

    // ✅ 뒤로가기 스와이프 방지
    useEffect(() => {
        const handleTouchStart = (e) => {
            if (e.touches[0].clientX < 30) {
                e.preventDefault();
            }
        };

        window.addEventListener('touchstart', handleTouchStart, { passive: false });

        return () => {
            window.removeEventListener('touchstart', handleTouchStart);
        };
    }, []);
    
    // ✅ 최초 로딩 시 세팅 (캐시 기반)
    useEffect(() => {
        if (userInfo?.volunteerInfo?.profileImage) {
            setProfileImageUrl(userInfo.volunteerInfo.profileImage);
        }
    }, [userInfo]);

    // ✅ Edit에서 돌아온 경우 최신 데이터 강제 refetch 후 업데이트
    useEffect(() => {
        if (location.state?.updated) {
            refetch().then((result) => {
                if (result.data?.volunteerInfo?.profileImage) {
                    setProfileImageUrl(`${result.data.volunteerInfo.profileImage}?v=${new Date().getTime()}`);
                }
            });
            // ✅ updated flag 제거 (뒤로가기 시 중복 refetch 방지)
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, refetch, navigate]);


    // ✅ 매칭 상태에 따른 버튼 핸들러
    const volunteerStatus = userInfo?.currentMatching?.status || null;

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
            {/* ✅ 상단바 (로고 & 아이콘) */}
            <div className={styles.topbar}>
                <button className={styles.logo}><img src={ongi} alt="Logo" /></button>
                <div className={styles.topRightButtons}>
                    <button className={styles.iconBtn} onClick={() => navigate('/edit', { state: { from: 'edit' } })}>
                        <img src="/profileedit.svg" alt="Edit" />
                    </button>
                    <button className={styles.iconBtn} onClick={() => navigate('/notification')}>
                        <img src="/alarm.svg" alt="Alarm" />
                    </button>
                </div>
            </div>

            {/* ✅ 프로필 카드 */}
            <div className={styles.profileCard}>
                <img src={profileImageUrl} alt="Profile" className={styles.profileImage} />
                <div className={styles.profileInfo}>
                    <div className={styles.name}>{userInfo?.volunteerInfo?.name || '이름 없음'} 님</div>
                    <div className={styles.hours}>봉사시간 <strong>{userInfo?.volunteerInfo?.volunteerHours || 0}</strong> 시간</div>
                    <div className={styles.phone}>{formatPhoneNumber(userInfo?.volunteerInfo?.phone)}</div>
                </div>
            </div>

            {/* ✅ 봉사 가능 시간 */}
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

            {/* ✅ 매칭 정보 카드 (상태별 렌더링) */}
            <div className={styles.matchCard}>
                {volunteerStatus === "PROGRESS" && (
                    <>
                        <p className={styles.matchName}><strong>{userInfo.currentMatching.otherName}</strong> 님과의 매칭</p>
                        <p className={styles.matchTime}>
                            {formatDate(userInfo.currentMatching.startTime)} | {new Date(userInfo.currentMatching.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <button className={styles.reviewBtn} onClick={handleMatchingButton}>요청서 확인</button>
                        <p className={styles.reviewInfo}>오늘의 일정! 한번 더 확인하고 방문해요!</p>
                    </>
                )}

                {volunteerStatus === "REVIEWING" && (
                    <>
                        <p className={styles.matchName}><strong>{userInfo.currentMatching.otherName}</strong> 님과의 매칭</p>
                        <p className={styles.matchTime}>
                            {formatDate(userInfo.currentMatching.startTime)} | {new Date(userInfo.currentMatching.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <button className={styles.reviewBtn} onClick={handleMatchingButton}>후기 작성</button>
                        <p className={styles.reviewInfo}>후기를 남겨주세요!</p>
                    </>
                )}

                {volunteerStatus === "COMPLETED" && (
                    <>
                        <p className={styles.matchName}>오늘 봉사가 완료됐습니다.</p>
                        <button className={styles.reviewBtn} onClick={() => navigate("/completereview")}>후기 확인</button>
                        <p className={styles.reviewInfo}>오늘의 일정은 더이상 없습니다.</p>
                    </>
                )}

                {volunteerStatus === "NOT_MATCHING" && (
                    <>
                        <p className={styles.matchName}>매칭 진행중입니다</p>
                        <button className={styles.reviewBtn} onClick={() => navigate("/matchinglist")}>매칭내역</button>
                        <p className={styles.reviewInfo}>{formatDate(userInfo.currentMatching.startTime)} 봉사 신청</p>
                    </>
                )}

                {volunteerStatus === null && (
                    <>
                        <p className={styles.matchName}>오늘의 일정이 없습니다.</p>
                        <button className={styles.reviewBtn} onClick={() => navigate("/matchinglist")}>매칭내역</button>
                        <p className={styles.reviewInfo}>매칭내역을 확인해주세요.</p>
                    </>
                )}
            </div>

            {/* ✅ 하단 네비게이션 */}
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
