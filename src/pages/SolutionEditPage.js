import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { createSolution, getSolutionById, updateSolution, resetSolutionState } from '../redux/slices/solutionSlice';

const SolutionEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loading, error, success, solution } = useSelector((state) => state.solution);

    // Form state
    const [title, setTitle] = useState('');
    const [mainTxt, setMainTxt] = useState('');
    const [examDate, setExamDate] = useState('');
    const [solutionUrlImgArray, setSolutionUrlImgArray] = useState('');
    const [solutionUrlPDF, setSolutionUrlPDF] = useState('');
    const [url, setUrl] = useState('');
    const [status, setStatus] = useState('draft');
    const [remark, setRemark] = useState('');
    
    const isEditMode = Boolean(id);

    useEffect(() => {
        if (isEditMode) {
            dispatch(getSolutionById(id));
        }
        return () => {
            dispatch(resetSolutionState());
        };
    }, [dispatch, id, isEditMode]);

    useEffect(() => {
        if (solution && isEditMode) {
            setTitle(solution.title);
            setMainTxt(solution.mainTxt || '');
            setExamDate(solution.examDate ? solution.examDate.substring(0, 10) : '');
            setSolutionUrlImgArray(solution.solutionUrlImgArray?.join('\n') || '');
            setSolutionUrlPDF(solution.solutionUrlPDF || '');
            setUrl(solution.url || '');
            setStatus(solution.status);
            setRemark(solution.remark || '');
        }
    }, [solution, isEditMode]);

    useEffect(() => {
        if (success) {
            navigate('/admin/solutions');
        }
    }, [success, navigate]);
    
    const submitHandler = (e) => {
        e.preventDefault();
        const solutionData = {
            title,
            mainTxt,
            examDate,
            solutionUrlImgArray: solutionUrlImgArray.split('\n').filter(url => url),
            solutionUrlPDF,
            url,
            status,
            remark,
        };
        if (isEditMode) {
            dispatch(updateSolution({ id, solutionData }));
        } else {
            dispatch(createSolution(solutionData));
        }
    };

    return (
        <>
            <Link to="/admin/solutions" className="btn btn-light my-3">Go Back</Link>
            <Row className="justify-content-md-center">
                <Col md={8}>
                    <h1>{isEditMode ? 'Edit Solution' : 'Create Solution'}</h1>
                    {loading && <Loader />}
                    {error && <Message variant="danger">{error}</Message>}
                    
                    <Form onSubmit={submitHandler}>
                        <Row>
                            <Col md={8}><Form.Group controlId="title" className="my-2"><Form.Label>Title</Form.Label><Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} required /></Form.Group></Col>
                            <Col md={4}><Form.Group controlId="examDate" className="my-2"><Form.Label>Exam Date</Form.Label><Form.Control type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} /></Form.Group></Col>
                        </Row>
                        <Form.Group controlId="mainTxt" className="my-2"><Form.Label>Main Text / Description</Form.Label><Form.Control as="textarea" rows={4} value={mainTxt} onChange={(e) => setMainTxt(e.target.value)} /></Form.Group>
                        <Form.Group controlId="solutionUrlImgArray" className="my-2"><Form.Label>Image URLs (one per line)</Form.Label><Form.Control as="textarea" rows={3} value={solutionUrlImgArray} onChange={(e) => setSolutionUrlImgArray(e.target.value)} /></Form.Group>
                        <Form.Group controlId="solutionUrlPDF" className="my-2"><Form.Label>PDF URL</Form.Label><Form.Control type="text" value={solutionUrlPDF} onChange={(e) => setSolutionUrlPDF(e.target.value)} /></Form.Group>
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

export default SolutionEditPage;
