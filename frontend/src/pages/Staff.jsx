import React, { useState, useEffect } from 'react';
import { 
    Container, Row, Col, Card, Table, Button, 
    Modal, Form, Alert, Badge, Spinner
} from 'react-bootstrap';
import { 
    FaUserTie, FaEdit, FaTrash, FaPlus, 
    FaHistory, FaCalendarAlt, FaSave, FaTimes
} from 'react-icons/fa';
import api from '../services/api';

const Staff = () => {
    const [staff, setStaff] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [staffHistory, setStaffHistory] = useState([]);
    const [formData, setFormData] = useState({
        emp_name: '',
        staff_type_id: '',
        shift_id: '',
        id_card_type: '',
        id_card_no: '',
        address: '',
        contact_no: '',
        salary: ''
    });
    const [staffTypes, setStaffTypes] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [idCardTypes, setIdCardTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchStaff();
        fetchStaffTypes();
        fetchShifts();
        fetchIdCardTypes();
    }, []);

    const fetchStaff = async () => {
        try {
            setTableLoading(true);
            // Try to fetch from API first
            const response = await api.get('/staff');
            if (response.data && response.data.data) {
                setStaff(response.data.data);
            } else {
                // Fallback to mock data
                setStaff([
                    {
                        emp_id: 1,
                        emp_name: 'Joseph Bow',
                        staff_type: 'Manager',
                        shift: 'Evening',
                        shift_timing: '4:00 PM - 10:00 PM',
                        id_card_type: 'National Identity Card',
                        id_card_no: '422510099122',
                        address: '4516 Spruce Drive',
                        contact_no: '3479454777',
                        salary: '21000',
                        staff_type_id: 1,
                        shift_id: 3,
                        id_card_type_id: 1
                    },
                    {
                        emp_id: 2,
                        emp_name: 'Cleta Landon',
                        staff_type: 'Front Desk Receptionist',
                        shift: 'Evening',
                        shift_timing: '4:00 PM - 10:00 PM',
                        id_card_type: 'National Identity Card',
                        id_card_no: '422510099122',
                        address: '2555 Hillside Drive',
                        contact_no: '1479994500',
                        salary: '12500',
                        staff_type_id: 3,
                        shift_id: 3,
                        id_card_type_id: 1
                    }
                ]);
            }
        } catch (error) {
            console.error('Error fetching staff:', error);
            // Fallback to mock data
            setStaff([
                {
                    emp_id: 1,
                    emp_name: 'Joseph Bow',
                    staff_type: 'Manager',
                    shift: 'Evening',
                    shift_timing: '4:00 PM - 10:00 PM',
                    id_card_type: 'National Identity Card',
                    id_card_no: '422510099122',
                    address: '4516 Spruce Drive',
                    contact_no: '3479454777',
                    salary: '21000'
                },
                {
                    emp_id: 2,
                    emp_name: 'Cleta Landon',
                    staff_type: 'Front Desk Receptionist',
                    shift: 'Evening',
                    shift_timing: '4:00 PM - 10:00 PM',
                    id_card_type: 'National Identity Card',
                    id_card_no: '422510099122',
                    address: '2555 Hillside Drive',
                    contact_no: '1479994500',
                    salary: '12500'
                }
            ]);
        } finally {
            setTableLoading(false);
        }
    };

    const fetchStaffTypes = async () => {
        try {
            const response = await api.get('/staff/types');
            if (response.data && response.data.data) {
                setStaffTypes(response.data.data);
            } else {
                // Fallback to mock data
                setStaffTypes([
                    { staff_type_id: 1, staff_type: 'Manager' },
                    { staff_type_id: 2, staff_type: 'Housekeeping Manager' },
                    { staff_type_id: 3, staff_type: 'Front Desk Receptionist' },
                    { staff_type_id: 4, staff_type: 'Chef' },
                    { staff_type_id: 5, staff_type: 'Waiter' },
                    { staff_type_id: 6, staff_type: 'Housekeeper' },
                    { staff_type_id: 7, staff_type: 'Security' }
                ]);
            }
        } catch (error) {
            console.error('Error fetching staff types:', error);
            setStaffTypes([
                { staff_type_id: 1, staff_type: 'Manager' },
                { staff_type_id: 2, staff_type: 'Housekeeping Manager' },
                { staff_type_id: 3, staff_type: 'Front Desk Receptionist' },
                { staff_type_id: 4, staff_type: 'Chef' },
                { staff_type_id: 5, staff_type: 'Waiter' }
            ]);
        }
    };

    const fetchShifts = async () => {
        try {
            const response = await api.get('/staff/shifts');
            if (response.data && response.data.data) {
                setShifts(response.data.data);
            } else {
                // Fallback to mock data
                setShifts([
                    { shift_id: 1, shift: 'Morning', shift_timing: '5:00 AM - 10:00 AM' },
                    { shift_id: 2, shift: 'Day', shift_timing: '10:00 AM - 4:00PM' },
                    { shift_id: 3, shift: 'Evening', shift_timing: '4:00 PM - 10:00 PM' },
                    { shift_id: 4, shift: 'Night', shift_timing: '10:00PM - 5:00AM' }
                ]);
            }
        } catch (error) {
            console.error('Error fetching shifts:', error);
            setShifts([
                { shift_id: 1, shift: 'Morning', shift_timing: '5:00 AM - 10:00 AM' },
                { shift_id: 2, shift: 'Day', shift_timing: '10:00 AM - 4:00PM' },
                { shift_id: 3, shift: 'Evening', shift_timing: '4:00 PM - 10:00 PM' },
                { shift_id: 4, shift: 'Night', shift_timing: '10:00PM - 5:00AM' }
            ]);
        }
    };

    const fetchIdCardTypes = async () => {
        try {
            const response = await api.get('/customers/id-card-types');
            if (response.data && response.data.data) {
                setIdCardTypes(response.data.data);
            } else {
                // Fallback to mock data
                setIdCardTypes([
                    { id_card_type_id: 1, id_card_type: 'National Identity Card' },
                    { id_card_type_id: 2, id_card_type: 'Voter Id Card' },
                    { id_card_type_id: 3, id_card_type: 'Pan Card' },
                    { id_card_type_id: 4, id_card_type: 'Driving License' }
                ]);
            }
        } catch (error) {
            console.error('Error fetching ID card types:', error);
            setIdCardTypes([
                { id_card_type_id: 1, id_card_type: 'National Identity Card' },
                { id_card_type_id: 2, id_card_type: 'Voter Id Card' },
                { id_card_type_id: 3, id_card_type: 'Pan Card' },
                { id_card_type_id: 4, id_card_type: 'Driving License' }
            ]);
        }
    };

    const handleShowModal = (staffMember = null) => {
        if (staffMember) {
            setSelectedStaff(staffMember);
            setFormData({
                emp_name: staffMember.emp_name,
                staff_type_id: staffMember.staff_type_id || staffTypes.find(st => st.staff_type === staffMember.staff_type)?.staff_type_id || '',
                shift_id: staffMember.shift_id || shifts.find(s => s.shift === staffMember.shift)?.shift_id || '',
                id_card_type: staffMember.id_card_type_id || idCardTypes.find(it => it.id_card_type === staffMember.id_card_type)?.id_card_type_id || '',
                id_card_no: staffMember.id_card_no || '',
                address: staffMember.address || '',
                contact_no: staffMember.contact_no || '',
                salary: staffMember.salary || ''
            });
        } else {
            setSelectedStaff(null);
            setFormData({
                emp_name: '',
                staff_type_id: '',
                shift_id: '',
                id_card_type: '',
                id_card_no: '',
                address: '',
                contact_no: '',
                salary: ''
            });
        }
        setErrors({});
        setShowModal(true);
    };

    const handleShowHistory = (staffMember) => {
        setSelectedStaff(staffMember);
        // Mock history data - In real app, you'd fetch from API
        const mockHistory = [
            {
                id: 1,
                shift: 'Morning',
                shift_timing: '5:00 AM - 10:00 AM',
                from_date: '2017-11-13 05:39:06',
                to_date: '2017-11-15 02:22:26'
            },
            {
                id: 2,
                shift: 'Evening',
                shift_timing: '4:00 PM - 10:00 PM',
                from_date: '2017-11-15 06:52:26',
                to_date: null
            }
        ];
        setStaffHistory(mockHistory);
        setShowHistoryModal(true);
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.emp_name.trim()) newErrors.emp_name = 'Full name is required';
        if (!formData.staff_type_id) newErrors.staff_type_id = 'Staff type is required';
        if (!formData.shift_id) newErrors.shift_id = 'Shift is required';
        if (!formData.id_card_type) newErrors.id_card_type = 'ID card type is required';
        if (!formData.id_card_no.trim()) newErrors.id_card_no = 'ID card number is required';
        if (!formData.contact_no.trim()) newErrors.contact_no = 'Contact number is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.salary || formData.salary <= 0) newErrors.salary = 'Valid salary is required';
        
        // Contact number validation
        const phoneRegex = /^[0-9]{10,15}$/;
        if (formData.contact_no && !phoneRegex.test(formData.contact_no)) {
            newErrors.contact_no = 'Please enter a valid contact number (10-15 digits)';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setFormLoading(true);
        try {
            const staffData = {
                emp_name: formData.emp_name,
                staff_type_id: formData.staff_type_id,
                shift_id: formData.shift_id,
                id_card_type: formData.id_card_type, // This should be id_card_type_id in backend
                id_card_no: formData.id_card_no,
                address: formData.address,
                contact_no: formData.contact_no,
                salary: formData.salary
            };

            if (selectedStaff) {
                // Update staff
                await api.put(`/staff/${selectedStaff.emp_id}`, staffData);
                alert('Staff updated successfully');
            } else {
                // Create new staff
                await api.post('/staff', staffData);
                alert('Staff added successfully');
            }
            
            fetchStaff();
            setShowModal(false);
            setSelectedStaff(null);
        } catch (error) {
            console.error('Error saving staff:', error);
            alert(`Failed to save staff: ${error.response?.data?.mess_body || error.message}`);
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (staffId) => {
        if (window.confirm('Are you sure you want to delete this staff member?')) {
            try {
                await api.delete(`/staff/${staffId}`);
                fetchStaff();
                alert('Staff deleted successfully');
            } catch (error) {
                console.error('Error deleting staff:', error);
                alert('Failed to delete staff');
            }
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedStaff(null);
        setFormData({
            emp_name: '',
            staff_type_id: '',
            shift_id: '',
            id_card_type: '',
            id_card_no: '',
            address: '',
            contact_no: '',
            salary: ''
        });
        setErrors({});
    };

    // Format date for display
    const formatDateTime = (dateString) => {
        if (!dateString) return 'Current';
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    return (
        <Container fluid>
            <Row className="mb-4">
                <Col>
                    <h2>Staff Management</h2>
                </Col>
                <Col className="text-end">
                    <Button variant="primary" onClick={() => handleShowModal()}>
                        <FaPlus className="me-2" /> Add New Staff
                    </Button>
                </Col>
            </Row>

            <Card>
                <Card.Body>
                    {tableLoading ? (
                        <div className="text-center p-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-3">Loading staff...</p>
                        </div>
                    ) : (
                        <Table striped hover responsive>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Position</th>
                                    <th>Shift</th>
                                    <th>Contact</th>
                                    <th>Salary</th>
                                    <th>ID Type</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {staff.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center text-muted py-4">
                                            No staff members found
                                        </td>
                                    </tr>
                                ) : (
                                    staff.map((staffMember) => (
                                        <tr key={staffMember.emp_id}>
                                            <td>
                                                <FaUserTie className="me-2" />
                                                {staffMember.emp_name}
                                            </td>
                                            <td>{staffMember.staff_type}</td>
                                            <td>
                                                <Badge bg="info">
                                                    {staffMember.shift}
                                                </Badge>
                                                <div className="small text-muted">
                                                    {staffMember.shift_timing}
                                                </div>
                                            </td>
                                            <td>{staffMember.contact_no}</td>
                                            <td>${staffMember.salary}</td>
                                            <td>{staffMember.id_card_type}</td>
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        onClick={() => handleShowModal(staffMember)}
                                                        title="Edit"
                                                    >
                                                        <FaEdit />
                                                    </Button>
                                                    <Button
                                                        variant="outline-info"
                                                        size="sm"
                                                        onClick={() => handleShowHistory(staffMember)}
                                                        title="Shift History"
                                                    >
                                                        <FaHistory />
                                                    </Button>
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => handleDelete(staffMember.emp_id)}
                                                        title="Delete"
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

            {/* Staff Form Modal */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {selectedStaff ? 'Edit Staff' : 'Add New Staff'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        {formLoading ? (
                            <div className="text-center p-5">
                                <Spinner animation="border" variant="primary" />
                                <p className="mt-3">Saving staff...</p>
                            </div>
                        ) : (
                            <>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Full Name *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={formData.emp_name}
                                                onChange={(e) => setFormData({...formData, emp_name: e.target.value})}
                                                isInvalid={!!errors.emp_name}
                                                placeholder="Enter full name"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.emp_name}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Staff Type *</Form.Label>
                                            <Form.Select
                                                value={formData.staff_type_id}
                                                onChange={(e) => setFormData({...formData, staff_type_id: e.target.value})}
                                                isInvalid={!!errors.staff_type_id}
                                            >
                                                <option value="">Select Position</option>
                                                {staffTypes.map((type) => (
                                                    <option key={type.staff_type_id} value={type.staff_type_id}>
                                                        {type.staff_type}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.staff_type_id}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Shift *</Form.Label>
                                            <Form.Select
                                                value={formData.shift_id}
                                                onChange={(e) => setFormData({...formData, shift_id: e.target.value})}
                                                isInvalid={!!errors.shift_id}
                                            >
                                                <option value="">Select Shift</option>
                                                {shifts.map((shift) => (
                                                    <option key={shift.shift_id} value={shift.shift_id}>
                                                        {shift.shift} ({shift.shift_timing})
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.shift_id}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Salary ($) *</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={formData.salary}
                                                onChange={(e) => setFormData({...formData, salary: e.target.value})}
                                                min="0"
                                                step="0.01"
                                                isInvalid={!!errors.salary}
                                                placeholder="Enter salary"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.salary}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Contact Number *</Form.Label>
                                            <Form.Control
                                                type="tel"
                                                value={formData.contact_no}
                                                onChange={(e) => setFormData({...formData, contact_no: e.target.value})}
                                                isInvalid={!!errors.contact_no}
                                                placeholder="e.g., 1234567890"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.contact_no}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>ID Card Type *</Form.Label>
                                            <Form.Select
                                                value={formData.id_card_type}
                                                onChange={(e) => setFormData({...formData, id_card_type: e.target.value})}
                                                isInvalid={!!errors.id_card_type}
                                            >
                                                <option value="">Select ID Type</option>
                                                {idCardTypes.map((type) => (
                                                    <option key={type.id_card_type_id} value={type.id_card_type_id}>
                                                        {type.id_card_type}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.id_card_type}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                
                                <Form.Group className="mb-3">
                                    <Form.Label>ID Card Number *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.id_card_no}
                                        onChange={(e) => setFormData({...formData, id_card_no: e.target.value})}
                                        isInvalid={!!errors.id_card_no}
                                        placeholder="Enter ID card number"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.id_card_no}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                
                                <Form.Group className="mb-3">
                                    <Form.Label>Address *</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={formData.address}
                                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                                        isInvalid={!!errors.address}
                                        placeholder="Enter full address"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.address}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal} disabled={formLoading}>
                            <FaTimes className="me-2" /> Cancel
                        </Button>
                        <Button variant="primary" type="submit" disabled={formLoading}>
                            {formLoading ? (
                                <>
                                    <Spinner animation="border" size="sm" className="me-2" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <FaSave className="me-2" />
                                    {selectedStaff ? 'Update Staff' : 'Add Staff'}
                                </>
                            )}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* History Modal */}
            <Modal show={showHistoryModal} onHide={() => setShowHistoryModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <FaHistory className="me-2" />
                        Shift History - {selectedStaff?.emp_name}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {staffHistory.length === 0 ? (
                        <div className="text-center text-muted py-4">
                            No shift history found
                        </div>
                    ) : (
                        <Table striped hover responsive>
                            <thead>
                                <tr>
                                    <th>Shift</th>
                                    <th>Timing</th>
                                    <th>From Date</th>
                                    <th>To Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {staffHistory.map((history) => (
                                    <tr key={history.id}>
                                        <td>
                                            <Badge bg="info">{history.shift}</Badge>
                                        </td>
                                        <td>{history.shift_timing}</td>
                                        <td>{formatDateTime(history.from_date)}</td>
                                        <td>{formatDateTime(history.to_date)}</td>
                                        <td>
                                            {history.to_date ? (
                                                <Badge bg="secondary">Completed</Badge>
                                            ) : (
                                                <Badge bg="success">Active</Badge>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowHistoryModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Staff;