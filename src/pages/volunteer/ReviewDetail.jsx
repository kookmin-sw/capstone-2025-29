import React from "react";
import Topbar from "../../components/Topbar";
import MatchCard from "../../components/MatchCard";
import styles from "./ReviewDetail.module.css";

export default function ReviewDetail() {
    const reviewData = {
        name: "홍길동",
        date: "2025년 10월 11일",
        time: "14:30",
        tags: ["의료", "강남구", "의료", "강남구", "의료"],
        icon: "../../../public/book.svg",
        images: [
            "../../../public/imgex.png",
            "../../../public/imgex.png",
            "../../../public/imgex.png"
        ],
        content: `어쩌구어쩌구어쩌구어쩌구어쩌구어쩌구
어쩌구어쩌구어쩌구어쩌구어쩌구어쩌구
어쩌구어쩌구어쩌구어쩌구어쩌구어쩌구`
    };

    return (
        <div className={styles.container}>
            <Topbar title="후기작성" />
            <MatchCard {...reviewData} showDivider={false} />

            {/* 이미지 미리보기 */}
            <div className={styles.imageScroll}>
                {reviewData.images.map((src, idx) => (
                    <img key={idx} src={src} className={styles.previewImage} alt={`preview-${idx}`} />
                ))}
            </div>

            {/* 후기 텍스트 */}
            <p className={styles.reviewText}>
                {reviewData.content}
            </p>
        </div>
    );
}
