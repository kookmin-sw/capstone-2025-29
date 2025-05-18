// ✅ 필수 라이브러리 및 컴포넌트 import
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../../components/Topbar";
import LoadingModal from "../../components/LoadingModal";
import { fetchUserInfo, updateUserInfo, checkPassword, updatePassword } from "../../api/both";
import { getPreSignedUrl } from "../../api/ImgApi";
import axios from "axios";
import styles from "./Edit.module.css";
import { motion } from 'framer-motion';

export default function Edit() {
    const navigate = useNavigate();
    const userType = localStorage.getItem("userType") || "volunteer";

    const districtMap = {
        GANGNAM: "강남구", GANGDONG: "강동구", GANGBUK: "강북구", GANGSEO: "강서구",
        GWANAK: "관악구", GWANGJIN: "광진구", GURO: "구로구", GEUMCHEON: "금천구",
        NOWON: "노원구", DOBONG: "도봉구", DONGDAEMUN: "동대문구", DONGJAK: "동작구",
        MAPO: "마포구", SEODAEMUN: "서대문구", SEOCHO: "서천구", SEONGDONG: "성동구",
        SEONGBUK: "성북구", SONGPA: "송파구", YANGCHEON: "양천구", YEONGDEUNGPO: "영등포구",
        YONGSAN: "용산구", EUNPYEONG: "은평구", JONGNO: "종로구"
    };
    const reverseDistrictMap = Object.fromEntries(Object.entries(districtMap).map(([key, value]) => [value, key]));

    const [formData, setFormData] = useState({
        name: "", age: "", gender: "", phone: "", district: "", detail: "", profileImage: "", introduction: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [passwordInput, setPasswordInput] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [matchError, setMatchError] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const [imageKey, setImageKey] = useState(Date.now()); // 이미지 강제 리렌더링용 key 추가

    useEffect(() => {
        const loadUserInfo = async () => {
            setIsLoading(true);
            try {
                const data = await fetchUserInfo(userType);
                const profileImageUrl = data.profileImage || "/profile.svg";
                setFormData({
                    name: data.name || "",
                    age: data.age?.toString() || "",
                    gender: data.gender || "",
                    phone: data.phone || "",
                    district: districtMap[data.address?.district] || "",
                    detail: data.address?.detail || "",
                    profileImage: profileImageUrl,
                    introduction: data.bio || ""
                });
                localStorage.setItem('username', data.name);
                localStorage.setItem('useraddress', JSON.stringify(data.address));
            } catch (error) {
                alert("유저 정보 로드 실패: " + error.message);
            } finally {
                setIsLoading(false);
            }
        };
        loadUserInfo();
    }, [userType]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageClick = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";

        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            let timeoutId;
            try {
                setIsLoading(true);
                setImageLoading(true);

                // ✅ 5초 타이머 시작
                timeoutId = setTimeout(() => {
                    alert("사진 업로드가 오래 걸리고 있습니다. 다시 시도해주세요.");
                    setImageLoading(false);
                }, 10000);

                const { preSignedUrl, key } = await getPreSignedUrl('profile', userType);
                await axios.put(preSignedUrl, file, {
                    headers: { 'Content-Type': file.type || 'application/octet-stream' }
                });

                const uploadedUrl = `${import.meta.env.VITE_S3_BASE_URL}/${key}?v=${Date.now()}`;
                setFormData((prev) => ({ ...prev, profileImage: uploadedUrl }));

            } catch (error) {
                alert("사진 업로드 실패: " + error.message);
            } finally {
                clearTimeout(timeoutId); // ✅ 타이머 제거
                setIsLoading(false);
                setImageLoading(false);
            }
        };

        input.click();
    };


    const handleInfoSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

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
            bio: formData.introduction,
            userType
        };

        try {
            await updateUserInfo(updatePayload);
            alert("정보가 수정되었습니다.");
            navigate(userType === "volunteer" ? '/volunteermain' : '/usermain', { state: { updated: true } });
        } catch (error) {
            alert("정보 수정 실패: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        try {
            await checkPassword(passwordInput, userType);
            setPasswordError(false);

            if (!newPassword || !confirmPassword) {
                alert("새 비밀번호를 입력해주세요.");
                return;
            }

            if (newPassword !== confirmPassword) {
                setMatchError(true);
                return;
            }

            await updatePassword(newPassword, userType);
            alert("비밀번호가 변경되었습니다.");
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
            <form className={styles.form} onSubmit={handleInfoSubmit}>
                <div className={styles.profileImageWrapper} onClick={handleImageClick}>
                    <img
                        src={formData.profileImage || "/profile.svg"}
                        alt="Profile"
                        className={styles.profileImage}
                        onLoad={() => {
                            if (imageLoading) {
                                setIsLoading(false);
                                setImageLoading(false);
                                alert("이미지가 선택되었습니다.");
                            }
                        }}
                    />
                </div>

                {["name", "age", "phone", "district", "detail"].map(field => (
                    <div key={field} className={styles.inputGroup}>
                        <label>{field === "district" ? "지역(구)" : field === "detail" ? "상세주소" : field === "phone" ? "번호" : field === 'name' ? '이름' : field === 'age' ? '나이' : field}</label>
                        {field === "district" ? (
                            <select name={field} value={formData[field]} onChange={handleInputChange}>
                                <option value="">지역 선택</option>
                                {Object.entries(districtMap).map(([key, value]) => (
                                    <option key={key} value={value}>{value}</option>
                                ))}
                            </select>
                        ) : (
                            <input name={field} type="text" value={formData[field]} onChange={handleInputChange} />
                        )}
                    </div>
                ))}

                {userType === "volunteer" && (
                    <div className={styles.inputGroup}>
                        <label>자기소개</label>
                        <textarea
                            className={styles.introduction}
                            name="introduction"
                            value={formData.introduction}
                            onChange={handleInputChange}
                            rows={10}
                            placeholder="소개를 잘 작성하시면 매칭에 도움이 됩니다."
                        />
                    </div>
                )}
                <button type="submit" className={styles.submitBtn}>수정하기</button>
            </form>

            <form className={styles.form} onSubmit={handlePasswordSubmit}>
                <div className={styles.inputGroup}>
                    <label>현재 비밀번호</label>
                    <input
                        placeholder="현재 비밀번호를 입력해주세요"
                        name="passwordInput"
                        type="password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                    />
                    {passwordError && <span className={styles.errorText}>비밀번호를 확인해주세요.</span>}
                </div>
                <div className={styles.inputGroup}>
                    <label>새 비밀번호</label>
                    <input
                        placeholder="새 비밀번호를 입력해주세요."
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label>새 비밀번호 확인</label>
                    <input
                        placeholder="새 비밀번호를 확인해주세요."
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {matchError && <span className={styles.errorText}>비밀번호가 일치하지 않습니다.</span>}
                </div>
                <button type="submit" className={styles.submitBtn}>비밀번호 변경</button>
            </form>

            <LoadingModal isOpen={isLoading} message="처리 중입니다..." />
        </div>
    );
}
