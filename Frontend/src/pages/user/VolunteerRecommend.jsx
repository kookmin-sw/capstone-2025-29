import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Topbar from "../../components/Topbar";
import VolunteerModal from "../../components/VolunteerModal";
<<<<<<< HEAD
import { cancelMatching, requestElderlyMatching, recommendVolunteerMatching } from "../../api/UserApi";
import styles from "./VolunteerRecommend.module.css";

export default function VolunteerRecommend() {
    const location = useLocation();
    const navigate = useNavigate();
    const volunteersData = location.state;

    const matchingId = volunteersData?.volunteersData?.matchingId;
    const volunteers = volunteersData?.volunteersData?.recommendVolunteers || [];

    const [selectedVolunteer, setSelectedVolunteer] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeVolunteerId, setActiveVolunteerId] = useState(null);

    const isConfirmed = useRef(false);

    useEffect(() => {
        const cancelMatchingKeepalive = () => {
            if (volunteers.length > 0 && matchingId && !isConfirmed.current) {
                console.log("🚨 매칭 취소 요청 (keepalive)");

                fetch(`${import.meta.env.VITE_API_URL}/api/elderly/matching/${matchingId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                        'Content-Type': 'application/json',
                    },
                    keepalive: true,
                }).then(() => {
                    console.log("✅ 매칭 취소 성공 (keepalive)");
                }).catch(err => {
                    console.error("❌ 매칭 취소 실패 (keepalive):", err);
                });
            }
        };

        const handleBeforeUnload = () => {
            cancelMatchingKeepalive();
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                cancelMatchingKeepalive();
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        document.addEventListener('visibilitychange', handleVisibilityChange);

=======
import {
    cancelMatching,
    requestElderlyMatching,
    recommendVolunteerMatching,
    cancelMatchingKeepalive
} from "../../api/UserApi";
import styles from "./VolunteerRecommend.module.css";

// ✅ 추천된 봉사자 선택 페이지
export default function VolunteerRecommend() {
    const location = useLocation(); // 이전 페이지에서 전달된 데이터 접근
    const navigate = useNavigate(); // 페이지 이동을 위한 함수

    // ✅ 추천 봉사자 및 매칭 ID 추출
    const volunteersData = location.state;
    const matchingId = volunteersData?.volunteersData?.matchingId;
    const volunteers = volunteersData?.volunteersData?.recommendVolunteers || [];

    // ✅ 선택된 봉사자 모달 상태 및 선택 상태 관리
    const [selectedVolunteer, setSelectedVolunteer] = useState(null); // 상세 모달에 표시할 봉사자 정보
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 여부
    const [activeVolunteerId, setActiveVolunteerId] = useState(null); // 현재 선택된 카드

    const isConfirmed = useRef(false); // 매칭 확정 여부 (keepalive 취소 방지용)

    // ✅ 페이지 이탈 또는 탭 비활성화 시 매칭 자동 취소 처리
    useEffect(() => {
        // 브라우저 닫기/새로고침 시
        const handleBeforeUnload = () => {
            if (volunteers.length > 0 && matchingId && !isConfirmed.current) {
                cancelMatchingKeepalive(matchingId);
            }
        };

        // 탭 전환 또는 최소화 시
        const handleVisibilityChange = () => {
            if (
                document.visibilityState === 'hidden' &&
                volunteers.length > 0 &&
                matchingId &&
                !isConfirmed.current
            ) {
                cancelMatchingKeepalive(matchingId);
            }
        };

        // 이벤트 등록
        window.addEventListener('beforeunload', handleBeforeUnload);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // 이벤트 해제 (메모리 누수 방지)
>>>>>>> main
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [volunteers.length, matchingId]);

<<<<<<< HEAD
    // 카드 클릭 → 상세 모달
=======
    // ✅ 카드 클릭 → 모달 열기
>>>>>>> main
    const handleCardClick = (id) => {
        const volunteer = volunteers.find((v) => v.volunteerId === id);
        if (volunteer) {
            setSelectedVolunteer({
                ...volunteer,
                profileImageUrl: volunteer.profileImageUrl && volunteer.profileImageUrl.trim() !== ""
                    ? volunteer.profileImageUrl
<<<<<<< HEAD
                    : "/profile.svg"
=======
                    : "/profile.svg" // 기본 이미지
>>>>>>> main
            });
            setIsModalOpen(true);
        }
    };

<<<<<<< HEAD
=======
    // ✅ 선택 버튼 클릭 → 봉사자 확정
>>>>>>> main
    const handleSelectButtonClick = async (id) => {
        if (activeVolunteerId === id) {
            const confirmSelect = window.confirm('해당 봉사자를 선택하시겠습니까?');
            if (confirmSelect) {
                try {
                    await recommendVolunteerMatching({ volunteerId: id, matchingId });
<<<<<<< HEAD
                    isConfirmed.current = true;

                    alert("봉사자 선택이 완료되었습니다.");
                    navigate("/helpcenter");
=======
                    isConfirmed.current = true; // 확정 상태 기록

                    alert("봉사자 선택이 완료되었습니다.");
                    navigate("/helpcenter"); // 센터로 이동
>>>>>>> main
                } catch (error) {
                    console.error("추천 봉사자 선택 실패:", error);
                    alert(error.message || "추천 봉사자 선택에 실패했습니다.");
                }
            }
        } else {
<<<<<<< HEAD
            setActiveVolunteerId(id);
        }
    };

=======
            setActiveVolunteerId(id); // 버튼 시각적 선택
        }
    };

    // ✅ 모달 닫기
>>>>>>> main
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

<<<<<<< HEAD
=======
    // ✅ 뒤로가기 → 매칭 취소 확인 및 실행
>>>>>>> main
    const handleBack = async () => {
        const confirmCancel = window.confirm("매칭을 취소하시겠습니까?");
        if (confirmCancel && matchingId) {
            try {
                await cancelMatching(matchingId);
                alert("매칭이 취소되었습니다.");
                navigate('/helpcenter');
            } catch (error) {
                console.error("매칭 취소 실패:", error);
                alert(error.message || "매칭 취소에 실패했습니다.");
            }
        }
    };

<<<<<<< HEAD
    const handleBottomButtonClick = async () => {
        if (volunteers.length === 0) {
            navigate("/helpcenter");
        } else {
            try {
                await requestElderlyMatching({ matchingId });
=======
    // ✅ 하단 버튼 클릭 → "괜찮습니다" 또는 "매칭 기다리기"
    const handleBottomButtonClick = async () => {
        if (volunteers.length === 0) {
            // 추천된 봉사자 없을 경우 → 매칭 대기 화면으로
            alert("매칭 진행을 계속 진행합니다.")
            navigate("/helpcenter");
        } else {
            try {
                await requestElderlyMatching({ matchingId }); // 매칭 요청
>>>>>>> main
                isConfirmed.current = true;

                alert("매칭 신청이 완료되었습니다.");
                navigate("/helpcenter");
            } catch (error) {
                console.error("매칭 신청 실패:", error);
                alert(error.message || "매칭 신청에 실패했습니다.");
            }
        }
    };

    return (
        <div className={styles.container}>
<<<<<<< HEAD
            <Topbar title="" handleBack={handleBack} />

=======
            {/* 상단 바 */}
            <Topbar title="" handleBack={handleBack} />

            {/* 봉사자 추천 결과 */}
>>>>>>> main
            {volunteers.length > 0 ? (
                <>
                    <div className={styles.titleBox}>
                        <p>요청하신 내용과</p>
                        <p>딱 맞는 봉사자를 찾았어요!</p>
                    </div>

                    <div className={styles.cardGrid}>
                        {volunteers.map((volunteer, index) => {
                            const profileImage = volunteer.profileImageUrl && volunteer.profileImageUrl.trim() !== ""
                                ? volunteer.profileImageUrl
<<<<<<< HEAD
                                : "/profile.svg";
=======
                                : "/profile.svg"; // 기본 프로필 이미지
>>>>>>> main

                            return (
                                <div
                                    key={volunteer.volunteerId || `volunteer-${index}`}
                                    className={styles.card}
                                    onClick={() => handleCardClick(volunteer.volunteerId)}
                                >
                                    <div className={styles.imageWrapper}>
                                        <img src={profileImage} alt={volunteer.name} className={styles.icon} />
                                    </div>
                                    <div className={styles.info}>
                                        <p className={styles.name}>{volunteer.name}님</p>
                                        <p className={styles.hours}>{volunteer.volunteerActivityTime}시간</p>
                                    </div>
                                    <button
                                        className={`${styles.selectButton} ${activeVolunteerId === volunteer.volunteerId ? styles.selected : ""}`}
                                        onClick={(e) => {
<<<<<<< HEAD
                                            e.stopPropagation();
=======
                                            e.stopPropagation(); // 카드 클릭 이벤트 중단
>>>>>>> main
                                            handleSelectButtonClick(volunteer.volunteerId);
                                        }}
                                    >
                                        선택
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </>
            ) : (
                <div className={styles.noVolunteers}>
                    매칭된 봉사자가 없습니다
                </div>
            )}

<<<<<<< HEAD
            <VolunteerModal isOpen={isModalOpen} onClose={handleCloseModal} volunteer={selectedVolunteer} />

=======
            {/* 봉사자 상세 모달 */}
            <VolunteerModal isOpen={isModalOpen} onClose={handleCloseModal} volunteer={selectedVolunteer} />

            {/* 하단 버튼 */}
>>>>>>> main
            <button
                className={styles.bottomButton}
                onClick={handleBottomButtonClick}
            >
                {volunteers.length === 0 ? "매칭 기다리기" : "아니요, 괜찮습니다"}
            </button>
        </div>
    );
}
