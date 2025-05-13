import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Topbar from "../../components/Topbar";
import VolunteerModal from "../../components/VolunteerModal";
import { cancelMatching, requestElderlyMatching } from "../../api/UserApi";
import styles from "./VolunteerRecommend.module.css";

export default function VolunteerRecommend() {
    const location = useLocation();
    const navigate = useNavigate();
    const volunteersData = location.state;

    console.log("봉사자 추천 데이터:", volunteersData);

    const matchingId = volunteersData?.volunteersData?.matchingId;
    const volunteers = volunteersData?.volunteersData?.recommendVolunteers || [];

    const [selectedVolunteer, setSelectedVolunteer] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeVolunteerId, setActiveVolunteerId] = useState(null);

    const isConfirmed = useRef(false);
    const isUnmounting = useRef(false);

    console.log(volunteers);
    // ✅ Mock 데이터
    // const volunteers = [
    //     { id: 1, name: "김철수", hours: 123, phone: "010-1234-5678", introduction: "안녕하세요. 자기소개입니다.", icon: "/volunteer-icon.svg" },
    //     { id: 2, name: "이영희", hours: 98, phone: "010-9876-5432", introduction: "안녕하세요. 자기소개입니다.", icon: "/volunteer-icon.svg" },
    //     { id: 3, name: "박민수", hours: 150, phone: "010-5678-1234", introduction: "안녕하세요. 자기소개입니다.", icon: "/volunteer-icon.svg" },
    //     { id: 4, name: "최지우", hours: 75, phone: "010-4321-8765", introduction: "안녕하세요. 자기소개입니다.", icon: "/volunteer-icon.svg" },
    // ];

    // ✅ 봉사자가 없으면 최초 진입 시 매칭 취소
    useEffect(() => {
        if (volunteers.length === 0 && matchingId) {
            cancelMatching(matchingId)
                .then(() => console.log("매칭 취소 완료 (봉사자 없음, 최초 진입시)"))
                .catch((error) => console.error("매칭 취소 실패:", error));
        }
    }, [volunteers.length, matchingId]);

    // ✅ 앱 나갈 때 매칭 취소 (확정 안 했을 경우만)
    useEffect(() => {
        return () => {
            if (isUnmounting.current) {
                if (volunteers.length > 0 && matchingId && !isConfirmed.current) {
                    cancelMatching(matchingId)
                        .then(() => console.log("매칭 취소 완료 (앱 나갈 때)"))
                        .catch((error) => console.error("매칭 취소 실패:", error));
                }
            }
        };
    }, [volunteers.length, matchingId]);

    // ✅ 진짜 언마운트 시점에만 isUnmounting = true 설정
    useEffect(() => {
        return () => {
            isUnmounting.current = true;
        };
    }, []);

    const handleCardClick = (id) => {
        const volunteer = volunteers.find((v) => v.id === id);
        setSelectedVolunteer(volunteer);
        setIsModalOpen(true);
    };

    const handleSelectButtonClick = (id) => {
        setActiveVolunteerId(id);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // ✅ '아니요, 괜찮습니다' 클릭 시 매칭 신청 API 호출
    const handleBottomButtonClick = async () => {
        if (volunteers.length === 0) {
            navigate("/helpcenter");
        } else {
            try {
                await requestElderlyMatching({ matchingId });
                console.log("매칭 신청 완료");
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
            <Topbar title="" />

            {volunteers.length > 0 ? (
                <>
                    <div className={styles.titleBox}>
                        <p>요청하신 내용과</p>
                        <p>딱 맞는 봉사자를 찾았어요!</p>
                    </div>

                    <div className={styles.cardGrid}>
                        {volunteers.map((volunteer) => (
                            <div key={volunteer.id} className={styles.card} onClick={() => handleCardClick(volunteer.id)}>
                                <div className={styles.imageWrapper}>
                                    <img src={volunteer.icon} alt={volunteer.name} className={styles.icon} />
                                </div>
                                <div className={styles.info}>
                                    <p className={styles.name}>{volunteer.name}님</p>
                                    <p className={styles.hours}>{volunteer.volunteerActivityTime}시간</p>
                                </div>
                                <button
                                    className={`${styles.selectButton} ${activeVolunteerId === volunteer.id ? styles.selected : ""}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSelectButtonClick(volunteer.id);
                                    }}
                                >
                                    선택
                                </button>
                            </div>
                        ))}
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
                {volunteers.length === 0 ? "홈으로 돌아가기" : "아니요, 괜찮습니다"}
            </button>
        </div>
    );
}
