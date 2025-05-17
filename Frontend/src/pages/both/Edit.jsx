// ✅ 필수 라이브러리 및 컴포넌트 import
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../../components/Topbar";
import LoadingModal from "../../components/LoadingModal";
import { fetchUserInfo, updateUserInfo, checkPassword, updatePassword } from "../../api/both";
import { getPreSignedUrl } from "../../api/ImgApi";
import axios from "axios";
import styles from "./Edit.module.css";

export default function Edit() {
    const navigate = useNavigate();
    const userType = localStorage.getItem("userType") || "volunteer";  // ✅ 유저타입 (volunteer/user)

    // ✅ 주소 district 변환용 맵 (영문 ↔ 한글)
    const districtMap = {
        GANGNAM: "강남구", GANGDONG: "강동구", GANGBUK: "강북구", GANGSEO: "강서구",
        GWANAK: "관악구", GWANGJIN: "광진구", GURO: "구로구", GEUMCHEON: "금천구",
        NOWON: "노원구", DOBONG: "도봉구", DONGDAEMUN: "동대문구", DONGJAK: "동작구",
        MAPO: "마포구", SEODAEMUN: "서대문구", SEOCHO: "서초구", SEONGDONG: "성동구",
        SEONGBUK: "성북구", SONGPA: "송파구", YANGCHEON: "양천구", YEONGDEUNGPO: "영등포구",
        YONGSAN: "용산구", EUNPYEONG: "은평구", JONGNO: "종로구"
    };
    const reverseDistrictMap = Object.fromEntries(Object.entries(districtMap).map(([key, value]) => [value, key]));

    // ✅ form 상태 및 기타 상태값 관리
    const [formData, setFormData] = useState({
        name: "", age: "", gender: "", phone: "", district: "", detail: "", profileImage: "", introduction: ""
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [passwordInput, setPasswordInput] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [matchError, setMatchError] = useState(false);

    // ✅ 유저 정보 로딩 (마운트 시 1회)
    useEffect(() => {
        const loadUserInfo = async () => {
            setIsLoading(true);
            try {
                const data = await fetchUserInfo(userType);  // API 호출

                const profileImageUrl = data.profileImage || "/profile.svg";  // 기본 이미지 fallback

                // formData 세팅
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

                // localStorage 값도 업데이트 (다른 곳에서 쓸 경우 대비)
                localStorage.setItem('username', formData.name);
                localStorage.setItem('useraddress', JSON.stringify(data.address));

            } catch (error) {
                alert("유저 정보 불러오기 실패: " + error.message);
            } finally {
                setIsLoading(false);
            }
        };
        loadUserInfo();
    }, [userType]);

    // ✅ form input 값 변경 핸들러
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // ✅ 프로필 이미지 클릭 시 이미지 선택 & S3 업로드
    const handleImageClick = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";

        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            console.log("📸 선택한 이미지 파일:", file);

            try {
                setIsLoading(true);

                const { preSignedUrl, key } = await getPreSignedUrl('profile', userType);  // S3 업로드용 URL 요청
                console.log("📝 S3 PreSigned URL:", preSignedUrl);

                await axios.put(preSignedUrl, file, { headers: { 'Content-Type': file.type || 'application/octet-stream' } });

                const uploadedUrl = `https://ongi-s3.s3.ap-northeast-2.amazonaws.com/${key}?v=${new Date().getTime()}`;
                setFormData((prev) => ({ ...prev, profileImage: uploadedUrl }));  // 캐싱 회피용 v=timestamp

            } catch (error) {
                alert("이미지 업로드 실패: " + error.message);
            } finally {
                setIsLoading(false);
            }
        };
        input.click();
    };

    // ✅ 정보 수정 제출 핸들러
    const handleInfoSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        let finalImageUrl = formData.profileImage;

        // ✅ 이미지 새로 선택한 경우, 다시 업로드 후 URL 갱신
        if (selectedFile) {
            try {
                const { preSignedUrl, key } = await getPreSignedUrl('profile', userType);
                await axios.put(preSignedUrl, selectedFile, {
                    headers: { 'Content-Type': selectedFile.type || 'application/octet-stream' }
                });
                finalImageUrl = `https://ongi-s3.s3.ap-northeast-2.amazonaws.com/${key}`;

            } catch (error) {
                alert("프로필 이미지 업로드 실패: " + error.message);
                setIsLoading(false);
                return;
            }
        }

        // ✅ 최종 업데이트 payload 구성
        const updatePayload = {
            name: formData.name,
            age: Number(formData.age),
            gender: formData.gender,
            phone: formData.phone,
            address: { district: reverseDistrictMap[formData.district] || "", detail: formData.detail },
            profileImage: finalImageUrl,
            bio: formData.introduction,
            userType
        };

        // ✅ API 호출 → 정보 업데이트
        try {
            await updateUserInfo(updatePayload);
            alert("정보가 수정되었습니다.");

            if (userType === "volunteer") {
                navigate('/volunteermain', { state: { updated: true } }); // ✅ 최신화 반영 위해 state 전달
            }
            else {
                navigate('/usermain', { state: { updated: true } });
            }
        } catch (error) {
            alert("정보 수정 실패: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ 비밀번호 변경 제출 핸들러
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        try {
            await checkPassword(passwordInput, userType);  // ✅ 현재 비밀번호 검증
            setPasswordError(false);

            if (!newPassword || !confirmPassword) {
                alert("새 비밀번호를 입력해주세요.");
                return;
            }

            if (newPassword !== confirmPassword) {
                setMatchError(true);
                return;
            }

            await updatePassword(newPassword, userType);  // ✅ 비밀번호 업데이트
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

    // ✅ 실제 렌더링 부분 (폼 & 로딩 모달 포함)
    return (
        <div className={styles.container}>
            <Topbar title="프로필 수정" />
            <form className={styles.form} onSubmit={handleInfoSubmit}>
                <div className={styles.profileImageWrapper} onClick={handleImageClick}>
                    <img
                        src={formData.profileImage || "/profile.svg"}
                        alt="Profile"
                        className={styles.profileImage}
                    />
                </div>

                {/* 기본 정보 입력 폼 */}
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

                {/* 봉사자 전용 자기소개 */}
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

            {/* 비밀번호 변경 폼 */}
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

            {/* 로딩 모달 */}
            <LoadingModal isOpen={isLoading} message="처리 중입니다..." />
        </div>
    );
}
