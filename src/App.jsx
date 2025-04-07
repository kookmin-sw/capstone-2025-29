import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from './pages/both/Login';
import Signup from './pages/both/Signup';
import Edit from './pages/both/Edit';
import PasswordEdit from './pages/both/PasswordEdit';
import VolunteerMain from './pages/volunteer/VolunterMain';
import WriteReview from './pages/volunteer/WriteReview';
import AvailableTime from './pages/Volunteer/AvailableTime';
import MatchingList from './pages/volunteer/MatchingList';
import CompleteReview from './pages/volunteer/CompleteReview';
import MatchingDetail from './pages/volunteer/MatchingDetail';
import ReviewDetail from './pages/volunteer/ReviewDetail';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/edit" element={<Edit />} />
          <Route path='/passwordedit' element={<PasswordEdit />} />
          <Route path='/volunteermain' element={<VolunteerMain />} />
          <Route path='/writereview' element={<WriteReview />} />
          <Route path='/availabletime' element={<AvailableTime />} />
          <Route path='/MatchingList' element={<MatchingList />} />
          <Route path='/CompleteReview' element={<CompleteReview />} />
          <Route path='/MatchingDetail' element={<MatchingDetail />} />
          <Route path='/ReviewDetail' element={<ReviewDetail />} />

          <Route path="*" element={<div>not found</div>} /> {/* 404 페이지 */}
        </Routes>
      </Router>
    </>
  )
}

export default App
