import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { createNotice, getNoticeById, updateNotice, resetNoticeState } from '../redux/slices/noticeSlice';

const NoticeEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loading, error, success, notice } = useSelector((state) => state.notice);

    // Form state
    const [title, setTitle] = useState('');
    const [mainTxt, setMainTxt] = useState('');
    const [isAdmitCard, setIsAdmitCard] = useState(false);
    const [noticeUrlImgArray, setNoticeUrlImgArray] = useState('');
    const [noticeUrlPDF, setNoticeUrlPDF] = useState('');
    const [url, setUrl] = useState('');
    const [status, setStatus] = useState('draft');
    const [remark, setRemark] = useState('');
    
    const isEditMode = Boolean(id);

    useEffect(() => {
        if (isEditMode) {
            dispatch(getNoticeById(id));
        }
        return () => {
            dispatch(resetNoticeState());
        };
    }, [dispatch, id, isEditMode]);

    useEffect(() => {
        if (notice && isEditMode) {
            setTitle(notice.title);
            setMainTxt(notice.mainTxt || '');
            setIsAdmitCard(notice.isAdmitCard || false);
            setNoticeUrlImgArray(notice.noticeUrlImgArray?.join('\n') || '');
            setNoticeUrlPDF(notice.noticeUrlPDF || '');
            setUrl(notice.url || '');
            setStatus(notice.status);
            setRemark(notice.remark || '');
        }
    }, [notice, isEditMode]);

    useEffect(() => {
        if (success) {
            navigate('/admin/notices');
        }
    }, [success, navigate]);
    
    const submitHandler = (e) => {
        e.preventDefault();
        const noticeData = {
            title,
            mainTxt,
            isAdmitCard,
            noticeUrlImgArray: noticeUrlImgArray.split('\n').filter(url => url),
            noticeUrlPDF,
            url,
            status,
            remark,
        };
        if (isEditMode) {
            dispatch(updateNotice({ id, noticeData }));
        } else {
            dispatch(createNotice(noticeData));
        }
    };

    return (
        <>
            <Link to="/admin/notices" className="btn btn-light my-3">Go Back</Link>
            <Row className="justify-content-md-center">
                <Col md={8}>
                    <h1>{isEditMode ? 'Edit Notice' : 'Create Notice'}</h1>
                    {loading && <Loader />}
                    {error && <Message variant="danger">{error}</Message>}
                    
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId="title" className="my-2"><Form.Label>Title</Form.Label><Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} required /></Form.Group>
                        <Form.Group controlId="mainTxt" className="my-2"><Form.Label>Main Text / Description</Form.Label><Form.Control as="textarea" rows={4} value={mainTxt} onChange={(e) => setMainTxt(e.target.value)} /></Form.Group>
                        <Form.Group controlId="noticeUrlImgArray" className="my-2"><Form.Label>Image URLs (one per line)</Form.Label><Form.Control as="textarea" rows={3} value={noticeUrlImgArray} onChange={(e) => setNoticeUrlImgArray(e.target.value)} /></Form.Group>
                        <Row>
                           <Col md={8}><Form.Group controlId="noticeUrlPDF" className="my-2"><Form.Label>PDF URL</Form.Label><Form.Control type="text" value={noticeUrlPDF} onChange={(e) => setNoticeUrlPDF(e.target.value)} /></Form.Group></Col>
                           <Col md={4}><Form.Group controlId="isAdmitCard" className="my-3"><Form.Check type="checkbox" label="Is Admit Card?" checked={isAdmitCard} onChange={(e) => setIsAdmitCard(e.target.checked)} /></Form.Group></Col>
                        </Row>
                        <Form.Group controlId="url" className="my-2"><Form.Label>External Link URL</Form.Label><Form.Control type="text" value={url} onChange={(e) => setUrl(e.target.value)} /></Form.Group>
                        <Form.Group controlId="status" className="my-2"><Form.Label>Status</Form.Label><Form.Select value={status} onChange={(e) => setStatus(e.target.value)}><option value="draft">Draft</option><option value="published">Published</option><option value="expired">Expired</option></Form.Select></Form.Group>
                        <Form.Group controlId="remark" className="my-2"><Form.Label>Remark</Form.Label><Form.Control as="textarea" rows={2} value={remark} onChange={(e) => setRemark(e.target.value)} /></Form.Group>

                        <Button type="submit" variant="primary" className="mt-3" disabled={loading}>{isEditMode ? 'Update' : 'Create'}</Button>
                    </Form>
                </Col>
            </Row>
        </>
    );
};

export default NoticeEditPage;
