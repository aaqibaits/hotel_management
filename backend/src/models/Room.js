const connection = require('../config/database');

class Room {
    // Get all rooms
    static getAll(callback) {
        const query = `
            SELECT r.*, rt.room_type, rt.price, rt.max_person 
            FROM room r 
            JOIN room_type rt ON r.room_type_id = rt.room_type_id
            WHERE r.deleteStatus = 0
            ORDER BY r.room_id`;
        connection.query(query, callback);
    }

    // Get available rooms
    static getAvailable(callback) {
        const query = `
            SELECT r.*, rt.room_type, rt.price, rt.max_person 
            FROM room r 
            JOIN room_type rt ON r.room_type_id = rt.room_type_id
            WHERE r.status IS NULL AND r.deleteStatus = 0
            ORDER BY r.room_no`;
        connection.query(query, callback);
    }

    // Get room by ID
    static getById(id, callback) {
        const query = `
            SELECT r.*, rt.room_type, rt.price, rt.max_person 
            FROM room r 
            JOIN room_type rt ON r.room_type_id = rt.room_type_id
            WHERE r.room_id = ? AND r.deleteStatus = 0`;
        connection.query(query, [id], callback);
    }

    // Create room
    static create(data, callback) {
        const query = 'INSERT INTO room SET ?';
        connection.query(query, data, callback);
    }

    // Update room
    static update(id, data, callback) {
        const query = 'UPDATE room SET ? WHERE room_id = ?';
        connection.query(query, [data, id], callback);
    }

    // Delete room (soft delete)
    static delete(id, callback) {
        const query = 'UPDATE room SET deleteStatus = 1 WHERE room_id = ?';
        connection.query(query, [id], callback);
    }

    // Get room types
    static getRoomTypes(callback) {
        const query = 'SELECT * FROM room_type ORDER BY room_type_id';
        connection.query(query, callback);
    }
}

module.exports = Room;