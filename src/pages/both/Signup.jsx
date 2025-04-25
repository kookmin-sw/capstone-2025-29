import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Signup.module.css";
import Topbar from "../../components/Topbar";
import ongi from '../../assets/ongi.svg';
import { checkUsername, registerUser } from '../../api/both';


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

    // 필수 약관 동의 여부 확인
    const isRequiredTermsAgreed = agreements.terms && agreements.privacy;

    // 입력값 변경 핸들러
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // 아이디 입력 필드가 변경될 때 중복확인 상태 초기화
        if (name === 'id') {
            setIdChecked(false);
        }


        //입력에 대한 값 변경
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    // 전체 동의 체크 핸들러
    const handleAllAgreeChange = (checked) => {
        setAgreeAll(checked);
        setAgreements({ terms: checked, privacy: checked, marketing: checked });
    };

    // 아이디 중복 확인 요청 로직
    const handleCheckId = async () => {
        if (!formValues.id) {
            alert('아이디를 입력해주세요.');
            return;
        }

        try {
            await checkUsername(formValues.id, selectedRole);
            setIdChecked(true);
            alert('사용 가능한 아이디입니다.');
        } catch (error) {
            console.error('중복 확인 에러:', error);
            setIdChecked(false);
            alert(error.message);
        }
    };

    // 생년월일로부터 정확한 나이를 계산하는 함수
    const calculateAge = (birthYear, birthMonth, birthDay) => {
        const today = new Date();
        const birthDate = new Date(birthYear, birthMonth - 1, birthDay);

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    };

    // 비밀번호 일치 여부
    const passwordsMatch = formValues.password === confirmPassword;

    // 생년월일 입력 여부
    const birthDateComplete = formValues.birthYear && formValues.birthMonth && formValues.birthDay;

    // 필수 입력값 검증
    const isRequiredFieldsFilled =
        formValues.id.trim() !== "" &&
        formValues.password.trim() !== "" &&
        formValues.name.trim() !== "" &&
        formValues.region.trim() !== "" &&
        birthDateComplete &&
        formValues.phone.trim() !== "";

    // 가입 버튼 비활성화 조건
    const isSubmitDisabled =
        !isRequiredTermsAgreed ||
        !idChecked ||
        !isRequiredFieldsFilled ||
        !isPasswordValid ||
        !authCodeVerified;

    // 회원가입 폼 제출
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 필수 입력값 검증
        if (!formValues.id.trim()) {
            alert('아이디를 입력해주세요.');
            return;
        }

        if (!idChecked) {
            alert('아이디 중복확인을 해주세요.');
            return;
        }

        if (!formValues.password.trim()) {
            alert('비밀번호를 입력해주세요.');
            return;
        }

        if (!passwordsMatch) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        if (!formValues.name.trim()) {
            alert('이름을 입력해주세요.');
            return;
        }

        if (!formValues.region.trim()) {
            alert('지역을 입력해주세요.');
            return;
        }

        if (!birthDateComplete) {
            alert('생년월일을 모두 선택해주세요.');
            return;
        }

        if (!formValues.phone.trim()) {
            alert('휴대전화 번호를 입력해주세요.');
            return;
        }

        if (!authCodeVerified) {
            alert('휴대전화 인증을 완료해주세요.');
            return;
        }

        if (!isRequiredTermsAgreed) {
            alert('필수 약관에 동의해주세요.');
            return;
        }

        // formData 객체 생성
        const formData = {
            username: formValues.id,
            password: formValues.password,
            name: formValues.name,
            age: calculateAge(
                parseInt(formValues.birthYear),
                parseInt(formValues.birthMonth),
                parseInt(formValues.birthDay)
            ),
            gender: formValues.gender || "male",
            phone: formValues.phone,
            address: {
                district: formValues.region | "",
                detail: formValues.detailAddress || "",
            },
            phoneCode: formValues.phoneCode || "1234",
            userType: selectedRole || "volunteer",
        };

        try {
            await registerUser(formData);
            alert('회원가입이 완료되었습니다.');
            navigate('/login');
        } catch (error) {
            console.error("=== 에러 발생 ===");
            console.error("에러 메시지:", error.message);
            alert(error.message);
        }
    };

    return (
        <form className={styles.container} onSubmit={handleSubmit}>
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
                        disabled={idChecked}
                    />
                    <button
                        type="button"
                        className={styles.checkBtn}
                        onClick={handleCheckId}
                        disabled={idChecked}
                        style={{
                            backgroundColor: idChecked ? "#E6E6FA" : "#6D57DE",
                            color: idChecked ? "#6D57DE" : "#fff",
                            cursor: idChecked ? "not-allowed" : "pointer"
                        }}
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
                        alert('인증번호가 확인되었습니다.');
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