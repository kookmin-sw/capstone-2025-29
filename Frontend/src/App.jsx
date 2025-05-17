/* React와 필요한 라이브러리 import */
import { useState } from 'react'
import { useEffect } from 'react';
import { requestFCMToken } from './fcm';   // ✅ 토큰 요청 함수
import { messaging, onMessage } from './firebase'; // ✅ 포그라운드 알림 수신
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* 페이지 컴포넌트 import */
// 공통 페이지
import Splash from './pages/both/Splash';
import Login from './pages/both/Login';
import Signup from './pages/both/Signup';
import Edit from './pages/both/Edit';
import RoleSelect from './pages/both/RoleSelect';

// 봉사자 관련 페이지
import VolunteerMain from './pages/volunteer/VolunteerMain';
import WriteReview from './pages/volunteer/WriteReview';
import AvailableTime from './pages/volunteer/AvailableTime';
import MatchingList from './pages/volunteer/MatchingList';
import CompleteReview from './pages/volunteer/CompleteReview';
import MatchingDetail from './pages/volunteer/MatchingDetail';
import ReviewDetail from './pages/volunteer/ReviewDetail';

// 사용자 관련 페이지
import UserMain from './pages/user/UserMain';
import HelpCenter from './pages/user/HelpCenter';
import RequestForm from './pages/user/RequestForm';
import ApplyingList from './pages/user/ApplyingList';
import ApplyingDetail from './pages/user/ApplyingDetail';
import SetName from './pages/user/SetName';
import ChatCenter from './pages/user/ChatCenter';
import ChatPage from './pages/user/ChatPage';
import NotificationPage from './pages/both/NotificationPage';
import VolunteerRecommend from './pages/user/VolunteerRecommend';
import RedirectHandler from './api/RedirectHandler'; // ✅ 리다이렉트 핸들러

import LoadingModalTest from './components/LoadingModalTest';

let isOnMessageRegistered = false;

/* 메인 App 컴포넌트 */
function App() {

  useEffect(() => {
    const isPWA = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    const isNotificationSupported = 'Notification' in window;

    // ✅ 서비스 워커 등록 (모바일/데스크톱 공통)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then(registration => {
          console.log('✅ Service Worker 등록 성공:', registration.scope);
        })
        .catch(error => {
          console.error('❌ Service Worker 등록 실패:', error);
        });
    }

    // ✅ PWA 환경일 때 알림 권한 요청
    if (isPWA && isNotificationSupported) {
      console.log('✅ iOS PWA 환경 감지됨');

      const handleFCMRequest = async () => {
        try {
          await requestFCMToken();
          console.log('✅ FCM 토큰 발급 성공');
        } catch (err) {
          alert('❌ FCM 토큰 요청 실패: ' + err.message);
          console.error('FCM 요청 실패:', err);
        }
      };

      if (Notification.permission === 'default') {
        alert("📱 앱을 처음 실행했습니다. 알림 권한을 요청합니다.");
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            handleFCMRequest();
          } else {
            alert("⚠️ 알림 권한이 거부되었습니다. 설정 > Safari > 알림에서 허용으로 변경해주세요.");
          }
        });
      } else if (Notification.permission === 'granted') {
        handleFCMRequest();
      } else if (Notification.permission === 'denied') {
        alert("🚫 알림이 차단되어 있습니다. 설정 > Safari > 알림에서 허용해주세요.");
      }
    } else {
      console.log('❌ PWA 환경이 아니거나 알림을 지원하지 않는 브라우저입니다.');
    }
  }, []);

  // ✅ 포그라운드 푸시 알림 수신 처리
  useEffect(() => {
    if (!isOnMessageRegistered) {
      onMessage(messaging, (payload) => {
        console.log('📩 FCM 메시지 수신:', payload);
        alert(`📩 ${payload.notification.title}: ${payload.notification.body}`);
      });
      isOnMessageRegistered = true;
    }
  }, []);

  // ✅ 2. 포그라운드 알림 수신 처리
  useEffect(() => {
    if (!isOnMessageRegistered) {
      onMessage(messaging, (payload) => {
        console.log('Message received. ', payload);
        alert(`📩 ${payload.notification.title}: ${payload.notification.body}`);
      });
      isOnMessageRegistered = true;
    }
  }, []);

  return (
    <>
      {/* 라우터 설정 */}
      <Router>
        <Routes>
          {/* 공통 페이지 라우트 */}
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/roleselect" element={<RoleSelect />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/edit" element={<Edit />} />
          <Route path="/notification" element={<NotificationPage />} />

          {/* 봉사자 페이지 라우트 */}
          <Route path="/volunteermain" element={<VolunteerMain />} />
          <Route path="/writereview" element={<WriteReview />} />
          <Route path="/availabletime" element={<AvailableTime />} />
          <Route path="/matchinglist" element={<MatchingList />} />
          <Route path="/completereview" element={<CompleteReview />} />
          <Route path="/matchingdetail" element={<MatchingDetail />} />
          <Route path="/reviewdetail" element={<ReviewDetail />} />

          {/* 사용자 페이지 라우트 */}
          <Route path="/usermain" element={<UserMain />} />
          <Route path="/helpcenter" element={<HelpCenter />} />
          <Route path="/requestform" element={<RequestForm />} />
          <Route path="/applyinglist" element={<ApplyingList />} />
          <Route path="/applyingdetail" element={<ApplyingDetail />} />
          <Route path="/setname" element={<SetName />} />
          <Route path="/chatcenter" element={<ChatCenter />} />
          <Route path="/chatpage" element={<ChatPage />} />
          <Route path="/VolunteerRecommend" element={<VolunteerRecommend />} />

          {/* 리다이렉트 핸들러 - 로그인 후 리다이렉트 처리 */}
          <Route path="/redirect" element={<RedirectHandler />} />

          {/* 테스트 페이지 - 로딩 모달 테스트 */}
          <Route path="/loadingmodaltest" element={<LoadingModalTest />} />



          {/* 404 페이지 - 정의되지 않은 경로로 접근 시 표시 */}
          <Route path="*" element={<div>not found</div>} />
        </Routes>
      </Router>
    </>
  )
}

export default App

