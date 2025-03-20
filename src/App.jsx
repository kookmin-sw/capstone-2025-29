import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from './pages/login';
import Signup from './pages/Signup';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
          
          <Route path="*" element={<div>not found</div>} /> {/* 404 페이지 */}
        </Routes>
      </Router>
    </>
  )
}

export default App
