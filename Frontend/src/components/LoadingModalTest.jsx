import React, { useState } from "react";
import LoadingModal from "./LoadingModal";

export default function LoadingModalTest() {
    const [isLoading, setIsLoading] = useState(false);

    const handleStartLoading = () => {
        setIsLoading(true); // 로딩 시작
        setTimeout(() => {
            setIsLoading(false); // 3초 후 로딩 종료
        }, 1000000);
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>로딩 모달 테스트</h1>
            <button
                onClick={handleStartLoading}
                style={{
                    padding: "10px 20px",
                    fontSize: "16px",
                    backgroundColor: "#6d57de",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                로딩 시작
            </button>

            {/* 로딩 모달 */}
            <LoadingModal isOpen={isLoading} />
        </div>
    );
}