import React from "react";
import styles from "./UserMain.module.css";
import ongi from "../../assets/ongi.svg";
import { useNavigate } from "react-router-dom";

/* 사용자 메인 페이지 컴포넌트 */
export default function UserMain() {
    // 페이지 이동을 위한 navigate 훅
    const navigate = useNavigate();

    // 채팅 버튼 클릭 핸들러
    const handleChatClick = () => {
        // 로컬 스토리지에서 사용자 이름 확인
        const userName = localStorage.getItem('userName');
        if (!userName) {
            // 이름이 설정되지 않은 경우 SetName 페이지로 이동
            navigate('/SetName');
        } else {
            // 이름이 설정된 경우 ChatCenter 페이지로 이동
            navigate('/ChatCenter');
        }
    };

    return (
        <div className={styles.container}>
            {/* 상단 네비게이션 바 */}
            <div className={styles.topbar}>
                {/* 로고 */}
                <button className={styles.logo}>
                    <img src={ongi} alt="온기 로고" />
                </button>
                {/* 우측 상단 버튼들 */}
                <div className={styles.topRightButtons}>
                    {/* 프로필 편집 버튼 */}
                    <button className={styles.iconBtn} onClick={() => navigate('/edit')}>
                        <img src="../public/profileedit.svg" alt="프로필 편집" />
                    </button>
                    {/* 알림 버튼 */}
                    <button className={styles.iconBtn}>
                        <img src="../public/alarm.svg" alt="알람" />
                    </button>
                </div>
            </div>

            {/* 메인 카드 영역 */}
            <div className={styles.cardwrapper}>
                {/* 봉사자 연결 카드 */}
                <div className={styles.mainCard}>
                    <div className={styles.textSection}>
                        <h2>한번의 터치로<br />봉사자를 연결해드려요.</h2>
                        <p>혼자가 아닙니다, 당신을 도울 사람이 있습니다.<br />
                            필요한 도움, 지금 바로 신청하세요!</p>
                    </div>
                    <div className={styles.imageWrapper}>
                        <img src="../../public/volunteer.svg" alt="봉사자 이미지" className={styles.volunteerimg}/>
                    </div>
                    {/* 도움 신청 버튼 */}
                    <button className={styles.actionBtn} onClick={() => navigate('/HelpCenter')}>신청하러 가기</button>
                </div>

                {/* 채팅 카드 */}
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
                    {/* 채팅 시작 버튼 */}
                    <button className={styles.chatBtn} onClick={handleChatClick}>채팅하러 가기</button>
                </div>
            </div>
        </div>
    );
}
