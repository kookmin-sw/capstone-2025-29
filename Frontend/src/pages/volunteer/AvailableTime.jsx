import React, { useState } from "react";
import styles from "./AvailableTime.module.css";
import Topbar from "../../components/Topbar";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import { setAvailableTimes } from '../../api/VolunteerApi';
=======
import { setAvailableTimes } from '../../api/VolunteerApi'; // ⬅️ 봉사 가능 시간 설정 API
>>>>>>> main

export default function AvailableTime() {
    const navigate = useNavigate();

<<<<<<< HEAD
=======
    // ✅ 봉사 유형 정의 (id, label, 기본/선택 아이콘 포함)
>>>>>>> main
    const volunteerTypes = [
        { id: "medical", label: "의료", icon: "/medical.svg", selectedIcon: "/medical-purple.svg" },
        { id: "culture", label: "문화", icon: "/culture.svg", selectedIcon: "/culture-purple.svg" },
        { id: "education", label: "교육", icon: "/education.svg", selectedIcon: "/education-purple.svg" },
        { id: "housing", label: "주거", icon: "/housing.svg", selectedIcon: "/housing-purple.svg" },
    ];

<<<<<<< HEAD
    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const korDays = ["월", "화", "수", "목", "금", "토", "일"];

    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectedDays, setSelectedDays] = useState([]);
    const [timeRanges, setTimeRanges] = useState({});

=======
    // ✅ 요일 정의 (영문, 한글)
    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const korDays = ["월", "화", "수", "목", "금", "토", "일"];

    // ✅ 상태값
    const [selectedTypes, setSelectedTypes] = useState([]);      // 선택된 봉사 유형
    const [selectedDays, setSelectedDays] = useState([]);        // 선택된 요일
    const [timeRanges, setTimeRanges] = useState({});            // 요일별 시작/끝 시간

    // ✅ 봉사 유형 선택 토글
>>>>>>> main
    const toggleType = (id) => {
        setSelectedTypes((prev) =>
            prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
        );
    };

<<<<<<< HEAD
=======
    // ✅ 요일 선택 토글
>>>>>>> main
    const toggleDay = (day) => {
        setSelectedDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };

