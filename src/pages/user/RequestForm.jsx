import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RequestForm.module.css";
import Topbar from "../../components/Topbar";

export default function RequestForm() {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        category: "",
        date: "",
        time: "",
        pet: [],
    });

    const handleNext = () => {
        if (step === 1 && !formData.category) {
            alert("신청 유형을 선택해주세요.");
            return;
        }
        if (step === 4) return;

        if (step === 3) {
            navigate("/requestfinal", { state: formData });
        } else {
            setStep(step + 1);
        }
    };

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

    return (
        <div className={styles.container}>
            <Topbar />

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
                                <img src={`../../public/${icon}.svg`} alt={label} />
                                {label}
                            </button>
                        ))}
                    </div>
                    <div className={styles.nextButton} onClick={handleNext}>
                        <img src="../../public/nextbtn.svg" alt="다음" />
                    </div>
                </div>
            )}

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
                        <img src="../../public/nextbtn.svg" alt="다음" />
                    </div>
                </div>
            )}

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
                            <img src="../../public/nextbtn.svg" alt="다음" />
                        </div>
                    </div>

                    <div className={styles.cardwrapper}>
                        <div className={styles.mentalCard}>
                            <p className={styles.cardTitle}>정신건강복지센터에<br />도움을 요청할까요?</p>
                            <p className={styles.cardPhone}>02-2226-0344</p>
                            <div className={styles.phoneIconWrapper}>
                                <img src="../../public/icon-call.svg" alt="전화기 아이콘" />
                            </div>
                            <button className={styles.callBtn}>전화연결</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
