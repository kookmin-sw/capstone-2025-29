// ✅ React 및 라우팅 관련 모듈 import
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// ✅ 스타일 및 컴포넌트 import
import styles from "./Signup.module.css";
import Topbar from "../../components/Topbar";
import ongi from '../../assets/ongi.svg';
import { checkUsername, registerUser, sendAuthCode, verifyAuthCode } from '../../api/both';

export default function Signup() {
    // ✅ 현재 위치(URL)와 네비게이션 훅 설정
    const location = useLocation();
    const navigate = useNavigate();
    const selectedRole = location.state?.role || "";
    const userInfo = location.state?.userInfo || {};

    // ✅ 전화번호를 +82 형식으로 포맷
    const formatToInternational = (phone) => {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.startsWith('010')) {
            return `+82${cleaned.slice(1)}`;
        }
        return phone.startsWith('+82') ? phone : `+82${cleaned}`;
    };

    // ✅ 전화번호를 010 형식으로 포맷
    const formatTo010 = (phone) => {
        if (!phone) return '';
        const index = phone.indexOf('10');
        if (index === -1) return phone.replace(/\D/g, '');
        let result = phone.slice(index);
        result = result.replace(/[\s-]/g, '');
        if (!result.startsWith('0')) {
            result = '0' + result;
        }
        return result;
    };

    // ✅ 전화번호를 URL 인코딩된 국제 포맷으로 변환
    const formatToEncodedInternational = (phone) => {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.startsWith('010')) {
            return `%2B82${cleaned.slice(1)}`;
        }
        if (phone.startsWith('+82')) {
            return `%2B${phone.slice(1)}`;
        }
        if (phone.startsWith('82')) {
            return `%2B${phone}`;
        }
        return `%2B${cleaned}`;
    };

    // ✅ 전화번호 정규화 (숫자만 추출하고 82, 10 처리)
    const normalizePhoneNumber = (phone) => {
        if (!phone) return '';
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.startsWith('82')) {
            return '0' + cleaned.slice(2);
        }
        if (cleaned.startsWith('10')) {
            return '0' + cleaned;
        }
        return cleaned;
    };

    // ✅ 서울시 지역구 목록
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

    // ✅ 회원가입 폼의 상태 변수 선언
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

    // ✅ 추가적인 상태 변수들 (비밀번호 확인, 인증 여부, 약관 동의 등)
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [idChecked, setIdChecked] = useState(false);
    const [authCodeVerified, setAuthCodeVerified] = useState(false);
    const [agreeAll, setAgreeAll] = useState(false);
    const [agreements, setAgreements] = useState({ terms: false, privacy: false, marketing: false });

    // ✅ userInfo가 있으면 기본값 자동 세팅 (카카오 로그인 등)
    useEffect(() => {
        if (userInfo) {
            setFormValues((prev) => ({
                ...prev,
                id: userInfo.username || "",
                name: userInfo.name || "",
                gender: userInfo.gender || "male",
                phone: formatTo010(userInfo.phone || "")
            }));
            if (userInfo.username) {
                setIdChecked(true);
            }
        }
    }, [userInfo]);

    // ✅ 약관 전체동의 체크 동기화
    useEffect(() => {
        const allChecked = Object.values(agreements).every(Boolean);
        setAgreeAll(allChecked);
    }, [agreements]);

    // ✅ 비밀번호 유효성 체크
    useEffect(() => {
        setIsPasswordValid(formValues.password === confirmPassword);
    }, [formValues.password, confirmPassword]);

    // ✅ 입력 필드 값 변경 핸들러
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'id') setIdChecked(false);
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    // ✅ 약관 전체 동의 핸들러
    const handleAllAgreeChange = (checked) => {
        setAgreeAll(checked);
        setAgreements({ terms: checked, privacy: checked, marketing: checked });
    };

    // ✅ 아이디 중복 확인 핸들러
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

    // ✅ 생년월일을 기반으로 나이 계산
    const calculateAge = (year, month, day) => {
        const today = new Date();
        const birth = new Date(year, month - 1, day);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        return age;
    };

    // ✅ 유효성 검사 조건 설정
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

    // ✅ 회원가입 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitDisabled) {
            alert("모든 필수 항목을 입력하고 인증을 완료해주세요.");
            return;
        }

        // ✅ 서버에 보낼 최종 회원가입 데이터
        const formData = {
            username: formValues.id,
            password: formValues.password,
            name: formValues.name,
            age: calculateAge(formValues.birthYear, formValues.birthMonth, formValues.birthDay),
            gender: formValues.gender,
            phone: formatTo010(formValues.phone),
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

    // ✅ JSX 반환 시작 (회원가입 폼 렌더링)
    return (
        <form className={styles.container} onSubmit={handleSubmit}>
            {/* 상단 로고 및 탑바 */}
            <Topbar title="" />
            <div className={styles.LogoImageWrapper}>
                <img className={styles.LogoImage} src={ongi} alt="로고" />
            </div>

            {/* 아이디 입력 + 중복확인 버튼 */}
            <div className={styles.inputGroup}>
                <label>아이디</label>
                <div className={styles.inputWithButton}>
                    <input
                        type="text"
                        name="id"
                        value={formValues.id}
                        onChange={handleInputChange}
                        placeholder="아이디 입력"
                        disabled={userInfo.username && userInfo.username === formValues.id}
                    />
                    <button
                        type="button"
                        className={styles.checkBtn}
                        onClick={handleCheckId}
                        disabled={idChecked || (userInfo.username && userInfo.username === formValues.id)}
                        style={{
                            backgroundColor: (idChecked || (userInfo.username && userInfo.username === formValues.id)) ? "#E6E6FA" : "#6D57DE",
                            color: (idChecked || (userInfo.username && userInfo.username === formValues.id)) ? "#6D57DE" : "#fff"
                        }}
                    >
                        중복확인
                    </button>
                </div>
            </div>

            {/* 비밀번호 & 비밀번호 재확인 */}
            <div className={styles.inputGroup}>
                <label>비밀번호</label>
                <input type="password" name="password" value={formValues.password} onChange={handleInputChange} placeholder="비밀번호 입력" />
            </div>
            <div className={styles.inputGroup}>
                <label>비밀번호 재확인</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="비밀번호 다시 입력" />
            </div>

            {/* 이름 입력 */}
            <div className={styles.inputGroup}>
                <label>이름</label>
                <input
                    type="text"
                    name="name"
                    value={formValues.name}
                    onChange={handleInputChange}
                    placeholder="이름 입력"
                    disabled={!!userInfo.username}
                    className={styles.input}
                />
            </div>

            {/* 성별 선택 */}
            <div className={styles.inputGroup}>
                <label>성별</label>
                <select name="gender" value={formValues.gender} onChange={handleInputChange} disabled={!!userInfo.gender}>
                    <option value="male">남성</option>
                    <option value="female">여성</option>
                </select>
            </div>

            {/* 지역구 선택 */}
            <div className={styles.inputGroup}>
                <label>지역구</label>
                <select name="region" value={formValues.region} onChange={handleInputChange}>
                    <option value="">지역구 선택</option>
                    {districts.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
            </div>

            {/* 상세주소 입력 */}
            <div className={styles.inputGroup}>
                <label>상세주소</label>
                <input type="text" name="detailAddress" value={formValues.detailAddress} onChange={handleInputChange} placeholder="상세주소 입력" />
            </div>

            {/* 생년월일 선택 */}
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

            {/* 전화번호 입력 + 인증요청/확인 */}
            <div className={styles.inputGroup}>
                <label>휴대전화</label>
                <div className={styles.inputWithButton}>
                    <input
                        type="text"
                        name="phone"
                        value={formValues.phone}
                        onChange={handleInputChange}
                        placeholder="전화번호 입력"
                        disabled={!!userInfo.username}
                        className={styles.input}
                    />
                    <button
                        type="button"
                        className={styles.checkBtn}
                        onClick={async () => {
                            const intlPhone = formatToInternational(formValues.phone);
                            try {
                                const response = await sendAuthCode(intlPhone);
                                alert('인증번호가 발송되었습니다.');
                            } catch (err) {
                                alert(err.message);
                            }
                        }}
                    >
                        인증번호 받기
                    </button>
                </div>

                {/* 인증번호 입력 */}
                <input
                    type="text"
                    name="authCode"
                    value={formValues.authCode}
                    onChange={handleInputChange}
                    placeholder="인증번호 입력"
                    className={styles.input}
                />

                {/* 인증번호 확인 */}
                <button
                    type="button"
                    className={styles.checkBtn}
                    onClick={async () => {
                        const intlPhone = formatToInternational(formValues.phone);
                        try {
                            await verifyAuthCode(intlPhone, formValues.authCode);
                            alert('인증번호가 확인되었습니다.');
                            setAuthCodeVerified(true);
                        } catch (err) {
                            alert(err.message);
                            setAuthCodeVerified(false);
                        }
                    }}
                >
                    인증번호 확인
                </button>
            </div>

            {/* 자기소개 입력 (봉사자만 보임) */}
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

            {/* 약관 동의 */}
            <div className={styles.agreement}>
                <label>
                    <input type="checkbox" checked={agreeAll} onChange={(e) => handleAllAgreeChange(e.target.checked)} />
                    약관 전체동의
                </label>
                <div className={styles.termsList}>
                    <label><input type="checkbox" checked={agreements.terms} onChange={(e) => setAgreements((prev) => ({ ...prev, terms: e.target.checked }))} /> 이용약관 동의 (필수)</label>
                    <label><input type="checkbox" checked={agreements.privacy} onChange={(e) => setAgreements((prev) => ({ ...prev, privacy: e.target.checked }))} /> 개인정보 수집 동의 (필수)</label>
                    <label><input type="checkbox" checked={agreements.marketing} onChange={(e) => setAgreements((prev) => ({ ...prev, marketing: e.target.checked }))} /> 마케팅 정보 수신 동의 (선택)</label>
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
