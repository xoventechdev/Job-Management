import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getJobDetailsForAd, deleteJobDetail, resetJobDetailState } from '../redux/slices/jobDetailSlice'; // We can reuse getJobDetailsForAd if we pass no ID or handle it in backend
import { getJobAds } from '../redux/slices/jobAdSlice'; // To map adId to adTitle

// NOTE: This component assumes a backend route that can fetch ALL job details, or we filter on frontend.
// For simplicity, we'll fetch all ads and all details and map them. A more optimized backend would be better for production.

const JobDetailListPage = () => {
    const dispatch = useDispatch();
    
    // We need to fetch all job ads to display their titles
    const { jobAds } = useSelector((state) => state.jobAd);
    const { jobDetails, loading, error, success: successDelete } = useSelector((state) => state.jobDetail);

    useEffect(() => {
        // A better approach would be a dedicated "getAllJobDetails" thunk.
        // For now, we fetch all ads, then fetch details for each ad. This is NOT efficient for large data.
        // A single backend endpoint `/api/v1/jobdetails` returning all details with populated ad info is ideal.
        // Assuming such an endpoint exists and is handled by getJobDetailsForAd with no ID:
        dispatch(getJobAds());
        dispatch(getJobDetailsForAd('all')); // Using a placeholder to signify fetching all
        
        return () => {
            dispatch(resetJobDetailState());
        };
    }, [dispatch, successDelete]);

    const deleteHandler = (id) => {
        if (window.confirm('Are you sure you want to delete this job detail?')) {
            dispatch(deleteJobDetail(id));
        }
    };

    // Create a map for quick lookup of ad titles
    const jobAdMap = jobAds.reduce((acc, ad) => {
        acc[ad._id] = ad.jobAdTitle;
        return acc;
    }, {});

    return (
        <>
            <Row className="align-items-center">
                <Col><h1>All Job Positions</h1></Col>
                <Col className="text-end">
                    <LinkContainer to="/admin/jobdetail/create">
                        <Button className="my-3"><FaPlus /> Create Job Position</Button>
                    </LinkContainer>
                </Col>
            </Row>

            {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
                <Table striped bordered hover responsive className="table-sm">
                    <thead>
                        <tr>
                            <th>POSITION TITLE</th>
                            <th>PARENT AD</th>
                            <th># POSITIONS</th>
                            <th>QUALIFICATION</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobDetails.map((detail) => (
                            <tr key={detail._id}>
                                <td>{detail.jobTitle}</td>
                                <td>{jobAdMap[detail.jobAdId] || 'N/A'}</td>
                                <td>{detail.jobPosition}</td>
                                <td>{detail.eduQu}</td>
                                <td>
                                    <LinkContainer to={`/admin/jobdetail/${detail._id}/edit`}>
                                        <Button variant="light" className="btn-sm mx-1"><FaEdit /></Button>
                                    </LinkContainer>
                                    <Button variant="danger" className="btn-sm" onClick={() => deleteHandler(detail._id)}>
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

export default JobDetailListPage;
