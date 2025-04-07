import React, { useState } from "react";
import styles from "./AvailableTime.module.css";
import Topbar from "../../components/Topbar";

export default function AvailableTime() {
    // 봉사 유형 옵션
    const volunteerTypes = [
        { id: "medical", label: "의료", icon: "../public/medical.svg" },
        { id: "culture", label: "문화", icon: "../public/culture.svg" },
        { id: "education", label: "교육", icon: "../public/education.svg" },
        { id: "housing", label: "주거", icon: "../public/housing.svg" },
    ];

    // 영어 요일 / 한국어 요일
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const korDays = ["일", "월", "화", "수", "목", "금", "토"];

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
                            <img src={type.icon} />
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
                <h3 className={styles.title}>가능한 시간 (3시간 고정)</h3>
                {selectedDays.map((day) => {
                    const kor = korDays[weekDays.indexOf(day)];
                    return (
                        <div className={styles.timeRow}>
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
                <button className={styles.submitBtn}>완료</button>
            </div>
        </div>
    );
}