<<<<<<< HEAD
    const handleTimeChange = (day, startTime) => {
        const [hour, minute] = startTime.split(":").map(Number);
        const endTotalMinutes = (hour * 60 + minute + 180) % (24 * 60);
        const endHour = Math.floor(endTotalMinutes / 60);
        const endMinute = endTotalMinutes % 60;

=======
    // ✅ 시작 시간 선택 → 종료 시간 자동 계산
    const handleTimeChange = (day, startTime) => {
        const [hour, minute] = startTime.split(":").map(Number);
        const endTotalMinutes = (hour * 60 + minute + 180) % (24 * 60); // ⬅️ 종료시간: 시작 + 3시간

        const endHour = Math.floor(endTotalMinutes / 60);
        const endMinute = endTotalMinutes % 60;

        // ⬅️ 시:분 포맷 변환
>>>>>>> main
        const formattedStart = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
        const formattedEnd = `${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`;

        setTimeRanges((prev) => ({
            ...prev,
            [day]: { start: formattedStart, end: formattedEnd },
        }));
    };

<<<<<<< HEAD
=======
    // ✅ 제출 버튼 클릭
>>>>>>> main
    const handleSubmit = async () => {
        if (selectedDays.length === 0) return alert("요일을 선택해주세요.");
        if (selectedTypes.length === 0) return alert("봉사 유형을 선택해주세요.");

<<<<<<< HEAD
        const schedules = selectedDays.map((day) => {
            const timeInfo = timeRanges[day];
            if (!timeInfo?.start) return null;

=======
        // ✅ 시작 시간이 선택되지 않은 요일 필터링
        const unselectedDays = selectedDays.filter(day => !timeRanges[day]?.start);

        if (unselectedDays.length > 0) {
            const sortedUnselected = [...unselectedDays].sort((a, b) => weekDays.indexOf(a) - weekDays.indexOf(b));
            const dayNames = sortedUnselected.map(day => korDays[weekDays.indexOf(day)]).join(', ');
            return alert(`시간을 선택해주세요 (${dayNames})`);
        }

        // ✅ 요일 정렬 후 스케줄 객체로 변환
        const sortedDays = [...selectedDays].sort((a, b) => weekDays.indexOf(a) - weekDays.indexOf(b));

        const schedules = sortedDays.map((day) => {
>>>>>>> main
            const dayOfWeekMap = {
                Mon: "MONDAY", Tue: "TUESDAY", Wed: "WEDNESDAY",
                Thu: "THURSDAY", Fri: "FRIDAY", Sat: "SATURDAY", Sun: "SUNDAY"
            };
<<<<<<< HEAD

            return { dayOfWeek: dayOfWeekMap[day], time: timeInfo.start };
        }).filter(Boolean);

        if (schedules.length === 0) return alert("시간을 선택해주세요.");

        const categoryMapping = { medical: 1, culture: 2, education: 4, housing: 8 };
        const category = selectedTypes.reduce((sum, type) => sum + categoryMapping[type], 0);

        try {
            await setAvailableTimes({ schedules, category });
            alert("신청이 완료되었습니다!");
            navigate('/volunteermain');
=======
            return { dayOfWeek: dayOfWeekMap[day], time: timeRanges[day].start };
        });

        // ✅ 선택된 봉사 유형 → 비트 OR 값으로 category 변환
        const categoryMapping = { medical: 1, culture: 2, education: 4, housing: 8 };
        const category = selectedTypes.reduce((sum, type) => sum + categoryMapping[type], 0);

        // ✅ API 요청
        try {
            await setAvailableTimes({ schedules, category });
            alert("신청이 완료되었습니다!");
            navigate('/volunteermain', { state: { updated: true } }); // ⬅️ 봉사 메인으로 이동
>>>>>>> main
        } catch (error) {
            console.error('스케줄 설정 실패:', error);
            alert('스케줄 설정에 실패했습니다. 다시 시도해주세요.');
        }
    };

<<<<<<< HEAD
=======
    // ✅ 시간 옵션 (00:00 ~ 23:30, 30분 단위)
>>>>>>> main
    const timeOptions = Array.from({ length: 48 }, (_, i) => {
        const hour = Math.floor(i / 2);
        const minute = i % 2 === 0 ? "00" : "30";
        const value = `${String(hour).padStart(2, "0")}:${minute}`;
<<<<<<< HEAD
        const display = hour === 0 ? `오전 12시 ${minute}분` :
                        hour < 12 ? `오전 ${hour}시 ${minute}분` :
                        hour === 12 ? `오후 12시 ${minute}분` :
                        `오후 ${hour - 12}시 ${minute}분`;
=======

        // 한글 표기로 변환
        const display = hour === 0 ? `오전 12시 ${minute}분` :
            hour < 12 ? `오전 ${hour}시 ${minute}분` :
                hour === 12 ? `오후 12시 ${minute}분` :
                    `오후 ${hour - 12}시 ${minute}분`;

>>>>>>> main
        return { value, display };
    });

    return (
        <div className={styles.container}>
            <Topbar title="나의 봉사 가능 시간 설정" />

<<<<<<< HEAD
            <div className={styles.section}>
                <h3 className={styles.title}>봉사 유형 선택 (중복가능)</h3>
                <div className={styles.volunteerTypeBox}>
                    {volunteerTypes.map((type) => (
                        <div
                            key={type.id}
                            className={`${styles.typeCard} ${selectedTypes.includes(type.id) ? styles.selected : ""}`}
                            onClick={() => toggleType(type.id)}
                        >
                            <img src={selectedTypes.includes(type.id) ? type.selectedIcon : type.icon} alt={type.label} />
                            <span>{type.label}</span>
                        </div>
                    ))}
                </div>
            </div>

=======
            {/* ✅ 1. 봉사 유형 선택 */}
            <div className={styles.section}>
                <h3 className={styles.title}>봉사 유형 선택 (중복가능)</h3>
                <div className={styles.volunteerTypeBox}>
                    {volunteerTypes.map((type) => {
                        const isSelected = selectedTypes.includes(type.id);

                        // 캐시 무효화를 위한 version query
                        const cacheBuster = isSelected ? 'selected' : 'normal';
                        const iconSrc = isSelected
                            ? `${type.selectedIcon}?v=${cacheBuster}`
                            : `${type.icon}?v=${cacheBuster}`;

                        return (
                            <div
                                key={type.id}
                                className={`${styles.typeCard} ${isSelected ? styles.selected : ""}`}
                                onClick={() => toggleType(type.id)}
                            >
                                <img src={iconSrc} alt={type.label} />
                                <span>{type.label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ✅ 2. 요일 선택 */}
>>>>>>> main
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

<<<<<<< HEAD
            <div className={styles.section}>
                <h3 className={styles.title}>가능한 시간</h3>
                {selectedDays.map((day) => {
                    const kor = korDays[weekDays.indexOf(day)];
                    return (
                        <div key={day} className={styles.timeRow}>
                            <span className={styles.dayLabel}>{kor}</span>
                            <div className={styles.timeGroup}>
                                <select
                                    className={styles.timeSelect}
                                    value={timeRanges[day]?.start || ""}
                                    onChange={(e) => handleTimeChange(day, e.target.value)}
                                >
                                    <option value="" disabled hidden>시간 선택</option>
                                    {timeOptions.map(({ value, display }) => (
                                        <option key={value} value={value}>{display}</option>
                                    ))}
                                </select>
                                <span className={styles.tilde}>~</span>
                                <span className={styles.endDisplay}>
                                    {timeRanges[day]?.end
                                        ? (() => {
                                            const [endHour, endMinute] = timeRanges[day].end.split(":").map(Number);
                                            const formattedMinute = String(endMinute).padStart(2, '0');
                                            if (endHour === 0) return `오전 12시 ${formattedMinute}분`;
                                            if (endHour < 12) return `오전 ${endHour}시 ${formattedMinute}분`;
                                            if (endHour === 12) return `오후 12시 ${formattedMinute}분`;
                                            return `오후 ${endHour - 12}시 ${formattedMinute}분`;
                                        })()
                                        : "--:--"}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

=======
            {/* ✅ 3. 선택한 요일 별 시간 설정 */}
            <div className={styles.section}>
                <h3 className={styles.title}>가능한 시간</h3>
                {[...selectedDays]
                    .sort((a, b) => weekDays.indexOf(a) - weekDays.indexOf(b))
                    .map((day) => {
                        const kor = korDays[weekDays.indexOf(day)];
                        return (
                            <div key={day} className={styles.timeRow}>
                                <span className={styles.dayLabel}>{kor}</span>
                                <div className={styles.timeGroup}>
                                    <select
                                        className={styles.timeSelect}
                                        value={timeRanges[day]?.start || ""}
                                        onChange={(e) => handleTimeChange(day, e.target.value)}
                                    >
                                        <option value="" disabled hidden>봉사 시작 시간 </option>
                                        {timeOptions.map(({ value, display }) => (
                                            <option key={value} value={value}>{display}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        );
                    })}
            </div>

            {/* ✅ 제출 버튼 */}
>>>>>>> main
            <div className={styles.submitArea}>
                <button className={styles.submitBtn} onClick={handleSubmit}>완료</button>
            </div>
        </div>
    );
}
