import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { createWeeklyNewspaper, getWeeklyNewspaperById, updateWeeklyNewspaper, resetNewspaperState } from '../redux/slices/weeklyNewspaperSlice';

const WeeklyNewspaperEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loading, error, success, newspaper } = useSelector((state) => state.weeklyNewspaper);

    // Form state
    const [newsPaperName, setNewsPaperName] = useState('');
    const [publishDate, setPublishDate] = useState('');
    const [paperUrlImgArray, setPaperUrlImgArray] = useState('');
    const [paperUrlPDF, setPaperUrlPDF] = useState('');
    const [status, setStatus] = useState('draft');
    const [remark, setRemark] = useState('');
    
    const isEditMode = Boolean(id);

    useEffect(() => {
        if (isEditMode) {
            dispatch(getWeeklyNewspaperById(id));
        }
        return () => {
            dispatch(resetNewspaperState());
        };
    }, [dispatch, id, isEditMode]);

    useEffect(() => {
        if (newspaper && isEditMode) {
            setNewsPaperName(newspaper.newsPaperName);
            setPublishDate(newspaper.publishDate.substring(0, 10));
            setPaperUrlImgArray(newspaper.paperUrlImgArray?.join('\n') || '');
            setPaperUrlPDF(newspaper.paperUrlPDF || '');
            setStatus(newspaper.status);
            setRemark(newspaper.remark || '');
        }
    }, [newspaper, isEditMode]);

    useEffect(() => {
        if (success) {
            navigate('/admin/newspapers');
        }
    }, [success, navigate]);
    
    const submitHandler = (e) => {
        e.preventDefault();
        const newspaperData = {
            newsPaperName,
            publishDate,
            paperUrlImgArray: paperUrlImgArray.split('\n').filter(url => url),
            paperUrlPDF,
            status,
            remark,
        };
        if (isEditMode) {
            dispatch(updateWeeklyNewspaper({ id, newspaperData }));
        } else {
            dispatch(createWeeklyNewspaper(newspaperData));
        }
    };

    return (
        <>
            <Link to="/admin/newspapers" className="btn btn-light my-3">Go Back</Link>
            <Row className="justify-content-md-center">
                <Col md={8}>
                    <h1>{isEditMode ? 'Edit Newspaper' : 'Create Newspaper'}</h1>
                    {loading && <Loader />}
                    {error && <Message variant="danger">{error}</Message>}
                    
                    <Form onSubmit={submitHandler}>
                        <Row>
                            <Col md={8}><Form.Group controlId="newsPaperName" className="my-2"><Form.Label>Newspaper Name</Form.Label><Form.Control type="text" value={newsPaperName} onChange={(e) => setNewsPaperName(e.target.value)} required /></Form.Group></Col>
                            <Col md={4}><Form.Group controlId="publishDate" className="my-2"><Form.Label>Publish Date</Form.Label><Form.Control type="date" value={publishDate} onChange={(e) => setPublishDate(e.target.value)} required /></Form.Group></Col>
                        </Row>
                        <Form.Group controlId="paperUrlImgArray" className="my-2"><Form.Label>Image URLs (one per line)</Form.Label><Form.Control as="textarea" rows={3} value={paperUrlImgArray} onChange={(e) => setPaperUrlImgArray(e.target.value)} /></Form.Group>
                        <Form.Group controlId="paperUrlPDF" className="my-2"><Form.Label>PDF URL</Form.Label><Form.Control type="text" value={paperUrlPDF} onChange={(e) => setPaperUrlPDF(e.target.value)} /></Form.Group>
                        <Row>
                            <Col md={6}><Form.Group controlId="status" className="my-2"><Form.Label>Status</Form.Label><Form.Select value={status} onChange={(e) => setStatus(e.target.value)}><option value="draft">Draft</option><option value="published">Published</option></Form.Select></Form.Group></Col>
                        </Row>
                        <Form.Group controlId="remark" className="my-2"><Form.Label>Remark</Form.Label><Form.Control as="textarea" rows={2} value={remark} onChange={(e) => setRemark(e.target.value)} /></Form.Group>

                        <Button type="submit" variant="primary" className="mt-3" disabled={loading}>{isEditMode ? 'Update' : 'Create'}</Button>
                    </Form>
                </Col>
            </Row>
        </>
    );
};

export default WeeklyNewspaperEditPage;
