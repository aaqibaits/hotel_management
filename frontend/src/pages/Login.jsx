import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Import api directly

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    // Add this function after imports in Login.jsx
const mockLogin = async (username, password) => {
    // Mock login for development
    return new Promise((resolve) => {
        setTimeout(() => {
            if (username === 'admin' && password === 'admin123') {
                localStorage.setItem('token', 'mock-token-for-development');
                resolve({ success: true, token: 'mock-token' });
            } else {
                reject(new Error('Invalid credentials'));
            }
        }, 500);
    });
};


const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
        // For development only - bypass API
        if (process.env.NODE_ENV === 'development') {
            console.log('Using mock login for development');
            await mockLogin(formData.username, formData.password);
            navigate('/dashboard');
            return;
        }
        
        // Original API call
        const response = await api.post('/login', {
            username: formData.username,
            password: formData.password
        });
        
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        }
    } catch (err) {
        setError(err.response?.data?.error || err.message || 'Login failed');
    } finally {
        setLoading(false);
    }
};

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
            <Card style={{ width: '400px' }}>
                <Card.Body>
                    <h2 className="text-center mb-4">Hotel Management System</h2>
                    <h4 className="text-center mb-4">Admin Login</h4>
                    
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Username or Email</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                placeholder="Enter admin"
                            />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Enter admin123"
                            />
                        </Form.Group>
                        
                        <Button 
                            variant="primary" 
                            type="submit" 
                            className="w-100"
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </Form>
                    
                    <div className="text-center mt-3">
                        <small className="text-muted">
                            Use: username: <strong>admin</strong>, password: <strong>admin123</strong>
                        </small>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Login;