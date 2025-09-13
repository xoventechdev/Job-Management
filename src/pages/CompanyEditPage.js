import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Row, Col, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { createCompany, getCompanyDetails, updateCompany, resetCompanyState } from '../redux/slices/companySlice';

const CompanyEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, success, company } = useSelector((state) => state.company);

  const isEditMode = Boolean(id);

  // Form state (aligned with schema)
  const [orgName, setOrgName] = useState('');
  const [orgLocation, setOrgLocation] = useState('');
  const [orgWeb, setOrgWeb] = useState('');
  const [orgLogo, setOrgLogo] = useState(''); // URL string
  const [orgInfo, setOrgInfo] = useState('');
  const [orgType, setOrgType] = useState('Private');
  const [isHotJob, setIsHotJob] = useState(false);
  const [status, setStatus] = useState('pending'); // approved | pending | rejected

  useEffect(() => {
    dispatch(resetCompanyState());
    if (isEditMode) {
      dispatch(getCompanyDetails(id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isEditMode, id]);

  useEffect(() => {
    if (company && isEditMode) {
      setOrgName(company.orgName || '');
      setOrgLocation(company.orgLocation || '');
      setOrgWeb(company.orgWeb || '');
      setOrgLogo(company.orgLogo || '');
      setOrgInfo(company.orgInfo || '');
      setOrgType(company.orgType || 'Government');
      setIsHotJob(Boolean(company.isHotJob));
      setStatus(company.status || 'approved');
    }
  }, [company, isEditMode]);

  useEffect(() => {
    if (success) {
      navigate('/admin/companies');
    }
  }, [success, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    const companyData = {
      orgName,
      orgLocation,
      orgWeb,
      orgLogo,
      orgInfo,
      orgType,
      isHotJob,
      status,
    };

    if (isEditMode) {
      dispatch(updateCompany({ id, companyData }));
    } else {
      dispatch(createCompany(companyData));
    }
  };

  const logoPreview = useMemo(() => {
    if (!orgLogo) return '';
    try {
      // basic sanity check; avoid crashing on invalid URL strings
      // If invalid, <Image> will just fail to load silently.
      return new URL(orgLogo).toString();
    } catch {
      return orgLogo; // allow relative paths if your backend serves them
    }
  }, [orgLogo]);

  return (
    <>
      <Link to="/admin/companies" className="btn btn-light my-3">
        Go Back
      </Link>
      <Row className="justify-content-md-center">
        <Col md={9} lg={8}>
          <h1>{isEditMode ? 'Edit Company' : 'Create Company'}</h1>
          {loading && <Loader />}
          {error && <Message variant="danger">{error}</Message>}

          <Form onSubmit={submitHandler}>
            <Form.Group controlId="orgName" className="my-3">
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter company name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="orgLocation" className="my-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter location"
                value={orgLocation}
                onChange={(e) => setOrgLocation(e.target.value)}
              />
            </Form.Group>

            <Row>
              <Col md={8}>
                <Form.Group controlId="orgWeb" className="my-3">
                  <Form.Label>Website URL</Form.Label>
                  <Form.Control
                    type="url"
                    placeholder="https://example.com"
                    value={orgWeb}
                    onChange={(e) => setOrgWeb(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="isHotJob" className="my-3">
                  <Form.Label className="d-block">Hot Job</Form.Label>
                  <Form.Check
                    type="switch"
                    id="isHotJobSwitch"
                    label={isHotJob ? 'Yes' : 'No'}
                    checked={isHotJob}
                    onChange={(e) => setIsHotJob(e.target.checked)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="orgLogo" className="my-3">
              <Form.Label>Logo URL {isEditMode ? <small className="text-muted">(optional)</small> : <span className="text-danger">*</span>}</Form.Label>
              <Form.Control
                type="url"
                placeholder="https://cdn.example.com/logo.png"
                value={orgLogo}
                onChange={(e) => setOrgLogo(e.target.value)}
                required={!isEditMode}
              />
              {logoPreview && (
                <div className="mt-2">
                  <Image src={logoPreview} alt="Logo preview" rounded style={{ maxHeight: 80 }} />
                </div>
              )}
            </Form.Group>

            <Form.Group controlId="orgInfo" className="my-3">
              <Form.Label>Company Info</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="A brief description of the company"
                value={orgInfo}
                onChange={(e) => setOrgInfo(e.target.value)}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group controlId="orgType" className="my-3">
                  <Form.Label>Organization Type</Form.Label>
                  <Form.Select
                    value={orgType}
                    onChange={(e) => setOrgType(e.target.value)}
                  >
                    <option value="Government">Government</option>
                    <option value="Private">Private</option>
                    <option value="NGO">NGO</option>
                    <option value="BANK">BANK</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="status" className="my-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Button type="submit" variant="primary" className="mt-3">
              {isEditMode ? 'Update' : 'Create'}
            </Button>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default CompanyEditPage;
