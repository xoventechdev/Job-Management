import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getNotificationContent, sendNotification, resetNotificationState } from '../redux/slices/notificationSlice';
import { FaPaperPlane, FaAndroid } from 'react-icons/fa';
import './notification.css'; // We'll create this for styling

const NotificationPage = () => {
    const dispatch = useDispatch();
    const { loading, error, content, successMessage } = useSelector((state) => state.notification);

    const [selectedItem, setSelectedItem] = useState('');
    const [notificationTitle, setNotificationTitle] = useState('');
    const [notificationBody, setNotificationBody] = useState('');

    useEffect(() => {
        dispatch(getNotificationContent());
        return () => {
            dispatch(resetNotificationState());
        }
    }, [dispatch]);

    const handleSelectChange = (e) => {
        const value = e.target.value;
        setSelectedItem(value);

        if (!value) {
            setNotificationTitle('');
            setNotificationBody('');
            return;
        }

        const [type, id] = value.split(':');
        let item;
        switch (type) {
            case 'jobAd':
                item = content.jobAds.find(i => i._id === id);
                setNotificationTitle('চাকরির বিজ্ঞপ্তি');
                setNotificationBody(item?.jobAdTitle || 'নতুন চাকরির বিজ্ঞপ্তি প্রকাশিত হয়েছে।');
                break;

            case 'notice':
                item = content.notices.find(i => i._id === id);
                setNotificationTitle('চাকরির নোটিস');
                setNotificationBody(item?.title || 'নতুন নোটিস প্রকাশিত হয়েছে।');
                break;

            case 'result':
                item = content.results.find(i => i._id === id);
                setNotificationTitle('ফলাফল প্রকাশ');
                setNotificationBody(item?.title || 'নতুন ফলাফল প্রকাশিত হয়েছে।');
                break;

            case 'solution':
                item = content.solutions.find(i => i._id === id);
                setNotificationTitle('সমাধান প্রকাশ');
                setNotificationBody(item?.title || 'নতুন পরীক্ষার সমাধান প্রকাশিত হয়েছে।');
                break;

            default:
                break;
        }

    };
    
    const submitHandler = (e) => {
        e.preventDefault();
        const [type, id] = selectedItem.split(':');
        const notificationData = {
            title: notificationTitle,
            body: notificationBody,
            dataPayload: { type, id } // This tells the app what to open
        };
        dispatch(sendNotification(notificationData));
    };

    return (
        <>
            <h1>Send Push Notification</h1>
            {loading && <Loader />}
            {error && <Message variant="danger">{error}</Message>}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            
            <Row>
                <Col md={6}>
                    <Card className="p-4">
                        <Form onSubmit={submitHandler}>
                            <Form.Group controlId="contentItem" className="my-3">
                                <Form.Label>Select Content to Notify About</Form.Label>
                                <Form.Select value={selectedItem} onChange={handleSelectChange} required>
                                    <option value="">-- Select an item --</option>
                                    <optgroup label="Job Ads">
                                        {content.jobAds.map(ad => <option key={`jobAd:${ad._id}`} value={`jobAd:${ad._id}`}>{ad.jobAdTitle}</option>)}
                                    </optgroup>
                                    <optgroup label="Notices">
                                        {content.notices.map(n => <option key={`notice:${n._id}`} value={`notice:${n._id}`}>{n.title}</option>)}
                                    </optgroup>
                                    <optgroup label="Results">
                                        {content.results.map(r => <option key={`result:${r._id}`} value={`result:${r._id}`}>{r.title}</option>)}
                                    </optgroup>
                                    <optgroup label="Solutions">
                                        {content.solutions.map(s => <option key={`solution:${s._id}`} value={`solution:${s._id}`}>{s.title}</option>)}
                                    </optgroup>
                                </Form.Select>
                            </Form.Group>
                            
                            <hr />

                            <Form.Group controlId="notificationTitle" className="my-2">
                                <Form.Label>Notification Title</Form.Label>
                                <Form.Control type="text" value={notificationTitle} onChange={(e) => setNotificationTitle(e.target.value)} required />
                            </Form.Group>
                            <Form.Group controlId="notificationBody" className="my-2">
                                <Form.Label>Notification Body</Form.Label>
                                <Form.Control as="textarea" rows={2} value={notificationBody} onChange={(e) => setNotificationBody(e.target.value)} required />
                            </Form.Group>

                            <Button type="submit" variant="primary" className="mt-3 w-100" disabled={!selectedItem || loading}>
                                <FaPaperPlane /> Send Notification
                            </Button>
                        </Form>
                    </Card>
                </Col>
                <Col md={6}>
                    <h5>Notification Preview</h5>
                    <div className="notification-preview">
                        <div className="notification-header">
                            <FaAndroid className="android-icon" />
                            <span>Android System • now</span>
                        </div>
                        <div className="notification-content">
                            <div className="app-icon">App</div>
                            <div className="text-content">
                                <div className="title">{notificationTitle || 'Notification Title'}</div>
                                <div className="body">{notificationBody || 'Notification body text will appear here...'}</div>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default NotificationPage;
