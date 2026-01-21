const connection = require('../config/database');

class Booking {
    // Get all bookings
    static getAll(callback) {
        const query = `
            SELECT b.*, c.customer_name, c.contact_no, c.email, 
                   r.room_no, rt.room_type, rt.price
            FROM booking b
            JOIN customer c ON b.customer_id = c.customer_id
            JOIN room r ON b.room_id = r.room_id
            JOIN room_type rt ON r.room_type_id = rt.room_type_id
            ORDER BY b.booking_date DESC`;
        connection.query(query, callback);
    }

    // Get booking by ID
    static getById(id, callback) {
        const query = `
            SELECT b.*, c.customer_name, c.contact_no, c.email, 
                   c.id_card_no, c.address,
                   r.room_no, rt.room_type, rt.price
            FROM booking b
            JOIN customer c ON b.customer_id = c.customer_id
            JOIN room r ON b.room_id = r.room_id
            JOIN room_type rt ON r.room_type_id = rt.room_type_id
            WHERE b.booking_id = ?`;
        connection.query(query, [id], callback);
    }

    // Create booking
    static create(data, callback) {
        const query = 'INSERT INTO booking SET ?';
        connection.query(query, data, callback);
    }

    // Update booking
    static update(id, data, callback) {
        const query = 'UPDATE booking SET ? WHERE booking_id = ?';
        connection.query(query, [data, id], callback);
    }

    // Update payment status
    static updatePayment(id, paymentData, callback) {
        const query = 'UPDATE booking SET ? WHERE booking_id = ?';
        connection.query(query, [paymentData, id], callback);
    }

    // Update check-in status
    static checkIn(id, callback) {
        const query = `
            UPDATE booking b
            JOIN room r ON b.room_id = r.room_id
            SET b.payment_status = 1, 
                r.status = 1, 
                r.check_in_status = 1
            WHERE b.booking_id = ?`;
        connection.query(query, [id], callback);
    }

    // Update check-out status
    static checkOut(id, callback) {
        const query = `
            UPDATE booking b
            JOIN room r ON b.room_id = r.room_id
            SET r.status = NULL, 
                r.check_in_status = 0,
                r.check_out_status = 1
            WHERE b.booking_id = ?`;
        connection.query(query, [id], callback);
    }

    // Get today's check-ins
    static getTodayCheckIns(date, callback) {
        const query = `
            SELECT b.*, c.customer_name, r.room_no
            FROM booking b
            JOIN customer c ON b.customer_id = c.customer_id
            JOIN room r ON b.room_id = r.room_id
            WHERE DATE(b.check_in) = ?`;
        connection.query(query, [date], callback);
    }
}