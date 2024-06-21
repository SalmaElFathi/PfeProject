import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Chat } from './components/index';
import ProfileUpdate from './pages/Profile';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import { Toaster } from 'react-hot-toast';
import JobDetails from './pages/JobDetails';
import Notifications from './pages/Notifications';
import Application from './pages/Applications';
import JobPost from './pages/JobPost';
import AllJobs from './pages/AllJobs';

const App = () => {
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsAuthenticated(true);

      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
      const payload = JSON.parse(jsonPayload);
      setRole(payload.role);
    }
  }, []);

  return (
    <div>
      <Toaster />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProfileUpdate />} />

          <Route path="/job-notifications" element={isAuthenticated && role === 'jobseeker' && <Notifications />} />

          <Route path="/dashboard" element={isAuthenticated && (role === 'jobseeker' ? <JobSeekerDashboard /> : <EmployerDashboard />)} />

          <Route path="/job-post" element={isAuthenticated && role === 'employer' && <JobPost />} />

          <Route path="/job-apply" element={isAuthenticated && role === 'jobseeker' && <AllJobs />} />

          <Route path="/login" element={<Login />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
          <Route path="/job/:id" element={<JobDetails />} />
          <Route path="/application/:id" element={isAuthenticated && role === 'jobseeker' && <Application />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
