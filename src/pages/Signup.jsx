import React from "react";
import styles from "./Signup.module.css";


export default function Signup() {
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>회원가입</h2>

            {/* 아이디 입력 */}
            <div className={styles.inputGroup}>
                <label>아이디</label>
                <div className={styles.inputWithButton}>
                    <input type="text" placeholder="아이디를 입력해주세요" />
                    <button className={styles.checkBtn}>중복확인</button>
                </div>
            </div>

            {/* 비밀번호 입력 */}
            <div className={styles.inputGroup}>
                <label>비밀번호</label>
                <input type="password" placeholder="비밀번호를 입력해주세요" />
            </div>

            {/* 비밀번호 재확인 */}
            <div className={styles.inputGroup}>
                <label>비밀번호 재확인</label>
                <input type="password" placeholder="비밀번호를 다시 입력해주세요" />
            </div>

            {/* 이름 입력 */}
            <div className={styles.inputGroup}>
                <label>이름</label>
                <input type="text" placeholder="이름을 입력해주세요" />
            </div>

            {/* 이용하실 분류 */}
            <div className={styles.inputGroup}>
                <label>이용하실 분류</label>
                <div className={styles.radioGroup}>
                    <button className={styles.radioBtn}>독거노인</button>
                    <button className={styles.radioBtn}>봉사자</button>
                </div>
            </div>

            {/* 생년월일 입력 */}
            <div className={styles.inputGroup}>
                <label>생년월일</label>
                <div className={styles.dateSelect}>
                    <select><option>년</option></select>
                    <select><option>월</option></select>
                    <select><option>일</option></select>
                </div>
            </div>

            {/* 휴대전화 인증 */}
            <div className={styles.inputGroup}>
                <label>휴대전화</label>
                <div className={styles.inputWithButton}>
                    <input type="text" placeholder="전화번호 입력" />
                    <button className={styles.checkBtn}>인증번호 받기</button>
                </div>
                <input type="text" placeholder="인증번호를 입력해주세요" />
            </div>

            {/* 약관 동의 */}
            <div className={styles.agreement}>
                <label>약관 전체동의</label>
                <div className={styles.termsList}>
                    <label><input type="checkbox" /> 이용약관 동의 (필수)</label>
                    <label><input type="checkbox" /> 개인정보 수집 동의 (필수)</label>
                    <label><input type="checkbox" /> 마케팅 정보 수신 동의 (선택)</label>
                </div>
            </div>

            {/* 가입 버튼 */}
            <button className={styles.submitBtn}>가입하기</button>
        </div>
    );
}
