import React, { useState, useEffect } from 'react';
import { 
    Container, Row, Col, Card, Table, Button, 
    Modal, Form, Alert, Badge, Spinner
} from 'react-bootstrap';
import { 
    FaCalendarCheck, FaEdit, FaTrash, FaPlus, 
    FaCheck, FaDoorOpen, FaMoneyBill, FaSave, FaTimes,
    FaUser, FaBed, FaCalendarAlt, FaRupeeSign, FaReceipt,
    FaCheckCircle, FaClock, FaExclamationTriangle
} from 'react-icons/fa';
import { format } from 'date-fns';
import { 
    getAdvanceBookings,
    createBooking,
    updateBooking,
    deleteBooking,
    confirmAdvanceBooking,
    updateBookingPayment
} from '../services/bookingService';
import api from '../services/api';

const AdvanceBooking = () => {
    const [bookings, setBookings] = useState([]);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [editingBooking, setEditingBooking] = useState(null);
    const [loading, setLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(true);
    const [customers, setCustomers] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [errors, setErrors] = useState({});
    
    const [paymentData, setPaymentData] = useState({
        amount: '',
        paymentStatus: 'UNPAID',
        paymentMethod: ''
    });
    
    const [bookingFormData, setBookingFormData] = useState({
        customer_id: '',
        room_id: '',
        check_in: '',
        check_out: '',
        total_price: '',
        remaining_price: '',
        bookingType: 'ADVANCE',
        status: 'PENDING_CONFIRMATION',
        paymentStatus: 'UNPAID',
        paymentMethod: ''
    });

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setTableLoading(true);
            const data = await getAdvanceBookings();
            setBookings(data || []);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setBookings([]);
        } finally {
            setTableLoading(false);
        }
    };

    const fetchDropdownData = async () => {
        try {
            const [customersRes, roomsRes] = await Promise.all([
                api.get('/customers'),
                api.get('/rooms')
            ]);
            setCustomers(customersRes.data.data || []);
            setRooms(roomsRes.data.data || []);
        } catch (error) {
            console.error('Error fetching dropdown data:', error);
        }
    };

    const handleOpenBookingModal = (booking = null) => {
        setEditingBooking(booking);
        if (booking) {
            setBookingFormData({
                customer_id: booking.customer_id || '',
                room_id: booking.room_id || '',
                check_in: booking.check_in || '',
                check_out: booking.check_out || '',
                total_price: booking.total_price || '',
                remaining_price: booking.remaining_price || booking.total_price || '',
                bookingType: 'ADVANCE',
                status: booking.status || 'PENDING_CONFIRMATION',
                paymentStatus: booking.paymentStatus || 'UNPAID',
                paymentMethod: booking.paymentMethod || ''
            });
        } else {
            setBookingFormData({
                customer_id: '',
                room_id: '',
                check_in: '',
                check_out: '',
                total_price: '',
                remaining_price: '',
                bookingType: 'ADVANCE',
                status: 'PENDING_CONFIRMATION',
                paymentStatus: 'UNPAID',
                paymentMethod: ''
            });
        }
        setErrors({});
        fetchDropdownData();
        setShowBookingModal(true);
    };

    const handleConfirmBooking = async (bookingId) => {
        if (window.confirm('Confirm this advance booking? This will move it to the regular bookings list.')) {
            try {
                setLoading(true);
                await confirmAdvanceBooking(bookingId);
                fetchBookings();
                alert('Booking confirmed successfully! It has been moved to the regular bookings.');
            } catch (error) {
                console.error('Error confirming booking:', error);
                alert(error.response?.data?.mess_body || 'Failed to confirm booking');
            } finally {
                setLoading(false);
            }
        }
    };

    const handlePaymentModal = (booking) => {
        setSelectedBooking(booking);
        setPaymentData({
            amount: booking.remaining_price || 0,
            paymentStatus: booking.paymentStatus || 'UNPAID',
            paymentMethod: booking.paymentMethod || ''
        });
        setShowPaymentModal(true);
    };

    const handlePaymentSubmit = async () => {
        if (!paymentData.amount || paymentData.amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        if (paymentData.paymentStatus === 'PAID' && !paymentData.paymentMethod) {
            alert('Please select a payment method');
            return;
        }

        try {
            setLoading(true);
            await updateBookingPayment(selectedBooking.booking_id, {
                remaining_price: selectedBooking.remaining_price - paymentData.amount,
                paymentStatus: paymentData.paymentStatus,
                paymentMethod: paymentData.paymentMethod
            });
            
            fetchBookings();
            setShowPaymentModal(false);
            setSelectedBooking(null);
            alert('Payment updated successfully');
        } catch (error) {
            console.error('Error updating payment:', error);
            alert(error.response?.data?.mess_body || 'Failed to update payment');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (bookingId) => {
        if (window.confirm('Are you sure you want to delete this advance booking?')) {
            try {
                await deleteBooking(bookingId);
                fetchBookings();
                alert('Booking deleted successfully');
            } catch (error) {
                console.error('Error deleting booking:', error);
                alert(error.response?.data?.mess_body || 'Failed to delete booking');
            }
        }
    };

    const handleShowDetailModal = (booking) => {
        setSelectedBooking(booking);
        setShowDetailModal(true);
    };

    const handleCloseDetailModal = () => {
        setShowDetailModal(false);
        setSelectedBooking(null);
    };

    const validateBookingForm = () => {
        const newErrors = {};
        
        if (!bookingFormData.customer_id) newErrors.customer_id = 'Customer is required';
        if (!bookingFormData.room_id) newErrors.room_id = 'Room is required';
        if (!bookingFormData.check_in) newErrors.check_in = 'Check-in date is required';
        if (!bookingFormData.check_out) newErrors.check_out = 'Check-out date is required';
        if (!bookingFormData.total_price || bookingFormData.total_price <= 0) {
            newErrors.total_price = 'Valid total price is required';
        }
        
        if (bookingFormData.paymentStatus === 'PAID' && !bookingFormData.paymentMethod) {
            newErrors.paymentMethod = 'Payment method is required when marking as PAID';
        }
        
        if (bookingFormData.check_in && bookingFormData.check_out) {
            const checkIn = new Date(bookingFormData.check_in);
            const checkOut = new Date(bookingFormData.check_out);
            if (checkOut <= checkIn) {
                newErrors.check_out = 'Check-out must be after check-in';
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateBookingForm()) {
            return;
        }

        setLoading(true);
        try {
            const bookingPayload = {
                ...bookingFormData,
                remaining_price: bookingFormData.paymentStatus === 'PAID' ? 0 : (bookingFormData.remaining_price || bookingFormData.total_price),
                bookingType: 'ADVANCE',
                status: 'PENDING_CONFIRMATION',
                checkInStatus: false,
                checkOutStatus: false
            };

            if (editingBooking) {
                await updateBooking(editingBooking.booking_id, bookingPayload);
                alert('Advance booking updated successfully');
            } else {
                await createBooking(bookingPayload);
                alert('Advance booking created successfully');
            }
            
            fetchBookings();
            handleCloseBookingModal();
        } catch (error) {
            console.error('Error saving booking:', error);
            alert(error.response?.data?.mess_body || 'Failed to save booking');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseBookingModal = () => {
        setShowBookingModal(false);
        setEditingBooking(null);
        setBookingFormData({
            customer_id: '',
            room_id: '',
            check_in: '',
            check_out: '',
            total_price: '',
            remaining_price: '',
            bookingType: 'ADVANCE',
            status: 'PENDING_CONFIRMATION',
            paymentStatus: 'UNPAID',
            paymentMethod: ''
        });
        setErrors({});
    };

    const calculatePrice = () => {
        if (bookingFormData.room_id && bookingFormData.check_in && bookingFormData.check_out) {
            const selectedRoom = rooms.find(r => r.room_id == bookingFormData.room_id);
            if (selectedRoom) {
                const checkIn = new Date(bookingFormData.check_in);
                const checkOut = new Date(bookingFormData.check_out);
                const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
                const price = selectedRoom.price * nights;
                setBookingFormData(prev => ({
                    ...prev, 
                    total_price: price, 
                    remaining_price: prev.paymentStatus === 'PAID' ? 0 : price
                }));
            }
        }
    };

    useEffect(() => {
        if (bookingFormData.room_id && bookingFormData.check_in && bookingFormData.check_out) {
            calculatePrice();
        }
    }, [bookingFormData.room_id, bookingFormData.check_in, bookingFormData.check_out]);

    const getStatusBadge = (status) => {
        const statusMap = {
            'PENDING_CONFIRMATION': { bg: 'warning', icon: <FaClock />, text: 'Pending' },
            'CONFIRMED': { bg: 'success', icon: <FaCheckCircle />, text: 'Confirmed' },
            'COMPLETED': { bg: 'secondary', icon: <FaCheck />, text: 'Completed' }
        };
        const statusInfo = statusMap[status] || statusMap['PENDING_CONFIRMATION'];
        return <Badge bg={statusInfo.bg}>{statusInfo.icon} {statusInfo.text}</Badge>;
    };

    const getPaymentStatusBadge = (status) => {
        return status === 'PAID' ? 
            <Badge bg="success"><FaCheckCircle /> Paid</Badge> : 
            <Badge bg="danger"><FaExclamationTriangle /> Unpaid</Badge>;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            return format(new Date(dateString), 'dd-MM-yyyy');
        } catch (error) {
            return dateString;
        }
    };

    const calculateNights = (checkIn, checkOut) => {
        if (!checkIn || !checkOut) return 0;
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        return Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    };

    return (
        <Container fluid>
            <Row className="mb-4">
                <Col>
                    <h2><FaCalendarCheck className="me-2" />Advance Booking Management</h2>
                    <p className="text-muted">Manage advance reservations - bookings will move to regular bookings upon confirmation</p>
                </Col>
                <Col className="text-end">
                    <Button 
                        variant="primary"
                        onClick={() => handleOpenBookingModal()}
                    >
                        <FaPlus className="me-2" /> New Advance Booking
                    </Button>
                </Col>
            </Row>

            <Card>
                <Card.Body>
                    {tableLoading ? (
                        <div className="text-center p-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-3">Loading advance bookings...</p>
                        </div>
                    ) : (
                        <Table striped hover responsive>
                            <thead>
                                <tr>
                                    <th>Booking ID</th>
                                    <th>Customer</th>
                                    <th>Room</th>
                                    <th>Check-in</th>
                                    <th>Check-out</th>
                                    <th>Total Price</th>
                                    <th>Status</th>
                                    <th>Payment</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="text-center text-muted py-4">
                                            No advance bookings found
                                        </td>
                                    </tr>
                                ) : (
                                    bookings.map((booking) => (
                                        <tr key={booking.booking_id}>
                                            <td>{booking.booking_id}</td>
                                            <td>
                                                <Button 
                                                    variant="link" 
                                                    className="p-0 text-decoration-none text-start"
                                                    onClick={() => handleShowDetailModal(booking)}
                                                >
                                                    <FaUser className="me-2" />
                                                    <strong>{booking.customer_name}</strong>
                                                </Button>
                                            </td>
                                            <td>
                                                <FaBed className="me-2" />
                                                {booking.room_no} ({booking.room_type})
                                            </td>
                                            <td>
                                                <FaCalendarAlt className="me-2" />
                                                {formatDate(booking.check_in)}
                                            </td>
                                            <td>
                                                <FaCalendarAlt className="me-2" />
                                                {formatDate(booking.check_out)}
                                            </td>
                                            <td>
                                                <FaRupeeSign className="me-2" />
                                                ₹{booking.total_price}
                                            </td>
                                            <td>{getStatusBadge(booking.status)}</td>
                                            <td>{getPaymentStatusBadge(booking.paymentStatus)}</td>
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <Button
                                                        variant="success"
                                                        size="sm"
                                                        title="Confirm Booking"
                                                        onClick={() => handleConfirmBooking(booking.booking_id)}
                                                        disabled={booking.status === 'CONFIRMED'}
                                                    >
                                                        <FaCheckCircle />
                                                    </Button>
                                                    <Button
                                                        variant="outline-warning"
                                                        size="sm"
                                                        title="Update Payment"
                                                        onClick={() => handlePaymentModal(booking)}
                                                    >
                                                        <FaMoneyBill />
                                                    </Button>
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        title="Edit"
                                                        onClick={() => handleOpenBookingModal(booking)}
                                                    >
                                                        <FaEdit />
                                                    </Button>
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        title="Delete"
                                                        onClick={() => handleDelete(booking.booking_id)}
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

            {/* Booking Detail Modal */}
            <Modal show={showDetailModal} onHide={handleCloseDetailModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <FaCalendarCheck className="me-2" />
                        Advance Booking Details
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedBooking && (
                        <>
                            <Card className="mb-3">
                                <Card.Header className="bg-primary text-white">
                                    <h5 className="mb-0">Booking Information</h5>
                                </Card.Header>
                                <Card.Body>
                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <strong>Booking ID:</strong>
                                            <p>{selectedBooking.booking_id}</p>
                                        </Col>
                                        <Col md={6}>
                                            <strong>Status:</strong>
                                            <p>{getStatusBadge(selectedBooking.status)}</p>
                                        </Col>
                                    </Row>
                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <strong>Customer:</strong>
                                            <p>{selectedBooking.customer_name}</p>
                                        </Col>
                                        <Col md={6}>
                                            <strong>Room:</strong>
                                            <p>{selectedBooking.room_no} ({selectedBooking.room_type})</p>
                                        </Col>
                                    </Row>
                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <strong>Check-in:</strong>
                                            <p>{formatDate(selectedBooking.check_in)}</p>
                                        </Col>
                                        <Col md={6}>
                                            <strong>Check-out:</strong>
                                            <p>{formatDate(selectedBooking.check_out)}</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <strong>Total Nights:</strong>
                                            <p>{calculateNights(selectedBooking.check_in, selectedBooking.check_out)} nights</p>
                                        </Col>
                                        <Col md={6}>
                                            <strong>Booking Date:</strong>
                                            <p>{formatDate(selectedBooking.booking_date)}</p>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>

                            <Card>
                                <Card.Header className="bg-info text-white">
                                    <h6 className="mb-0">Payment Information</h6>
                                </Card.Header>
                                <Card.Body>
                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <strong>Total Amount:</strong>
                                            <p className="h5 text-primary">₹{selectedBooking.total_price}</p>
                                        </Col>
                                        <Col md={6}>
                                            <strong>Remaining:</strong>
                                            <p className="h5 text-danger">₹{selectedBooking.remaining_price}</p>
                                        </Col>
                                    </Row>
                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <strong>Payment Status:</strong>
                                            <p>{getPaymentStatusBadge(selectedBooking.paymentStatus)}</p>
                                        </Col>
                                        <Col md={6}>
                                            <strong>Payment Method:</strong>
                                            <p>{selectedBooking.paymentMethod || 'Not specified'}</p>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDetailModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Booking Form Modal */}
            <Modal show={showBookingModal} onHide={handleCloseBookingModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingBooking ? 'Edit Advance Booking' : 'Create New Advance Booking'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleBookingSubmit}>
                    <Modal.Body>
                        <Alert variant="info">
                            <FaExclamationTriangle className="me-2" />
                            This is an advance booking. It will remain in "Pending Confirmation" status until confirmed.
                        </Alert>
                        
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Customer *</Form.Label>
                                    <Form.Select
                                        value={bookingFormData.customer_id}
                                        onChange={(e) => setBookingFormData({...bookingFormData, customer_id: e.target.value})}
                                        isInvalid={!!errors.customer_id}
                                    >
                                        <option value="">Select Customer</option>
                                        {customers.map(customer => (
                                            <option key={customer.customer_id} value={customer.customer_id}>
                                                {customer.customer_name} ({customer.contact_no})
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.customer_id}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Room *</Form.Label>
                                    <Form.Select
                                        value={bookingFormData.room_id}
                                        onChange={(e) => setBookingFormData({...bookingFormData, room_id: e.target.value})}
                                        isInvalid={!!errors.room_id}
                                    >
                                        <option value="">Select Room</option>
                                        {rooms.filter(room => !room.status || room.room_id == bookingFormData.room_id).map(room => (
                                            <option key={room.room_id} value={room.room_id}>
                                                {room.room_no} ({room.room_type}) - ₹{room.price}/night
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.room_id}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Check-in Date *</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={bookingFormData.check_in}
                                        onChange={(e) => setBookingFormData({...bookingFormData, check_in: e.target.value})}
                                        min={new Date().toISOString().split('T')[0]}
                                        isInvalid={!!errors.check_in}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.check_in}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Check-out Date *</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={bookingFormData.check_out}
                                        onChange={(e) => setBookingFormData({...bookingFormData, check_out: e.target.value})}
                                        min={bookingFormData.check_in || new Date().toISOString().split('T')[0]}
                                        isInvalid={!!errors.check_out}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.check_out}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Total Price (₹)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={bookingFormData.total_price}
                                        onChange={(e) => setBookingFormData({...bookingFormData, total_price: e.target.value})}
                                        min="0"
                                        step="0.01"
                                        isInvalid={!!errors.total_price}
                                        readOnly={!!bookingFormData.room_id && !!bookingFormData.check_in && !!bookingFormData.check_out}
                                    />
                                    <Form.Text className="text-muted">
                                        {bookingFormData.room_id && bookingFormData.check_in && bookingFormData.check_out ? 
                                            'Automatically calculated based on room rate and nights' : 
                                            'Select room and dates to auto-calculate'}
                                    </Form.Text>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.total_price}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col md={12}>
                                <Card className="mb-3 border-primary">
                                    <Card.Header className="bg-primary text-white">
                                        <h6 className="mb-0">Payment Information</h6>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Payment Status *</Form.Label>
                                                    <Form.Select
                                                        value={bookingFormData.paymentStatus}
                                                        onChange={(e) => {
                                                            const status = e.target.value;
                                                            setBookingFormData({
                                                                ...bookingFormData, 
                                                                paymentStatus: status,
                                                                remaining_price: status === 'PAID' ? 0 : bookingFormData.total_price,
                                                                paymentMethod: status === 'UNPAID' ? '' : bookingFormData.paymentMethod
                                                            });
                                                        }}
                                                    >
                                                        <option value="UNPAID">Unpaid</option>
                                                        <option value="PAID">Paid</option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                            
                                            {bookingFormData.paymentStatus === 'PAID' && (
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Payment Method *</Form.Label>
                                                        <Form.Select
                                                            value={bookingFormData.paymentMethod}
                                                            onChange={(e) => setBookingFormData({...bookingFormData, paymentMethod: e.target.value})}
                                                            isInvalid={!!errors.paymentMethod}
                                                        >
                                                            <option value="">Select Payment Method</option>
                                                            <option value="CASH">Cash</option>
                                                            <option value="CARD">Card</option>
                                                            <option value="UPI">UPI</option>
                                                            <option value="ONLINE">Online Transfer</option>
                                                            <option value="BANK_TRANSFER">Bank Transfer</option>
                                                        </Form.Select>
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.paymentMethod}
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                </Col>
                                            )}
                                        </Row>
                                        
                                        {bookingFormData.paymentStatus === 'PAID' && (
                                            <Alert variant="success" className="mb-0">
                                                <FaCheckCircle className="me-2" />
                                                Full payment will be marked as received
                                            </Alert>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseBookingModal} disabled={loading}>
                            <FaTimes className="me-2" /> Cancel
                        </Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Spinner animation="border" size="sm" className="me-2" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <FaSave className="me-2" />
                                    {editingBooking ? 'Update Booking' : 'Create Advance Booking'}
                                </>
                            )}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Payment Modal */}
            <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Payment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedBooking && (
                        <div>
                            <p><strong>Booking ID:</strong> {selectedBooking.booking_id}</p>
                            <p><strong>Customer:</strong> {selectedBooking.customer_name}</p>
                            <p><strong>Room:</strong> {selectedBooking.room_no}</p>
                            <p><strong>Total Price:</strong> ₹{selectedBooking.total_price}</p>
                            <p><strong>Remaining:</strong> ₹{selectedBooking.remaining_price}</p>
                            
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Payment Amount</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Enter amount"
                                        value={paymentData.amount}
                                        onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})}
                                        min="0"
                                        max={selectedBooking.remaining_price}
                                        step="0.01"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Payment Status</Form.Label>
                                    <Form.Select
                                        value={paymentData.paymentStatus}
                                        onChange={(e) => setPaymentData({...paymentData, paymentStatus: e.target.value})}
                                    >
                                        <option value="UNPAID">Unpaid</option>
                                        <option value="PAID">Paid</option>
                                    </Form.Select>
                                </Form.Group>
                                {paymentData.paymentStatus === 'PAID' && (
                                    <Form.Group className="mb-3">
                                        <Form.Label>Payment Method *</Form.Label>
                                        <Form.Select
                                            value={paymentData.paymentMethod}
                                            onChange={(e) => setPaymentData({...paymentData, paymentMethod: e.target.value})}
                                        >
                                            <option value="">Select Payment Method</option>
                                            <option value="CASH">Cash</option>
                                            <option value="CARD">Card</option>
                                            <option value="UPI">UPI</option>
                                            <option value="ONLINE">Online Transfer</option>
                                            <option value="BANK_TRANSFER">Bank Transfer</option>
                                        </Form.Select>
                                    </Form.Group>
                                )}
                            </Form>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handlePaymentSubmit} disabled={loading}>
                        {loading ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Updating...
                            </>
                        ) : 'Update Payment'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AdvanceBooking;