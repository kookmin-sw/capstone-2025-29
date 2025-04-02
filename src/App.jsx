import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from './pages/login';
import Signup from './pages/Signup';
import Edit from './pages/edit';
import PasswordEdit from './pages/PasswordEdit';
import VolunteerMain from './pages/VolunterMain';
import WriteReview from './pages/WriteReview';
import AvailableTime from './pages/AvailableTime';

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
          
          <Route path="*" element={<div>not found</div>} /> {/* 404 페이지 */}
        </Routes>
      </Router>
    </>
  )
}

export default App
