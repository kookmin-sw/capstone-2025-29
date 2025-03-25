import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Edit.module.css";
import Topbar from "../components/Topbar";

export default function Edit() {
    const navigate = useNavigate();
    const [passwordInput, setPasswordInput] = useState("");
    const [passwordError, setPasswordError] = useState(false);

    const handlePasswordCheck = () => {
        const isCorrect = passwordInput === "1234"; // 예시용 비밀번호 체크
        setPasswordError(!isCorrect);
        if (isCorrect) {
            navigate("/passwordedit");
        }
    };

    return (
        <form className={styles.container}>
            <Topbar title="프로필 수정" />

            {/* 프로필 이미지 */}
            <div className={styles.profileImageWrapper}>
                <img className={styles.profileImage} src="../public/profile.svg" alt="" />
            </div>

            {/* 이름 */}
            <div className={styles.inputGroup}>
                <label>이름</label>
                <input type="text" placeholder="항목을 입력해주세요" />
            </div>

            {/* 나이 */}
            <div className={styles.inputGroup}>
                <label>나이</label>
                <input type="text" placeholder="항목을 입력해주세요" />
            </div>

            {/* 성별 */}
            <div className={styles.inputGroup}>
                <label>성별</label>
                <input type="text" placeholder="항목을 입력해주세요" />
            </div>

            {/* 번호 */}
            <div className={styles.inputGroup}>
                <label>번호</label>
                <input type="text" placeholder="항목을 입력해주세요" />
            </div>

            {/* 지역 */}
            <div className={styles.inputGroup}>
                <label>지역</label>
                <input type="text" placeholder="항목을 입력해주세요" />
            </div>

            {/* 비밀번호 변경 */}
            <div className={styles.inputGroup}>
                <label>비밀번호 변경</label>
                <div className={styles.passwordChange}>
                    <input
                        type="password"
                        placeholder="현재 비밀번호를 입력해주세요"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={handlePasswordCheck}
                        style={{
                            backgroundColor: passwordInput.trim() === "" ? "#EEEEEE" : "#6D57DE",
                            color: passwordInput.trim() === "" ? "#999" : "#fff",
                            cursor: passwordInput.trim() === "" ? "not-allowed" : "pointer"
                        }}
                        disabled={passwordInput.trim() === ""}
                    >
                        완료
                    </button>
                </div>
                {passwordError && (
                    <span className={styles.errorText}> * 비밀번호를 확인해주세요</span>
                )}
            </div>

            {/* 수정하기 버튼 */}
            <button type="submit" className={styles.submitBtn}>
                수정하기
            </button>
        </form>
    );
}
