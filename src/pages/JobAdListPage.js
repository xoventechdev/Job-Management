import React, { useEffect, useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col, Modal, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaEdit, FaPlus, FaTrash, FaList } from 'react-icons/fa';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getJobAds, deleteJobAd, resetJobAdState } from '../redux/slices/jobAdSlice';

const JobAdListPage = () => {
    const dispatch = useDispatch();
    const { jobAds, loading, error, success: successDelete } = useSelector((state) => state.jobAd);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [adToDelete, setAdToDelete] = useState(null);

    useEffect(() => {
        dispatch(getJobAds());
        return () => {
            dispatch(resetJobAdState());
        };
    }, [dispatch, successDelete]);

    const handleDeleteClick = (ad) => {
        setAdToDelete(ad);
        setShowDeleteModal(true);
    };

    const confirmDeleteHandler = () => {
        if (adToDelete) {
            dispatch(deleteJobAd(adToDelete._id));
            setShowDeleteModal(false);
            setAdToDelete(null);
        }
    };

    return (
        <>
            <Row className="align-items-center">
                <Col><h1>Job Advertisements</h1></Col>
                <Col className="text-end">
                    <LinkContainer to="/admin/jobad/create">
                        <Button className="my-3"><FaPlus /> Create Job Ad</Button>
                    </LinkContainer>
                </Col>
            </Row>

            {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
                <Table striped bordered hover responsive className="table-sm">
                    <thead>
                        <tr>
                            <th>AD TITLE</th>
                            <th>ORGANIZATION</th>
                            <th>POSITIONS</th>
                            <th>END DATE</th>
                            <th>STATUS</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobAds.map((ad) => (
                            <tr key={ad._id}>
                                <td>{ad.jobAdTitle}</td>
                                <td>{ad.orgId?.orgName || 'N/A'}</td>
                                <td>{ad.totalJobPosition || 'N/A'}</td>
                                <td>{new Date(ad.applicationEndDate).toLocaleDateString()}</td>
                                <td>
                                    <Badge bg={ad.status === 'published' ? 'success' : ad.status === 'expired' ? 'secondary' : 'warning'}>
                                        {ad.status}
                                    </Badge>
                                </td>
                                <td>
                                    <LinkContainer to={`/admin/jobad/${ad._id}/details`}>
                                        <Button variant="info" className="btn-sm mx-1" title="Manage Details"><FaList /></Button>
                                    </LinkContainer>
                                    <LinkContainer to={`/admin/jobad/${ad._id}/edit`}>
                                        <Button variant="light" className="btn-sm mx-1" title="Edit Ad"><FaEdit /></Button>
                                    </LinkContainer>
                                    <Button variant="danger" className="btn-sm" onClick={() => handleDeleteClick(ad)} title="Delete Ad">
                                        <FaTrash />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton><Modal.Title>Confirm Deletion</Modal.Title></Modal.Header>
                <Modal.Body>Are you sure you want to delete this job ad and all its associated job positions?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={confirmDeleteHandler}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default JobAdListPage;

