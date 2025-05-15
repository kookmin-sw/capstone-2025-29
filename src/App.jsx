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

/* 메인 App 컴포넌트 */
function App() {
  useEffect(() => {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        requestFCMToken();
      } else {
        console.warn('Notification permission denied');
      }
    });
  }, []);

  // ✅ 2. 포그라운드 알림 수신 처리
  useEffect(() => {
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      // ✅ 여기서 사용자에게 보여줄 알림 처리 (예: toast, alert 등)
      alert(`📩 ${payload.notification.title}: ${payload.notification.body}`);
    });
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

