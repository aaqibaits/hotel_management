const dbValidation = require('../../utils/dbValidation');

module.exports = {
    /* ------------------- Authentication --------------------- */
    login: function (req, res) {
        return {
            queryString: "SELECT * FROM user WHERE (username = ? OR email = ?) AND password = ?",
            arr: [req.body.username, req.body.username, req.body.password]
        };
    },

    /* ------------------- Dashboard --------------------- */
    getDashboardStats: function (req, res) {
        return {
            queryString: `
                SELECT 
                    -- Existing stats
                    (SELECT COUNT(*) FROM room WHERE deleteStatus = 0) as totalRooms,
                    (SELECT COUNT(*) FROM room WHERE status IS NULL AND deleteStatus = 0) as availableRooms,
                    (SELECT COUNT(*) FROM room WHERE status = 1 AND deleteStatus = 0) as occupiedRooms,
                    (SELECT COUNT(*) FROM booking) as totalBookings,
                    (SELECT COUNT(*) FROM booking WHERE payment_status = 0) as activeBookings,
                    (SELECT COUNT(*) FROM customer) as totalCustomers,
                    (SELECT COUNT(*) FROM staff) as totalStaff,
                    (SELECT COUNT(*) FROM complaint WHERE resolve_status = 0) as pendingComplaints,
                    
                    -- New stats for dashboard cards
                    (SELECT COALESCE(SUM(total_price), 0) FROM booking) as totalAmount,
                    (SELECT COALESCE(SUM(remaining_price), 0) FROM booking) as totalPending,
                    (SELECT COALESCE(SUM(total_price), 0) FROM booking WHERE DATE(booking_date) = CURDATE()) as todayAmount,
                    (SELECT COUNT(*) FROM booking WHERE DATE(booking_date) = CURDATE()) as todayBookings,

                    -- NEW: Advance Bookings Count
                (SELECT COUNT(*) FROM booking WHERE bookingType = 'ADVANCE' AND status = 'PENDING_CONFIRMATION') as advanceBookings
            `,
            arr: []
        };
    },

    /* ------------------- Room Management --------------------- */
    getAllRooms: function (req, res) {
        return {
            queryString: `
                SELECT r.*, rt.room_type, rt.price, rt.max_person 
                FROM room r 
                JOIN room_type rt ON r.room_type_id = rt.room_type_id
                WHERE r.deleteStatus = 0
                ORDER BY r.room_no
            `,
            arr: []
        };
    },

    getRoomById: function (req, res) {
        return {
            queryString: `
                SELECT r.*, rt.room_type, rt.price, rt.max_person 
                FROM room r 
                JOIN room_type rt ON r.room_type_id = rt.room_type_id
                WHERE r.room_id = ? AND r.deleteStatus = 0
            `,
            arr: [req.params.id || req.body.room_id]
        };
    },

    saveRoom: function (req, res) {
        return {
            queryString: `
                INSERT INTO room (room_no, room_type_id, status, check_in_status, check_out_status)
                VALUES (?, ?, ?, ?, ?)
            `,
            arr: [
                req.body.room_no,
                req.body.room_type_id,
                req.body.status || null,
                req.body.check_in_status || 0,
                req.body.check_out_status || 0
            ]
        };
    },

    updateRoom: function (req, res) {
        return {
            queryString: `
                UPDATE room 
                SET room_no = ?, room_type_id = ?, status = ?, 
                    check_in_status = ?, check_out_status = ?
                WHERE room_id = ?
            `,
            arr: [
                req.body.room_no,
                req.body.room_type_id,
                req.body.status,
                req.body.check_in_status,
                req.body.check_out_status,
                req.params.id || req.body.room_id
            ]
        };
    },

    deleteRoomById: function (req, res) {
        return {
            queryString: "UPDATE room SET deleteStatus = 1 WHERE room_id = ?",
            arr: [req.params.id || req.body.room_id]
        };
    },

    /* ------------------- Room Types --------------------- */
    getRoomTypes: function (req, res) {
        return {
            queryString: "SELECT * FROM room_type ORDER BY room_type_id",
            arr: []
        };
    },

    /* ------------------- Booking Management --------------------- */
    getAllBookings: function (req, res) {
        return {
            queryString: `
                SELECT b.*, c.customer_name, c.contact_no, c.email, 
                       r.room_no, rt.room_type, rt.price
                FROM booking b
                JOIN customer c ON b.customer_id = c.customer_id
                JOIN room r ON b.room_id = r.room_id
                JOIN room_type rt ON r.room_type_id = rt.room_type_id
                WHERE (b.bookingType != 'ADVANCE' OR b.status = 'CONFIRMED')
                ORDER BY b.booking_date DESC
            `,
            arr: []
        };
    },

    getAdvanceBookings: function (req, res) {
        return {
            queryString: `
                SELECT b.*, c.customer_name, c.contact_no, c.email, 
                       r.room_no, rt.room_type, rt.price
                FROM booking b
                JOIN customer c ON b.customer_id = c.customer_id
                JOIN room r ON b.room_id = r.room_id
                JOIN room_type rt ON r.room_type_id = rt.room_type_id
                WHERE b.bookingType = 'ADVANCE'
                ORDER BY b.booking_date DESC
            `,
            arr: []
        };
    },

    getBookingById: function (req, res) {
        return {
            queryString: `
                SELECT b.*, c.customer_name, c.contact_no, c.email, 
                       c.id_card_no, c.address, r.room_no, rt.room_type, rt.price
                FROM booking b
                JOIN customer c ON b.customer_id = c.customer_id
                JOIN room r ON b.room_id = r.room_id
                JOIN room_type rt ON r.room_type_id = rt.room_type_id
                WHERE b.booking_id = ?
            `,
            arr: [req.params.id || req.body.booking_id]
        };
    },

    saveBooking: function (req, res) {
        return {
            queryString: `
                INSERT INTO booking 
                (customer_id, room_id, check_in, check_out, total_price, remaining_price, 
                 bookingType, status, paymentStatus, paymentMethod, checkInStatus, checkOutStatus)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            arr: [
                req.body.customer_id,
                req.body.room_id,
                req.body.check_in,
                req.body.check_out,
                req.body.total_price,
                req.body.remaining_price || req.body.total_price,
                req.body.bookingType || 'NORMAL',
                req.body.status || 'CONFIRMED',
                req.body.paymentStatus || 'UNPAID',
                req.body.paymentMethod || null,
                req.body.checkInStatus || 0,
                req.body.checkOutStatus || 0
            ]
        };
    },

    confirmAdvanceBooking: function (req, res) {
        return {
            queryString: `
                UPDATE booking 
                SET status = 'CONFIRMED'
                WHERE booking_id = ? AND bookingType = 'ADVANCE'
            `,
            arr: [req.params.id || req.body.booking_id]
        };
    },

    checkIn: function (req, res) {
        return {
            queryString: `
                UPDATE booking b
                JOIN room r ON b.room_id = r.room_id
                SET b.checkInStatus = 1,
                    r.status = 1, 
                    r.check_in_status = 1
                WHERE b.booking_id = ?
            `,
            arr: [req.params.id || req.body.booking_id]
        };
    },

    checkOut: function (req, res) {
        return {
            queryString: `
                UPDATE booking b
                JOIN room r ON b.room_id = r.room_id
                SET b.checkOutStatus = 1,
                    r.status = NULL, 
                    r.check_in_status = 0,
                    r.check_out_status = 1
                WHERE b.booking_id = ?
            `,
            arr: [req.params.id || req.body.booking_id]
        };
    },

    updateBookingPayment: function (req, res) {
        return {
            queryString: `
                UPDATE booking 
                SET remaining_price = ?, 
                    paymentStatus = ?,
                    paymentMethod = ?
                WHERE booking_id = ?
            `,
            arr: [
                req.body.remaining_price,
                req.body.paymentStatus,
                req.body.paymentMethod || null,
                req.params.id || req.body.booking_id
            ]
        };
    },

    updateBooking: function (req, res) {
        return {
            queryString: `
                UPDATE booking 
                SET customer_id = ?, 
                    room_id = ?, 
                    check_in = ?, 
                    check_out = ?, 
                    total_price = ?, 
                    remaining_price = ?, 
                    bookingType = ?,
                    status = ?,
                    paymentStatus = ?,
                    paymentMethod = ?,
                    checkInStatus = ?,
                    checkOutStatus = ?
                WHERE booking_id = ?
            `,
            arr: [
                req.body.customer_id,
                req.body.room_id,
                req.body.check_in,
                req.body.check_out,
                req.body.total_price,
                req.body.remaining_price || req.body.total_price,
                req.body.bookingType || 'NORMAL',
                req.body.status || 'CONFIRMED',
                req.body.paymentStatus || 'UNPAID',
                req.body.paymentMethod || null,
                req.body.checkInStatus || 0,
                req.body.checkOutStatus || 0,
                req.params.id || req.body.booking_id
            ]
        };
    },

    deleteBooking: function (req, res) {
        return {
            queryString: "DELETE FROM booking WHERE booking_id = ?",
            arr: [req.params.id || req.body.booking_id]
        };
    },
    /* ------------------- Customer Management --------------------- */
    saveCustomerPerson: function (req, res) {
        return {
            queryString: `
                INSERT INTO customer_person 
                (customer_id, person_name, id_card_type_id, id_card_no, id_card_front_image, id_card_back_image)
                VALUES (?, ?, ?, ?, ?, ?)
            `,
            arr: [
                req.body.customer_id,
                req.body.person_name,
                req.body.id_card_type_id,
                req.body.id_card_no,
                req.body.id_card_front_image || null,
                req.body.id_card_back_image || null
            ]
        };
    },

    getCustomerPersons: function (req, res) {
        return {
            queryString: `
                SELECT cp.*, it.id_card_type
                FROM customer_person cp
                JOIN id_card_type it ON cp.id_card_type_id = it.id_card_type_id
                WHERE cp.customer_id = ?
                ORDER BY cp.person_id
            `,
            arr: [req.params.customerId || req.query.customer_id]
        };
    },

    deleteCustomerPersons: function (req, res) {
        return {
            queryString: `
                DELETE FROM customer_person WHERE customer_id = ?
            `,
            arr: [req.body.customer_id || req.params.customerId]
        };
    },

    // Update the existing saveCustomer to include number_of_persons
    saveCustomerWithPersons: function (req, res) {
        return {
            queryString: `
                INSERT INTO customer 
                (customer_name, number_of_persons, contact_no, email, id_card_type_id, id_card_no, address)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `,
            arr: [
                req.body.customer_name,
                req.body.number_of_persons || 1,
                req.body.contact_no,
                req.body.email,
                req.body.id_card_type_id,
                req.body.id_card_no,
                req.body.address
            ]
        };
    },

    updateCustomerWithPersons: function (req, res) {
        return {
            queryString: `
                UPDATE customer 
                SET customer_name = ?, number_of_persons = ?, contact_no = ?, 
                    email = ?, id_card_type_id = ?, id_card_no = ?, address = ?
                WHERE customer_id = ?
            `,
            arr: [
                req.body.customer_name,
                req.body.number_of_persons || 1,
                req.body.contact_no,
                req.body.email,
                req.body.id_card_type_id,
                req.body.id_card_no,
                req.body.address,
                req.params.id || req.body.customer_id
            ]
        };
    },

    // Update getAllCustomers to include number_of_persons
    getAllCustomersWithPersons: function (req, res) {
        return {
            queryString: `
                SELECT c.*, it.id_card_type 
                FROM customer c
                JOIN id_card_type it ON c.id_card_type_id = it.id_card_type_id
                ORDER BY c.customer_name
            `,
            arr: []
        };
    },

    /* ------------------- Complaint Management --------------------- */
    getAllComplaints: function (req, res) {
        return {
            queryString: "SELECT * FROM complaint ORDER BY created_at DESC",
            arr: []
        };
    },

    /* ------------------- Dropdown Data --------------------- */
    getIdCardTypes: function (req, res) {
        return {
            queryString: "SELECT * FROM id_card_type ORDER BY id_card_type_id",
            arr: []
        };
    },

    getStaffTypes: function (req, res) {
        return {
            queryString: "SELECT * FROM staff_type ORDER BY staff_type_id",
            arr: []
        };
    },

    getShifts: function (req, res) {
        return {
            queryString: "SELECT * FROM shift ORDER BY shift_id",
            arr: []
        };
    },

    /* ------------------- Recent Bookings --------------------- */
    getRecentBookings: function (req, res) {
        return {
            queryString: `
                SELECT b.*, c.customer_name, r.room_no, rt.room_type
                FROM booking b
                JOIN customer c ON b.customer_id = c.customer_id
                JOIN room r ON b.room_id = r.room_id
                JOIN room_type rt ON r.room_type_id = rt.room_type_id
                ORDER BY b.booking_date DESC
                LIMIT 10
            `,
            arr: []
        };
    },

    /* ------------------- Staff Management --------------------- */
    getAllStaff: function (req, res) {
        return {
            queryString: `
                SELECT s.*, st.staff_type, sh.shift, sh.shift_timing, it.id_card_type
                FROM staff s
                JOIN staff_type st ON s.staff_type_id = st.staff_type_id
                JOIN shift sh ON s.shift_id = sh.shift_id
                JOIN id_card_type it ON s.id_card_type = it.id_card_type_id
                ORDER BY s.emp_name
            `,
            arr: []
        };
    },

    getStaffById: function (req, res) {
        return {
            queryString: `
                SELECT s.*, st.staff_type, sh.shift, sh.shift_timing, it.id_card_type
                FROM staff s
                JOIN staff_type st ON s.staff_type_id = st.staff_type_id
                JOIN shift sh ON s.shift_id = sh.shift_id
                JOIN id_card_type it ON s.id_card_type = it.id_card_type_id
                WHERE s.emp_id = ?
            `,
            arr: [req.params.id || req.body.emp_id]
        };
    },

    saveStaff: function (req, res) {
        return {
            queryString: `
                INSERT INTO staff 
                (emp_name, staff_type_id, shift_id, id_card_type, id_card_no, address, contact_no, salary)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `,
            arr: [
                req.body.emp_name,
                req.body.staff_type_id,
                req.body.shift_id,
                req.body.id_card_type,
                req.body.id_card_no,
                req.body.address,
                req.body.contact_no,
                req.body.salary
            ]
        };
    },

    updateStaff: function (req, res) {
        return {
            queryString: `
                UPDATE staff 
                SET emp_name = ?, staff_type_id = ?, shift_id = ?, 
                    id_card_type = ?, id_card_no = ?, address = ?, 
                    contact_no = ?, salary = ?
                WHERE emp_id = ?
            `,
            arr: [
                req.body.emp_name,
                req.body.staff_type_id,
                req.body.shift_id,
                req.body.id_card_type,
                req.body.id_card_no,
                req.body.address,
                req.body.contact_no,
                req.body.salary,
                req.params.id || req.body.emp_id
            ]
        };
    },

    deleteStaffById: function (req, res) {
        return {
            queryString: "DELETE FROM staff WHERE emp_id = ?",
            arr: [req.params.id || req.body.emp_id]
        };
    },

    /* ------------------- Staff Attendance --------------------- */
    getAttendanceByMonth: function (req, res) {
        const { month, year } = req.query;
        return {
            queryString: `
                SELECT sa.*, s.emp_name
                FROM staff_attendance sa
                JOIN staff s ON sa.emp_id = s.emp_id
                WHERE MONTH(sa.attendance_date) = ? 
                AND YEAR(sa.attendance_date) = ?
                ORDER BY sa.attendance_date, s.emp_name
            `,
            arr: [month, year]
        };
    },

    markAttendance: function (req, res) {
        return {
            queryString: `
                INSERT INTO staff_attendance (emp_id, attendance_date, status)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                    status = VALUES(status),
                    updated_at = CURRENT_TIMESTAMP
            `,
            arr: [
                req.body.emp_id,
                req.body.attendance_date,
                req.body.status
            ]
        };
    },

    deleteAttendance: function (req, res) {
        return {
            queryString: `
                DELETE FROM staff_attendance 
                WHERE emp_id = ? AND attendance_date = ?
            `,
            arr: [
                req.body.emp_id,
                req.body.attendance_date
            ]
        };
    },

    getAttendanceStats: function (req, res) {
        const { month, year } = req.query;
        return {
            queryString: `
                SELECT 
                    s.emp_id,
                    s.emp_name,
                    COUNT(CASE WHEN sa.status = 'present' THEN 1 END) as present_days,
                    COUNT(CASE WHEN sa.status = 'absent' THEN 1 END) as absent_days,
                    COUNT(sa.attendance_id) as total_marked
                FROM staff s
                LEFT JOIN staff_attendance sa ON s.emp_id = sa.emp_id
                    AND MONTH(sa.attendance_date) = ?
                    AND YEAR(sa.attendance_date) = ?
                GROUP BY s.emp_id, s.emp_name
                ORDER BY s.emp_name
            `,
            arr: [month, year]
        };
    },

    /* ------------------- Attendance Reports --------------------- */
    getAttendanceReport: function (req, res) {
        const { start_date, end_date, emp_id } = req.query;
        
        let queryString = `
            SELECT 
                s.emp_id,
                s.emp_name,
                st.staff_type,
                sh.shift,
                s.contact_no,
                COUNT(DISTINCT sa.attendance_date) as total_days_marked,
                COUNT(CASE WHEN sa.status = 'present' THEN 1 END) as present_days,
                COUNT(CASE WHEN sa.status = 'absent' THEN 1 END) as absent_days,
                ROUND((COUNT(CASE WHEN sa.status = 'present' THEN 1 END) * 100.0 / 
                    NULLIF(COUNT(DISTINCT sa.attendance_date), 0)), 2) as attendance_percentage
            FROM staff s
            LEFT JOIN staff_attendance sa ON s.emp_id = sa.emp_id
                AND sa.attendance_date BETWEEN ? AND ?
            LEFT JOIN staff_type st ON s.staff_type_id = st.staff_type_id
            LEFT JOIN shift sh ON s.shift_id = sh.shift_id
        `;
        
        const arr = [start_date, end_date];
        
        if (emp_id) {
            queryString += ` WHERE s.emp_id = ?`;
            arr.push(emp_id);
        }
        
        queryString += `
            GROUP BY s.emp_id, s.emp_name, st.staff_type, sh.shift, s.contact_no
            ORDER BY s.emp_name
        `;
        
        return {
            queryString: queryString,
            arr: arr
        };
    },

    getDetailedAttendanceReport: function (req, res) {
        const { start_date, end_date, emp_id } = req.query;
        
        let queryString = `
            SELECT 
                s.emp_id,
                s.emp_name,
                st.staff_type,
                sa.attendance_date,
                sa.status,
                sa.marked_at
            FROM staff s
            LEFT JOIN staff_attendance sa ON s.emp_id = sa.emp_id
                AND sa.attendance_date BETWEEN ? AND ?
            LEFT JOIN staff_type st ON s.staff_type_id = st.staff_type_id
        `;
        
        const arr = [start_date, end_date];
        
        if (emp_id) {
            queryString += ` WHERE s.emp_id = ?`;
            arr.push(emp_id);
        }
        
        queryString += `
            ORDER BY s.emp_name, sa.attendance_date
        `;
        
        return {
            queryString: queryString,
            arr: arr
        };
    },

    getMonthlyAttendanceSummary: function (req, res) {
        const { year } = req.query;
        
        return {
            queryString: `
                SELECT 
                    s.emp_id,
                    s.emp_name,
                    MONTH(sa.attendance_date) as month,
                    YEAR(sa.attendance_date) as year,
                    COUNT(CASE WHEN sa.status = 'present' THEN 1 END) as present_days,
                    COUNT(CASE WHEN sa.status = 'absent' THEN 1 END) as absent_days
                FROM staff s
                LEFT JOIN staff_attendance sa ON s.emp_id = sa.emp_id
                WHERE YEAR(sa.attendance_date) = ? OR sa.attendance_date IS NULL
                GROUP BY s.emp_id, s.emp_name, MONTH(sa.attendance_date), YEAR(sa.attendance_date)
                ORDER BY s.emp_name, MONTH(sa.attendance_date)
            `,
            arr: [year]
        };
    },

    /* ------------------- Room Types Management --------------------- */
    getRoomTypeById: function (req, res) {
        return {
            queryString: "SELECT * FROM room_type WHERE room_type_id = ?",
            arr: [req.params.id || req.body.room_type_id]
        };
    },

    saveRoomType: function (req, res) {
        return {
            queryString: `
                INSERT INTO room_type (room_type, price, max_person)
                VALUES (?, ?, ?)
            `,
            arr: [
                req.body.room_type,
                req.body.price,
                req.body.max_person
            ]
        };
    },

    updateRoomType: function (req, res) {
        return {
            queryString: `
                UPDATE room_type 
                SET room_type = ?, price = ?, max_person = ?
                WHERE room_type_id = ?
            `,
            arr: [
                req.body.room_type,
                req.body.price,
                req.body.max_person,
                req.params.id || req.body.room_type_id
            ]
        };
    },

    deleteRoomTypeById: function (req, res) {
        return {
            queryString: "DELETE FROM room_type WHERE room_type_id = ?",
            arr: [req.params.id || req.body.room_type_id]
        };
    },

    checkRoomTypeUsage: function (req, res) {
        return {
            queryString: "SELECT room_id FROM room WHERE room_type_id = ? AND deleteStatus = 0 LIMIT 1",
            arr: [req.params.id || req.body.room_type_id]
        };
    },
};