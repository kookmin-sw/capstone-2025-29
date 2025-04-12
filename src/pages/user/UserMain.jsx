import React from "react";
import styles from "./UserMain.module.css";
import ongi from "../../assets/ongi.svg";
import { useNavigate } from "react-router-dom";


export default function UserMain() {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            {/* 상단바 */}
            <div className={styles.topbar}>
                <button className={styles.logo}>
                    <img src={ongi} alt="온기 로고" />
                </button>
                <div className={styles.topRightButtons}>
                    <button className={styles.iconBtn} onClick={() => navigate('/edit')}>
                        <img src="../public/profileedit.svg" alt="프로필 편집" />
                    </button>
                    <button className={styles.iconBtn}>
                        <img src="../public/alarm.svg" alt="알람" />
                    </button>
                </div>
            </div>

            <div className={styles.cardwrapper}>
                {/* 첫 번째 카드 */}
                <div className={styles.mainCard}>
                    <div className={styles.textSection}>
                        <h2>한번의 터치로<br />봉사자를 연결해드려요.</h2>
                        <p>혼자가 아닙니다, 당신을 도울 사람이 있습니다.<br />
                            필요한 도움, 지금 바로 신청하세요!</p>
                    </div>
                    <div className={styles.imageWrapper}>
                        <img src="../../public/volunteer.svg" alt="봉사자 이미지" className={styles.volunteerimg}/>
                    </div>
                    <button className={styles.actionBtn} onClick={() => navigate('/HelpCenter')}>신청하러 가기</button>
                </div>

                {/* 두 번째 카드 */}
                <div className={styles.chatCard}>
                    <div className={styles.textSection}>
                        <h2>따뜻한 말벗이 필요하신가요?<br />지금 연결해 드릴게요.</h2>
                        <p>지금 대화를 시작하세요!<br />
                            당신의 하루를 함께할 따뜻한 친구를 만나보세요.</p>
                    </div>
                    <div className={styles.imageWrapper}>
                        <img src="../../public/chat-left.svg" alt="왼쪽 이미지" className={styles.leftImg} />
                        <img src="../../public/chat-right.svg" alt="오른쪽 이미지" className={styles.rightImg} />
                    </div>

                    <button className={styles.chatBtn}>채팅하러 가기</button>
                </div>
            </div>


        </div>
    );
}
