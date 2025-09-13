import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { updateUserProfile, resetAuth } from '../redux/slices/authSlice';

const ProfilePage = () => {
    const dispatch = useDispatch();
    const { userInfo, loading, error, success } = useSelector((state) => state.auth);

    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(null);

    // Sync form fields with userInfo when it changes
    useEffect(() => {
        if (userInfo?.data) {
            setUserName(userInfo.data.userName || '');
            setEmail(userInfo.data.email || '');
        }
    }, [userInfo]);

    // Handle success message and reset
    useEffect(() => {
        if (success) {
            setMessage('Profile Updated Successfully!');
            const timer = setTimeout(() => {
                setMessage(null);
                dispatch(resetAuth()); // Reset success state in redux
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [dispatch, success]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(updateUserProfile({ userName, email }));
    };

    return (
        <Container>
            <Row className="justify-content-md-center mt-5">
                <Col xs={12} md={8}>
                    <h2>User Profile</h2>
                    {message && <Message variant="success">{message}</Message>}
                    {error && <Message variant="danger">{error}</Message>}
                    {loading && <Loader />}
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId="userName">
                            <Form.Label>User Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter name"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId="email" className="mt-3">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        {/* You can add password change fields here if needed */}

                        <Button type="submit" variant="primary" className="mt-3">
                            Update Profile
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default ProfilePage;