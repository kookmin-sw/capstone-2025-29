import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Topbar from "../../components/Topbar";
import VolunteerModal from "../../components/VolunteerModal";
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

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [volunteers.length, matchingId]);

    // 카드 클릭 → 상세 모달
    const handleCardClick = (id) => {
        const volunteer = volunteers.find((v) => v.volunteerId === id);
        if (volunteer) {
            setSelectedVolunteer({
                ...volunteer,
                profileImageUrl: volunteer.profileImageUrl && volunteer.profileImageUrl.trim() !== ""
                    ? volunteer.profileImageUrl
                    : "/profile.svg"
            });
            setIsModalOpen(true);
        }
    };

    const handleSelectButtonClick = async (id) => {
        if (activeVolunteerId === id) {
            const confirmSelect = window.confirm('해당 봉사자를 선택하시겠습니까?');
            if (confirmSelect) {
                try {
                    await recommendVolunteerMatching({ volunteerId: id, matchingId });
                    isConfirmed.current = true;

                    alert("봉사자 선택이 완료되었습니다.");
                    navigate("/helpcenter");
                } catch (error) {
                    console.error("추천 봉사자 선택 실패:", error);
                    alert(error.message || "추천 봉사자 선택에 실패했습니다.");
                }
            }
        } else {
            setActiveVolunteerId(id);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

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

    const handleBottomButtonClick = async () => {
        if (volunteers.length === 0) {
            navigate("/helpcenter");
        } else {
            try {
                await requestElderlyMatching({ matchingId });
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
            <Topbar title="" handleBack={handleBack} />

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
                                : "/profile.svg";

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
                                            e.stopPropagation();
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

            <VolunteerModal isOpen={isModalOpen} onClose={handleCloseModal} volunteer={selectedVolunteer} />

            <button
                className={styles.bottomButton}
                onClick={handleBottomButtonClick}
            >
                {volunteers.length === 0 ? "매칭 기다리기" : "아니요, 괜찮습니다"}
            </button>
        </div>
    );
}
