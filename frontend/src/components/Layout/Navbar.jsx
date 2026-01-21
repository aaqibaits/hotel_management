import React from 'react';
import { Container, Navbar as BootstrapNavbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHotel } from 'react-icons/fa';

const Navbar = () => {
    return (
        <BootstrapNavbar bg="light" expand="lg" className="shadow-sm">
            <Container fluid>
                <BootstrapNavbar.Brand as={Link} to="/dashboard">
                    <FaHotel className="me-2" />
                    Hotel Management System
                </BootstrapNavbar.Brand>
                <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
                <BootstrapNavbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                    </Nav>
                </BootstrapNavbar.Collapse>
            </Container>
        </BootstrapNavbar>
    );
};

export default Navbar;