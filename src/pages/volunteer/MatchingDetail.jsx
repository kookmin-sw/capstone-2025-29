import React, { useState } from "react";
import Topbar from "../../components/Topbar";
import MatchCard from "../../components/MatchCard";
import styles from "./MatchingDetail.module.css";

export default function MatchingDetail() {
    // 임시 데이터
    const mockData = {
        id: 1,
        name: "홍길동",
        date: "2025년 10월 11일",
        time: "14:30",
        tags: ["의료", "강남구", "의료", "강남구", "의료"],
        icon: "/book.svg",
        address1: "서울 성북구 정릉로 77 국민대학교",
        address2: "서울 성북구 정릉동 861-1",
        pet: "개",
        request: "잘 부탁드립니다 편하게 와주세요!!",
    };

    const petOptions = ["개", "고양이", "기타", "없음"];

    return (
        <div className={styles.container}>
            <Topbar title="내역상세" />

            {/* 매칭 카드 */}
            <MatchCard {...mockData} />

            {/* 주소 */}
            <div className={styles.address}>
                <p>{mockData.address1}</p>
                <p>{mockData.address2}</p>
            </div>

            {/* 반려동물 여부 */}
            <div className={styles.section}>
                <h3 className={styles.label}>반려동물 여부</h3>
                <div className={styles.petOptions}>
                    {petOptions.map((option) => (
                        <div
                            key={option}
                            className={`${styles.petBtn} ${mockData.pet === option ? styles.selected : ""}`}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            </div>

            {/* 요청사항 */}
            <div className={styles.section}>
                <h3 className={styles.label}>추가 요청사항</h3>
                <p className={styles.requestText}>{mockData.request}</p>
            </div>


            {/* 취소하기 버튼 */}
            <button className={styles.cancelBtn}>
                취소요청
            </button>
        </div>
    );
}
