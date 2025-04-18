import React, { useState } from "react";
import styles from "./RoleSelect.module.css";
import Topbar from "../../components/Topbar";
import { useNavigate } from "react-router-dom";

export default function RoleSelect() {
    const navigate = useNavigate();

    const [selectedRole, setSelectedRole] = useState("");

    const handleSelect = (role) => {
        setSelectedRole(role);
    };

    return (
        <div className={styles.container}>
            <Topbar title="" />

            <div className={styles.titleBox}>
                <h2>가입 유형을</h2>
                <h2>선택해주세요.</h2>
            </div>

            <div className={styles.roleBox}>
                <div
                    className={`${styles.roleCard} ${styles.userCard} ${selectedRole === "user" ? styles.active : ""}`}
                    onClick={() => handleSelect("user")}
                >
                    <p className={selectedRole === "user" ? styles.selectedText : ""}>앱 이용자<br />회원 가입</p>
                    <img src={selectedRole === "user" ? "/user-icon-purple.svg" : "/user-icon.svg"} alt="앱 이용자" />
                </div>

                <div
                    className={`${styles.roleCard} ${styles.volunteerCard} ${selectedRole === "volunteer" ? styles.active : ""}`}
                    onClick={() => handleSelect("volunteer")}
                >
                    <p className={selectedRole === "volunteer" ? styles.selectedText : ""}>봉사자<br />회원 가입</p>
                    <img src={selectedRole === "volunteer" ? "/volunteer-icon-purple.svg" : "/volunteer-icon.svg"} alt="봉사자" />

                </div>

                <div className={styles.arrowButton} onClick={() => {
                    if (selectedRole) {
                        navigate('/signup', { state: { role: selectedRole } });
                    } else {
                        alert("가입 유형을 선택해주세요.");
                    }
                }}>
                    <img src="/nextbtn.svg" alt="다음" />
                </div>

            </div>


        </div>
    );
}
