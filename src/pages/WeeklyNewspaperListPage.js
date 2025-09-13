import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getWeeklyNewspapers, deleteWeeklyNewspaper } from '../redux/slices/weeklyNewspaperSlice';

const WeeklyNewspaperListPage = () => {
    const dispatch = useDispatch();
    
    const { newspapers, loading, error, success } = useSelector((state) => state.weeklyNewspaper);

    useEffect(() => {
        dispatch(getWeeklyNewspapers());
    }, [dispatch, success]);

    const deleteHandler = (id) => {
        if (window.confirm('Are you sure you want to delete this newspaper?')) {
            dispatch(deleteWeeklyNewspaper(id));
        }
    };

    return (
        <>
            <Row className="align-items-center">
                <Col><h1>Weekly Newspapers</h1></Col>
                <Col className="text-end">
                    <LinkContainer to="/admin/newspaper/create">
                        <Button className="my-3"><FaPlus /> Add Newspaper</Button>
                    </LinkContainer>
                </Col>
            </Row>

            {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
                <Table striped bordered hover responsive className="table-sm">
                    <thead>
                        <tr>
                            <th>NAME</th>
                            <th>PUBLISH DATE</th>
                            <th>STATUS</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {newspapers.map((newspaper) => (
                            <tr key={newspaper._id}>
                                <td>{newspaper.newsPaperName}</td>
                                <td>{new Date(newspaper.publishDate).toLocaleDateString('en-GB')}</td>
                                <td>{newspaper.status}</td>
                                <td>
                                    <LinkContainer to={`/admin/newspaper/${newspaper._id}/edit`}>
                                        <Button variant="light" className="btn-sm mx-1"><FaEdit /></Button>
                                    </LinkContainer>
                                    <Button variant="danger" className="btn-sm" onClick={() => deleteHandler(newspaper._id)}>
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

export default WeeklyNewspaperListPage;
