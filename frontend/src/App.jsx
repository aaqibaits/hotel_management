import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Layout Components
import Sidebar from './components/Layout/Sidebar';
import Navbar from './components/Layout/Navbar';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import Bookings from './pages/Bookings';
import Customers from './pages/Customers';
import Staff from './pages/Staff';
import StaffAttendance from './pages/staffAttendance';
import Complaints from './pages/Complaints';
import AttendanceReport from './pages/AttendanceReport';
import AdvanceBooking from './pages/AdvanceBooking';

// Private Route Component
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
};

function App() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} /> 
                <Route path="/*" element={
                    <PrivateRoute>
                        <div className="d-flex">
                            <Sidebar collapsed={sidebarCollapsed} />
                            <div className="flex-grow-1">
                                <Navbar 
                                    toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
                                />
                                <Container fluid className="p-4">
                                    <Routes>
                                        <Route path="/dashboard" element={<Dashboard />} />
                                        <Route path="/rooms" element={<Rooms />} />
                                        <Route path="/advanceBooking" element={<AdvanceBooking />} />
                                        <Route path="/bookings" element={<Bookings />} />
                                        <Route path="/customers" element={<Customers />} />
                                        <Route path="/staff" element={<Staff />} />
                                        <Route path="/staffAttendance" element={<StaffAttendance />} />
                                        <Route path="/attendance-report" element={<AttendanceReport />} />
                                        <Route path="/complaints" element={<Complaints />} />
                                        <Route path="/" element={<Navigate to="/dashboard" />} />
                                    </Routes>
                                </Container>
                            </div>
                        </div>
                    </PrivateRoute>
                } />
            </Routes>
        </Router>
    );
}

export default App;