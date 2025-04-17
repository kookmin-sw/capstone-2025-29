import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFCMToken } from '../../utils/firebase';
import styles from './SignUp.module.css';

export default function SignUp() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        fcmToken: '' // FCM 토큰을 저장할 상태
    });

    // FCM 토큰 가져오기
    const getAndSetFCMToken = async () => {
        try {
            const token = await getFCMToken();
            setFormData(prev => ({ ...prev, fcmToken: token }));
            return token;
        } catch (error) {
            console.error('FCM 토큰 가져오기 실패:', error);
            // 토큰 가져오기 실패 시에도 회원가입은 진행할 수 있도록 처리
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // 회원가입 전에 FCM 토큰 가져오기
            await getAndSetFCMToken();
            
            // 회원가입 API 호출
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('회원가입이 완료되었습니다.');
                navigate('/login');
            } else {
                throw new Error('회원가입에 실패했습니다.');
            }
        } catch (error) {
            console.error('회원가입 오류:', error);
            alert('회원가입 중 오류가 발생했습니다.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className={styles.container}>
            <h2>회원가입</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="email">이메일</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="password">비밀번호</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="name">이름</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className={styles.submitButton}>
                    회원가입
                </button>
            </form>
        </div>
    );
} 