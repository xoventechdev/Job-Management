import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { createJobAd, getJobAdById, updateJobAd, resetJobAdState } from '../redux/slices/jobAdSlice';
import { getCompanies } from '../redux/slices/companySlice';

const JobAdEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, success, jobAd } = useSelector((state) => state.jobAd);
  const { companies = [] } = useSelector((state) => state.company);

  const [orgId, setOrgId] = useState('');
  const [jobAdTitle, setJobAdTitle] = useState('');
  const [adPublishDate, setAdPublishDate] = useState('');
  const [applicationStartDate, setApplicationStartDate] = useState('');
  const [applicationEndDate, setApplicationEndDate] = useState('');
  const [jobCategories, setJobCategories] = useState('');
  const [totalJobPosition, setTotalJobPosition] = useState('');
  const [applicationMethod, setApplicationMethod] = useState('online');
  const [applicationLink, setApplicationLink] = useState('');
  const [adUrlImgArray, setAdUrlImgArray] = useState('');
  const [adUrlPDF, setAdUrlPDF] = useState('');
  const [adInfo, setAdInfo] = useState('');
  const [status, setStatus] = useState('draft');
  const [remark, setRemark] = useState('');

  const isEditMode = Boolean(id);

  // 1) Reset ONCE on mount (or do it on unmount if you prefer).
  useEffect(() => {
    dispatch(resetJobAdState());
    // optional: return () => dispatch(resetJobAdState()); // if you want cleanup on leave
  }, [dispatch]);

  // 2) Load companies ONCE on mount.
  useEffect(() => {
    dispatch(getCompanies());
  }, [dispatch]);

  // 3) Fetch the job ad when id/edit mode changes (NOT when jobAd changes).
  useEffect(() => {
    if (isEditMode) {
      dispatch(getJobAdById(id));
    }
  }, [dispatch, id, isEditMode]);

  // 4) When jobAd arrives, populate local form state.
  useEffect(() => {
    if (jobAd && isEditMode) {
      setOrgId(jobAd.orgId?._id || '');
      setJobAdTitle(jobAd.jobAdTitle || '');
      setAdPublishDate(jobAd.adPublishDate ? jobAd.adPublishDate.split('T')[0] : '');
      setApplicationStartDate(jobAd.applicationStartDate ? jobAd.applicationStartDate.split('T')[0] : '');
      setApplicationEndDate(jobAd.applicationEndDate ? jobAd.applicationEndDate.split('T')[0] : '');
      setJobCategories(Array.isArray(jobAd.jobCategories) ? jobAd.jobCategories.join(', ') : '');
      setTotalJobPosition(jobAd.totalJobPosition ?? '');
      setApplicationMethod(jobAd.applicationMethod || 'online');
      setApplicationLink(jobAd.applicationLink || '');
      setAdUrlImgArray(Array.isArray(jobAd.adUrlImgArray) ? jobAd.adUrlImgArray.join(', ') : '');
      setAdUrlPDF(jobAd.adUrlPDF || '');
      setAdInfo(jobAd.adInfo || '');
      setStatus(jobAd.status || 'draft');
      setRemark(jobAd.remark || '');
    }
  }, [jobAd, isEditMode]);

  // 5) Navigate after create/update success.
  useEffect(() => {
    if (success) navigate('/admin/jobads');
  }, [success, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    const jobAdData = {
      orgId,
      jobAdTitle,
      adPublishDate,
      applicationStartDate,
      applicationEndDate,
      jobCategories: jobCategories.split(',').map((c) => c.trim()).filter(Boolean),
      totalJobPosition: totalJobPosition !== '' ? Number(totalJobPosition) : undefined,
      applicationMethod,
      applicationLink,
      adUrlImgArray: adUrlImgArray.split(',').map((u) => u.trim()).filter(Boolean),
      adUrlPDF,
      adInfo,
      status,
      remark,
    };
    if (isEditMode) {
      dispatch(updateJobAd({ id, jobAdData }));
    } else {
      dispatch(createJobAd(jobAdData));
    }
  };

  return (
    <>
      <Link to="/admin/jobads" className="btn btn-light my-3">Go Back</Link>
      <Row className="justify-content-md-center">
        <Col md={8}>
          <h1>{isEditMode ? 'Edit Job Ad' : 'Create Job Ad'}</h1>
          {loading && <Loader />}
          {error && <Message variant="danger">{error}</Message>}

          <Form onSubmit={submitHandler}>
            <Form.Group controlId="jobAdTitle" className="my-3">
              <Form.Label>Job Ad Title</Form.Label>
              <Form.Control type="text" value={jobAdTitle} onChange={(e) => setJobAdTitle(e.target.value)} required />
            </Form.Group>

            <Form.Group controlId="orgId" className="my-3">
              <Form.Label>Organization</Form.Label>
              <Form.Select value={orgId} onChange={(e) => setOrgId(e.target.value)} required>
                <option value="">Select Company</option>
                {companies.map((c) => (
                  <option key={c._id} value={c._id}>{c.orgName}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Row>
              <Col md={4}>
                <Form.Group controlId="adPublishDate" className="my-3">
                  <Form.Label>Publish Date</Form.Label>
                  <Form.Control type="date" value={adPublishDate} onChange={(e) => setAdPublishDate(e.target.value)} required />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="applicationStartDate" className="my-3">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control type="date" value={applicationStartDate} onChange={(e) => setApplicationStartDate(e.target.value)} required />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="applicationEndDate" className="my-3">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control type="date" value={applicationEndDate} onChange={(e) => setApplicationEndDate(e.target.value)} required />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={8}>
                <Form.Group controlId="jobCategories" className="my-3">
                  <Form.Label>Categories (comma-separated)</Form.Label>
                  <Form.Control type="text" value={jobCategories} onChange={(e) => setJobCategories(e.target.value)} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="totalJobPosition" className="my-3">
                  <Form.Label>Total Positions</Form.Label>
                  <Form.Control type="number" value={totalJobPosition} onChange={(e) => setTotalJobPosition(e.target.value)} />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="applicationMethod" className="my-3">
              <Form.Label>Application Method</Form.Label>
              <Form.Select value={applicationMethod} onChange={(e) => setApplicationMethod(e.target.value)}>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="walk-in">Walk-in</option>
              </Form.Select>
            </Form.Group>

            {applicationMethod === 'online' && (
              <Form.Group controlId="applicationLink" className="my-3">
                <Form.Label>Application Link</Form.Label>
                <Form.Control type="text" value={applicationLink} onChange={(e) => setApplicationLink(e.target.value)} />
              </Form.Group>
            )}

            <Form.Group controlId="adUrlImgArray" className="my-3">
              <Form.Label>Image URLs (comma-separated)</Form.Label>
              <Form.Control as="textarea" rows={2} value={adUrlImgArray} onChange={(e) => setAdUrlImgArray(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="adUrlPDF" className="my-3">
              <Form.Label>PDF URL</Form.Label>
              <Form.Control type="text" value={adUrlPDF} onChange={(e) => setAdUrlPDF(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="adInfo" className="my-3">
              <Form.Label>Ad Info</Form.Label>
              <Form.Control as="textarea" rows={5} value={adInfo} onChange={(e) => setAdInfo(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="remark" className="my-3">
              <Form.Label>Remark</Form.Label>
              <Form.Control as="textarea" rows={2} value={remark} onChange={(e) => setRemark(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="status" className="my-3">
              <Form.Label>Status</Form.Label>
              <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="expired">Expired</option>
              </Form.Select>
            </Form.Group>

            <Button type="submit" variant="primary" className="mt-3">
              {isEditMode ? 'Update' : 'Create'}
            </Button>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default JobAdEditPage;
