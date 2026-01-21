import React, { useState, useEffect } from 'react';
import { 
    Container, Row, Col, Card, Table, Button, 
    Modal, Form, Alert, Badge, Spinner
} from 'react-bootstrap';
import { 
    FaExclamationCircle, FaCheck, FaEdit, 
    FaTrash, FaPlus 
} from 'react-icons/fa';
import { format } from 'date-fns';
import { 
    getComplaints, 
    createComplaint, 
    updateComplaint, 
    deleteComplaint,
    resolveComplaint 
} from '../services/complaintService';

const Complaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showResolveModal, setShowResolveModal] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [formData, setFormData] = useState({
        complainant_name: '',
        complaint_type: '',
        complaint: ''
    });
    const [resolveBudget, setResolveBudget] = useState('');
    const [loading, setLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(true);

    const complaintTypes = [
        'Room Windows',
        'Air Conditioner',
        'Bad Smells',
        'Faulty Electronics',
        'Plumbing',
        'Housekeeping',
        'Noise',
        'Other'
    ];

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            setTableLoading(true);
            const complaintsData = await getComplaints();
            setComplaints(complaintsData || []);
        } catch (error) {
            console.error('Error fetching complaints:', error);
            // Fallback to mock data
            setComplaints([
                {
                    id: 1,
                    complainant_name: 'Janice Alexander',
                    complaint_type: 'Room Windows',
                    complaint: 'Does not operate properly',
                    created_at: '2020-07-16 06:51:24',
                    resolve_status: 1,
                    resolve_date: '2020-07-17 06:51:58',
                    budget: 3600
                }
            ]);
        } finally {
            setTableLoading(false);
        }
    };

    const handleShowModal = (complaint = null) => {
        if (complaint) {
            setSelectedComplaint(complaint);
            setFormData({
                complainant_name: complaint.complainant_name,
                complaint_type: complaint.complaint_type,
                complaint: complaint.complaint
            });
        } else {
            setSelectedComplaint(null);
            setFormData({
                complainant_name: '',
                complaint_type: '',
                complaint: ''
            });
        }
        setShowModal(true);
    };

    const handleShowResolveModal = (complaint) => {
        setSelectedComplaint(complaint);
        setResolveBudget('');
        setShowResolveModal(true);
    };

    const handleResolve = async () => {
        if (!resolveBudget || resolveBudget <= 0) {
            alert('Please enter a valid budget');
            return;
        }

        try {
            setLoading(true);
            await resolveComplaint(selectedComplaint.id, resolveBudget);
            fetchComplaints();
            setShowResolveModal(false);
            alert('Complaint resolved successfully');
        } catch (error) {
            console.error('Error resolving complaint:', error);
            alert('Failed to resolve complaint');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (selectedComplaint) {
                await updateComplaint(selectedComplaint.id, formData);
            } else {
                await createComplaint(formData);
            }
            fetchComplaints();
            setShowModal(false);
            alert(`Complaint ${selectedComplaint ? 'updated' : 'submitted'} successfully`);
        } catch (error) {
            console.error('Error saving complaint:', error);
            alert('Operation failed');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this complaint?')) {
            try {
                await deleteComplaint(id);
                fetchComplaints();
                alert('Complaint deleted successfully');
            } catch (error) {
                console.error('Error deleting complaint:', error);
                alert('Failed to delete complaint');
            }
        }
    };

    const getStatusBadge = (status) => {
        return status === 1 ? 
            <Badge bg="success">Resolved</Badge> : 
            <Badge bg="warning">Pending</Badge>;
    };

    return (
        <Container fluid>
            <Row className="mb-4">
                <Col>
                    <h2>Complaint Management</h2>
                </Col>
                <Col className="text-end">
                    <Button variant="primary" onClick={() => handleShowModal()}>
                        <FaPlus className="me-2" /> New Complaint
                    </Button>
                </Col>
            </Row>

            <Card>
                <Card.Body>
                    {tableLoading ? (
                        <div className="text-center p-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-3">Loading complaints...</p>
                        </div>
                    ) : (
                        <Table striped hover responsive>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Complainant</th>
                                    <th>Type</th>
                                    <th>Complaint</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Budget</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {complaints.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="text-center text-muted py-4">
                                            No complaints found
                                        </td>
                                    </tr>
                                ) : (
                                    complaints.map((complaint) => (
                                        <tr key={complaint.id}>
                                            <td>{complaint.id}</td>
                                            <td>{complaint.complainant_name}</td>
                                            <td>{complaint.complaint_type}</td>
                                            <td>
                                                <div style={{ maxWidth: '300px' }}>
                                                    {complaint.complaint.length > 50 
                                                        ? `${complaint.complaint.substring(0, 50)}...`
                                                        : complaint.complaint
                                                    }
                                                </div>
                                            </td>
                                            <td>{complaint.created_at ? format(new Date(complaint.created_at), 'dd/MM/yyyy') : ''}</td>
                                            <td>{getStatusBadge(complaint.resolve_status)}</td>
                                            <td>
                                                {complaint.budget ? 
                                                    `$${complaint.budget}` : 
                                                    '-'
                                                }
                                            </td>
                                            <td>
                                                <div className="d-flex gap-2">
                                                    {complaint.resolve_status === 0 && (
                                                        <>
                                                            <Button
                                                                variant="outline-success"
                                                                size="sm"
                                                                onClick={() => handleShowResolveModal(complaint)}
                                                            >
                                                                <FaCheck /> Resolve
                                                            </Button>
                                                            <Button
                                                                variant="outline-primary"
                                                                size="sm"
                                                                onClick={() => handleShowModal(complaint)}
                                                            >
                                                                <FaEdit />
                                                            </Button>
                                                        </>
                                                    )}
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => handleDelete(complaint.id)}
                                                    >
                                                        <FaTrash />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>

            {/* Add/Edit Complaint Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {selectedComplaint ? 'Edit Complaint' : 'New Complaint'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Complainant Name *</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.complainant_name}
                                onChange={(e) => setFormData({...formData, complainant_name: e.target.value})}
                                required
                            />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Complaint Type *</Form.Label>
                            <Form.Select
                                value={formData.complaint_type}
                                onChange={(e) => setFormData({...formData, complaint_type: e.target.value})}
                                required
                            >
                                <option value="">Select Type</option>
                                {complaintTypes.map((type) => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Complaint Details *</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                value={formData.complaint}
                                onChange={(e) => setFormData({...formData, complaint: e.target.value})}
                                required
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Spinner animation="border" size="sm" className="me-2" />
                                    Saving...
                                </>
                            ) : selectedComplaint ? 'Update' : 'Submit'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Resolve Complaint Modal */}
            <Modal show={showResolveModal} onHide={() => setShowResolveModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Resolve Complaint</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedComplaint && (
                        <div>
                            <p><strong>Complainant:</strong> {selectedComplaint.complainant_name}</p>
                            <p><strong>Type:</strong> {selectedComplaint.complaint_type}</p>
                            <p><strong>Issue:</strong> {selectedComplaint.complaint}</p>
                            
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Resolution Budget ($) *</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Enter budget amount"
                                        min="1"
                                        value={resolveBudget}
                                        onChange={(e) => setResolveBudget(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Resolution Notes</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Add any additional notes..."
                                    />
                                </Form.Group>
                            </Form>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowResolveModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={handleResolve} disabled={loading}>
                        {loading ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <FaCheck className="me-2" /> Mark as Resolved
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Complaints;