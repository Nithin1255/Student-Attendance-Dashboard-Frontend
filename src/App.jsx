import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import LoginPage from './components/pages/LoginPage';
import Home from './components/pages/Home';
import DashboardLayout from './layouts/DashboardLayout';

// Protected pages
import Dashboard from "./components/pages/Dashboard";
import Report from "./components/pages/Report";
import Attendance from "./components/pages/Attendance";
import Students from "./components/pages/Students";

import PrivateRoute from "./components/PrivateRoute";

import AdminDashboardLayout from './layouts/AdminDashboardLayout';
import AdminRoute from './routes/AdminRoute';
import AdminDashboard from './components/pages/AdminDashboard';
// Placeholder management pages (to be implemented)
const AdminTeachers = React.lazy(() => import('./components/pages/AdminTeachers'));
const AdminClasses = React.lazy(() => import('./components/pages/AdminClasses'));
const AdminSubjects = React.lazy(() => import('./components/pages/AdminSubjects'));
const AdminStudents = React.lazy(() => import('./components/pages/AdminStudents'));
const AdminClassStudents = React.lazy(() => import('./components/pages/AdminClassStudents'));


const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        {/* Admin routes */}
        <Route path="/admin/dashboard/*" element={
          <AdminRoute>
            <AdminDashboardLayout />
          </AdminRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="teachers" element={
            <React.Suspense fallback={<div>Loading...</div>}>
              <AdminTeachers />
            </React.Suspense>
          } />
          <Route path="classes" element={
            <React.Suspense fallback={<div>Loading...</div>}>
              <AdminClasses />
            </React.Suspense>
          } />
          <Route path="classes/:classId/students" element={
            <React.Suspense fallback={<div>Loading...</div>}>
              <AdminClassStudents />
            </React.Suspense>
          } />
          <Route path="subjects" element={
            <React.Suspense fallback={<div>Loading...</div>}>
              <AdminSubjects />
            </React.Suspense>
          } />
          <Route path="students" element={
            <React.Suspense fallback={<div>Loading...</div>}>
              <AdminStudents />
            </React.Suspense>
          } />
        </Route>

        {/* Protected layout (with sidebar) */}
        <Route element={<PrivateRoute />}>
          <Route element={<DashboardLayout />}>
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
