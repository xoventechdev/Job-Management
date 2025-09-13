import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getSolutions, deleteSolution } from '../redux/slices/solutionSlice';

const SolutionListPage = () => {
    const dispatch = useDispatch();
    
    const { solutions, loading, error, success } = useSelector((state) => state.solution);

    useEffect(() => {
        dispatch(getSolutions());
    }, [dispatch, success]);

    const deleteHandler = (id) => {
        if (window.confirm('Are you sure you want to delete this solution?')) {
            dispatch(deleteSolution(id));
        }
    };

    return (
        <>
            <Row className="align-items-center">
                <Col><h1>Exam Solutions</h1></Col>
                <Col className="text-end">
                    <LinkContainer to="/admin/solution/create">
                        <Button className="my-3"><FaPlus /> Create Solution</Button>
                    </LinkContainer>
                </Col>
            </Row>

            {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
                <Table striped bordered hover responsive className="table-sm">
                    <thead>
                        <tr>
                            <th>TITLE</th>
                            <th>EXAM DATE</th>
                            <th>STATUS</th>
                            <th>CREATED AT</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {solutions.map((solution) => (
                            <tr key={solution._id}>
                                <td>{solution.title}</td>
                                <td>{solution.examDate ? new Date(solution.examDate).toLocaleDateString('en-GB') : 'N/A'}</td>
                                <td>{solution.status}</td>
                                <td>{new Date(solution.createdAt).toLocaleDateString('en-GB')}</td>
                                <td>
                                    <LinkContainer to={`/admin/solution/${solution._id}/edit`}>
                                        <Button variant="light" className="btn-sm mx-1"><FaEdit /></Button>
                                    </LinkContainer>
                                    <Button variant="danger" className="btn-sm" onClick={() => deleteHandler(solution._id)}>
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

export default SolutionListPage;
