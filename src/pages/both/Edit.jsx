import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Edit.module.css";
import Topbar from "../../components/Topbar";
import {
    fetchUserInfo,
    updateUserInfo,
    checkPassword,
    updatePassword,
} from "../../api/both";

export default function Edit() {
    const navigate = useNavigate();

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
                    district: data.address?.district || "",
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
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // ✅ 기본 정보 수정 핸들러
    const handleInfoSubmit = async (e) => {
        e.preventDefault();

        const updatePayload = {
            name: formData.name,
            age: Number(formData.age),
            gender: formData.gender,
            phone: formData.phone,
            address: {
                district: formData.district,
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

    // ✅ 비밀번호 변경 핸들러
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        // 새 비밀번호 확인 불일치
        if (newPassword !== confirmPassword) {
            setMatchError(true);
            setPasswordError(false);
            return;
        } else {
            setMatchError(false);
        }

        try {
            // 현재 비밀번호 확인
            await checkPassword(passwordInput, userType);
            setPasswordError(false);

            // 비밀번호 변경
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
                    <img className={styles.profileImage} src={formData.profileImage || "/profile.svg"} alt="" />
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
                    <input name="gender" type="text" value={formData.gender} onChange={handleInputChange} />
                </div>

                <div className={styles.inputGroup}>
                    <label>번호</label>
                    <input name="phone" type="text" value={formData.phone} onChange={handleInputChange} />
                </div>

                <div className={styles.inputGroup}>
                    <label>지역(구)</label>
                    <input name="district" type="text" value={formData.district} onChange={handleInputChange} />
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
                    {passwordError && (
                        <span className={styles.errorText}>* 비밀번호를 확인해주세요.</span>
                    )}
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
                    {matchError && (
                        <span className={styles.errorText}>* 새 비밀번호를 확인해주세요.</span>
                    )}
                </div>

                <button type="submit" className={styles.submitBtn}>변경하기</button>
            </form>
        </div>
    );
}
