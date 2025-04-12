import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Topbar from "../../components/Topbar";
import MatchCard from "../../components/MatchCard";
import styles from "./RequestFinal.module.css";
import { useNavigate } from "react-router-dom";
export default function RequestFinal() {
    const location = useLocation();
    const navigate = useNavigate();
    const { category, date, time, pet } = location.state || {};

    // 예시 데이터 - 서버에서 받아온다고 가정
    const mockData = {
        id: 1,
        name: "홍길동",
        date: "2025년 10월 11일",
        time: "14:30",
        tags: ['의료', "강남구"],
        icon: "../public/book.svg",
        address1: "서울 성북구 정릉로 77 국민대학교",
        address2: "서울 성북구 정릉동 861-1",
    };

    const [requestText, setRequestText] = useState("");

    const handleSubmit = () => {
        const finalData = {
            ...mockData,
            pet,
            request: requestText,
        };
        console.log("최종 제출 데이터:", finalData);
        alert("신청이 완료되었습니다!");
        navigate('/HelpCenter');
    };

    return (
        <div className={styles.container}>
            <Topbar />

            {/* 매칭 카드 */}
            <MatchCard {...mockData} />

            {/* 주소 */}
            <div className={styles.address}>
                <p>{mockData.address1}</p>
                <p>{mockData.address2}</p>
            </div>

            {/* 반려동물 */}
            <div className={styles.section}>
                <h3 className={styles.label}>반려동물 여부</h3>
                <div className={styles.petOptions}>
                    {["개", "고양이", "기타", "없음"].map((option) => (
                        <div
                            key={option}
                            className={`${styles.petBtn} ${pet.includes(option) ? styles.selected : ""}`}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            </div>

            {/* 추가 요청사항 */}
            <div className={styles.section}>
                <h3 className={styles.label}>추가 요청사항</h3>
                <textarea
                    className={styles.textarea}
                    placeholder="요청사항을 입력하세요"
                    value={requestText}
                    onChange={(e) => setRequestText(e.target.value)}
                />

                {/* 제출 버튼 */}
                <button className={styles.submitBtn} onClick={handleSubmit}>
                    제출하기
                </button>
            </div>


        </div>
    );
}
