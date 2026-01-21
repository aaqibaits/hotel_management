const express = require('express');
const cors = require('cors');
require('./src/config/database'); // Connect to DB
const hotelRoutes = require('./src/routes/controllers/hotelRoutes');

const app = express();
const PORT = 5000;
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toLocaleTimeString()} - ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api', hotelRoutes);

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Hotel Management System API is running!',
        database: 'hotelms'
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('🏨 HOTEL MANAGEMENT SYSTEM BACKEND');
    console.log('='.repeat(60));
    console.log(`✅ Server: http://localhost:${PORT}`);
    console.log(`✅ Database: hotelms`);
    console.log('\n📡 Available Endpoints:');
    console.log('   POST   /api/login');
    console.log('   GET    /api/dashboard/stats');
    console.log('   GET    /api/rooms');
    console.log('   GET    /api/bookings');
    console.log('   GET    /api/customers');
    console.log('   GET    /api/complaints');
    console.log('   GET    /api/health (health check)');
    console.log('   GET    /api/test (test endpoint)');
    console.log('='.repeat(60));
});