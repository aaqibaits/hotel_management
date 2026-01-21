const connection = require('../config/database');

class Customer {
    // Get all customers
    static getAll(callback) {
        const query = `
            SELECT c.*, it.id_card_type 
            FROM customer c
            JOIN id_card_type it ON c.id_card_type_id = it.id_card_type_id
            ORDER BY c.customer_name`;
        connection.query(query, callback);
    }

    // Get customer by ID
    static getById(id, callback) {
        const query = `
            SELECT c.*, it.id_card_type 
            FROM customer c
            JOIN id_card_type it ON c.id_card_type_id = it.id_card_type_id
            WHERE c.customer_id = ?`;
        connection.query(query, [id], callback);
    }

    // Create customer
    static create(data, callback) {
        const query = 'INSERT INTO customer SET ?';
        connection.query(query, data, callback);
    }

    // Update customer
    static update(id, data, callback) {
        const query = 'UPDATE customer SET ? WHERE customer_id = ?';
        connection.query(query, [data, id], callback);
    }

    // Get ID card types
    static getIdCardTypes(callback) {
        const query = 'SELECT * FROM id_card_type ORDER BY id_card_type_id';
        connection.query(query, callback);
    }
}

module.exports = Customer;