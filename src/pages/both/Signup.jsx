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
    const userInfo = location.state?.userInfo || {};

    console.log(userInfo)
    const districts = [
        { value: "GANGNAM", label: "강남구" }, { value: "GANGDONG", label: "강동구" },
        { value: "GANGBUK", label: "강북구" }, { value: "GANGSEO", label: "강서구" },
        { value: "GWANAK", label: "관악구" }, { value: "GWANGJIN", label: "광진구" },
        { value: "GURO", label: "구로구" }, { value: "GEUMCHEON", label: "금천구" },
        { value: "NOWON", label: "노원구" }, { value: "DOBONG", label: "도봉구" },
        { value: "DONGDAEMUN", label: "동대문구" }, { value: "DONGJAK", label: "동작구" },
        { value: "MAPO", label: "마포구" }, { value: "SEODAEMUN", label: "서대문구" },
        { value: "SEOCHO", label: "서초구" }, { value: "SEONGDONG", label: "성동구" },
        { value: "SEONGBUK", label: "성북구" }, { value: "SONGPA", label: "송파구" },
        { value: "YANGCHEON", label: "양천구" }, { value: "YEONGDEUNGPO", label: "영등포구" },
        { value: "YONGSAN", label: "용산구" }, { value: "EUNPYEONG", label: "은평구" },
        { value: "JONGNO", label: "종로구" }
    ];

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
        authCode: "",
        gender: "male",
        introduction: ""
    });

    const [confirmPassword, setConfirmPassword] = useState("");
    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [idChecked, setIdChecked] = useState(false);
    const [authCodeVerified, setAuthCodeVerified] = useState(false);
    const [agreeAll, setAgreeAll] = useState(false);
    const [agreements, setAgreements] = useState({ terms: false, privacy: false, marketing: false });

    useEffect(() => {
        if (userInfo) {
            setFormValues((prev) => ({
                ...prev,
                id: userInfo.username || "",
                name: userInfo.name || "",
                gender: userInfo.gender || "male",
                phone: userInfo.phone || "",
            }));
        }
    }, [userInfo]);

    useEffect(() => {
        const allChecked = Object.values(agreements).every(Boolean);
        setAgreeAll(allChecked);
    }, [agreements]);

    useEffect(() => {
        setIsPasswordValid(formValues.password === confirmPassword);
    }, [formValues.password, confirmPassword]);

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
        if (!formValues.id.trim()) return alert('아이디를 입력해주세요.');
        try {
            await checkUsername(formValues.id, selectedRole);
            setIdChecked(true);
            alert('사용 가능한 아이디입니다.');
        } catch (error) {
            setIdChecked(false);
            alert(error.message);
        }
    };

    const calculateAge = (year, month, day) => {
        const today = new Date();
        const birth = new Date(year, month - 1, day);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        return age;
    };

    const birthDateComplete = formValues.birthYear && formValues.birthMonth && formValues.birthDay;
    const isRequiredTermsAgreed = agreements.terms && agreements.privacy;

    const isRequiredFieldsFilled =
        formValues.id.trim() &&
        formValues.password.trim() &&
        formValues.name.trim() &&
        formValues.region.trim() &&
        birthDateComplete &&
        formValues.phone.trim();

    const isSubmitDisabled =
        !isRequiredTermsAgreed ||
        !idChecked ||
        !isRequiredFieldsFilled ||
        !isPasswordValid ||
        !authCodeVerified;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitDisabled) {
            alert("모든 필수 항목을 입력하고 인증을 완료해주세요.");
            return;
        }

        const formData = {
            username: formValues.id,
            password: formValues.password,
            name: formValues.name,
            age: calculateAge(formValues.birthYear, formValues.birthMonth, formValues.birthDay),
            gender: formValues.gender,
            phone: formValues.phone,
            address: {
                district: formValues.region,
                detail: formValues.detailAddress || ""
            },
            phoneCode: localStorage.getItem('fcmToken') || "",
            userType: selectedRole || "volunteer",
            bio: selectedRole === "volunteer" ? formValues.introduction : ""
        };

        try {
            console.log("회원가입 데이터:", formData);
            await registerUser(formData);
            alert('회원가입이 완료되었습니다.');
            navigate('/login');
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <form className={styles.container} onSubmit={handleSubmit}>
            <Topbar title="" />
            <div className={styles.LogoImageWrapper}>
                <img className={styles.LogoImage} src={ongi} alt="로고" />
            </div>

            <div className={styles.inputGroup}>
                <label>아이디</label>
                <div className={styles.inputWithButton}>
                    <input
                        type="text"
                        name="id"
                        value={formValues.id}
                        onChange={handleInputChange}
                        placeholder="아이디 입력"
                        disabled={idChecked || !!userInfo.username} // ✅ userInfo.username 이 있으면 비활성화
                    />
                    <button
                        type="button"
                        className={styles.checkBtn}
                        onClick={handleCheckId}
                        disabled={idChecked || !!userInfo.username} // ✅ userInfo.username 이 있으면 비활성화
                        style={{
                            backgroundColor: (idChecked || !!userInfo.username) ? "#E6E6FA" : "#6D57DE",
                            color: (idChecked || !!userInfo.username) ? "#6D57DE" : "#fff"
                        }}
                    >
                        중복확인
                    </button>

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
                <label>성별</label>
                <select name="gender" value={formValues.gender} onChange={handleInputChange}>
                    <option value="male">남성</option>
                    <option value="female">여성</option>
                </select>
            </div>

            <div className={styles.inputGroup}>
                <label>지역구</label>
                <select name="region" value={formValues.region} onChange={handleInputChange}>
                    <option value="">지역구 선택</option>
                    {districts.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
            </div>

            <div className={styles.inputGroup}>
                <label>상세주소</label>
                <input type="text" name="detailAddress" value={formValues.detailAddress} onChange={handleInputChange} placeholder="상세주소 입력" />
            </div>

            <div className={styles.inputGroup}>
                <label>생년월일</label>
                <div className={styles.dateSelect}>
                    <select name="birthYear" value={formValues.birthYear} onChange={handleInputChange}>
                        <option value="">년</option>
                        {Array.from({ length: 100 }, (_, i) => {
                            const year = new Date().getFullYear() - i;
                            return <option key={year} value={year}>{year}</option>;
                        })}
                    </select>
                    <select name="birthMonth" value={formValues.birthMonth} onChange={handleInputChange}>
                        <option value="">월</option>
                        {[...Array(12)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
                    </select>
                    <select name="birthDay" value={formValues.birthDay} onChange={handleInputChange}>
                        <option value="">일</option>
                        {[...Array(31)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
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

            {selectedRole === "volunteer" && (
                <div className={styles.inputGroup}>
                    <label>자기소개 (100자 내외)</label>
                    <textarea name="introduction" value={formValues.introduction} onChange={handleInputChange} placeholder="소개를 잘 작성하시면 매칭에 도움이 됩니다." maxLength={100} rows={10} className={styles.introduction} />
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
