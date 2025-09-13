import React, { useEffect, useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col, Modal, Image, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaEdit, FaPlus, FaTrash, FaExternalLinkAlt } from 'react-icons/fa';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getCompanies, deleteCompany, resetCompanyState } from '../redux/slices/companySlice';

const statusBadge = (status) => {
  switch (status) {
    case 'approved':
      return <Badge bg="success">Approved</Badge>;
    case 'rejected':
      return <Badge bg="danger">Rejected</Badge>;
    default:
      return <Badge bg="warning" text="dark">Pending</Badge>;
  }
};

const CompanyListPage = () => {
  const dispatch = useDispatch();
  const { companies = [], loading, error, success: successDelete } = useSelector((state) => state.company);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);

  useEffect(() => {
    dispatch(getCompanies());
    return () => {
      dispatch(resetCompanyState());
    };
  }, [dispatch, successDelete]);

  const handleDeleteClick = (company) => {
    setCompanyToDelete(company);
    setShowDeleteModal(true);
  };

  const confirmDeleteHandler = () => {
    if (companyToDelete?._id) {
      dispatch(deleteCompany(companyToDelete._id));
    }
    setShowDeleteModal(false);
    setCompanyToDelete(null);
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Companies</h1>
        </Col>
        <Col className="text-end">
          <LinkContainer to="/admin/company/create">
            <Button className="my-3">
              <FaPlus /> Create Company
            </Button>
          </LinkContainer>
        </Col>
      </Row>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm align-middle">
          <thead>
            <tr>
              <th>LOGO</th>
              <th>NAME</th>
              <th>LOCATION</th>
              <th>TYPE</th>
              <th>HOT</th>
              <th>STATUS</th>
              <th>WEBSITE</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company._id}>
                <td style={{ width: 64 }}>
                  {company.orgLogo ? (
                    <Image
                      src={company.orgLogo}
                      alt={company.orgName}
                      rounded
                      fluid
                      style={{ maxWidth: 48, maxHeight: 48, objectFit: 'cover' }}
                    />
                  ) : (
                    <span className="text-muted">No Logo</span>
                  )}
                </td>
                <td>{company.orgName}</td>
                <td>{company.orgLocation || <span className="text-muted">—</span>}</td>
                <td>{company.orgType}</td>
                <td>
                  {company.isHotJob ? (
                    <Badge bg="danger">Hot</Badge>
                  ) : (
                    <Badge bg="secondary">Normal</Badge>
                  )}
                </td>
                <td>{statusBadge(company.status)}</td>
                <td>
                  {company.orgWeb ? (
                    <a href={company.orgWeb} target="_blank" rel="noreferrer">
                      Visit <FaExternalLinkAlt className="ms-1" />
                    </a>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/admin/company/${company._id}/edit`}>
                    <Button variant="light" className="btn-sm mx-1">
                      <FaEdit />
                    </Button>
                  </LinkContainer>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => handleDeleteClick(company)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the company "{companyToDelete?.orgName}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteHandler}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CompanyListPage;
