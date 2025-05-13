import React, { useState } from "react";
import styles from "./AvailableTime.module.css";
import Topbar from "../../components/Topbar";
import { useNavigate } from "react-router-dom";
import { setAvailableTimes } from '../../api/VolunteerApi';

export default function AvailableTime() {
    const navigate = useNavigate();

    // 봉사 유형 옵션
    const volunteerTypes = [
        {
            id: "medical",
            label: "의료",
            icon: "/medical.svg",
            selectedIcon: "/medical-purple.svg"
        },
        {
            id: "culture",
            label: "문화",
            icon: "/culture.svg",
            selectedIcon: "/culture-purple.svg"
        },
        {
            id: "education",
            label: "교육",
            icon: "/education.svg",
            selectedIcon: "/education-purple.svg"
        },
        {
            id: "housing",
            label: "주거",
            icon: "/housing.svg",
            selectedIcon: "/housing-purple.svg"
        },
    ];

    // 영어 요일 / 한국어 요일
    const weekDays = [ "Mon", "Tue", "Wed", "Thu", "Fri", "Sat","Sun"];
    const korDays = [ "Mon", "Tue", "Wed", "Thu", "Fri", "Sat","Sun"];

    // 선택된 봉사 유형
    const [selectedTypes, setSelectedTypes] = useState([]);
    // 선택된 요일
    const [selectedDays, setSelectedDays] = useState([]);
    // 요일별 가능한 시간
    const [timeRanges, setTimeRanges] = useState({});

    // 봉사유형 선택/해제
    const toggleType = (id) => {
        setSelectedTypes((prev) =>
            prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
        );
    };

    // 요일 선택/해제
    const toggleDay = (day) => {
        setSelectedDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };

    // 시간 변경 핸들러 (시작 또는 종료 시간)
    const handleTimeChange = (day, field, value) => {
        setTimeRanges((prev) => ({
            ...prev,
            [day]: {
                ...prev[day],
                [field]: value,
            },
        }));
    };

    // 완료 버튼 클릭 시 실행
    const handleSubmit = async () => {
        if (selectedDays.length === 0) {
            alert("요일을 선택해주세요.");
            return;
        }

        if (selectedTypes.length === 0) {
            alert("봉사 유형을 선택해주세요.");
            return;
        }

        // 선택된 요일들의 시간 정보 수집
        let schedules = [];

        for (const day of selectedDays) {
            const timeInfo = timeRanges[day];
            if (!timeInfo?.start) continue;

            const [hour, minute] = timeInfo.start.split(":").map(Number);
            const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

            // 요일 매핑
            let dayOfWeek;
            switch (day) {
                case "Mon": dayOfWeek = "MONDAY"; break;
                case "Tue": dayOfWeek = "TUESDAY"; break;
                case "Wed": dayOfWeek = "WEDNESDAY"; break;
                case "Thu": dayOfWeek = "THURSDAY"; break;
                case "Fri": dayOfWeek = "FRIDAY"; break;
                case "Sat": dayOfWeek = "SATURDAY"; break;
                case "Sun": dayOfWeek = "SUNDAY"; break;
                default: continue;
            }

            // 서버 전송용 데이터
            schedules.push({
                dayOfWeek: dayOfWeek,
                time: timeStr
            });
        }

        if (schedules.length === 0) {
            alert("시간을 선택해주세요.");
            return;
        }

        // 선택된 봉사 유형을 숫자로 변환하고 합산
        const categoryMapping = {
            medical: 1,   // 의료
            culture: 2,   // 문화
            education: 4, // 교육
            housing: 8    // 주거
        };
        const category = selectedTypes.reduce((sum, type) => sum + categoryMapping[type], 0);

        try {
            // 서버에 봉사 가능 시간 전송
            const response = await setAvailableTimes({
                schedules: schedules,
                category: category // 선택된 봉사 유형의 합산 값 전송
            });

            alert("신청이 완료되었습니다!");
            navigate('/volunteermain');
        } catch (error) {
            console.error('스케줄 설정 실패:', error);
            if (error.response?.status === 401) {
                navigate('/login');
            } else {
                alert('스케줄 설정에 실패했습니다. 다시 시도해주세요.');
            }
        }
    };

    return (
        <div className={styles.container}>
            {/* 상단 Topbar */}
            <Topbar title="나의 봉사 가능 시간 설정" />

            {/* 봉사 유형 선택 */}
            <div className={styles.section}>
                <h3 className={styles.title}>봉사 유형 선택 (중복가능)</h3>
                <div className={styles.volunteerTypeBox}>
                    {volunteerTypes.map((type) => (
                        <div
                            key={type.id}
                            className={`${styles.typeCard} ${selectedTypes.includes(type.id) ? styles.selected : ""}`}
                            onClick={() => toggleType(type.id)}
                        >
                            <img
                                src={selectedTypes.includes(type.id) ? type.selectedIcon : type.icon}
                                alt={type.label}
                                className={styles.icon}
                            />
                            <span>{type.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 요일 선택 */}
            <div className={styles.section}>
                <h3 className={styles.title}>요일 선택</h3>
                <div className={styles.dayBox}>
                    {weekDays.map((day) => (
                        <div
                            key={day}
                            className={`${styles.dayCircle} ${selectedDays.includes(day) ? styles.active : styles.inactive}`}
                            onClick={() => toggleDay(day)}
                        >
                            {day}
                        </div>
                    ))}
                </div>
            </div>

            {/* 가능한 시간 설정 */}
            <div className={styles.section}>
                <h3 className={styles.title}>가능한 시간</h3>
                {selectedDays.map((day) => {
                    const kor = korDays[weekDays.indexOf(day)];
                    return (
                        <div key={day} className={styles.timeRow}>
                            <span className={styles.dayLabel}>{kor}</span>

                            {/* 이 부분만 따로 감싸서 가운데 정렬 */}
                            <div className={styles.timeGroup}>
                                <input
                                    type="time"
                                    lang="en-GB"
                                    step="3600"
                                    value={timeRanges[day]?.start || ""}
                                    onChange={(e) => {
                                        const start = e.target.value;
                                        const [hour, minute] = start.split(":").map(Number);
                                        const endHour = (hour + 3) % 24;
                                        const end = `${endHour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
                                        handleTimeChange(day, "start", start);
                                        handleTimeChange(day, "end", end);
                                    }}
                                    className={styles.timeInput}
                                />
                                <span className={styles.tilde}>~</span>
                                <span className={styles.endDisplay}>
                                    {timeRanges[day]?.end || "--:--"}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 완료 버튼 영역 */}
            <div className={styles.submitArea}>
                <button className={styles.submitBtn} onClick={() => { handleSubmit() }}>완료</button>
            </div>
        </div>
    );
}
