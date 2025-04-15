/* React와 필요한 라이브러리 import */
import { useState } from 'react'
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
import RequestFinal from './pages/user/RequestFinal';
import ApplyingList from './pages/user/ApplyingList';
import ApplyingDetail from './pages/user/ApplyingDetail';
import SetName from './pages/user/SetName';
import ChatCenter from './pages/user/ChatCenter';
import ChatPage from './pages/user/ChatPage';
/* 메인 App 컴포넌트 */
function App() {
  return (
    <>
      {/* 라우터 설정 */}
      <Router>
        <Routes>
          {/* 공통 페이지 라우트 */}
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/RoleSelect" element={<RoleSelect />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/edit" element={<Edit />} />

          {/* 봉사자 페이지 라우트 */}
          <Route path='/volunteermain' element={<VolunteerMain />} />
          <Route path='/writereview' element={<WriteReview />} />
          <Route path='/availabletime' element={<AvailableTime />} />
          <Route path='/MatchingList' element={<MatchingList />} />
          <Route path='/CompleteReview' element={<CompleteReview />} />
          <Route path='/MatchingDetail' element={<MatchingDetail />} />
          <Route path='/ReviewDetail' element={<ReviewDetail />} />

          {/* 사용자 페이지 라우트 */}
          <Route path="/UserMain" element={<UserMain />} />
          <Route path="/HelpCenter" element={<HelpCenter />} />
          <Route path="/RequestForm" element={<RequestForm />} />
          <Route path="/Requestfinal" element={<RequestFinal />} />
          <Route path="/ApplyingList" element={<ApplyingList />} />
          <Route path="/ApplyingDetail" element={<ApplyingDetail />} />
          <Route path="/SetName" element={<SetName />} />
          <Route path="/ChatCenter" element={<ChatCenter />} />
          <Route path="/ChatPage" element={<ChatPage />} />
          {/* 404 페이지 - 정의되지 않은 경로로 접근 시 표시 */}
          <Route path="*" element={<div>not found</div>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
