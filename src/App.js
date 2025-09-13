import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
// import './App.css'; 

// Core Components
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';

// --- Page Imports ---

// Authentication Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import VerifyOtpPage from './pages/VerifyOtpPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProfilePage from './pages/ProfilePage';

// Admin Content Pages
import DashboardPage from './pages/DashboardPage';
import CompanyListPage from './pages/CompanyListPage';
import CompanyEditPage from './pages/CompanyEditPage';
import JobAdListPage from './pages/JobAdListPage';
import JobAdEditPage from './pages/JobAdEditPage';

import JobDetailListPage from './pages/JobDetailListPage';
import JobDetailEditPage from './pages/JobDetailEditPage';

import WeeklyNewspaperListPage from './pages/WeeklyNewspaperListPage';
import WeeklyNewspaperEditPage from './pages/WeeklyNewspaperEditPage';

import NoticeListPage from './pages/NoticeListPage';
import NoticeEditPage from './pages/NoticeEditPage';

import ResultListPage from './pages/ResultListPage';
import ResultEditPage from './pages/ResultEditPage';

import SolutionListPage from './pages/SolutionListPage';
import SolutionEditPage from './pages/SolutionEditPage';

import NotificationPage from './pages/NotificationPage';

function App() {
    return (
        <Router>
            <Header />
            <Container fluid>
                <Routes>
                    {/* --- Public Routes --- */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/verify-otp" element={<VerifyOtpPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    
                    {/* Default route redirects to login */}
                    <Route path="/" element={<LoginPage />} />

                    {/* --- Protected Routes --- */}
                    {/* This wrapper ensures a user must be logged in for any nested routes */}
                    <Route element={<ProtectedRoute />}>
                        
                        {/* Standalone protected route (no sidebar) */}
                        <Route path="/profile" element={<ProfilePage />} />
                        
                        {/* Routes that use the AdminLayout (with sidebar) */}
                        <Route element={<AdminLayout />}>
                            <Route path="/dashboard" element={<DashboardPage />} />
                            
                            {/* Company Routes */}
                            <Route path="/admin/companies" element={<CompanyListPage />} />
                            <Route path="/admin/company/create" element={<CompanyEditPage />} />
                            <Route path="/admin/company/:id/edit" element={<CompanyEditPage />} />

                            {/* Job Ad Routes */}
                            <Route path="/admin/jobads" element={<JobAdListPage />} />
                            <Route path="/admin/jobad/create" element={<JobAdEditPage />} />
                            <Route path="/admin/jobad/:id/edit" element={<JobAdEditPage />} />

 
                            {/* Job Detail Routes */}
                            <Route path="/admin/jobdetail" element={<JobDetailListPage />} />
                            <Route path="/admin/jobdetail/create" element={<JobDetailEditPage />} />
                            <Route path="/admin/jobdetail/:id/edit" element={<JobDetailEditPage />} />                           
                            
                             {/* Weekly Newspapers Routes */}
                            <Route path="/admin/newspapers" element={<WeeklyNewspaperListPage />} />
                            <Route path="/admin/newspaper/create" element={<WeeklyNewspaperEditPage />} />
                            <Route path="/admin/newspaper/:id/edit" element={<WeeklyNewspaperEditPage />} />                           
                            
                             {/* Notice Routes */}
                            <Route path="/admin/notices" element={<NoticeListPage />} />
                            <Route path="/admin/notice/create" element={<NoticeEditPage />} />
                            <Route path="/admin/notice/:id/edit" element={<NoticeEditPage />} /> 

                              {/* Result Routes */}
                            <Route path="/admin/results" element={<ResultListPage />} />
                            <Route path="/admin/result/create" element={<ResultEditPage />} />
                            <Route path="/admin/result/:id/edit" element={<ResultEditPage />} />  

                              {/* Result Routes */}
                            <Route path="/admin/solutions" element={<SolutionListPage />} />
                            <Route path="/admin/solution/create" element={<SolutionEditPage />} />
                            <Route path="/admin/solution/:id/edit" element={<SolutionEditPage />} />   

                            <Route path="/admin/notifications" element={<NotificationPage />} />
                        
                            
                        </Route>

                    </Route>
                </Routes>
            </Container>
        </Router>
    );
}

export default App;

