import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaTachometerAlt, FaBuilding, FaBullhorn, FaNewspaper, FaClipboardList, FaLightbulb, FaQuestionCircle , FaBell } from 'react-icons/fa';
// import '../App.css'; // We will create this for custom styles

const Sidebar = () => {
    return (
        <Nav className="flex-column bg-dark sidebar">
            <LinkContainer to="/dashboard">
                <Nav.Link className="text-white py-3 px-3">
                    <FaTachometerAlt className="me-2" /> Dashboard
                </Nav.Link>
            </LinkContainer>

            <h6 className="text-secondary text-uppercase px-3 mt-4 mb-2">Management</h6>

            <LinkContainer to="/admin/companies">
                <Nav.Link className="text-white py-2 px-3">
                    <FaBuilding className="me-2" /> Companies
                </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/admin/jobads">
                <Nav.Link className="text-white py-2 px-3">
                    <FaBullhorn className="me-2" /> Job Ads
                </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/admin/jobdetail">
                <Nav.Link className="text-white py-2 px-3">
                    <FaBullhorn className="me-2" /> Job Detail
                </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/admin/newspapers">
                <Nav.Link className="text-white py-2 px-3">
                     <FaNewspaper className="me-2" /> Newspapers
                </Nav.Link>
            </LinkContainer>

            <h6 className="text-secondary text-uppercase px-3 mt-4 mb-2">Content</h6>

            <LinkContainer to="/admin/notices">
                <Nav.Link className="text-white py-2 px-3">
                    <FaClipboardList className="me-2" /> Notices
                </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/admin/results">
                <Nav.Link className="text-white py-2 px-3">
                    <FaLightbulb className="me-2" /> Results
                </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/admin/solutions">
                <Nav.Link className="text-white py-2 px-3">
                    <FaQuestionCircle className="me-2" /> Solutions
                </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/admin/notifications">
                <Nav.Link className="text-white py-2 px-3">
                    <FaBell  className="me-2" /> Notifications
                </Nav.Link>
            </LinkContainer>
        </Nav>
    );
};

export default Sidebar;
