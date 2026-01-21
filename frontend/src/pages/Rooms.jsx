import React, { useState, useEffect } from 'react';
import { 
    Container, Row, Col, Card, Table, Button, 
    Modal, Form, Alert, Badge, Tabs, Tab, InputGroup, FormControl
} from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaBed, FaCog, FaRupeeSign, FaUserFriends } from 'react-icons/fa';
import { 
    getRooms, getRoomTypes, createRoom, updateRoom, deleteRoom,
    getRoomTypeById, createRoomType, updateRoomType, deleteRoomType 
} from '../services/roomService';

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [showRoomModal, setShowRoomModal] = useState(false);
    const [showRoomTypeModal, setShowRoomTypeModal] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [editingRoomType, setEditingRoomType] = useState(null);
    const [activeTab, setActiveTab] = useState('rooms');
    
    const [roomFormData, setRoomFormData] = useState({
        room_no: '',
        room_type_id: '',
        status: null,
        check_in_status: 0,
        check_out_status: 0
    });
    
    const [roomTypeFormData, setRoomTypeFormData] = useState({
        room_type: '',
        price: '',
        max_person: ''
    });
    
    const [error, setError] = useState('');
    const [roomLoading, setRoomLoading] = useState(false);
    const [roomTypeLoading, setRoomTypeLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(true);
    const [roomTypesLoading, setRoomTypesLoading] = useState(true);

    useEffect(() => {
        fetchRooms();
        fetchRoomTypes();
    }, []);

    const fetchRooms = async () => {
        try {
            setTableLoading(true);
            const roomsData = await getRooms();
            setRooms(roomsData || []);
        } catch (error) {
            console.error('Error fetching rooms:', error);
            setError('Failed to load rooms');
            setRooms([]);
        } finally {
            setTableLoading(false);
        }
    };

    const fetchRoomTypes = async () => {
        try {
            setRoomTypesLoading(true);
            const typesData = await getRoomTypes();
            setRoomTypes(typesData || []);
        } catch (error) {
            console.error('Error fetching room types:', error);
            setError('Failed to load room types');
            setRoomTypes([]);
        } finally {
            setRoomTypesLoading(false);
        }
    };

    // Room Management Functions
    const handleShowRoomModal = (room = null) => {
        if (room) {
            setEditingRoom(room);
            setRoomFormData({
                room_no: room.room_no,
                room_type_id: room.room_type_id || roomTypes.find(t => t.room_type === room.room_type)?.room_type_id || '',
                status: room.status,
                check_in_status: room.check_in_status || 0,
                check_out_status: room.check_out_status || 0
            });
        } else {
            setEditingRoom(null);
            setRoomFormData({
                room_no: '',
                room_type_id: '',
                status: null,
                check_in_status: 0,
                check_out_status: 0
            });
        }
        setShowRoomModal(true);
        setError('');
    };

    const handleCloseRoomModal = () => {
        setShowRoomModal(false);
        setEditingRoom(null);
        setError('');
    };

    const handleRoomChange = (e) => {
        setRoomFormData({
            ...roomFormData,
            [e.target.name]: e.target.value
        });
    };

    const handleRoomSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setRoomLoading(true);

        try {
            if (editingRoom) {
                await updateRoom(editingRoom.room_id, roomFormData);
            } else {
                await createRoom(roomFormData);
            }
            fetchRooms();
            handleCloseRoomModal();
        } catch (error) {
            setError(error.response?.data?.mess_body || 'Operation failed');
        } finally {
            setRoomLoading(false);
        }
    };

    const handleRoomDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this room?')) {
            try {
                await deleteRoom(id);
                fetchRooms();
            } catch (error) {
                console.error('Error deleting room:', error);
                alert('Failed to delete room');
            }
        }
    };

    // Room Type Management Functions
    const handleShowRoomTypeModal = (roomType = null) => {
        if (roomType) {
            setEditingRoomType(roomType);
            setRoomTypeFormData({
                room_type: roomType.room_type,
                price: roomType.price,
                max_person: roomType.max_person
            });
        } else {
            setEditingRoomType(null);
            setRoomTypeFormData({
                room_type: '',
                price: '',
                max_person: ''
            });
        }
        setShowRoomTypeModal(true);
        setError('');
    };

    const handleCloseRoomTypeModal = () => {
        setShowRoomTypeModal(false);
        setEditingRoomType(null);
        setError('');
    };

    const handleRoomTypeChange = (e) => {
        setRoomTypeFormData({
            ...roomTypeFormData,
            [e.target.name]: e.target.value
        });
    };

    const handleRoomTypeSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setRoomTypeLoading(true);

        try {
            if (editingRoomType) {
                await updateRoomType(editingRoomType.room_type_id, roomTypeFormData);
            } else {
                await createRoomType(roomTypeFormData);
            }
            fetchRoomTypes();
            handleCloseRoomTypeModal();
        } catch (error) {
            setError(error.response?.data?.mess_body || 'Operation failed');
        } finally {
            setRoomTypeLoading(false);
        }
    };

    const handleRoomTypeDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this room type?')) {
            try {
                await deleteRoomType(id);
                fetchRoomTypes();
            } catch (error) {
                console.error('Error deleting room type:', error);
                alert(error.response?.data?.mess_body || 'Failed to delete room type');
            }
        }
    };

    const getStatusBadge = (room) => {
        if (room.status === 1) {
            return <Badge bg="danger">Occupied</Badge>;
        } else if (room.check_in_status === 1) {
            return <Badge bg="warning">Checked In</Badge>;
        } else if (room.check_out_status === 1) {
            return <Badge bg="info">Recently Vacated</Badge>;
        } else {
            return <Badge bg="success">Available</Badge>;
        }
    };

    return (
        <Container fluid>
            <Row className="mb-4">
                <Col>
                    <h2>Room Management</h2>
                </Col>
                <Col className="text-end">
                    {activeTab === 'rooms' ? (
                        <Button variant="primary" onClick={() => handleShowRoomModal()}>
                            <FaPlus className="me-2" /> Add New Room
                        </Button>
                    ) : (
                        <Button variant="success" onClick={() => handleShowRoomTypeModal()}>
                            <FaPlus className="me-2" /> Add New Room Type
                        </Button>
                    )}
                </Col>
            </Row>

            <Card>
                <Card.Body>
                    <Tabs
                        activeKey={activeTab}
                        onSelect={(k) => setActiveTab(k)}
                        className="mb-3"
                    >
                        <Tab eventKey="rooms" title={
                            <>
                                <FaBed className="me-2" />
                                Rooms ({rooms.length})
                            </>
                        }>
                            {tableLoading ? (
                                <div className="text-center p-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="mt-3">Loading rooms...</p>
                                </div>
                            ) : (
                                <Table striped hover responsive>
                                    <thead>
                                        <tr>
                                            <th>Room No</th>
                                            <th>Room Type</th>
                                            <th>Max Persons</th>
                                            <th>Price</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rooms.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="text-center text-muted py-4">
                                                    No rooms found. Add your first room!
                                                </td>
                                            </tr>
                                        ) : (
                                            rooms.map((room) => (
                                                <tr key={room.room_id}>
                                                    <td>
                                                        <FaBed className="me-2" />
                                                        {room.room_no}
                                                    </td>
                                                    <td>{room.room_type}</td>
                                                    <td>{room.max_person}</td>
                                                    <td>₹{room.price}</td>
                                                    <td>{getStatusBadge(room)}</td>
                                                    <td>
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            className="me-2"
                                                            onClick={() => handleShowRoomModal(room)}
                                                        >
                                                            <FaEdit />
                                                        </Button>
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            onClick={() => handleRoomDelete(room.room_id)}
                                                            disabled={room.status === 1}
                                                        >
                                                            <FaTrash />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </Table>
                            )}
                        </Tab>
                        
                        <Tab eventKey="room-types" title={
                            <>
                                <FaCog className="me-2" />
                                Room Types ({roomTypes.length})
                            </>
                        }>
                            <div className="d-flex justify-content-end mb-3">
                                <Button 
                                    variant="outline-primary" 
                                    size="sm"
                                    onClick={() => handleShowRoomTypeModal()}
                                >
                                    <FaPlus className="me-1" /> Add Room Type
                                </Button>
                            </div>
                            
                            {roomTypesLoading ? (
                                <div className="text-center p-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="mt-3">Loading room types...</p>
                                </div>
                            ) : (
                                <Table striped hover responsive>
                                    <thead>
                                        <tr>
                                            <th>Room Type</th>
                                            <th>Price per Day</th>
                                            <th>Max Persons</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {roomTypes.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="text-center text-muted py-4">
                                                    No room types found. Add your first room type!
                                                </td>
                                            </tr>
                                        ) : (
                                            roomTypes.map((type) => (
                                                <tr key={type.room_type_id}>
                                                    <td>
                                                        <strong>{type.room_type}</strong>
                                                    </td>
                                                    <td>
                                                        <FaRupeeSign className="me-2 text-success" />
                                                        ₹{type.price}
                                                    </td>
                                                    <td>
                                                        <FaUserFriends className="me-2 text-info" />
                                                        {type.max_person} {type.max_person === 1 ? 'person' : 'persons'}
                                                    </td>
                                                    <td>
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            className="me-2"
                                                            onClick={() => handleShowRoomTypeModal(type)}
                                                        >
                                                            <FaEdit />
                                                        </Button>
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            onClick={() => handleRoomTypeDelete(type.room_type_id)}
                                                        >
                                                            <FaTrash />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </Table>
                            )}
                        </Tab>
                    </Tabs>
                </Card.Body>
            </Card>

            {/* Add/Edit Room Modal */}
            <Modal show={showRoomModal} onHide={handleCloseRoomModal}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingRoom ? 'Edit Room' : 'Add New Room'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleRoomSubmit}>
                    <Modal.Body>
                        {error && <Alert variant="danger">{error}</Alert>}
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Room Number *</Form.Label>
                            <Form.Control
                                type="text"
                                name="room_no"
                                value={roomFormData.room_no}
                                onChange={handleRoomChange}
                                required
                                placeholder="e.g., A-101"
                            />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Room Type *</Form.Label>
                            <Form.Select
                                name="room_type_id"
                                value={roomFormData.room_type_id}
                                onChange={handleRoomChange}
                                required
                            >
                                <option value="">Select Room Type</option>
                                {roomTypes.map((type) => (
                                    <option key={type.room_type_id} value={type.room_type_id}>
                                        {type.room_type} (₹{type.price} - Max {type.max_person} persons)
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        
                        {editingRoom && (
                            <Form.Group className="mb-3">
                                <Form.Label>Status</Form.Label>
                                <Form.Select
                                    name="status"
                                    value={roomFormData.status || ''}
                                    onChange={handleRoomChange}
                                >
                                    <option value="">Select Status</option>
                                    <option value="0">Available</option>
                                    <option value="1">Occupied</option>
                                </Form.Select>
                            </Form.Group>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseRoomModal}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" disabled={roomLoading}>
                            {roomLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Saving...
                                </>
                            ) : editingRoom ? 'Update Room' : 'Add Room'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Add/Edit Room Type Modal */}
            <Modal show={showRoomTypeModal} onHide={handleCloseRoomTypeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingRoomType ? 'Edit Room Type' : 'Add New Room Type'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleRoomTypeSubmit}>
                    <Modal.Body>
                        {error && <Alert variant="danger">{error}</Alert>}
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Room Type Name *</Form.Label>
                            <Form.Control
                                type="text"
                                name="room_type"
                                value={roomTypeFormData.room_type}
                                onChange={handleRoomTypeChange}
                                required
                                placeholder="e.g., Deluxe Suite, Standard Room, etc."
                            />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Price per Night (₹) *</Form.Label>
                            <InputGroup>
                                <InputGroup.Text>
                                    <FaRupeeSign />
                                </InputGroup.Text>
                                <Form.Control
                                    type="number"
                                    name="price"
                                    value={roomTypeFormData.price}
                                    onChange={handleRoomTypeChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    placeholder="Enter price"
                                />
                            </InputGroup>
                            <Form.Text className="text-muted">
                                Enter the price per night for this room type
                            </Form.Text>
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Maximum Persons *</Form.Label>
                            <InputGroup>
                                <InputGroup.Text>
                                    <FaUserFriends />
                                </InputGroup.Text>
                                <Form.Control
                                    type="number"
                                    name="max_person"
                                    value={roomTypeFormData.max_person}
                                    onChange={handleRoomTypeChange}
                                    required
                                    min="1"
                                    placeholder="Enter maximum number of persons"
                                />
                            </InputGroup>
                            <Form.Text className="text-muted">
                                Maximum number of guests allowed in this room type
                            </Form.Text>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseRoomTypeModal}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" disabled={roomTypeLoading}>
                            {roomTypeLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Saving...
                                </>
                            ) : editingRoomType ? 'Update Room Type' : 'Add Room Type'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default Rooms;