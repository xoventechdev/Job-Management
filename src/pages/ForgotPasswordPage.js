import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { requestPasswordReset, resetAuth } from '../redux/slices/authSlice';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, success } = useSelector((state) => state.auth);

    useEffect(() => {
        // Cleanup on component unmount
        return () => {
            dispatch(resetAuth());
        };
    }, [dispatch]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(requestPasswordReset(email));
    };

    // If successful, navigate to OTP verification page
    if (success) {
        navigate(`/verify-otp?email=${email}`);
    }

    return (
        <Container>
            <Row className="justify-content-md-center mt-5">
                <Col xs={12} md={6}>
                    <h2>Forgot Password</h2>
                    <p>Enter your email address and we will send you an OTP to reset your password.</p>
                    {error && <Message variant="danger">{error}</Message>}
                    {loading && <Loader />}
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId="email">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            ></Form.Control>
                        </Form.Group>
                        <Button type="submit" variant="primary" className="mt-3">
                            Send OTP
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default ForgotPasswordPage;
