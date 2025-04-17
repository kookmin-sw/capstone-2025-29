import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RequestForm.module.css";
import Topbar from "../../components/Topbar";
import MatchCard from "../../components/MatchCard";

/**
 * 도움 요청 폼 컴포넌트
 * 4단계로 구성된 폼을 통해 사용자의 도움 요청 정보를 수집
 */
export default function RequestForm() {
    const navigate = useNavigate();

    // 현재 단계와 폼 데이터 상태 관리
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        category: "",      // 도움 유형 (의료, 주거, 문화, 교육)
        date: "",          // 요청 날짜
        time: "",          // 요청 시간
        pet: [],           // 반려동물 정보
        requestText: "",   // 추가 요청사항
    });

    // 임시 매칭 데이터 (실제로는 서버에서 받아올 데이터)
    const mockData = {
        id: 1,
        name: "홍길동",
        date: "2025년 10월 11일",
        time: "14:30",
        tags: ['의료', "강남구"],
        icon: "/book.svg",
        address1: "서울 성북구 정릉로 77 국민대학교",
        address2: "서울 성북구 정릉동 861-1",
    };

    /**
     * 뒤로가기 버튼 핸들러
     * - 첫 단계에서는 이전 페이지로 이동
     * - 그 외 단계에서는 이전 단계로 이동
     */
    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        } else {
            navigate(-1);
        }
    };

    /**
     * 다음 단계로 이동하는 핸들러
     * - 첫 단계에서는 카테고리 선택 필수
     * - 마지막 단계에서는 이동하지 않음
     */
    const handleNext = () => {
        if (step === 1 && !formData.category) {
            alert("신청 유형을 선택해주세요.");
            return;
        }
        if (step === 4) return;

        setStep(step + 1);
    };

    /**
     * 폼 데이터 변경 핸들러
     * - 반려동물 선택은 다중 선택 가능
     * - 그 외 필드는 단일 값으로 업데이트
     */
    const handleChange = (key, value) => {
        if (key === "pet") {
            setFormData(prev => {
                const isSelected = prev.pet.includes(value);
                const newPets = isSelected
                    ? prev.pet.filter(p => p !== value)
                    : [...prev.pet, value];
                return { ...prev, pet: newPets };
            });
        } else {
            setFormData(prev => ({ ...prev, [key]: value }));
        }
    };

    /**
     * 폼 제출 핸들러
     * - 최종 데이터를 콘솔에 출력
     * - 완료 알림 후 도움센터 페이지로 이동
     */
    const handleSubmit = () => {
        const finalData = {
            ...mockData,
            pet: formData.pet,
            request: formData.requestText,
        };
        console.log("최종 제출 데이터:", finalData);
        alert("신청이 완료되었습니다!");
        navigate('/HelpCenter');
    };

    return (
        <div className={styles.container}>
            {/* 상단 네비게이션 바 */}
            <Topbar handleBack={handleBack} />

            {/* STEP 1: 도움 유형 선택 */}
            {step === 1 && (
                <div className={styles.stepBox}>
                    <p className={styles.title}>신청하실 유형을 선택해주세요</p>
                    <div className={styles.categoryGrid}>
                        {[
                            { icon: "medical", label: "의료" },
                            { icon: "housing", label: "주거" },
                            { icon: "culture", label: "문화" },
                            { icon: "education", label: "교육" }
                        ].map(({ icon, label }) => (
                            <button
                                key={icon}
                                className={`${styles.categoryBtn} ${formData.category === label ? styles.active : ""}`}
                                onClick={() => handleChange("category", label)}
                            >
                                <img src={`/${icon}.svg`} alt={label} />
                                {label}
                            </button>
                        ))}
                    </div>
                    <div className={styles.nextButton} onClick={handleNext}>
                        <img src="/nextbtn.svg" alt="다음" />
                    </div>
                </div>
            )}

            {/* STEP 2: 날짜/시간 선택 */}
            {step === 2 && (
                <div className={styles.stepBox}>
                    <div className={styles.dateTitleBox}>
                        <p>정확한 날짜와 시간을<br />입력해주세요</p>
                    </div>
                    <div className={styles.datetimeInputs}>
                        <input
                            className={styles.dateInput}
                            type="date"
                            value={formData.date}
                            onChange={(e) => handleChange("date", e.target.value)}
                        />
                        <input
                            className={styles.timeInput}
                            type="time"
                            value={formData.time}
                            onChange={(e) => handleChange("time", e.target.value)}
                        />
                    </div>
                    <div className={styles.nextButton} onClick={handleNext}>
                        <img src="/nextbtn.svg" alt="다음" />
                    </div>
                </div>
            )}

            {/* STEP 3: 반려동물 정보 및 정신건강복지센터 안내 */}
            {step === 3 && (
                <>
                    <div className={styles.section}>
                        <h3 className={styles.label}>반려동물 여부</h3>
                        <div className={styles.petOptions}>
                            {["개", "고양이", "기타", "없음"].map((option) => (
                                <button
                                    key={option}
                                    className={`${styles.petBtn} ${formData.pet.includes(option) ? styles.selected : ""}`}
                                    onClick={() => handleChange("pet", option)}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                        <div className={`${styles.nextButton} ${styles.smallNextButton}`} onClick={handleNext}>
                            <img src="/nextbtn.svg" alt="다음" />
                        </div>
                    </div>

                    {/* 정신건강복지센터 연락처 카드 */}
                    <div className={styles.cardwrapper}>
                        <div className={styles.mentalCard}>
                            <p className={styles.cardTitle}>정신건강복지센터에<br />도움을 요청할까요?</p>
                            <p className={styles.cardPhone}>02-2226-0344</p>
                            <div className={styles.phoneIconWrapper}>
                                <img src="/icon-call.svg" alt="전화기 아이콘" />
                            </div>
                            <button className={styles.callBtn}>전화연결</button>
                        </div>
                    </div>
                </>
            )}

            {/* STEP 4: 최종 확인 및 제출 */}
            {step === 4 && (
                <>
                    {/* 매칭된 봉사자 정보 표시 */}
                    <MatchCard {...mockData} />

                    {/* 봉사자 주소 정보 */}
                    <div className={styles.address}>
                        <p>{mockData.address1}</p>
                        <p>{mockData.address2}</p>
                    </div>

                    {/* 선택된 반려동물 정보 표시 */}
                    <div className={styles.section}>
                        <h3 className={styles.label}>반려동물 여부</h3>
                        <div className={styles.petOptions}>
                            {["개", "고양이", "기타", "없음"].map((option) => (
                                <div
                                    key={option}
                                    className={`${styles.petBtn} ${formData.pet.includes(option) ? styles.selected : ""}`}
                                >
                                    {option}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 추가 요청사항 입력 */}
                    <div className={styles.section}>
                        <h3 className={styles.label}>추가 요청사항</h3>
                        <textarea
                            className={styles.textarea}
                            placeholder="요청사항을 입력하세요"
                            value={formData.requestText}
                            onChange={(e) => handleChange("requestText", e.target.value)}
                        />

                        {/* 최종 제출 버튼 */}
                        <button className={styles.submitBtn} onClick={handleSubmit}>
                            제출하기
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
