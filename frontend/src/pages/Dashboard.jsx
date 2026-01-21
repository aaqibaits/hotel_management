import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
    FaRupeeSign, 
    FaClock, 
    FaCalendarCheck, 
    FaMoneyBill, 
    FaCalendarDay, 
    FaBed,
    FaHotel,
    FaCalendarPlus,
    FaChartLine,
    FaArrowUp,
    FaArrowDown
} from 'react-icons/fa';
import { getDashboardStats, getRecentBookings } from '../services/dashboardService';

const Dashboard = () => {
    const [stats, setStats] = useState({});
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [statsData, bookingsData] = await Promise.all([
                getDashboardStats(),
                getRecentBookings()
            ]);
            
            setStats(statsData || {});
            setRecentBookings(bookingsData || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError('Failed to load dashboard data');
            // Fallback mock data
            setStats({
                totalRooms: 26,
                availableRooms: 18,
                occupiedRooms: 3,
                totalBookings: 8,
                activeBookings: 3,
                totalCustomers: 8,
                totalStaff: 13,
                pendingComplaints: 1,
                occupancyRate: '11.54',
                totalAmount: 12500,
                totalPending: 3200,
                todayAmount: 1500,
                todayBookings: 2,
                advanceBookings: 5
            });
        } finally {
            setLoading(false);
        }
    };

    // Stats cards configuration with advance bookings
    const statsCards = [
        {
            title: 'Total Revenue',
            value: `₹${(stats.totalAmount || 0).toLocaleString()}`,
            subtitle: 'All-time earnings',
            icon: FaRupeeSign,
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        },
        {
            title: 'Pending Payments',
            value: `₹${(stats.totalPending || 0).toLocaleString()}`,
            subtitle: 'To be collected',
            icon: FaClock,
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        },
        {
            title: 'Total Bookings',
            value: (stats.totalBookings || 0).toLocaleString(),
            subtitle: 'Till date',
            icon: FaCalendarCheck,
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        },
        {
            title: 'Advance Bookings',
            value: (stats.advanceBookings || 0).toLocaleString(),
            subtitle: 'Pending confirmation',
            icon: FaCalendarPlus,
            gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        },
        {
            title: "Today's Revenue",
            value: `₹${(stats.todayAmount || 0).toLocaleString()}`,
            subtitle: 'Earned today',
            icon: FaMoneyBill,
            gradient: 'linear-gradient(135deg, #81FBB8 0%, #28C76F 100%)',
        },
        {
            title: "Today's Bookings",
            value: (stats.todayBookings || 0).toLocaleString(),
            subtitle: 'New bookings',
            icon: FaCalendarDay,
            gradient: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
        }
    ];

    if (loading) {
        return (
            <div className="text-center p-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div style={{ background: 'linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 100%)', minHeight: '100vh' }}>
            <Container fluid className="p-4">
                {/* Header */}
                <div className="mb-4">
                    <h2 className="fw-bold mb-1" style={{ color: '#2d3748' }}>Dashboard Overview</h2>
                    <p className="text-muted">Welcome back! Here's what's happening today.</p>
                </div>
                
                {error && (
                    <div className="alert alert-warning" role="alert">
                        {error}
                    </div>
                )}
                
                {/* Stats Cards Grid */}
                <Row className="g-4 mb-4">
                    {statsCards.map((card, index) => (
                        <Col key={index} lg={4} md={6}>
                            <Card 
                                className="border-0 shadow-sm h-100"
                                style={{
                                    background: card.gradient,
                                    borderRadius: '15px',
                                    overflow: 'hidden',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '';
                                }}
                            >
                                <Card.Body className="p-4">
                                    <div className="d-flex align-items-start justify-content-between mb-3">
                                        <div className="flex-grow-1">
                                            <p className="text-white-50 mb-1 small fw-medium">{card.subtitle}</p>
                                            <h3 className="text-white mb-0 fw-bold">{card.value}</h3>
                                        </div>
                                        <div 
                                            className="bg-white bg-opacity-25 p-3 rounded-3"
                                            style={{ backdropFilter: 'blur(10px)' }}
                                        >
                                            <card.icon className="text-white" size={24} />
                                        </div>
                                    </div>
                                    <h6 className="text-white mb-0">{card.title}</h6>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
                
                {/* Room Status and Quick Actions */}
                <Row className="g-4 mb-4">
                    {/* Room Status Card */}
                    <Col lg={8}>
                        <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
                            <Card.Body className="p-4">
                                <div className="d-flex align-items-center mb-4">
                                    <div className="bg-primary bg-opacity-10 p-3 rounded-3 me-3">
                                        <FaHotel className="text-primary" size={24} />
                                    </div>
                                    <div>
                                        <h5 className="mb-1 fw-bold">Room Status Summary</h5>
                                        <p className="text-muted mb-0 small">Real-time room availability</p>
                                    </div>
                                </div>
                                
                                {/* Room Status Bars */}
                                <div className="mb-4">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="fw-medium">Available Rooms</span>
                                        <span className="text-success fw-bold">{stats.availableRooms || 0}/{stats.totalRooms || 0}</span>
                                    </div>
                                    <div className="progress" style={{ height: '10px', borderRadius: '10px' }}>
                                        <div 
                                            className="progress-bar bg-success" 
                                            style={{ 
                                                width: `${stats.totalRooms ? (stats.availableRooms / stats.totalRooms) * 100 : 0}%`,
                                                borderRadius: '10px'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="fw-medium">Occupied Rooms</span>
                                        <span className="text-danger fw-bold">{stats.occupiedRooms || 0}/{stats.totalRooms || 0}</span>
                                    </div>
                                    <div className="progress" style={{ height: '10px', borderRadius: '10px' }}>
                                        <div 
                                            className="progress-bar bg-danger" 
                                            style={{ 
                                                width: `${stats.occupancyRate || 0}%`,
                                                borderRadius: '10px'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="fw-medium">Other Status</span>
                                        <span className="text-secondary fw-bold">
                                            {(stats.totalRooms || 0) - (stats.availableRooms || 0) - (stats.occupiedRooms || 0)}/{stats.totalRooms || 0}
                                        </span>
                                    </div>
                                    <div className="progress" style={{ height: '10px', borderRadius: '10px' }}>
                                        <div 
                                            className="progress-bar bg-secondary" 
                                            style={{ 
                                                width: `${stats.totalRooms ? (((stats.totalRooms - stats.availableRooms - stats.occupiedRooms) / stats.totalRooms) * 100) : 0}%`,
                                                borderRadius: '10px'
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Occupancy Rate Circle */}
                                <div className="text-center mt-4 p-3 bg-light rounded-3">
                                    <h6 className="mb-3">Occupancy Rate</h6>
                                    <div className="d-flex align-items-center justify-content-center">
                                        <div 
                                            style={{
                                                width: '120px',
                                                height: '120px',
                                                borderRadius: '50%',
                                                background: `conic-gradient(#0d6efd ${(stats.occupancyRate || 0) * 3.6}deg, #e9ecef 0deg)`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <div 
                                                style={{
                                                    width: '100px',
                                                    height: '100px',
                                                    borderRadius: '50%',
                                                    background: 'white',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexDirection: 'column'
                                                }}
                                            >
                                                <span className="fw-bold h4 mb-0">{stats.occupancyRate || 0}%</span>
                                                <small className="text-muted">Occupied</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    
                    {/* Quick Actions */}
                    <Col lg={4}>
                        <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
                            <Card.Body className="p-4">
                                <h5 className="mb-4 fw-bold">Quick Actions</h5>
                                <div className="d-flex flex-column gap-3">
                                    <Link 
                                        to="/rooms" 
                                        className="btn btn-primary btn-lg text-start d-flex align-items-center text-decoration-none"
                                        style={{ borderRadius: '10px' }}
                                    >
                                        <FaBed className="me-3" size={20} />
                                        <div>
                                            <div className="fw-bold">Manage Rooms</div>
                                            <small>View and update room status</small>
                                        </div>
                                    </Link>
                                    
                                    <Link 
                                        to="/advanceBooking" 
                                        className="btn btn-outline-primary btn-lg text-start d-flex align-items-center text-decoration-none"
                                        style={{ borderRadius: '10px' }}
                                    >
                                        <FaCalendarPlus className="me-3" size={20} />
                                        <div>
                                            <div className="fw-bold">Advance Bookings</div>
                                            <small>Manage pre-bookings</small>
                                        </div>
                                    </Link>
                                    
                                    <Link 
                                        to="/bookings" 
                                        className="btn btn-outline-success btn-lg text-start d-flex align-items-center text-decoration-none"
                                        style={{ borderRadius: '10px' }}
                                    >
                                        <FaCalendarCheck className="me-3" size={20} />
                                        <div>
                                            <div className="fw-bold">View Bookings</div>
                                            <small>Check all reservations</small>
                                        </div>
                                    </Link>
                                    
                                    <Link 
                                        to="/customers" 
                                        className="btn btn-outline-info btn-lg text-start d-flex align-items-center text-decoration-none"
                                        style={{ borderRadius: '10px' }}
                                    >
                                        <FaChartLine className="me-3" size={20} />
                                        <div>
                                            <div className="fw-bold">Customer List</div>
                                            <small>View all customers</small>
                                        </div>
                                    </Link>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                
                {/* Recent Bookings Table */}
                <Card className="border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                    <Card.Body className="p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h5 className="mb-1 fw-bold">Recent Bookings</h5>
                                <p className="text-muted mb-0 small">Latest reservations and check-ins</p>
                            </div>
                            <Link to="/bookings" className="btn btn-primary" style={{ borderRadius: '10px' }}>
                                View All
                            </Link>
                        </div>
                        
                        <div className="table-responsive">
                            <Table hover className="align-middle">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="border-0 py-3">Booking ID</th>
                                        <th className="border-0 py-3">Customer</th>
                                        <th className="border-0 py-3">Room</th>
                                        <th className="border-0 py-3">Check-in</th>
                                        <th className="border-0 py-3">Check-out</th>
                                        <th className="border-0 py-3">Total Price</th>
                                        <th className="border-0 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentBookings.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="text-center text-muted py-5">
                                                <FaCalendarCheck size={48} className="mb-3 opacity-25" />
                                                <p>No recent bookings found</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        recentBookings.map((booking) => (
                                            <tr key={booking.booking_id}>
                                                <td className="fw-medium">#{booking.booking_id}</td>
                                                <td>{booking.customer_name}</td>
                                                <td>
                                                    <Badge bg="light" text="dark">
                                                        {booking.room_no} - {booking.room_type}
                                                    </Badge>
                                                </td>
                                                <td>{booking.check_in}</td>
                                                <td>{booking.check_out}</td>
                                                <td className="fw-bold">₹{booking.total_price}</td>
                                                <td>
                                                    <Badge 
                                                        bg={booking.payment_status ? 'success' : 'warning'}
                                                        style={{ borderRadius: '20px', padding: '6px 12px' }}
                                                    >
                                                        {booking.payment_status ? 'Paid' : 'Pending'}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default Dashboard;