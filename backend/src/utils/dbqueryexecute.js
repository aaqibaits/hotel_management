const mysql = require('mysql2');
require('dotenv').config();

// Create connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'arham123',
    database: process.env.DB_NAME || 'hotelms',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Promise wrapper for the pool
const promisePool = pool.promise();

// Export query functions
module.exports = {
    // Execute SELECT query
    executeSelect: async (sqlObj) => {
        try {
            const [rows] = await promisePool.query(sqlObj.queryString, sqlObj.arr || []);
            return rows;
        } catch (error) {
            throw error;
        }
    },

    // Execute INSERT/UPDATE/DELETE query
    executeUpdate: async (sqlObj) => {
        try {
            const [result] = await promisePool.query(sqlObj.queryString, sqlObj.arr || []);
            return result;
        } catch (error) {
            throw error;
        }
    },

    // Execute multiple queries
    executeMultiple: async (sqlObj) => {
        try {
            const [result] = await promisePool.query(sqlObj.queryString, sqlObj.params || []);
            return result;
        } catch (error) {
            throw error;
        }
    },

    // Close connection
    closeConnection: () => {
        pool.end();
    }
};