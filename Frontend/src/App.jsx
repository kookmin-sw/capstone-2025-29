import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { requestFCMToken } from './fcm';
import { messaging, onMessage } from './firebase';
import './App.css';

// 공통 페이지
import Splash from './pages/both/Splash';
import Login from './pages/both/Login';
import Signup from './pages/both/Signup';
import Edit from './pages/both/Edit';
import RoleSelect from './pages/both/RoleSelect';
import NotificationPage from './pages/both/NotificationPage';

// 봉사자 페이지
import VolunteerMain from './pages/volunteer/VolunteerMain';
import WriteReview from './pages/volunteer/WriteReview';
import AvailableTime from './pages/volunteer/AvailableTime';
import MatchingList from './pages/volunteer/MatchingList';
import CompleteReview from './pages/volunteer/CompleteReview';
import MatchingDetail from './pages/volunteer/MatchingDetail';
import ReviewDetail from './pages/volunteer/ReviewDetail';

// 사용자 페이지
import UserMain from './pages/user/UserMain';
import HelpCenter from './pages/user/HelpCenter';
import RequestForm from './pages/user/RequestForm';
import ApplyingList from './pages/user/ApplyingList';
import ApplyingDetail from './pages/user/ApplyingDetail';
import SetName from './pages/user/SetName';
import ChatCenter from './pages/user/ChatCenter';
import ChatPage from './pages/user/ChatPage';
import VolunteerRecommend from './pages/user/VolunteerRecommend';

// 기타
import RedirectHandler from './api/RedirectHandler';
import LoadingModalTest from './components/LoadingModalTest';
import NotificationWatcher from './components/NotificationWatcher';

// let isOnMessageRegistered = false;

function AppRoutes({ isNewNotification, setIsNewNotification }) {
  const location = useLocation();

  // 알림이 왔을 때 alert 띄울 화면 경로 목록
  const allowedPaths = ['/volunteermain', '/usermain', '/helpcenter'];
  const [isInitialLaunch, setIsInitialLaunch] = useState(true);

  const onNewNotification = () => {
    // 초기 실행 때는 alert 금지
    if (!isInitialLaunch && allowedPaths.includes(location.pathname) && document.visibilityState === 'visible') {
      alert("🔔 새로운 알림이 도착했습니다.");
    }

    setIsNewNotification(true);
    localStorage.setItem('isNewNotification', 'true');
  };

  useEffect(() => {
    if (allowedPaths.includes(location.pathname)) {
      setIsInitialLaunch(false); // 초기 진입 끝, 이후부터 alert 허용
    }
  }, [location.pathname]);
  return (
    <>
      <NotificationWatcher onNewNotification={onNewNotification} />
      <Routes>
        {/* 공통 */}
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/roleselect" element={<RoleSelect />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/edit" element={<Edit />} />
        <Route path="/notification" element={<NotificationPage setIsNewNotification={setIsNewNotification} />} />

        {/* 봉사자 */}
        <Route path="/volunteermain" element={<VolunteerMain isNewNotification={isNewNotification} setIsNewNotification={setIsNewNotification} />} />
        <Route path="/writereview" element={<WriteReview />} />
        <Route path="/availabletime" element={<AvailableTime />} />
        <Route path="/matchinglist" element={<MatchingList />} />
        <Route path="/completereview" element={<CompleteReview />} />
        <Route path="/matchingdetail" element={<MatchingDetail />} />
        <Route path="/reviewdetail" element={<ReviewDetail />} />

        {/* 사용자 */}
        <Route path="/usermain" element={<UserMain isNewNotification={isNewNotification} setIsNewNotification={setIsNewNotification} />} />
        <Route path="/helpcenter" element={<HelpCenter isNewNotification={isNewNotification} setIsNewNotification={setIsNewNotification} />} />
        <Route path="/requestform" element={<RequestForm />} />
        <Route path="/applyinglist" element={<ApplyingList />} />
        <Route path="/applyingdetail" element={<ApplyingDetail />} />
        <Route path="/setname" element={<SetName />} />
        <Route path="/chatcenter" element={<ChatCenter />} />
        <Route path="/chatpage" element={<ChatPage />} />
        <Route path="/VolunteerRecommend" element={<VolunteerRecommend />} />

        {/* 기타 */}
        <Route path="/redirect" element={<RedirectHandler />} />
        <Route path="/loadingmodaltest" element={<LoadingModalTest />} />
        <Route path="*" element={<div>not found</div>} />

      </Routes>
    </>
  );
}



function App() {
  const [isNewNotification, setIsNewNotification] = useState(false);

  // useEffect(() => {
  //   const isPWA = window.navigator.standalone;
  //   const isNotificationSupported = 'Notification' in window;

  //   if (isPWA && isNotificationSupported) {
  //     if (Notification.permission === 'default') {
  //       Notification.requestPermission().then(permission => {
  //         console.log("Notification permission:", permission);
  //         if (permission === 'granted') requestFCMToken();
  //       });
  //     } else if (Notification.permission === 'granted') {
  //       requestFCMToken();
  //     } else if (Notification.permission === 'denied') {
  //       alert('알림을 허용해야 매칭 알림을 받을 수 있습니다.\n설정 > Safari > 알림에서 변경해주세요.');
  //     }
  //   } else {
  //     console.log("홈화면 추가 안 됨 (Safari 브라우저 실행 중)");
  //   }
  // }, []);

  // useEffect(() => {
  //   if (!isOnMessageRegistered) {
  //     onMessage(messaging, (payload) => {
  //       console.log('Message received. ', payload);
  //       alert(`📩 ${payload.notification.title}: ${payload.notification.body}`);
  //       setIsNewNotification(true);
  //     });
  //     isOnMessageRegistered = true;
  //   }
  // }, []);

  // 앱 시작 시 localStorage의 알림 상태 읽어서 복원
  useEffect(() => {
    const stored = localStorage.getItem('isNewNotification');
    if (stored === 'true') {
      setIsNewNotification(true);
    }
  }, []);
  return (
    <Router>
      <AppRoutes isNewNotification={isNewNotification} setIsNewNotification={setIsNewNotification} />
    </Router>
  )
}

export default App;
