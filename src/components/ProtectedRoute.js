import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
    const { userInfo } = useSelector((state) => state.auth);

    // If user is logged in, allow access to the nested routes (via <Outlet />)
    // Otherwise, redirect them to the /login page
    return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
