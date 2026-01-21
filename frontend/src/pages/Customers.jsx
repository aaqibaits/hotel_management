import React, { useState, useEffect } from 'react';
import { 
    Container, Row, Col, Card, Table, Button, 
    Modal, Form, Alert, Spinner, Badge
} from 'react-bootstrap';
import { FaUsers, FaEdit, FaTrash, FaPlus, FaIdCard, FaImage, FaEye, FaTimes } from 'react-icons/fa';
import { 
    getCustomers, 
    createCustomer, 
    updateCustomer, 
    deleteCustomer,
    getIdCardTypes,
    getCustomerPersons,
    fileToBase64
} from '../services/customerService';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [formData, setFormData] = useState({
        customer_name: '',
        number_of_persons: 1,
        contact_no: '',
        email: '',
        id_card_type_id: '',
        id_card_no: '',
        address: ''
    });
    const [persons, setPersons] = useState([]);
    const [idCardTypes, setIdCardTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCustomers();
        fetchIdCardTypes();
    }, []);

    // Initialize persons array when number of persons changes
    useEffect(() => {
        const numPersons = parseInt(formData.number_of_persons) || 1;
        const currentPersons = [...persons];
        
        if (numPersons > currentPersons.length) {
            // Add new persons
            for (let i = currentPersons.length; i < numPersons; i++) {
                currentPersons.push({
                    person_name: '',
                    id_card_type_id: '',
                    id_card_no: '',
                    id_card_front_image: null,
                    id_card_back_image: null,
                    id_card_front_preview: null,
                    id_card_back_preview: null
                });
            }
        } else if (numPersons < currentPersons.length) {
            // Remove excess persons
            currentPersons.splice(numPersons);
        }
        
        setPersons(currentPersons);
    }, [formData.number_of_persons]);

    const fetchCustomers = async () => {
        try {
            setTableLoading(true);
            const customersData = await getCustomers();
            setCustomers(customersData || []);
        } catch (error) {
            console.error('Error fetching customers:', error);
            setError('Failed to load customers');
        } finally {
            setTableLoading(false);
        }
    };

    const fetchIdCardTypes = async () => {
        try {
            const typesData = await getIdCardTypes();
            setIdCardTypes(typesData || []);
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

    const handleShowModal = async (customer = null) => {
        if (customer) {
            setEditingCustomer(customer);
            setFormData({
                customer_name: customer.customer_name,
                number_of_persons: customer.number_of_persons || 1,
                contact_no: customer.contact_no,
                email: customer.email,
                id_card_type_id: customer.id_card_type_id || '',
                id_card_no: customer.id_card_no,
                address: customer.address
            });

            // Fetch person details if editing
            try {
                const personsData = await getCustomerPersons(customer.customer_id);
                if (personsData && personsData.length > 0) {
                    setPersons(personsData.map(p => ({
                        person_name: p.person_name,
                        id_card_type_id: p.id_card_type_id,
                        id_card_no: p.id_card_no,
                        id_card_front_image: p.id_card_front_image,
                        id_card_back_image: p.id_card_back_image,
                        id_card_front_preview: p.id_card_front_image,
                        id_card_back_preview: p.id_card_back_image
                    })));
                }
            } catch (error) {
                console.error('Error fetching person details:', error);
            }
        } else {
            setEditingCustomer(null);
            setFormData({
                customer_name: '',
                number_of_persons: 1,
                contact_no: '',
                email: '',
                id_card_type_id: '',
                id_card_no: '',
                address: ''
            });
            setPersons([{
                person_name: '',
                id_card_type_id: '',
                id_card_no: '',
                id_card_front_image: null,
                id_card_back_image: null,
                id_card_front_preview: null,
                id_card_back_preview: null
            }]);
        }
        setShowModal(true);
        setShowDetailModal(false);
        setError('');
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingCustomer(null);
        setError('');
        setPersons([]);
    };

    const handleShowDetailModal = async (customer) => {
        setSelectedCustomer(customer);
        // Fetch person details for the selected customer
        try {
            const personsData = await getCustomerPersons(customer.customer_id);
            if (personsData && personsData.length > 0) {
                setPersons(personsData.map(p => ({
                    person_name: p.person_name,
                    id_card_type_id: p.id_card_type_id,
                    id_card_type: p.id_card_type,
                    id_card_no: p.id_card_no,
                    id_card_front_image: p.id_card_front_image,
                    id_card_back_image: p.id_card_back_image,
                    id_card_front_preview: p.id_card_front_image,
                    id_card_back_preview: p.id_card_back_image
                })));
            }
        } catch (error) {
            console.error('Error fetching person details:', error);
        }
        setShowDetailModal(true);
    };

    const handleCloseDetailModal = () => {
        setShowDetailModal(false);
        setSelectedCustomer(null);
        setPersons([]);
    };

    const handleShowImage = (imageUrl, side) => {
        setSelectedImage({ url: imageUrl, side });
        setShowImageModal(true);
    };

    const handleCloseImageModal = () => {
        setShowImageModal(false);
        setSelectedImage(null);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handlePersonChange = (index, field, value) => {
        const updatedPersons = [...persons];
        updatedPersons[index][field] = value;
        setPersons(updatedPersons);
    };

    const handleFileChange = async (index, field, file) => {
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            alert('Please upload a valid image file (JPEG, PNG, GIF)');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }

        try {
            const base64 = await fileToBase64(file);
            const updatedPersons = [...persons];
            updatedPersons[index][field] = base64;
            updatedPersons[index][`${field}_preview`] = URL.createObjectURL(file);
            setPersons(updatedPersons);
        } catch (error) {
            console.error('Error converting file:', error);
            alert('Failed to process image');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // Validate persons data
        for (let i = 0; i < persons.length; i++) {
            const person = persons[i];
            if (!person.person_name.trim()) {
                setError(`Please enter name for Person ${i + 1}`);
                return;
            }
            if (!person.id_card_type_id) {
                setError(`Please select ID card type for Person ${i + 1}`);
                return;
            }
            if (!person.id_card_no.trim()) {
                setError(`Please enter ID card number for Person ${i + 1}`);
                return;
            }
        }

        setLoading(true);

        try {
            const customerData = {
                ...formData,
                persons: persons.map(p => ({
                    person_name: p.person_name,
                    id_card_type_id: p.id_card_type_id,
                    id_card_no: p.id_card_no,
                    id_card_front_image: p.id_card_front_image,
                    id_card_back_image: p.id_card_back_image
                }))
            };

            if (editingCustomer) {
                await updateCustomer(editingCustomer.customer_id, customerData);
            } else {
                await createCustomer(customerData);
            }
            
            fetchCustomers();
            handleCloseModal();
            handleCloseDetailModal();
            alert(`Customer ${editingCustomer ? 'updated' : 'added'} successfully`);
        } catch (error) {
            setError(error.response?.data?.mess_body || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            try {
                await deleteCustomer(id);
                fetchCustomers();
                handleCloseDetailModal();
                alert('Customer deleted successfully');
            } catch (error) {
                console.error('Error deleting customer:', error);
                alert('Failed to delete customer');
            }
        }
    };

    const getIDCardTypeName = (id) => {
        const type = idCardTypes.find(t => t.id_card_type_id == id);
        return type ? type.id_card_type : 'Unknown';
    };

    return (
        <Container fluid>
            <Row className="mb-4">
                <Col>
                    <h2>Customer Management</h2>
                </Col>
                <Col className="text-end">
                    <Button variant="primary" onClick={() => handleShowModal()}>
                        <FaPlus className="me-2" /> Add New Customer
                    </Button>
                </Col>
            </Row>

            <Card>
                <Card.Body>
                    {tableLoading ? (
                        <div className="text-center p-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-3">Loading customers...</p>
                        </div>
                    ) : (
                        <Table striped hover responsive>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Persons</th>
                                    <th>Contact</th>
                                    <th>Email</th>
                                    <th>ID Type</th>
                                    <th>ID Number</th>
                                    <th>Address</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center text-muted py-4">
                                            No customers found
                                        </td>
                                    </tr>
                                ) : (
                                    customers.map((customer) => (
                                        <tr key={customer.customer_id}>
                                            <td>
                                                <Button 
                                                    variant="link" 
                                                    className="p-0 text-decoration-none text-start"
                                                    onClick={() => handleShowDetailModal(customer)}
                                                >
                                                    <FaUsers className="me-2" />
                                                    <strong>{customer.customer_name}</strong>
                                                </Button>
                                            </td>
                                            <td>
                                                <Badge bg="info">
                                                    {customer.number_of_persons || 1} Person(s)
                                                </Badge>
                                            </td>
                                            <td>{customer.contact_no}</td>
                                            <td>{customer.email}</td>
                                            <td>{customer.id_card_type}</td>
                                            <td>
                                                <FaIdCard className="me-2" />
                                                {customer.id_card_no}
                                            </td>
                                            <td>{customer.address}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>

            {/* Add/Edit Customer Modal */}
            <Modal show={showModal} onHide={handleCloseModal} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                        {error && <Alert variant="danger">{error}</Alert>}
                        
                        {/* Main Customer Information */}
                        <Card className="mb-4">
                            <Card.Header className="bg-primary text-white">
                                <h5 className="mb-0">Customer Information</h5>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Full Name *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="customer_name"
                                                value={formData.customer_name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Number of Persons *</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="number_of_persons"
                                                value={formData.number_of_persons}
                                                onChange={handleChange}
                                                min="1"
                                                max="10"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Contact Number *</Form.Label>
                                            <Form.Control
                                                type="tel"
                                                name="contact_no"
                                                value={formData.contact_no}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Email Address *</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Primary ID Card Type *</Form.Label>
                                            <Form.Select
                                                name="id_card_type_id"
                                                value={formData.id_card_type_id}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select ID Type</option>
                                                {idCardTypes.map((type) => (
                                                    <option key={type.id_card_type_id} value={type.id_card_type_id}>
                                                        {type.id_card_type}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Primary ID Card Number *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="id_card_no"
                                                value={formData.id_card_no}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Address *</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={2}
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        {/* Person Details */}
                        {persons.map((person, index) => (
                            <Card key={index} className="mb-3">
                                <Card.Header className="bg-info text-white">
                                    <h6 className="mb-0">
                                        <FaUsers className="me-2" />
                                        Person {index + 1} Details & ID Card Images
                                    </h6>
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col md={4}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Person Name *</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={person.person_name}
                                                    onChange={(e) => handlePersonChange(index, 'person_name', e.target.value)}
                                                    placeholder="Enter full name"
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>ID Card Type *</Form.Label>
                                                <Form.Select
                                                    value={person.id_card_type_id}
                                                    onChange={(e) => handlePersonChange(index, 'id_card_type_id', e.target.value)}
                                                    required
                                                >
                                                    <option value="">Select ID Type</option>
                                                    {idCardTypes.map((type) => (
                                                        <option key={type.id_card_type_id} value={type.id_card_type_id}>
                                                            {type.id_card_type}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>ID Card Number *</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={person.id_card_no}
                                                    onChange={(e) => handlePersonChange(index, 'id_card_no', e.target.value)}
                                                    placeholder="Enter ID number"
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        {/* Front Side ID Card */}
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    <FaIdCard className="me-2" />
                                                    ID Card - Front Side
                                                </Form.Label>
                                                <Form.Control
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleFileChange(index, 'id_card_front_image', e.target.files[0])}
                                                />
                                                {person.id_card_front_preview && (
                                                    <div className="mt-2 text-center">
                                                        <img 
                                                            src={person.id_card_front_preview} 
                                                            alt="Front ID Preview" 
                                                            style={{ 
                                                                maxWidth: '100%', 
                                                                maxHeight: '200px',
                                                                border: '2px solid #dee2e6',
                                                                borderRadius: '8px',
                                                                padding: '5px'
                                                            }} 
                                                        />
                                                        <div className="mt-2">
                                                            <Badge bg="success">
                                                                <FaImage className="me-1" />
                                                                Front Side Uploaded
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                )}
                                            </Form.Group>
                                        </Col>

                                        {/* Back Side ID Card */}
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    <FaIdCard className="me-2" />
                                                    ID Card - Back Side
                                                </Form.Label>
                                                <Form.Control
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleFileChange(index, 'id_card_back_image', e.target.files[0])}
                                                />
                                                {person.id_card_back_preview && (
                                                    <div className="mt-2 text-center">
                                                        <img 
                                                            src={person.id_card_back_preview} 
                                                            alt="Back ID Preview" 
                                                            style={{ 
                                                                maxWidth: '100%', 
                                                                maxHeight: '200px',
                                                                border: '2px solid #dee2e6',
                                                                borderRadius: '8px',
                                                                padding: '5px'
                                                            }} 
                                                        />
                                                        <div className="mt-2">
                                                            <Badge bg="success">
                                                                <FaImage className="me-1" />
                                                                Back Side Uploaded
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                )}
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        ))}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Spinner animation="border" size="sm" className="me-2" />
                                    Saving...
                                </>
                            ) : editingCustomer ? 'Update Customer' : 'Add Customer'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Customer Detail Modal */}
            <Modal show={showDetailModal} onHide={handleCloseDetailModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <FaUsers className="me-2" />
                        Customer Details
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    {selectedCustomer && (
                        <>
                            <Card className="mb-4">
                                <Card.Header className="bg-primary text-white">
                                    <h5 className="mb-0">Customer Information</h5>
                                </Card.Header>
                                <Card.Body>
                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <strong>Name:</strong>
                                            <p className="mb-0">{selectedCustomer.customer_name}</p>
                                        </Col>
                                        <Col md={6}>
                                            <strong>Number of Persons:</strong>
                                            <p className="mb-0">
                                                <Badge bg="info">{selectedCustomer.number_of_persons || 1} Person(s)</Badge>
                                            </p>
                                        </Col>
                                    </Row>
                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <strong>Contact Number:</strong>
                                            <p className="mb-0">{selectedCustomer.contact_no}</p>
                                        </Col>
                                        <Col md={6}>
                                            <strong>Email Address:</strong>
                                            <p className="mb-0">{selectedCustomer.email}</p>
                                        </Col>
                                    </Row>
                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <strong>Primary ID Card Type:</strong>
                                            <p className="mb-0">{selectedCustomer.id_card_type}</p>
                                        </Col>
                                        <Col md={6}>
                                            <strong>Primary ID Card Number:</strong>
                                            <p className="mb-0">{selectedCustomer.id_card_no}</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12}>
                                            <strong>Address:</strong>
                                            <p className="mb-0">{selectedCustomer.address}</p>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>

                            {/* Person Details */}
                            <h5 className="mb-3">Persons Details</h5>
                            {persons.map((person, index) => (
                                <Card key={index} className="mb-3">
                                    <Card.Header className="bg-info text-white">
                                        <h6 className="mb-0">Person {index + 1}</h6>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row className="mb-3">
                                            <Col md={4}>
                                                <strong>Name:</strong>
                                                <p className="mb-0">{person.person_name}</p>
                                            </Col>
                                            <Col md={4}>
                                                <strong>ID Card Type:</strong>
                                                <p className="mb-0">{person.id_card_type || getIDCardTypeName(person.id_card_type_id)}</p>
                                            </Col>
                                            <Col md={4}>
                                                <strong>ID Card Number:</strong>
                                                <p className="mb-0">{person.id_card_no}</p>
                                            </Col>
                                        </Row>
                                        
                                        {/* ID Card Images */}
                                        <Row>
                                            <Col md={6}>
                                                <strong>ID Card - Front Side:</strong>
                                                {person.id_card_front_preview ? (
                                                    <div className="mt-2 text-center">
                                                        <img 
                                                            src={person.id_card_front_preview} 
                                                            alt="Front ID Preview" 
                                                            style={{ 
                                                                maxWidth: '100%', 
                                                                maxHeight: '150px',
                                                                border: '2px solid #dee2e6',
                                                                borderRadius: '8px',
                                                                padding: '5px',
                                                                cursor: 'pointer'
                                                            }}
                                                            onClick={() => handleShowImage(person.id_card_front_preview, 'Front')}
                                                        />
                                                        <div className="mt-2">
                                                            <Button 
                                                                variant="outline-primary" 
                                                                size="sm"
                                                                onClick={() => handleShowImage(person.id_card_front_preview, 'Front')}
                                                            >
                                                                <FaEye className="me-1" /> View Full Size
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-muted mt-2 mb-0">No image uploaded</p>
                                                )}
                                            </Col>
                                            <Col md={6}>
                                                <strong>ID Card - Back Side:</strong>
                                                {person.id_card_back_preview ? (
                                                    <div className="mt-2 text-center">
                                                        <img 
                                                            src={person.id_card_back_preview} 
                                                            alt="Back ID Preview" 
                                                            style={{ 
                                                                maxWidth: '100%', 
                                                                maxHeight: '150px',
                                                                border: '2px solid #dee2e6',
                                                                borderRadius: '8px',
                                                                padding: '5px',
                                                                cursor: 'pointer'
                                                            }}
                                                            onClick={() => handleShowImage(person.id_card_back_preview, 'Back')}
                                                        />
                                                        <div className="mt-2">
                                                            <Button 
                                                                variant="outline-primary" 
                                                                size="sm"
                                                                onClick={() => handleShowImage(person.id_card_back_preview, 'Back')}
                                                            >
                                                                <FaEye className="me-1" /> View Full Size
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-muted mt-2 mb-0">No image uploaded</p>
                                                )}
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            ))}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-danger" onClick={() => selectedCustomer && handleDelete(selectedCustomer.customer_id)}>
                        <FaTrash className="me-2" /> Delete Customer
                    </Button>
                    <Button variant="outline-primary" onClick={() => selectedCustomer && handleShowModal(selectedCustomer)}>
                        <FaEdit className="me-2" /> Edit Customer
                    </Button>
                    <Button variant="secondary" onClick={handleCloseDetailModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Full Size Image Modal */}
            <Modal show={showImageModal} onHide={handleCloseImageModal} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <FaImage className="me-2" />
                        ID Card - {selectedImage?.side} Side
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    {selectedImage && (
                        <img 
                            src={selectedImage.url} 
                            alt={`ID Card ${selectedImage.side} Side`}
                            style={{ 
                                maxWidth: '100%',
                                maxHeight: '70vh',
                                objectFit: 'contain'
                            }}
                        />
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseImageModal}>
                        <FaTimes className="me-2" /> Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Customers;