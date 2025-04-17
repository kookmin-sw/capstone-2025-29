import React, { useState } from "react";
import styles from "./Edit.module.css";
import Topbar from "../../components/Topbar";

export default function Edit() {
    const [passwordInput, setPasswordInput] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [passwordError, setPasswordError] = useState(false);
    const [matchError, setMatchError] = useState(false);

    const handleInfoSubmit = (e) => {
        e.preventDefault();
        alert("기본 정보가 수정되었습니다.");
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();

        const isCurrentCorrect = passwordInput === "1234"; // 예시 현재 비밀번호

        setPasswordError(!isCurrentCorrect);
        setMatchError(newPassword !== confirmPassword);

        if (!isCurrentCorrect || newPassword !== confirmPassword) return;

        alert("비밀번호가 성공적으로 변경되었습니다!");
        // TODO: 서버에 저장 요청
    };

    return (
        <div className={styles.container}>
            <Topbar title="프로필 수정" />

            {/* 기본 정보 수정 */}
            <form className={styles.form} onSubmit={handleInfoSubmit}>
                <div className={styles.profileImageWrapper}>
                    <img className={styles.profileImage} src="/profile.svg" alt="" />
                </div>

                <div className={styles.inputGroup}>
                    <label>이름</label>
                    <input type="text" placeholder="항목을 입력해주세요" />
                </div>

                <div className={styles.inputGroup}>
                    <label>나이</label>
                    <input type="text" placeholder="항목을 입력해주세요" />
                </div>

                <div className={styles.inputGroup}>
                    <label>성별</label>
                    <input type="text" placeholder="항목을 입력해주세요" />
                </div>

                <div className={styles.inputGroup}>
                    <label>번호</label>
                    <input type="text" placeholder="항목을 입력해주세요" />
                </div>

                <div className={styles.inputGroup}>
                    <label>지역</label>
                    <input type="text" placeholder="항목을 입력해주세요" />
                </div>

                <button type="submit" className={styles.submitBtn}>
                    수정하기
                </button>
            </form>

            {/* 비밀번호 변경 */}
            <form className={styles.form} onSubmit={handlePasswordSubmit}>
                <div className={styles.inputGroup}>
                    <label>현재 비밀번호</label>
                    <input
                        type="password"
                        placeholder="현재 비밀번호를 입력해주세요"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                    />
                    {passwordError && (
                        <span className={styles.errorText}>* 비밀번호를 확인해주세요.</span>
                    )}
                </div>

                <div className={styles.inputGroup}>
                    <label>새 비밀번호</label>
                    <input
                        type="password"
                        placeholder="새 비밀번호를 입력해 주세요."
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>새 비밀번호 확인</label>
                    <input
                        type="password"
                        placeholder="새 비밀번호를 한번 더 입력해 주세요."
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {matchError && (
                        <span className={styles.errorText}>* 새 비밀번호를 확인해주세요.</span>
                    )}
                </div>

                <button type="submit" className={styles.submitBtn}>
                    변경하기
                </button>
            </form>
        </div>
    );
}