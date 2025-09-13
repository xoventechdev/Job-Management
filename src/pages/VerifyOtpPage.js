import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { verifyOtp, resetAuth } from '../redux/slices/authSlice';

const VerifyOtpPage = () => {
    const [otp, setOtp] = useState('');
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Get email from URL query parameter
    const email = new URLSearchParams(location.search).get('email');

    const { loading, error, success } = useSelector((state) => state.auth);

     useEffect(() => {
        if (!email) {
            navigate('/login'); // Redirect if no email is provided
        }
        // Cleanup on component unmount
        return () => {
            dispatch(resetAuth());
        };
    }, [dispatch, email, navigate]);


    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(verifyOtp({ email, otp }));
    };
    
    // If OTP is correct, navigate to the reset password page
    if (success) {
        navigate(`/reset-password?email=${email}&otp=${otp}`);
    }

    return (
        <Container>
            <Row className="justify-content-md-center mt-5">
                <Col xs={12} md={6}>
                    <h2>Verify OTP</h2>
                    <p>An OTP has been sent to {email}. Please enter it below.</p>
                    {error && <Message variant="danger">{error}</Message>}
                    {loading && <Loader />}
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId="otp">
                            <Form.Label>OTP Code</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            ></Form.Control>
                        </Form.Group>
                        <Button type="submit" variant="primary" className="mt-3">
                            Verify
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default VerifyOtpPage;
