import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getResults, deleteResult } from '../redux/slices/resultSlice';

const ResultListPage = () => {
    const dispatch = useDispatch();
    
    const { results, loading, error, success } = useSelector((state) => state.result);

    useEffect(() => {
        dispatch(getResults());
    }, [dispatch, success]);

    const deleteHandler = (id) => {
        if (window.confirm('Are you sure you want to delete this result?')) {
            dispatch(deleteResult(id));
        }
    };

    return (
        <>
            <Row className="align-items-center">
                <Col><h1>Application Results</h1></Col>
                <Col className="text-end">
                    <LinkContainer to="/admin/result/create">
                        <Button className="my-3"><FaPlus /> Create Result</Button>
                    </LinkContainer>
                </Col>
            </Row>

            {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
                <Table striped bordered hover responsive className="table-sm">
                    <thead>
                        <tr>
                            <th>TITLE</th>
                            <th>STATUS</th>
                            <th>CREATED AT</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((result) => (
                            <tr key={result._id}>
                                <td>{result.title}</td>
                                <td>{result.status}</td>
                                <td>{new Date(result.createdAt).toLocaleDateString('en-GB')}</td>
                                <td>
                                    <LinkContainer to={`/admin/result/${result._id}/edit`}>
                                        <Button variant="light" className="btn-sm mx-1"><FaEdit /></Button>
                                    </LinkContainer>
                                    <Button variant="danger" className="btn-sm" onClick={() => deleteHandler(result._id)}>
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

export default ResultListPage;
