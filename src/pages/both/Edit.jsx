import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../../components/Topbar";
import {
    fetchUserInfo,
    updateUserInfo,
    checkPassword,
    updatePassword,
} from "../../api/both";
import styles from "./Edit.module.css";

export default function Edit() {
    const navigate = useNavigate();

    const districtMap = {
        GANGNAM: "강남구", GANGDONG: "강동구", GANGBUK: "강북구", GANGSEO: "강서구",
        GWANAK: "관악구", GWANGJIN: "광진구", GURO: "구로구", GEUMCHEON: "금천구",
        NOWON: "노원구", DOBONG: "도봉구", DONGDAEMUN: "동대문구", DONGJAK: "동작구",
        MAPO: "마포구", SEODAEMUN: "서대문구", SEOCHO: "서초구", SEONGDONG: "성동구",
        SEONGBUK: "성북구", SONGPA: "송파구", YANGCHEON: "양천구", YEONGDEUNGPO: "영등포구",
        YONGSAN: "용산구", EUNPYEONG: "은평구", JONGNO: "종로구"
    };

    const reverseDistrictMap = Object.fromEntries(
        Object.entries(districtMap).map(([key, value]) => [value, key])
    );



    const [formData, setFormData] = useState({
        name: "",
        age: "",
        gender: "",
        phone: "",
        district: "",
        detail: "",
        profileImage: ""
    });

    const [passwordInput, setPasswordInput] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [matchError, setMatchError] = useState(false);

    const userType = localStorage.getItem("userType") || "volunteer";

    useEffect(() => {
        const loadUserInfo = async () => {
            try {
                const data = await fetchUserInfo(userType);
                setFormData({
                    name: data.name || "",
                    age: data.age?.toString() || "",
                    gender: data.gender || "",
                    phone: data.phone || "",
                    district: districtMap[data.address?.district] || "",
                    detail: data.address?.detail || "",
                    profileImage: data.profileImage || ""
                });
            } catch (error) {
                alert("유저 정보 불러오기 실패: " + error.message);
            }
        };

        loadUserInfo();
    }, [userType]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleInfoSubmit = async (e) => {
        e.preventDefault();

        const updatePayload = {
            name: formData.name,
            age: Number(formData.age),
            gender: formData.gender,
            phone: formData.phone,
            address: {
                district: reverseDistrictMap[formData.district] || "",
                detail: formData.detail
            },
            profileImage: formData.profileImage,
            userType
        };

        try {
            await updateUserInfo(updatePayload);
            alert("기본 정보가 수정되었습니다.");
            navigate(userType === "volunteer" ? "/volunteermain" : "/usermain");
        } catch (error) {
            alert("정보 수정 실패: " + error.message);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        try {
            // 현재 비밀번호 확인
            await checkPassword(passwordInput, userType);
            setPasswordError(false);

            // 새 비밀번호 / 비밀번호 확인 공란 체크
            if (newPassword.trim() === "" || confirmPassword.trim() === "") {
                alert("새 비밀번호를 입력해주세요.");
                return;
            }

            // 새 비밀번호 일치 여부 체크
            if (newPassword !== confirmPassword) {
                setMatchError(true);
                return;
            } else {
                setMatchError(false);
            }

            // 비밀번호 변경 진행
            await updatePassword(newPassword, userType);
            alert("비밀번호가 성공적으로 변경되었습니다!");
            navigate(userType === "volunteer" ? "/volunteermain" : "/usermain");
        } catch (error) {
            if (error.status === 401 || error.message.includes("비밀번호")) {
                setPasswordError(true);
            } else {
                alert("비밀번호 변경 실패: " + error.message);
            }
        }
    };

    return (
        <div className={styles.container}>
            <Topbar title="프로필 수정" />

            {/* 기본 정보 수정 폼 */}
            <form className={styles.form} onSubmit={handleInfoSubmit}>
                <div className={styles.profileImageWrapper}>
                    <img
                        className={styles.profileImage}
                        src={formData.profileImage || "/profile.svg"}
                        alt="Profile"
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>이름</label>
                    <input name="name" type="text" value={formData.name} onChange={handleInputChange} />
                </div>

                <div className={styles.inputGroup}>
                    <label>나이</label>
                    <input name="age" type="text" value={formData.age} onChange={handleInputChange} />
                </div>

                <div className={styles.inputGroup}>
                    <label>성별</label>
                    <input
                        type="text"
                        value={formData.gender === 'male' ? '남성' : formData.gender === 'female' ? '여성' : '정보 없음'}
                        readOnly
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>번호</label>
                    <input name="phone" type="text" value={formData.phone} onChange={handleInputChange} />
                </div>

                <div className={styles.inputGroup}>
                    <label>지역(구)</label>
                    <select name="district" value={formData.district} onChange={handleInputChange}>
                        <option value="">지역 선택</option>
                        {Object.entries(districtMap).map(([key, value]) => (
                            <option key={key} value={value}>{value}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.inputGroup}>
                    <label>지역(상세)</label>
                    <input name="detail" type="text" value={formData.detail} onChange={handleInputChange} />
                </div>

                <button type="submit" className={styles.submitBtn}>수정하기</button>
            </form>

            {/* 비밀번호 변경 폼 */}
            <form className={styles.form} onSubmit={handlePasswordSubmit}>
                <div className={styles.inputGroup}>
                    <label>현재 비밀번호</label>
                    <input
                        type="password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="현재 비밀번호를 입력해주세요"
                    />
                    {passwordError && <span className={styles.errorText}>* 비밀번호를 확인해주세요.</span>}
                </div>

                <div className={styles.inputGroup}>
                    <label>새 비밀번호</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="새 비밀번호를 입력해 주세요."
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>새 비밀번호 확인</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="새 비밀번호를 한번 더 입력해 주세요."
                    />
                    {matchError && <span className={styles.errorText}>* 새 비밀번호를 확인해주세요.</span>}
                </div>

                <button type="submit" className={styles.submitBtn}>변경하기</button>
            </form>
        </div>
    );
}
