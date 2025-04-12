import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Splash from './pages/both/Splash';
import Login from './pages/both/Login';
import Signup from './pages/both/Signup';
import Edit from './pages/both/Edit';
import VolunteerMain from './pages/volunteer/VolunterMain';
import WriteReview from './pages/volunteer/WriteReview';
import AvailableTime from './pages/Volunteer/AvailableTime';
import MatchingList from './pages/volunteer/MatchingList';
import CompleteReview from './pages/volunteer/CompleteReview';
import MatchingDetail from './pages/volunteer/MatchingDetail';
import ReviewDetail from './pages/volunteer/ReviewDetail';
import RoleSelect from './pages/both/RoleSelect';

import UserMain from './pages/user/UserMain';
import HelpCenter from './pages/user/HelpCenter';
import RequestForm from './pages/user/RequestForm';
import RequestFinal from './pages/user/RequestFinal';
import ApplyingList from './pages/user/ApplyingList';
import ApplyingDetail from './pages/user/ApplyingDetail';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/RoleSelect" element={<RoleSelect />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/edit" element={<Edit />} />
          <Route path='/volunteermain' element={<VolunteerMain />} />
          <Route path='/writereview' element={<WriteReview />} />
          <Route path='/availabletime' element={<AvailableTime />} />
          <Route path='/MatchingList' element={<MatchingList />} />
          <Route path='/CompleteReview' element={<CompleteReview />} />
          <Route path='/MatchingDetail' element={<MatchingDetail />} />
          <Route path='/ReviewDetail' element={<ReviewDetail />} />

          <Route path="/UserMain" element={<UserMain />} />
          <Route path="/HelpCenter" element={<HelpCenter />} />
          <Route path="/RequestForm" element={<RequestForm />} />
          <Route path="/Requestfinal" element={<RequestFinal />} />
          <Route path="/ApplyingList" element={<ApplyingList />} />
          <Route path="/ApplyingDetail" element={<ApplyingDetail />} />

          <Route path="*" element={<div>not found</div>} /> {/* 404 페이지 */}
        </Routes>
      </Router>
    </>
  )
}

export default App
