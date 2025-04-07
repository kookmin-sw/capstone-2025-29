import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PasswordEdit.module.css";
import Topbar from "../../components/Topbar";

export default function PasswordEdit() {
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        // 공백 체크
        if (newPassword.trim() === "" || confirmPassword.trim() === "") {
            alert("새 비밀번호를 입력해주세요");
            return;
        }
        if (newPassword === confirmPassword) {
            setError(false);
            alert("비밀번호가 성공적으로 변경되었습니다!");
            // TODO: 서버에 요청 보내기
            navigate(-1);
        } else {
            setError(true);
        }
    };

    return (
        <div className={styles.container}>
            {/* Topbar는 form 외부에 있어야 form submit 영향을 안 받음 */}
            <Topbar title="비밀번호 변경" />

            <form className={styles.form} onSubmit={handleSubmit}>
                {/* 여백 추가 */}
                <div className={styles.blank}></div>

                {/* 새 비밀번호 */}
                <div className={styles.inputGroup}>
                    <label>새 비밀번호</label>
                    <input
                        type="password"
                        placeholder="새 비밀번호를 입력해 주세요."
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>

                {/* 새 비밀번호 확인 */}
                <div className={styles.inputGroup}>
                    <label>새 비밀번호 확인</label>
                    <input
                        type="password"
                        placeholder="새 비밀번호를 한번 더 입력해 주세요."
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                {/* 에러 메시지 */}
                {error && (
                    <span className={styles.errorText}>
                        * 비밀번호가 일치하지 않습니다.
                    </span>
                )}

                {/* 변경 버튼 */}
                <button type="submit" className={styles.submitBtn}>
                    변경하기
                </button>
            </form>
        </div>
    );
}
