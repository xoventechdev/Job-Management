import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getNotices, deleteNotice } from '../redux/slices/noticeSlice';

const NoticeListPage = () => {
    const dispatch = useDispatch();
    
    const { notices, loading, error, success } = useSelector((state) => state.notice);

    useEffect(() => {
        dispatch(getNotices());
    }, [dispatch, success]);

    const deleteHandler = (id) => {
        if (window.confirm('Are you sure you want to delete this notice?')) {
            dispatch(deleteNotice(id));
        }
    };

    return (
        <>
            <Row className="align-items-center">
                <Col><h1>Job Notices</h1></Col>
                <Col className="text-end">
                    <LinkContainer to="/admin/notice/create">
                        <Button className="my-3"><FaPlus /> Create Notice</Button>
                    </LinkContainer>
                </Col>
            </Row>

            {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
                <Table striped bordered hover responsive className="table-sm">
                    <thead>
                        <tr>
                            <th>TITLE</th>
                            <th>TYPE</th>
                            <th>STATUS</th>
                            <th>CREATED AT</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {notices.map((notice) => (
                            <tr key={notice._id}>
                                <td>{notice.title}</td>
                                <td>{notice.isAdmitCard ? <Badge bg="info">Admit Card</Badge> : <Badge bg="secondary">General</Badge>}</td>
                                <td>{notice.status}</td>
                                <td>{new Date(notice.createdAt).toLocaleDateString('en-GB')}</td>
                                <td>
                                    <LinkContainer to={`/admin/notice/${notice._id}/edit`}>
                                        <Button variant="light" className="btn-sm mx-1"><FaEdit /></Button>
                                    </LinkContainer>
                                    <Button variant="danger" className="btn-sm" onClick={() => deleteHandler(notice._id)}>
                                        <FaTrash />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </>
    );
};

export default NoticeListPage;
