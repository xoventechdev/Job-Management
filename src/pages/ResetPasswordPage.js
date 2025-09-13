import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { resetPassword, resetAuth } from '../redux/slices/authSlice';

const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const email = new URLSearchParams(location.search).get('email');
    const otp = new URLSearchParams(location.search).get('otp');

    const { loading, error, userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!email || !otp) {
            navigate('/login');
        }
         // Redirect if user becomes logged in
        if (userInfo) {
            navigate('/dashboard');
        }
         return () => { dispatch(resetAuth()); };
    }, [dispatch, email, otp, navigate, userInfo]);


    const submitHandler = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
        } else {
            setMessage(null);
            dispatch(resetPassword({ email, otp, password }));
        }
    };

    return (
        <Container>
            <Row className="justify-content-md-center mt-5">
                <Col xs={12} md={6}>
                    <h2>Reset Password</h2>
                    {message && <Message variant="danger">{message}</Message>}
                    {error && <Message variant="danger">{error}</Message>}
                    {loading && <Loader />}
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId="password">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control type="password" placeholder="Enter new password" value={password} onChange={(e) => setPassword(e.target.value)} required></Form.Control>
                        </Form.Group>
                        <Form.Group controlId="confirmPassword"  className="mt-3">
                            <Form.Label>Confirm New Password</Form.Label>
                            <Form.Control type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required></Form.Control>
                        </Form.Group>
                        <Button type="submit" variant="primary" className="mt-3">
                            Set New Password
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default ResetPasswordPage;
