import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import LoginPage from './components/pages/LoginPage';
import Home from './components/pages/Home';
import LandingPage from './components/pages/LandingPage';

import DashboardLayout from './layouts/DashboardLayout';

// Protected pages
import Dashboard from "./components/pages/Dashboard";
import Report from "./components/pages/Report";
import Attendance from "./components/pages/Attendance";
import Students from "./components/pages/Students";

import PrivateRoute from "./components/PrivateRoute";




const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected layout (with sidebar) */}
        <Route element={<PrivateRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/landingpage" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/report" element={<Report />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/students" element={<Students />} />
          </Route>
        </Route>
      </Routes>
    </div>
  )
}

export default App
