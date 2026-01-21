const connection = require('../config/database');

class Complaint {
    // Get all complaints
    static getAll(callback) {
        const query = 'SELECT * FROM complaint ORDER BY created_at DESC';
        connection.query(query, callback);
    }

    // Get complaint by ID
    static getById(id, callback) {
        const query = 'SELECT * FROM complaint WHERE id = ?';
        connection.query(query, [id], callback);
    }

    // Create complaint
    static create(data, callback) {
        const query = 'INSERT INTO complaint SET ?';
        connection.query(query, data, callback);
    }

    // Update complaint
    static update(id, data, callback) {
        const query = 'UPDATE complaint SET ? WHERE id = ?';
        connection.query(query, [data, id], callback);
    }

    // Resolve complaint
    static resolve(id, budget, callback) {
        const query = `
            UPDATE complaint 
            SET resolve_status = 1, 
                resolve_date = NOW(), 
                budget = ? 
            WHERE id = ?`;
        connection.query(query, [budget, id], callback);
    }
}

module.exports = Complaint;