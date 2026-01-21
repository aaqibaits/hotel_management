const connection = require('../config/database');

class Staff {
    // Get all staff
    static getAll(callback) {
        const query = `
            SELECT s.*, st.staff_type, sh.shift, sh.shift_timing, it.id_card_type
            FROM staff s
            JOIN staff_type st ON s.staff_type_id = st.staff_type_id
            JOIN shift sh ON s.shift_id = sh.shift_id
            JOIN id_card_type it ON s.id_card_type = it.id_card_type_id
            ORDER BY s.emp_name`;
        connection.query(query, callback);
    }

    // Get staff by ID
    static getById(id, callback) {
        const query = `
            SELECT s.*, st.staff_type, sh.shift, sh.shift_timing, it.id_card_type
            FROM staff s
            JOIN staff_type st ON s.staff_type_id = st.staff_type_id
            JOIN shift sh ON s.shift_id = sh.shift_id
            JOIN id_card_type it ON s.id_card_type = it.id_card_type_id
            WHERE s.emp_id = ?`;
        connection.query(query, [id], callback);
    }

    // Create staff
    static create(data, callback) {
        const query = 'INSERT INTO staff SET ?';
        connection.query(query, data, (err, result) => {
            if (err) return callback(err);
            
            // Create entry in emp_history
            const historyData = {
                emp_id: result.insertId,
                shift_id: data.shift_id,
                from_date: new Date()
            };
            
            const historyQuery = 'INSERT INTO emp_history SET ?';
            connection.query(historyQuery, historyData, callback);
        });
    }

    // Update staff
    static update(id, data, callback) {
        const query = 'UPDATE staff SET ? WHERE emp_id = ?';
        connection.query(query, [data, id], (err) => {
            if (err) return callback(err);
            
            // Update current shift in emp_history
            const updateHistoryQuery = `
                UPDATE emp_history 
                SET to_date = NOW() 
                WHERE emp_id = ? AND to_date IS NULL`;
            
            connection.query(updateHistoryQuery, [id], (err) => {
                if (err) return callback(err);
                
                // Add new entry in emp_history
                const newHistoryData = {
                    emp_id: id,
                    shift_id: data.shift_id,
                    from_date: new Date()
                };
                
                const insertHistoryQuery = 'INSERT INTO emp_history SET ?';
                connection.query(insertHistoryQuery, newHistoryData, callback);
            });
        });
    }

    // Get staff types
    static getStaffTypes(callback) {
        const query = 'SELECT * FROM staff_type ORDER BY staff_type_id';
        connection.query(query, callback);
    }

    // Get shifts
    static getShifts(callback) {
        const query = 'SELECT * FROM shift ORDER BY shift_id';
        connection.query(query, callback);
    }

    // Get staff history
    static getHistory(empId, callback) {
        const query = `
            SELECT eh.*, sh.shift, sh.shift_timing
            FROM emp_history eh
            JOIN shift sh ON eh.shift_id = sh.shift_id
            WHERE eh.emp_id = ?
            ORDER BY eh.from_date DESC`;
        connection.query(query, [empId], callback);
    }
}

module.exports = Staff;