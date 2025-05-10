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

    const [formValues, setFormValues] = useState({
        id: "",
        password: "",
        name: "",
        region: "",
        detailAddress: "",
        userType: "",
        birthYear: "",
        birthMonth: "",
        birthDay: "",
        phone: "",
        authCode: ""
    });

    const [confirmPassword, setConfirmPassword] = useState("");
    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [idChecked, setIdChecked] = useState(false);
    const [authCodeVerified, setAuthCodeVerified] = useState(false);
    const [agreeAll, setAgreeAll] = useState(false);
    const [agreements, setAgreements] = useState({ terms: false, privacy: false, marketing: false });

    useEffect(() => {
        const allChecked = Object.values(agreements).every(Boolean);
        setAgreeAll(allChecked);
    }, [agreements]);

    const isRequiredTermsAgreed = agreements.terms && agreements.privacy;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'id') setIdChecked(false);
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleAllAgreeChange = (checked) => {
        setAgreeAll(checked);
        setAgreements({ terms: checked, privacy: checked, marketing: checked });
    };

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

    const calculateAge = (birthYear, birthMonth, birthDay) => {
        const today = new Date();
        const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
        return age;
    };

    const passwordsMatch = formValues.password === confirmPassword;
    const birthDateComplete = formValues.birthYear && formValues.birthMonth && formValues.birthDay;

    const isRequiredFieldsFilled =
        formValues.id.trim() !== "" &&
        formValues.password.trim() !== "" &&
        formValues.name.trim() !== "" &&
        formValues.region.trim() !== "" &&
        birthDateComplete &&
        formValues.phone.trim() !== "";

    const isSubmitDisabled =
        !isRequiredTermsAgreed ||
        !idChecked ||
        !isRequiredFieldsFilled ||
        !isPasswordValid ||
        !authCodeVerified;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formValues.id.trim()) return alert('아이디를 입력해주세요.');
        if (!idChecked) return alert('아이디 중복확인을 해주세요.');
        if (!formValues.password.trim()) return alert('비밀번호를 입력해주세요.');
        if (!passwordsMatch) return alert('비밀번호가 일치하지 않습니다.');
        if (!formValues.name.trim()) return alert('이름을 입력해주세요.');
        if (!formValues.region.trim()) return alert('지역을 입력해주세요.');
        if (!birthDateComplete) return alert('생년월일을 모두 선택해주세요.');
        if (!formValues.phone.trim()) return alert('휴대전화 번호를 입력해주세요.');
        if (!authCodeVerified) return alert('휴대전화 인증을 완료해주세요.');
        if (!isRequiredTermsAgreed) return alert('필수 약관에 동의해주세요.');

        const formData = {
            username: formValues.id,
            password: formValues.password,
            name: formValues.name,
            age: calculateAge(parseInt(formValues.birthYear), parseInt(formValues.birthMonth), parseInt(formValues.birthDay)),
            gender: formValues.gender || "male",
            phone: formValues.phone,
            address: {
                district: formValues.region || "",
                detail: formValues.detailAddress || ""
            },
            phoneCode: formValues.phoneCode || "1234",
            userType: selectedRole || "volunteer"
        };

        try {
            await registerUser(formData);
            alert('회원가입이 완료되었습니다.');
            navigate('/login');
        } catch (error) {
            console.error("에러 발생:", error.message);
            alert(error.message);
        }
    };

    return (
        <form className={styles.container} onSubmit={handleSubmit}>
            <Topbar title="" />
            <div className={styles.LogoImageWrapper}><img className={styles.LogoImage} src={ongi} alt="" /></div>

            <div className={styles.inputGroup}>
                <label>아이디</label>
                <div className={styles.inputWithButton}>
                    <input type="text" name="id" value={formValues.id} onChange={handleInputChange} placeholder="아이디 입력" disabled={idChecked} />
                    <button type="button" className={styles.checkBtn} onClick={handleCheckId} disabled={idChecked} style={{ backgroundColor: idChecked ? "#E6E6FA" : "#6D57DE", color: idChecked ? "#6D57DE" : "#fff" }}>중복확인</button>
                </div>
            </div>

            <div className={styles.inputGroup}>
                <label>비밀번호</label>
                <input type="password" name="password" value={formValues.password} onChange={handleInputChange} placeholder="비밀번호 입력" />
            </div>

            <div className={styles.inputGroup}>
                <label>비밀번호 재확인</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="비밀번호 다시 입력" />
            </div>

            <div className={styles.inputGroup}>
                <label>이름</label>
                <input type="text" name="name" value={formValues.name} onChange={handleInputChange} placeholder="이름 입력" />
            </div>

            <div className={styles.inputGroup}>
                <label>지역구</label>
                <select name="region" value={formValues.region} onChange={handleInputChange} defaultValue="">
                    <option value="" disabled>지역구 선택</option>
                    <option value="GANGNAM">강남구</option>
                    <option value="SEOCHO">서초구</option>
                    <option value="MAPO">마포구</option>
                    <option value="JONGNO">종로구</option>
                </select>
            </div>

            <div className={styles.inputGroup}>
                <label>상세주소</label>
                <input type="text" name="detailAddress" value={formValues.detailAddress || ""} onChange={handleInputChange} placeholder="상세주소를 입력해주세요" />
            </div>

            <div className={styles.inputGroup}>
                <label>생년월일</label>
                <div className={styles.dateSelect}>
                    <select name="birthYear" onChange={handleInputChange} defaultValue="">
                        <option disabled value="">년</option>
                        {Array.from({ length: 100 }, (_, i) => {
                            const year = new Date().getFullYear() - i;
                            return <option key={year}>{year}</option>;
                        })}
                    </select>
                    <select name="birthMonth" onChange={handleInputChange} defaultValue="">
                        <option disabled value="">월</option>
                        {[...Array(12)].map((_, i) => <option key={i + 1}>{i + 1}</option>)}
                    </select>
                    <select name="birthDay" onChange={handleInputChange} defaultValue="">
                        <option disabled value="">일</option>
                        {[...Array(31)].map((_, i) => <option key={i + 1}>{i + 1}</option>)}
                    </select>
                </div>
            </div>

            <div className={styles.inputGroup}>
                <label>휴대전화</label>
                <div className={styles.inputWithButton}>
                    <input type="text" name="phone" value={formValues.phone} onChange={handleInputChange} placeholder="전화번호 입력" />
                    <button type="button" className={styles.checkBtn}>인증번호 받기</button>
                </div>
                <input type="text" name="authCode" value={formValues.authCode} onChange={handleInputChange} placeholder="인증번호 입력" />
                <button type="button" className={styles.checkBtn} onClick={() => { alert('인증번호가 확인되었습니다.'); setAuthCodeVerified(true); }}>인증번호 확인</button>
            </div>

            
            {/* 자기소개 입력란 */}
            {selectedRole === "volunteer" && (
                <div className={styles.inputGroup}>
                    <label>자기소개 (100자 내외)</label>
                    <textarea
                        name="introduction"
                        value={formValues.introduction}
                        onChange={handleInputChange}
                        placeholder="소개를 잘 작성하시면 매칭에 도움이 됩니다."
                        maxLength={100}
                        rows={10}
                        className={styles.introduction}
                    />
                </div>
            )}

            <div className={styles.agreement}>
                <label><input type="checkbox" checked={agreeAll} onChange={(e) => handleAllAgreeChange(e.target.checked)} /> 약관 전체동의</label>
                <div className={styles.termsList}>
                    <label><input type="checkbox" checked={agreements.terms} onChange={(e) => setAgreements((prev) => ({ ...prev, terms: e.target.checked }))} /> 이용약관 동의 (필수)</label>
                    <label><input type="checkbox" checked={agreements.privacy} onChange={(e) => setAgreements((prev) => ({ ...prev, privacy: e.target.checked }))} /> 개인정보 수집 동의 (필수)</label>
                    <label><input type="checkbox" checked={agreements.marketing} onChange={(e) => setAgreements((prev) => ({ ...prev, marketing: e.target.checked }))} /> 마케팅 정보 수신 동의 (선택)</label>
                </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={isSubmitDisabled} style={{ backgroundColor: !isSubmitDisabled ? "#6D57DE" : "#dcdcdc", color: !isSubmitDisabled ? "#fff" : "#999", cursor: !isSubmitDisabled ? "pointer" : "not-allowed" }}>
                가입하기
            </button>
        </form>
    );
}