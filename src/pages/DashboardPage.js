import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { FaBuilding, FaBullhorn, FaNewspaper, FaClipboardList } from 'react-icons/fa';

const DashboardPage = () => {
    return (
        <>
            <h1 className="mb-4">Admin Dashboard</h1>
            <Row>
                <Col md={6} lg={3} className="mb-4">
                    <Card bg="primary" text="white">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <Card.Title as="h3">150</Card.Title>
                                    <Card.Text>Total Companies</Card.Text>
                                </div>
                                <FaBuilding size={40} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} lg={3} className="mb-4">
                    <Card bg="success" text="white">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <Card.Title as="h3">75</Card.Title>
                                    <Card.Text>Active Job Ads</Card.Text>
                                </div>
                                <FaBullhorn size={40} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} lg={3} className="mb-4">
                    <Card bg="warning" text="white">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <Card.Title as="h3">25</Card.Title>
                                    <Card.Text>Weekly Newspapers</Card.Text>
                                </div>
                                <FaNewspaper size={40} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} lg={3} className="mb-4">
                    <Card bg="danger" text="white">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <Card.Title as="h3">42</Card.Title>
                                    <Card.Text>Pending Notices</Card.Text>
                                </div>
                                <FaClipboardList size={40} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card>
                        <Card.Header>Recent Activity</Card.Header>
                        <Card.Body>
                            <p>This is where a chart or list of recent activities would go.</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default DashboardPage;

