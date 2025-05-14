import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RequestForm.module.css";
import Topbar from "../../components/Topbar";
import MatchCard from "../../components/MatchCard";
import { requestElderlyMatching, fetchRecommendedVolunteers } from "../../api/UserApi";
/**
 * 도움 요청 폼 컴포넌트
 * 4단계로 구성된 폼을 통해 사용자의 도움 요청 정보를 수집
 */
export default function RequestForm() {
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState('');
    const [currentTime, setCurrentTime] = useState('');
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태

    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();

            // 날짜 형식: YYYY년 MM월 DD일
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            setCurrentDate(`${year}년 ${month}월 ${day}일`);

            // 시간 형식: HH:MM
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            setCurrentTime(`${hours}:${minutes}`);
        };

        // 초기 실행
        updateDateTime();

        // 1분마다 업데이트
        const interval = setInterval(updateDateTime, 60000);

        return () => clearInterval(interval);
    }, []);

    // 현재 단계와 폼 데이터 상태 관리
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        category: "",      // 도움 유형 (의료, 주거, 문화, 교육)
        date: "",          // 요청 날짜
        time: "",          // 요청 시간
        pet: ["없음"],     // 반려동물 정보 (기본값으로 '없음' 선택)
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
            setFormData(prev => ({
                ...prev,
                pet: [value] // 다중 선택 대신 선택한 값만 배열로 유지
            }));
        } else {
            setFormData(prev => ({ ...prev, [key]: value }));
        }
    };

    /**
     * 폼 제출 핸들러
     * - 최종 데이터를 콘솔에 출력
     * - 완료 알림 후 도움센터 페이지로 이동
     */
    const handleSubmit = async () => {
        // formData를 API에 맞게 변환
        const requestBody = {
            volunteerType: formData.category === "의료" ? "HEALTH"
                : formData.category === "주거" ? "HOUSING"
                    : formData.category === "문화" ? "CULTURE"
                        : formData.category === "교육" ? "EDUCATION"
                            : "",
            addDescription: formData.requestText || "추가 요청사항 없음",
            startTime: formData.date && formData.time
                ? `${formData.date}T${formData.time}:00`
                : "",
            animalType: formData.pet.includes("개") ? "dog"
                : formData.pet.includes("고양이") ? "cat"
                    : formData.pet.includes("기타") ? "etc"
                        : "none",
            address: {
                district: "GANGNAM", // 실제 주소 데이터로 교체 필요
                detail: "역삼동 123-45", // 실제 주소 데이터로 교체 필요
            }
        };
        // 시간 유효성 검사
        if (requestBody.startTime) {
            const now = new Date();
            const selected = new Date(requestBody.startTime);
            if (selected <= now) {
                alert("현재 시각 이후의 시간만 선택할 수 있습니다.");
                return;
            }
        }
        try {
            setIsLoading(true); // 로딩 시작
            const recommendedVolunteers = await fetchRecommendedVolunteers(requestBody); // 추천 봉사자 데이터 가져오기
            setIsLoading(false); // 로딩 종료

            console.log("추천 봉사자 데이터:", recommendedVolunteers);

            alert("신청서가 제출되었습니다.");
            navigate("/volunteerRecommend", { state: { volunteersData: recommendedVolunteers } }); // 데이터와 함께 페이지 이동
        } catch (error) {
            setIsLoading(false); // 로딩 종료
            console.error("신청 에러 상세:", error);
            if (error.message) {
                alert(error.message);
            }
            if (error.status) {
                console.error("에러 상태코드:", error.status);
            }
        }
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
                            { id: "medical", label: "의료", icon: formData.category === "의료" ? "/medical-purple.svg" : "/medical.svg" },
                            { id: "housing", label: "주거", icon: formData.category === "주거" ? "/housing-purple.svg" : "/housing.svg" },
                            { id: "culture", label: "문화", icon: formData.category === "문화" ? "/culture-purple.svg" : "/culture.svg" },
                            { id: "education", label: "교육", icon: formData.category === "교육" ? "/education-purple.svg" : "/education.svg" }
                        ].map((category) => (
                            <button
                                key={category.id}
                                className={`${styles.categoryBtn} ${formData.category === category.label ? styles.active : ""}`}
                                onClick={() => handleChange("category", category.label)}
                            >
                                <img src={category.icon} alt={category.label} />
                                <span>{category.label}</span>
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
                            min={new Date().toISOString().split('T')[0]}
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
                    {/* 신청자 정보 카드 */}
                    <div className={styles.card}>
                        <div className={styles.top}>
                            <img
                                src={
                                    formData.category === "의료" ? "/medical.svg" :
                                        formData.category === "주거" ? "/housing.svg" :
                                            formData.category === "문화" ? "/culture.svg" :
                                                formData.category === "교육" ? "/education.svg" :
                                                    "/book.svg" // fallback
                                }
                                className={styles.icon}
                                alt={formData.category}
                            />
                            <div>
                                <div className={styles.name}><strong>김춘배</strong>님의 신청</div>
                                <div className={styles.dateTime}>
                                    <span>
                                        {
                                            formData.date
                                                ? `${formData.date.slice(0, 4)}년 ${formData.date.slice(5, 7)}월 ${formData.date.slice(8, 10)}일`
                                                : ""
                                        }
                                    </span>
                                    <span className={styles.divider}>|</span>
                                    <span>{formData.time}</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.tags}>
                            {formData.category && (
                                <span className={styles.tag}>{formData.category}</span>
                            )}
                        </div>
                    </div>

                    {/* 주소 하드코딩 */}
                    <div className={styles.address}>
                        <p>서울특별시 강남구</p>
                        <p>역삼동 123-45</p>
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
                        {/* <div className={styles.tags}>
                            {tags.map((tag, idx) => (
                                <span key={idx} className={styles.tag}>{tag}</span>
                            ))}
                        </div> */}
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
