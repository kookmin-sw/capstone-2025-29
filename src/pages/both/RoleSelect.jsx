import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./RoleSelect.module.css";
import Topbar from "../../components/Topbar";

export default function RoleSelect() {
    const navigate = useNavigate();
    const location = useLocation();

    const [selectedRole, setSelectedRole] = useState("");

    
    useEffect(() => {
        console.log(location)
        if (location.search) {
            const params = new URLSearchParams(location.search);
            
            const username = params.get("username");
            const name = params.get("name");
            const gender = params.get("gender");
            const phone = params.get("phone");
            const age = params.get("age");

            console.log("=== Query Params ===");
            console.log("username:", username);
            console.log("name:", name);
            console.log("gender:", gender);
            console.log("phone:", phone);
            console.log("age:", age);
        } else {
            console.log("location.search is empty:", location.search);
        }
    }, []);

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
                    className={`${styles.roleCard} ${styles.userCard} ${selectedRole === "elderly" ? styles.active : ""}`}
                    onClick={() => handleSelect("elderly")}
                >
                    <p className={selectedRole === "elderly" ? styles.selectedText : ""}>앱 이용자<br />회원 가입</p>
                    <img src={selectedRole === "elderly" ? "/user-icon-purple.svg" : "/user-icon.svg"} alt="앱 이용자" />
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
