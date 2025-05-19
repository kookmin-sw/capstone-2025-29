import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./RoleSelect.module.css";
import Topbar from "../../components/Topbar";

export default function RoleSelect() {
    const navigate = useNavigate();
    const location = useLocation();

    // ✅ 선택된 역할 (elderly 또는 volunteer)
    const [selectedRole, setSelectedRole] = useState("");

    // ✅ 카카오 로그인 등에서 전달된 사용자 정보
    const [userInfo, setUserInfo] = useState({
        username: "",
        name: "",
        gender: "",
        phone: "",
        age: ""
    });

    // ✅ URL 쿼리 파라미터에서 사용자 정보 추출
    useEffect(() => {
        if (location.search) {
            const params = new URLSearchParams(location.search);
            const newUserInfo = {
                username: params.get("username") || "",
                name: params.get("name") || "",
                gender: params.get("gender") || "",
                phone: params.get("phone") || "",
                age: params.get("age") || ""
            };

            setUserInfo(newUserInfo);
        }
    }, [location.search]);

    // ✅ 역할 선택
    const handleSelect = (role) => {
        setSelectedRole(role);
    };

    // ✅ 다음 페이지로 이동 (회원가입 페이지)
    const handleNext = () => {
        if (selectedRole) {
            navigate('/signup', { state: { role: selectedRole, userInfo } });
        } else {
            alert("가입 유형을 선택해주세요.");
        }
    };

    return (
        <div className={styles.container}>
            <Topbar title="" />

            <div className={styles.titleBox}>
                <h2>가입 유형을</h2>
                <h2>선택해주세요.</h2>
            </div>

            <div className={styles.roleBox}>
                {/* ✅ 앱 이용자 카드 */}
                <div
                    className={`${styles.roleCard} ${styles.userCard} ${selectedRole === "elderly" ? styles.active : ""}`}
                    onClick={() => handleSelect("elderly")}
                >
                    <p className={selectedRole === "elderly" ? styles.selectedText : ""}>
                        앱 이용자<br />회원 가입
                    </p>
                    <img
                        src={selectedRole === "elderly" ? "/user-icon-purple.svg" : "/user-icon.svg"}
                        alt="앱 이용자"
                    />
                </div>

                {/* ✅ 봉사자 카드 */}
                <div
                    className={`${styles.roleCard} ${styles.volunteerCard} ${selectedRole === "volunteer" ? styles.active : ""}`}
                    onClick={() => handleSelect("volunteer")}
                >
                    <p className={selectedRole === "volunteer" ? styles.selectedText : ""}>
                        봉사자<br />회원 가입
                    </p>
                    <img
                        src={selectedRole === "volunteer" ? "/volunteer-icon-purple.svg" : "/volunteer-icon.svg"}
                        alt="봉사자"
                    />
                </div>

                {/* ✅ 다음 버튼 */}
                <div className={styles.arrowButton} onClick={handleNext}>
                    <img src="/nextbtn.svg" alt="다음" />
                </div>
            </div>
        </div>
    );
}
