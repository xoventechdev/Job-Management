// src/pages/JobDetailEditPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
  createJobDetail,
  getJobDetailById,
  updateJobDetail,
  resetJobDetailState,
} from '../redux/slices/jobDetailSlice';
import { getJobAds } from '../redux/slices/jobAdSlice';

const JobDetailEditPage = () => {
  const { id } = useParams(); // detail id (if editing)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // store
  const { jobAds } = useSelector((state) => state.jobAd);
  const { loading, error, success, jobDetail } = useSelector((state) => state.jobDetail);

  // local state
  const [jobAdId, setJobAdId] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobPosition, setJobPosition] = useState(''); // keep as string for controlled <input type="number">
  const [eduQu, setEduQu] = useState('');
  const [othersQu, setOthersQu] = useState('');
  const [salary, setSalary] = useState('');
  const [age, setAge] = useState('');

  const isEditMode = Boolean(id);

  // Load dropdown data + the detail (if editing)
  useEffect(() => {
    dispatch(getJobAds());
    if (isEditMode) {
      dispatch(getJobDetailById(id));
    }
    return () => {
      dispatch(resetJobDetailState());
    };
  }, [dispatch, id, isEditMode]);

  // Prefill the form when jobDetail arrives in edit mode
  useEffect(() => {
    if (isEditMode && jobDetail) {
      setJobAdId(jobDetail.jobAdId ?? '');
      setJobTitle(jobDetail.jobTitle ?? '');
      setJobPosition(
        jobDetail.jobPosition === 0 || jobDetail.jobPosition
          ? String(jobDetail.jobPosition)
          : ''
      );
      setEduQu(jobDetail.eduQu ?? '');
      setOthersQu(jobDetail.othersQu ?? '');
      setSalary(jobDetail.salary ?? '');
      setAge(jobDetail.age ?? '');
    }
  }, [isEditMode, jobDetail]);

  // After create/update, go back to the parent ad's details page (fallback to a list page)
  useEffect(() => {
    if (success) {
      const target = isEditMode ? `/admin/jobdetail/${id}/edit` : '/admin/jobdetail';
      navigate('/admin/jobdetail');
    }
  }, [success, navigate, jobAdId]);

  const submitHandler = (e) => {
    e.preventDefault();
    const detailData = {
      jobAdId,
      jobTitle,
      jobPosition: jobPosition === '' ? null : Number(jobPosition),
      eduQu,
      othersQu,
      salary,
      age,
    };
    if (isEditMode) {
      dispatch(updateJobDetail({ id, detailData }));
    } else {
      dispatch(createJobDetail(detailData));
    }
  };

  return (
    <>
      <Link
        to={isEditMode && jobAdId ? `/admin/jobad/${jobAdId}/details` : '/admin/jobads'}
        className="btn btn-light my-3"
      >
        Go Back
      </Link>

      <Row className="justify-content-md-center">
        <Col md={8}>
          <h1>{isEditMode ? 'Edit Job Position' : 'Create Job Position'}</h1>

          {loading && <Loader />}
          {error && <Message variant="danger">{error}</Message>}

          <Form onSubmit={submitHandler}>
            <Form.Group controlId="jobAdId" className="my-3">
              <Form.Label>Parent Advertisement</Form.Label>
              <Form.Select
                value={jobAdId}
                onChange={(e) => setJobAdId(e.target.value)}
                required
              >
                <option value="">-- Select Parent Ad --</option>
                {jobAds.map((ad) => (
                  <option key={ad._id} value={ad._id}>
                    {ad.jobAdTitle}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Row>
              <Col md={8}>
                <Form.Group controlId="jobTitle" className="my-2">
                  <Form.Label>Job Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="jobPosition" className="my-2">
                  <Form.Label># of Positions</Form.Label>
                  <Form.Control
                    type="number"
                    inputMode="numeric"
                    value={jobPosition}
                    onChange={(e) => setJobPosition(e.target.value)}
                    min="0"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="eduQu" className="my-2">
              <Form.Label>Educational Qualification</Form.Label>
              <Form.Control
                type="text"
                value={eduQu}
                onChange={(e) => setEduQu(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="othersQu" className="my-2">
              <Form.Label>Other Qualifications</Form.Label>
              <Form.Control
                type="text"
                value={othersQu}
                onChange={(e) => setOthersQu(e.target.value)}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group controlId="salary" className="my-2">
                  <Form.Label>Salary</Form.Label>
                  <Form.Control
                    type="text"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="age" className="my-2">
                  <Form.Label>Age Limit</Form.Label>
                  <Form.Control
                    type="text"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button type="submit" variant="primary" className="mt-3" disabled={loading}>
              {isEditMode ? 'Update' : 'Create'}
            </Button>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default JobDetailEditPage;
