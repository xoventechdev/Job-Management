import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { createResult, getResultById, updateResult, resetResultState } from '../redux/slices/resultSlice';

const ResultEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loading, error, success, result } = useSelector((state) => state.result);

    // Form state
    const [title, setTitle] = useState('');
    const [mainTxt, setMainTxt] = useState('');
    const [resultUrlImgArray, setResultUrlImgArray] = useState('');
    const [resultUrlPDF, setResultUrlPDF] = useState('');
    const [url, setUrl] = useState('');
    const [status, setStatus] = useState('draft');
    const [remark, setRemark] = useState('');
    
    const isEditMode = Boolean(id);

    useEffect(() => {
        if (isEditMode) {
            dispatch(getResultById(id));
        }
        return () => {
            dispatch(resetResultState());
        };
    }, [dispatch, id, isEditMode]);

    useEffect(() => {
        if (result && isEditMode) {
            setTitle(result.title);
            setMainTxt(result.mainTxt || '');
            setResultUrlImgArray(result.resultUrlImgArray?.join('\n') || '');
            setResultUrlPDF(result.resultUrlPDF || '');
            setUrl(result.url || '');
            setStatus(result.status);
            setRemark(result.remark || '');
        }
    }, [result, isEditMode]);

    useEffect(() => {
        if (success) {
            navigate('/admin/results');
        }
    }, [success, navigate]);
    
    const submitHandler = (e) => {
        e.preventDefault();
        const resultData = {
            title,
            mainTxt,
            resultUrlImgArray: resultUrlImgArray.split('\n').filter(url => url),
            resultUrlPDF,
            url,
            status,
            remark,
        };
        if (isEditMode) {
            dispatch(updateResult({ id, resultData }));
        } else {
            dispatch(createResult(resultData));
        }
    };

    return (
        <>
            <Link to="/admin/results" className="btn btn-light my-3">Go Back</Link>
            <Row className="justify-content-md-center">
                <Col md={8}>
                    <h1>{isEditMode ? 'Edit Result' : 'Create Result'}</h1>
                    {loading && <Loader />}
                    {error && <Message variant="danger">{error}</Message>}
                    
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId="title" className="my-2"><Form.Label>Title</Form.Label><Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} required /></Form.Group>
                        <Form.Group controlId="mainTxt" className="my-2"><Form.Label>Main Text / Description</Form.Label><Form.Control as="textarea" rows={4} value={mainTxt} onChange={(e) => setMainTxt(e.target.value)} /></Form.Group>
                        <Form.Group controlId="resultUrlImgArray" className="my-2"><Form.Label>Image URLs (one per line)</Form.Label><Form.Control as="textarea" rows={3} value={resultUrlImgArray} onChange={(e) => setResultUrlImgArray(e.target.value)} /></Form.Group>
                        <Form.Group controlId="resultUrlPDF" className="my-2"><Form.Label>PDF URL</Form.Label><Form.Control type="text" value={resultUrlPDF} onChange={(e) => setResultUrlPDF(e.target.value)} /></Form.Group>
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

export default ResultEditPage;
