import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
// import '../App.css'; // Ensure your custom styles are imported

const AdminLayout = () => {
    return (
        <Row className="admin-layout">
            {/* Sidebar Column */}
            <Col md={3} lg={2} className="sidebar-col p-0">
                <Sidebar />
            </Col>

            {/* Main Content Column */}
            <Col md={9} lg={10} className="content-col">
                <main className="py-3">
                    {/* This is the magic part! */}
                    <Outlet /> 
                </main>
            </Col>
        </Row>
    );
};

export default AdminLayout;

