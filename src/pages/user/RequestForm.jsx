import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RequestForm.module.css";
import Topbar from "../../components/Topbar";
import MatchCard from "../../components/MatchCard";
import { requestElderlyMatching, fetchRecommendedVolunteers } from "../../api/UserApi";
import LoadingModal from "../../components/LoadingModal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
/**
 * 도움 요청 폼 컴포넌트
 * 4단계로 구성된 폼을 통해 사용자의 도움 요청 정보를 수집
 */
export default function RequestForm() {
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState('');
    const [currentTime, setCurrentTime] = useState('');
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태

    const userName = localStorage.getItem('userName') || "이름 없음";
    const userAddress = JSON.parse(localStorage.getItem('userAddress')) || { district: "", detail: "" };

    const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

    const districtMap = {
        GANGNAM: "강남구", GANGDONG: "강동구", GANGBUK: "강북구", GANGSEO: "강서구",
        GWANAK: "관악구", GWANGJIN: "광진구", GURO: "구로구", GEUMCHEON: "금천구",
        NOWON: "노원구", DOBONG: "도봉구", DONGDAEMUN: "동대문구", DONGJAK: "동작구",
        MAPO: "마포구", SEODAEMUN: "서대문구", SEOCHO: "서초구", SEONGDONG: "성동구",
        SEONGBUK: "성북구", SONGPA: "송파구", YANGCHEON: "양천구", YEONGDEUNGPO: "영등포구",
        YONGSAN: "용산구", EUNPYEONG: "은평구", JONGNO: "종로구"
    };


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
                district: userAddress.district || "구역 없음",
                detail: userAddress.detail || "상세 주소 없음"
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
        } finally {
            setIsLoading(false); // 로딩 종료
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
                        <p>정확한 날짜와 시간을<br />선택해주세요</p>
                    </div>

                    {/* 날짜 선택 (무조건 캘린더) */}
                    <div className={styles.selectWrapper}>
                        <DatePicker
                            locale={ko}
                            dateFormat="yyyy년 MM월 dd일"
                            selected={formData.date ? new Date(formData.date) : null}
                            minDate={new Date()}
                            onChange={(date) => {
                                const formatted = date.toISOString().split('T')[0];
                                handleChange("date", formatted);
                            }}
                            className={styles.datepickerInput}
                            popperPlacement="bottom"
                            placeholderText="날짜를 선택해주세요"
                        />
                    </div>

                    {/* 시간 선택 (option select) */}
                    <div className={styles.selectWrapper}>
                        <select
                            className={styles.customSelect}
                            value={formData.time}
                            onChange={(e) => handleChange("time", e.target.value)}
                            required
                        >
                            <option value="" disabled hidden>시간을 선택해주세요</option>
                            {Array.from({ length: 48 }, (_, i) => {
                                const hour = String(Math.floor(i / 2)).padStart(2, '0');
                                const min = i % 2 === 0 ? '00' : '30';
                                const value = `${hour}:${min}`;
                                const display = hour >= 12
                                    ? `오후 ${hour === '12' ? '12' : String(Number(hour) - 12)}:${min}`
                                    : `오전 ${Number(hour)}:${min}`;
                                return (
                                    <option key={value} value={value}>{display}</option>
                                );
                            })}
                        </select>
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
                                <div className={styles.name}><strong>{userName}</strong>님의 신청</div>
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
                            {userAddress.district && (
                                <span className={styles.tag}>{districtMap[userAddress.district]}</span>
                            )}
                        </div>

                    </div>

                    {/* 주소 */}
                    <div className={styles.address}>
                        <p>서울특별시 {districtMap[userAddress.district]}</p>
                        <p>{userAddress.detail}</p>
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
            {/* 로딩 모달 */}
            <LoadingModal isOpen={isLoading} message="매칭 중입니다..." />

        </div>
    );
}
