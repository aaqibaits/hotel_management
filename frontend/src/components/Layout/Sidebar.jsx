import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import {
    FaTachometerAlt,
    FaBed,
    FaCalendarCheck,
    FaUsers,
    FaUserTie,
    FaTasks,
    FaRegCalendar,
    FaExclamationCircle,
    FaSignOutAlt,
    FaCalendarPlus,
    FaChevronRight
} from 'react-icons/fa';

const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        { path: '/dashboard', icon: FaTachometerAlt, label: 'Dashboard', color: '#667eea' },
        { path: '/rooms', icon: FaBed, label: 'Rooms', color: '#f093fb' },
        { path: '/advanceBooking', icon: FaCalendarPlus, label: 'Advance Bookings', color: '#a8edea' },
        { path: '/bookings', icon: FaCalendarCheck, label: 'Bookings', color: '#4facfe' },
        { path: '/customers', icon: FaUsers, label: 'Customers', color: '#81FBB8' },
        { path: '/staff', icon: FaUserTie, label: 'Staff', color: '#e0c3fc' },
        { path: '/staffAttendance', icon: FaRegCalendar, label: 'Staff Attendance', color: '#ffeaa7' },
        { path: '/attendance-report', icon: FaTasks, label: 'Attendance Report', color: '#fab1a0' },
        { path: '/complaints', icon: FaExclamationCircle, label: 'Complaints', color: '#ff7675' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <div 
            className="sidebar"
            style={{
                width: '280px',
                minHeight: '100vh',
                background: 'linear-gradient(180deg, #1a1f36 0%, #0f1419 100%)',
                boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
                position: 'sticky',
                top: 0,
                height: '100vh',
                overflowY: 'auto'
            }}
        >
            {/* Logo Section */}
            <div 
                className="p-4 text-center"
                style={{
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.02)'
                }}
            >
                <div 
                    style={{
                        width: '60px',
                        height: '60px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 15px',
                        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
                    }}
                >
                    <FaBed className="text-white" size={28} />
                </div>
                <h4 className="text-white fw-bold mb-1">Arham Hotels</h4>
                <p className="text-white-50 small mb-0">Management System</p>
            </div>

            {/* Navigation Menu */}
            <Nav className="flex-column p-3">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    
                    return (
                        <Nav.Item key={item.path} className="mb-2">
                            <Nav.Link 
                                as={Link} 
                                to={item.path}
                                style={{
                                    color: isActive ? '#ffffff' : 'rgba(255,255,255,0.7)',
                                    background: isActive 
                                        ? 'linear-gradient(90deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.1) 100%)'
                                        : 'transparent',
                                    borderRadius: '12px',
                                    padding: '14px 16px',
                                    marginBottom: '4px',
                                    transition: 'all 0.3s ease',
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    borderLeft: isActive ? `3px solid ${item.color}` : '3px solid transparent'
                                }}
                                className="sidebar-link"
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                        e.currentTarget.style.color = '#ffffff';
                                        e.currentTarget.style.transform = 'translateX(5px)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                                        e.currentTarget.style.transform = 'translateX(0)';
                                    }
                                }}
                            >
                                <div 
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '10px',
                                        background: isActive 
                                            ? `linear-gradient(135deg, ${item.color} 0%, ${item.color}dd 100%)`
                                            : 'rgba(255,255,255,0.05)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: '14px',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <Icon size={18} />
                                </div>
                                <span className="fw-medium flex-grow-1">{item.label}</span>
                                {isActive && <FaChevronRight size={14} style={{ opacity: 0.5 }} />}
                            </Nav.Link>
                        </Nav.Item>
                    );
                })}
            </Nav>

            {/* Logout Button */}
            <div className="p-3 mt-auto" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <Nav.Link 
                    onClick={handleLogout}
                    style={{
                        color: 'rgba(255,255,255,0.7)',
                        background: 'rgba(255, 118, 117, 0.1)',
                        borderRadius: '12px',
                        padding: '14px 16px',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 118, 117, 0.2)';
                        e.currentTarget.style.color = '#ff7675';
                        e.currentTarget.style.transform = 'translateX(5px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 118, 117, 0.1)';
                        e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                        e.currentTarget.style.transform = 'translateX(0)';
                    }}
                >
                    <div 
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: 'rgba(255,255,255,0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '14px'
                        }}
                    >
                        <FaSignOutAlt size={18} />
                    </div>
                    <span className="fw-medium">Logout</span>
                </Nav.Link>
            </div>
        </div>
    );
};

export default Sidebar;