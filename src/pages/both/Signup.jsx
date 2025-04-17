import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Signup.module.css";
import Topbar from "../../components/Topbar";
import ongi from '../../assets/ongi.svg';
import { messaging, getToken, onMessage } from '../../firebase';
import NotificationSetup from '../../components/NotificationSetup';

export default function Signup() {
    const location = useLocation();
    const navigate = useNavigate();
    const selectedRole = location.state?.role || "";

    // form 상태 저장
    const [formValues, setFormValues] = useState({
        id: "",
        password: "",
        name: "",
        region: "",
        userType: "",
        birthYear: "",
        birthMonth: "",
        birthDay: "",
        phone: "",
        authCode: ""
    });

    // 비밀번호 확인 별도 상태
    const [confirmPassword, setConfirmPassword] = useState("");

    // 비밀번호 유효성 상태
    const [isPasswordValid, setIsPasswordValid] = useState(true);

    // 아이디 중복확인 상태
    const [idChecked, setIdChecked] = useState(false);

    // 인증번호 확인 상태
    const [authCodeVerified, setAuthCodeVerified] = useState(false);

    // 약관 동의 상태
    const [agreeAll, setAgreeAll] = useState(false);
    const [agreements, setAgreements] = useState({
        terms: false,
        privacy: false,
        marketing: false
    });

    // 약관 전체 체크 여부에 따른 전체 동의 상태 업데이트
    useEffect(() => {
        const allChecked = Object.values(agreements).every(Boolean);
        setAgreeAll(allChecked);
    }, [agreements]);

    // 비밀번호 유효성 검사 함수 (8자리 + 특수기호)
    const validatePassword = (password) => {
        const lengthCheck = password.length >= 8;
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const hasNumber = /\d/.test(password);
        //return lengthCheck && hasSpecialChar && hasNumber;

        return true
    };

    // 입력값 변경 핸들러
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // 비밀번호 입력 시 유효성 검사 적용
        if (name === "password") {
            setIsPasswordValid(validatePassword(value));
        }

        //입력에 대한 값 변경
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    // 전체 동의 체크 핸들러
    const handleAllAgreeChange = (checked) => {
        setAgreeAll(checked);
        setAgreements({ terms: checked, privacy: checked, marketing: checked });
    };

    // 아이디 중복 확인 요청 로직 (추후 구현)
    const handleCheckId = () => {
        // TODO: 서버와 중복확인 API 통신 후 결과 반영
        setIdChecked(true);
    };

    // 회원가입 폼 제출
    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = {
            ...formValues,
            birth: `${formValues.birthYear}-${formValues.birthMonth}-${formValues.birthDay}`,
            agreements
        };

        console.log("전송할 데이터:", formData);

        // 역할에 따라 이동 -> 나중에 fetch 안으로 집어 넣야야함

        if (selectedRole === "volunteer") {
            navigate("/volunteerMain");
        } else {
            navigate("/userMain");
        }

        // fetch("https://your-api-endpoint.com/signup", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify(formData)
        // })
        //     .then((res) => res.json())
        //     .then((data) => {
        //         alert("회원가입 완료");
        //         console.log(data);
        //     })
        //     .catch((err) => console.error("에러:", err));
    };

    // 비밀번호 일치 여부
    const passwordsMatch = formValues.password === confirmPassword;

    // 생년월일 입력 여부
    const birthDateComplete = formValues.birthYear && formValues.birthMonth && formValues.birthDay;

    // 가입 버튼 비활성화 조건
    const isSubmitDisabled = false;
    !agreeAll ||
        !idChecked ||
        formValues.userType === "" ||
        !passwordsMatch ||
        !isPasswordValid ||
        formValues.phone.trim() === "" ||
        formValues.region.trim() === "" ||
        !authCodeVerified ||
        !birthDateComplete;

    return (
        <form className={styles.container} onSubmit={handleSubmit} >
            <NotificationSetup />
            <Topbar title="" />

            {/* 프로필 이미지 */}
            <div className={styles.LogoImageWrapper}>
                <img className={styles.LogoImage} src={ongi} alt="" />
            </div>

            {/* 아이디 입력 */}
            <div className={styles.inputGroup}>
                <label>아이디</label>
                <div className={styles.inputWithButton}>
                    <input
                        type="text"
                        name="id"
                        value={formValues.id}
                        onChange={handleInputChange}
                        placeholder="아이디 입력"
                    />
                    <button
                        type="button"
                        className={styles.checkBtn}
                        style={{
                            backgroundColor: idChecked ? "#E6E6FA" : "#6D57DE",
                            color: idChecked ? "#6D57DE" : "#fff"
                        }}
                        onClick={handleCheckId}
                    >
                        중복확인
                    </button>
                </div>
            </div>

            {/* 비밀번호 입력 */}
            <div className={styles.inputGroup}>
                <label>비밀번호</label>
                <input
                    type="password"
                    name="password"
                    value={formValues.password}
                    onChange={handleInputChange}
                    placeholder="비밀번호 입력"
                    autoComplete="new-password"
                    data-form-type="other"
                    data-lpignore="true"
                />
            </div>

            {/* 비밀번호 재확인 */}
            <div className={styles.inputGroup}>
                <label>비밀번호 재확인</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="비밀번호 다시 입력"
                    autoComplete="new-password"
                    data-form-type="other"
                    data-lpignore="true"
                />
            </div>

            {/* 이름 */}
            <div className={styles.inputGroup}>
                <label>이름</label>
                <input
                    type="text"
                    name="name"
                    value={formValues.name}
                    onChange={handleInputChange}
                    placeholder="이름 입력"
                />
            </div>

            {/* 지역 */}
            <div className={styles.inputGroup}>
                <label>지역</label>
                <input
                    type="text"
                    name="region"
                    value={formValues.region}
                    onChange={handleInputChange}
                    placeholder="구/군/면/읍"
                />
            </div>

            {/* 생년월일 */}
            <div className={styles.inputGroup}>
                <label>생년월일</label>
                <div className={styles.dateSelect}>
                    <select name="birthYear" onChange={handleInputChange} defaultValue="">
                        <option disabled value="">년</option>
                        {Array.from({ length: 100 }, (_, i) => {
                            const year = new Date().getFullYear() - i;
                            return <option key={year}>{year} 년</option>;
                        })}
                    </select>
                    <select name="birthMonth" onChange={handleInputChange} defaultValue="">
                        <option disabled value="">월</option>
                        {[...Array(12)].map((_, i) => <option key={i + 1}>{i + 1} 월</option>)}
                    </select>
                    <select name="birthDay" onChange={handleInputChange} defaultValue="">
                        <option disabled value="">일</option>
                        {[...Array(31)].map((_, i) => <option key={i + 1}>{i + 1} 일</option>)}
                    </select>
                </div>
            </div>

            {/* 휴대전화 */}
            <div className={styles.inputGroup}>
                <label>휴대전화</label>
                <div className={styles.inputWithButton}>
                    <input
                        type="text"
                        name="phone"
                        value={formValues.phone}
                        onChange={handleInputChange}
                        placeholder="전화번호 입력"
                    />
                    <button type="button" className={styles.checkBtn}>인증번호 받기</button>
                </div>
                <input
                    type="text"
                    name="authCode"
                    value={formValues.authCode}
                    onChange={handleInputChange}
                    placeholder="인증번호 입력"
                />
                <button
                    type="button"
                    className={styles.checkBtn}
                    onClick={() => {
                        // TODO: 실제 인증번호 비교 로직
                        setAuthCodeVerified(true);
                    }}
                >
                    인증번호 확인
                </button>
            </div>

            {/* 약관 동의 */}
            <div className={styles.agreement}>
                <label>
                    <input
                        type="checkbox"
                        checked={agreeAll}
                        onChange={(e) => handleAllAgreeChange(e.target.checked)}
                    /> 약관 전체동의
                </label>
                <div className={styles.termsList}>
                    <label>
                        <input
                            type="checkbox"
                            checked={agreements.terms}
                            onChange={(e) => setAgreements((prev) => ({ ...prev, terms: e.target.checked }))}
                        /> 이용약관 동의 (필수)
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={agreements.privacy}
                            onChange={(e) => setAgreements((prev) => ({ ...prev, privacy: e.target.checked }))}
                        /> 개인정보 수집 동의 (필수)
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={agreements.marketing}
                            onChange={(e) => setAgreements((prev) => ({ ...prev, marketing: e.target.checked }))}
                        /> 마케팅 정보 수신 동의 (선택)
                    </label>
                </div>
            </div>

            {/* 가입 버튼 */}
            <button
                type="submit"
                className={styles.submitBtn}
                disabled={isSubmitDisabled}
                style={{
                    backgroundColor: !isSubmitDisabled ? "#6D57DE" : "#dcdcdc",
                    color: !isSubmitDisabled ? "#fff" : "#999",
                    cursor: !isSubmitDisabled ? "pointer" : "not-allowed"
                }}
            >
                가입하기
            </button>
        </form>
    );
}
