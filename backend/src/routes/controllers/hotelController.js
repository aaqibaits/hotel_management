var dbqueryexecute = require("../../utils/dbqueryexecute");
var hotelSqlc = require("./hotelSqlc");

module.exports = {
    /* ------------------- Authentication --------------------- */
    login: async function (req, res) {
        try {
            // For testing, use mock login first
            const { username, password } = req.body;
            
            // Check if user exists in database
            const record = await dbqueryexecute.executeSelect(hotelSqlc.login(req, res));
            
            if (record.length > 0) {
                res.status(200).json({
                    status: 200,
                    mess: "Login Successful!",
                    mess_body: "Welcome to Hotel Management System",
                    data: record[0],
                    token: "jwt-token-" + Date.now()
                });
            } else {
                // For development, allow admin/admin123
                if (username === 'admin' && password === 'admin123') {
                    res.status(200).json({
                        status: 200,
                        mess: "Login Successful!",
                        mess_body: "Welcome to Hotel Management System",
                        data: { username: 'admin', name: 'Administrator' },
                        token: "jwt-token-" + Date.now()
                    });
                } else {
                    res.status(401).json({
                        status: 401,
                        mess: "Login Failed",
                        mess_body: "Invalid username or password"
                    });
                }
            }
        } catch (err) {
            console.error('Login error:', err);
            res.status(500).json({
                status: 500,
                mess: err.code,
                mess_body: err.message
            });
        }
    },

    /* ------------------- Dashboard --------------------- */
    getDashboardStats: async function (req, res) {
        try {
            const record = await dbqueryexecute.executeSelect(hotelSqlc.getDashboardStats(req, res));
            
            if (record[0]) {
                // Calculate occupancy rate
                if (record[0].totalRooms > 0) {
                    record[0].occupancyRate = ((record[0].occupiedRooms / record[0].totalRooms) * 100).toFixed(2);
                } else {
                    record[0].occupancyRate = 0;
                }
                
                // Ensure all new stats have default values if null
                record[0].totalAmount = record[0].totalAmount || 0;
                record[0].totalPending = record[0].totalPending || 0;
                record[0].todayAmount = record[0].todayAmount || 0;
                record[0].todayBookings = record[0].todayBookings || 0;
                
                res.status(200).json({
                    status: 200,
                    mess: "Record Found!",
                    mess_body: "Dashboard statistics found",
                    data: record[0]
                });
            } else {
                // Return default values if no record found
                res.status(200).json({
                    status: 200,
                    mess: "Record Found!",
                    mess_body: "Dashboard statistics found",
                    data: {
                        totalRooms: 0,
                        availableRooms: 0,
                        occupiedRooms: 0,
                        totalBookings: 0,
                        activeBookings: 0,
                        totalCustomers: 0,
                        totalStaff: 0,
                        pendingComplaints: 0,
                        occupancyRate: 0,
                        totalAmount: 0,
                        totalPending: 0,
                        todayAmount: 0,
                        todayBookings: 0
                    }
                });
            }
        } catch (err) {
            console.error('Dashboard stats error:', err);
            res.status(500).json({
                status: 500,
                mess: err.code,
                mess_body: err.message
            });
        }
    },

    getRecentBookings: async function (req, res) {
        try {
            const record = await dbqueryexecute.executeSelect(hotelSqlc.getRecentBookings(req, res));
            res.status(200).json({
                status: 200,
                mess: "Record Found!",
                mess_body: "Recent bookings retrieved",
                data: record
            });
        } catch (err) {
            console.error('Recent bookings error:', err);
            res.status(500).json({
                status: 500,
                mess: err.code,
                mess_body: err.message
            });
        }
    },

    /* ------------------- Room Management --------------------- */
    getAllRooms: async function (req, res) {
        try {
            const record = await dbqueryexecute.executeSelect(hotelSqlc.getAllRooms(req, res));
            res.status(200).json({
                status: 200,
                mess: "Record Found!",
                mess_body: "Room list retrieved successfully",
                data: record
            });
        } catch (err) {
            console.error('Rooms error:', err);
            res.status(500).json({
                status: 500,
                mess: err.code,
                mess_body: err.message
            });
        }
    },

    getRoomById: async function (req, res) {
        try {
            const record = await dbqueryexecute.executeSelect(hotelSqlc.getRoomById(req, res));
            if (record.length > 0) {
                res.status(200).json({
                    status: 200,
                    mess: "Record Found!",
                    mess_body: "Room details retrieved",
                    data: record[0]
                });
            } else {
                res.status(404).json({
                    status: 404,
                    mess: "Not Found",
                    mess_body: "Room not found"
                });
            }
        } catch (err) {
            res.status(500).json({
                status: 500,
                mess: err.code,
                mess_body: err.message
            });
        }
    },

    saveRoom: async function (req, res) {
        try {
            const record = await dbqueryexecute.executeUpdate(hotelSqlc.saveRoom(req, res));
            res.status(200).json({
                status: 200,
                mess: "Record Saved!",
                mess_body: "Room added successfully",
                data: { insertId: record.insertId }
            });
        } catch (err) {
            res.status(500).json({
                status: 500,
                mess: err.code,
                mess_body: err.message
            });
        }
    },

    updateRoom: async function (req, res) {
        try {
            await dbqueryexecute.executeUpdate(hotelSqlc.updateRoom(req, res));
            res.status(200).json({
                status: 200,
                mess: "Record Updated!",
                mess_body: "Room updated successfully"
            });
        } catch (err) {
            res.status(500).json({
                status: 500,
                mess: err.code,
                mess_body: err.message
            });
        }
    },

    deleteRoomById: async function (req, res) {
        try {
            await dbqueryexecute.executeUpdate(hotelSqlc.deleteRoomById(req, res));
            res.status(200).json({
                status: 200,
                mess: "Record Deleted!",
                mess_body: "Room deleted successfully"
            });
        } catch (err) {
            res.status(500).json({
                status: 500,
                mess: err.code,
                mess_body: err.message
            });
        }
    },

    /* ------------------- Room Types --------------------- */
    getRoomTypes: async function (req, res) {
        try {
            const record = await dbqueryexecute.executeSelect(hotelSqlc.getRoomTypes(req, res));
            res.status(200).json({
                status: 200,
                mess: "Record Found!",
                mess_body: "Room types retrieved",
                data: record
            });
        } catch (err) {
            res.status(500).json({
                status: 500,
                mess: err.code,
                mess_body: err.message
            });
        }
    },

    /* ------------------- Booking Management --------------------- */
    getAllBookings: async function (req, res) {
        try {
            const record = await dbqueryexecute.executeSelect(hotelSqlc.getAllBookings(req, res));
            res.status(200).json({
                status: 200,
                mess: "Record Found!",
                mess_body: "Booking list retrieved",
                data: record
            });
        } catch (err) {
            res.status(500).json({
                status: 500,
                mess: err.code,
                mess_body: err.message
            });
        }
    },

    getAdvanceBookings: async function (req, res) {
        try {
            const record = await dbqueryexecute.executeSelect(hotelSqlc.getAdvanceBookings(req, res));
            res.status(200).json({
                status: 200,
                mess: "Record Found!",
                mess_body: "Advance booking list retrieved",
                data: record
            });
        } catch (err) {
            res.status(500).json({
                status: 500,
                mess: err.code,
                mess_body: err.message
            });
        }
    },

    getBookingById: async function (req, res) {
        try {
            const record = await dbqueryexecute.executeSelect(hotelSqlc.getBookingById(req, res));
            if (record.length > 0) {
                res.status(200).json({
                    status: 200,
                    mess: "Record Found!",
                    mess_body: "Booking details retrieved",
                    data: record[0]
                });
            } else {
                res.status(404).json({
                    status: 404,
                    mess: "Not Found",
                    mess_body: "Booking not found"
                });
            }
        } catch (err) {
            res.status(500).json({
                status: 500,
                mess: err.code,
                mess_body: err.message
            });
        }
    },

    saveBooking: async function (req, res) {
        try {
            // Validate booking type specific rules
            const bookingType = req.body.bookingType || 'NORMAL';
            
            if (bookingType === 'ADVANCE') {
                req.body.status = 'PENDING_CONFIRMATION';
                req.body.checkInStatus = false;
                req.body.checkOutStatus = false;
            } else {
                req.body.status = 'CONFIRMED';
            }

            const record = await dbqueryexecute.executeUpdate(hotelSqlc.saveBooking(req, res));
            res.status(200).json({
                status: 200,
                mess: "Record Saved!",
                mess_body: bookingType === 'ADVANCE' ? 
                    "Advance booking created successfully" : 
                    "Booking created successfully",
                data: { bookingId: record.insertId }
            });
        } catch (err) {
            res.status(500).json({
                status: 500,
                mess: err.code,
                mess_body: err.message
            });
        }
    },

    confirmAdvanceBooking: async function (req, res) {
        try {
            const bookingId = req.params.id;
            
            // Get current booking to validate
            const booking = await dbqueryexecute.executeSelect(
                hotelSqlc.getBookingById({ params: { id: bookingId } }, res)
            );
            
            if (booking.length === 0) {
                return res.status(404).json({
                    status: 404,
                    mess: "Not Found",
                    mess_body: "Booking not found"
                });
            }

            if (booking[0].bookingType !== 'ADVANCE') {
                return res.status(400).json({
                    status: 400,
                    mess: "Bad Request",
                    mess_body: "This is not an advance booking"
                });
            }

            if (booking[0].status === 'CONFIRMED') {
                return res.status(400).json({
                    status: 400,
                    mess: "Bad Request",
                    mess_body: "Booking is already confirmed"
                });
            }

            await dbqueryexecute.executeUpdate(hotelSqlc.confirmAdvanceBooking(req, res));
            
            res.status(200).json({
                status: 200,
                mess: "Booking Confirmed!",
                mess_body: "Advance booking confirmed successfully"
            });
        } catch (err) {
            console.error('Error confirming booking:', err);
            res.status(500).json({
                status: 500,
                mess: err.code,
                mess_body: err.message
            });
        }
    },

    checkIn: async function (req, res) {
        try {
            const bookingId = req.params.id;
            
            // Validate before check-in
            const booking = await dbqueryexecute.executeSelect(
                hotelSqlc.getBookingById({ params: { id: bookingId } }, res)
            );
            
            if (booking.length === 0) {
                return res.status(404).json({
                    status: 404,
                    mess: "Not Found",
                    mess_body: "Booking not found"
                });
            }

            const bookingData = booking[0];

            // Validation: Must be confirmed
            if (bookingData.status !== 'CONFIRMED') {
                return res.status(400).json({
                    status: 400,
                    mess: "Check-in Failed",
                    mess_body: "Booking must be confirmed before check-in"
                });
            }

            // Validation: Payment must be completed
            if (bookingData.paymentStatus !== 'PAID') {
                return res.status(400).json({
                    status: 400,
                    mess: "Check-in Failed",
                    mess_body: "Payment must be completed before check-in"
                });
            }

            // Validation: Not already checked in
            if (bookingData.checkInStatus) {
                return res.status(400).json({
                    status: 400,
                    mess: "Check-in Failed",
                    mess_body: "Customer is already checked in"
                });
            }

            // Validation: Not checked out
            if (bookingData.checkOutStatus) {
                return res.status(400).json({
                    status: 400,
                    mess: "Check-in Failed",
                    mess_body: "Cannot check-in after check-out"
                });
            }

            await dbqueryexecute.executeUpdate(hotelSqlc.checkIn(req, res));
            
            res.status(200).json({
                status: 200,
                mess: "Check-in Successful!",
                mess_body: "Guest checked in successfully"
            });
        } catch (err) {
            console.error('Check-in error:', err);
            res.status(500).json({
                status: 500,
                mess: err.code,
                mess_body: err.message
            });
        }
    },

    checkOut: async function (req, res) {
        try {
            const bookingId = req.params.id;
            
            // Validate before check-out
            const booking = await dbqueryexecute.executeSelect(
                hotelSqlc.getBookingById({ params: { id: bookingId } }, res)
            );
            
            if (booking.length === 0) {
                return res.status(404).json({
                    status: 404,
                    mess: "Not Found",
                    mess_body: "Booking not found"
                });
            }

            const bookingData = booking[0];

            // Validation: Must be checked in first
            if (!bookingData.checkInStatus) {
                return res.status(400).json({
                    status: 400,
                    mess: "Check-out Failed",
                    mess_body: "Customer must be checked in before check-out"
                });
            }

            // Validation: Not already checked out
            if (bookingData.checkOutStatus) {
                return res.status(400).json({
                    status: 400,
                    mess: "Check-out Failed",
                    mess_body: "Customer is already checked out"
                });
            }

            await dbqueryexecute.executeUpdate(hotelSqlc.checkOut(req, res));
            
            res.status(200).json({
                status: 200,
                mess: "Check-out Successful!",
                mess_body: "Guest checked out successfully. Booking is now complete."
            });
        } catch (err) {
            console.error('Check-out error:', err);
            res.status(500).json({
                status: 500,
                mess: err.code,
                mess_body: err.message
            });
        }
    },

    updateBookingPayment: async function (req, res) {
        try {
            const bookingId = req.params.id;
            
            // Get booking to validate
            const booking = await dbqueryexecute.executeSelect(
                hotelSqlc.getBookingById({ params: { id: bookingId } }, res)
            );
            
            if (booking.length === 0) {
                return res.status(404).json({
                    status: 404,
                    mess: "Not Found",
                    mess_body: "Booking not found"
                });
            }

            // Cannot update payment if checked out
            if (booking[0].checkOutStatus) {
                return res.status(400).json({
                    status: 400,
                    mess: "Payment Update Failed",
                    mess_body: "Cannot update payment after check-out"
                });
            }

            // Validate payment status and method
            if (req.body.paymentStatus === 'PAID' && !req.body.paymentMethod) {
                return res.status(400).json({
                    status: 400,
                    mess: "Payment Update Failed",
                    mess_body: "Payment method is required when marking as PAID"
                });
            }

            await dbqueryexecute.executeUpdate(hotelSqlc.updateBookingPayment(req, res));
            
            res.status(200).json({
                status: 200,
                mess: "Payment Updated!",
                mess_body: "Payment updated successfully"
            });
        } catch (err) {
            console.error('Payment update error:', err);
            res.status(500).json({
                status: 500,
                mess: err.code,
                mess_body: err.message
            });
        }
    },

    updateBooking: async function (req, res) {
        try {
            const bookingId = req.params.id;
            
            // Get booking to validate
            const booking = await dbqueryexecute.executeSelect(
                hotelSqlc.getBookingById({ params: { id: bookingId } }, res)
            );
            
            if (booking.length === 0) {
                return res.status(404).json({
                    status: 404,
                    mess: "Not Found",
                    mess_body: "Booking not found"
                });
            }

            // Cannot update if checked out (booking is locked)
            if (booking[0].checkOutStatus) {
                return res.status(400).json({
                    status: 400,
                    mess: "Update Failed",
                    mess_body: "Cannot update booking after check-out"
                });
            }

            await dbqueryexecute.executeUpdate(hotelSqlc.updateBooking(req, res));
            
            res.status(200).json({
                status: 200,
                mess: "Record Updated!",
                mess_body: "Booking updated successfully"
            });
        } catch (err) {
            console.error('Error updating booking:', err);
            res.status(500).json({
                status: 500,
                mess: err.code,
                mess_body: err.message
            });
        }
    },

    deleteBooking: async function (req, res) {
        try {
            const bookingId = req.params.id;
            
            // Get booking to validate
            const booking = await dbqueryexecute.executeSelect(
                hotelSqlc.getBookingById({ params: { id: bookingId } }, res)
            );
            
            if (booking.length === 0) {
                return res.status(404).json({
                    status: 404,
                    mess: "Not Found",
                    mess_body: "Booking not found"
                });
            }

            // Cannot delete if checked in or checked out
            if (booking[0].checkInStatus || booking[0].checkOutStatus) {
                return res.status(400).json({
                    status: 400,
                    mess: "Delete Failed",
                    mess_body: "Cannot delete a booking that has been checked in or checked out"
                });
            }

            await dbqueryexecute.executeUpdate(hotelSqlc.deleteBooking(req, res));
            
            res.status(200).json({
                status: 200,
                mess: "Record Deleted!",
                mess_body: "Booking deleted successfully"
            });
        } catch (err) {
            console.error('Error deleting booking:', err);
            res.status(500).json({
                status: 500,
                mess: err.code,
                mess_body: err.message
            });
        }
    },

    /* ------------------- Customer Management --------------------- */
    saveCustomerWithPersons: async function (req, res) {
        try {
            // Save main customer
            const customerResult = await dbqueryexecute.executeUpdate(
                hotelSqlc.saveCustomerWithPersons(req, res)
            );
            
            const customerId = customerResult.insertId;
            
            // Save person details if provided
            if (req.body.persons && req.body.persons.length > 0) {
                for (const person of req.body.persons) {
                    const personReq = {
                        body: {
                            customer_id: customerId,
                            person_name: person.person_name,
                            id_card_type_id: person.id_card_type_id,
                            id_card_no: person.id_card_no,
                            id_card_front_image: person.id_card_front_image,
                            id_card_back_image: person.id_card_back_image
                        }
                    };
                    
                    await dbqueryexecute.executeUpdate(
                        hotelSqlc.saveCustomerPerson(personReq, res)
                    );
                }
            }
            
            res.status(200).json({
                status: 200,
                mess: "Record Saved!",
                mess_body: "Customer added successfully with person details",
                data: { customerId: customerId }
            });
        } catch (err) {
            console.error('Save customer error:', err);
            res.status(500).json({
                status: 500,
                mess: err.code,
                mess_body: err.message
            });
        }
    },

    updateCustomerWithPersons: async function (req, res) {
        try {
            // Update main customer
            await dbqueryexecute.executeUpdate(
                hotelSqlc.updateCustomerWithPersons(req, res)
            );
            
            const customerId = req.params.id || req.body.customer_id;
            
            // Delete existing person records
            await dbqueryexecute.executeUpdate(
                hotelSqlc.deleteCustomerPersons({ body: { customer_id: customerId } }, res)
            );
            
            // Add new person details
            if (req.body.persons && req.body.persons.length > 0) {
                for (const person of req.body.persons) {
                    const personReq = {
                        body: {
                            customer_id: customerId,
                            person_name: person.person_name,
                            id_card_type_id: person.id_card_type_id,
                            id_card_no: person.id_card_no,
                            id_card_front_image: person.id_card_front_image,
                            id_card_back_image: person.id_card_back_image
                        }
                    };
                    
                    await dbqueryexecute.executeUpdate(
                        hotelSqlc.saveCustomerPerson(personReq, res)
                    );
                }
            }
            
            res.status(200).json({
                status: 200,
                mess: "Record Updated!",
                mess_body: "Customer updated successfully"
            });
        } catch (err) {
            console.error('Update customer error:', err);
            res.status(500).json({
                status: 500,
                mess: err.code,
                mess_body: err.message
            });
        }
    },

    getCustomerPersons: async function (req, res) {
        try {
            const record = await dbqueryexecute.executeSelect(
                hotelSqlc.getCustomerPersons(req, res)
            );
            
            res.status(200).json({
                status: 200,
                mess: "Record Found!",
                mess_body: "Customer persons retrieved",
                data: record
            });
        } catch (err) {
            console.error('Get customer persons error:', err);
            res.status(500).json({
                status: 500,
                mess: err.code,
                mess_body: err.message
            });
        }
    },

    // Update the existing getAllCustomers
    getAllCustomersUpdated: async function (req, res) {
        try {
            const record = await dbqueryexecute.executeSelect(
                hotelSqlc.getAllCustomersWithPersons(req, res)
            );
            res.status(200).json({
                status: 200,
                mess: "Record Found!",
                mess_body: "Customer list retrieved",
                data: record
            });
        } catch (err) {
            res.status(500).json({
                status: 500,
                mess: err.code,
                mess_body: err.message
            });
        }
    },

    /* ------------------- Complaint Management --------------------- */
    getAllComplaints: async function (req, res) {
        try {
            const record = await dbqueryexecute.executeSelect(hotelSqlc.getAllComplaints(req, res));
            res.status(200).json({
                status: 200,
                mess: "Record Found!",
                mess_body: "Complaint list retrieved",
                data: record
            });
        } catch (err) {
            res.status(500).json({
                status: 500,
                mess: err.code,
                mess_body: err.message
            });
        }
    },

    /* ------------------- Dropdown Data --------------------- */
    getIdCardTypes: async function (req, res) {
        try {
            const record = await dbqueryexecute.executeSelect(hotelSqlc.getIdCardTypes(req, res));
            res.status(200).json({
                status: 200,
                mess: "Record Found!",
                mess_body: "ID card types retrieved",
                data: record
            });
        } catch (err) {
            res.status(500).json({
                status: 500,
                mess: err.code,
                mess_body: err.message
            });
        }
    },

    getStaffTypes: async function (req, res) {
        try {
            const record = await dbqueryexecute.executeSelect(hotelSqlc.getStaffTypes(req, res));
            res.status(200).json({
                status: 200,
                mess: "Record Found!",
                mess_body: "Staff types retrieved",
                data: record
            });
        } catch (err) {
            res.status(500).json({
                status: 500,
                mess: err.code,
                mess_body: err.message
            });
        }
    },

    getShifts: async function (req, res) {
        try {
            const record = await dbqueryexecute.executeSelect(hotelSqlc.getShifts(req, res));
            res.status(200).json({
                status: 200,
                mess: "Record Found!",
                mess_body: "Shifts retrieved",
                data: record
            });
        } catch (err) {
            res.status(500).json({
                status: 500,
                mess: err.code,
                mess_body: err.message
            });
        }
    },

    /* ------------------- Staff Management --------------------- */
    getAllStaff: async function (req, res) {
        try {
            const record = await dbqueryexecute.executeSelect(hotelSqlc.getAllStaff(req, res));
            res.status(200).json({
                status: 200,
                mess: "Record Found!",
                mess_body: "Staff list retrieved",
                data: record
            });
        } catch (err) {
            res.status(500).json({
                status: 500,
                mess: err.code,
                mess_body: err.message
            });
        }
    },

    getStaffById: async function (req, res) {
        try {
            const record = await dbqueryexecute.executeSelect(hotelSqlc.getStaffById(req, res));
            if (record.length > 0) {
                res.status(200).json({
                    status: 200,
                    mess: "Record Found!",
                    mess_body: "Staff details retrieved",
                    data: record[0]
                });
            } else {
                res.status(404).json({
                    status: 404,
                    mess: "Not Found",
                    mess_body: "Staff not found"
                });
            }
        } catch (err) {
            res.status(500).json({
                status: 500,
                mess: err.code,
                mess_body: err.message
            });
        }
    },

    saveStaff: async function (req, res) {
        try {
            const record = await dbqueryexecute.executeUpdate(hotelSqlc.saveStaff(req, res));
            res.status(200).json({
                status: 200,
                mess: "Record Saved!",
                mess_body: "Staff added successfully",
                data: { staffId: record.insertId }
            });
        } catch (err) {
            res.status(500).json({
                status: 500,
                mess: err.code,
                mess_body: err.message
            });
        }
    },

    updateStaff: async function (req, res) {
        try {
            await dbqueryexecute.executeUpdate(hotelSqlc.updateStaff(req, res));
            res.status(200).json({
                status: 200,
                mess: "Record Updated!",
                mess_body: "Staff updated successfully"
            });
        } catch (err) {
            res.status(500).json({
                status: 500,
                mess: err.code,
                mess_body: err.message
            });
        }
    },

    deleteStaffById: async function (req, res) {
        try {
            await dbqueryexecute.executeUpdate(hotelSqlc.deleteStaffById(req, res));
            res.status(200).json({
                status: 200,
                mess: "Record Deleted!",
                mess_body: "Staff deleted successfully"
            });
        } catch (err) {
            res.status(500).json({
                status: 500,
                mess: err.code,
                mess_body: err.message
            });
        }
    },

    /* ------------------- Staff Attendance --------------------- */
    getAttendanceByMonth: async function (req, res) {
        try {
            const { month, year } = req.query;
            
            if (!month || !year) {
                return res.status(400).json({
                    status: 400,
                    mess: "Bad Request",
                    mess_body: "Month and year are required"
                });
            }

            const record = await dbqueryexecute.executeSelect(
                hotelSqlc.getAttendanceByMonth(req, res)
            );
            
            res.status(200).json({
                status: 200,
                mess: "Record Found!",
                mess_body: "Attendance retrieved successfully",
                data: record
            });
        } catch (err) {
            console.error('Attendance fetch error:', err);
            res.status(500).json({
                status: 500,
                mess: err.code,
                mess_body: err.message
            });
        }
    },

    markAttendance: async function (req, res) {
        try {
            const { emp_id, attendance_date, status } = req.body;
            
            // Validation
            if (!emp_id || !attendance_date || !status) {
                return res.status(400).json({
                    status: 400,
                    mess: "Bad Request",
                    mess_body: "emp_id, attendance_date, and status are required"
                });
            }

            if (!['present', 'absent'].includes(status)) {
                return res.status(400).json({
                    status: 400,
                    mess: "Bad Request",
                    mess_body: "Status must be 'present' or 'absent'"
                });
            }

            await dbqueryexecute.executeUpdate(
                hotelSqlc.markAttendance(req, res)
            );
            
            res.status(200).json({
                status: 200,
                mess: "Attendance Marked!",
                mess_body: "Attendance marked successfully"
            });
        } catch (err) {
            console.error('Mark attendance error:', err);
            res.status(500).json({
                status: 500,
                mess: err.code,
                mess_body: err.message
            });
        }
    },

    deleteAttendance: async function (req, res) {
        try {
            const { emp_id, attendance_date } = req.body;
            
            if (!emp_id || !attendance_date) {
                return res.status(400).json({
                    status: 400,
                    mess: "Bad Request",
                    mess_body: "emp_id and attendance_date are required"
                });
            }

            await dbqueryexecute.executeUpdate(
                hotelSqlc.deleteAttendance(req, res)
            );
            
            res.status(200).json({
                status: 200,
                mess: "Attendance Deleted!",
                mess_body: "Attendance record deleted successfully"
            });
        } catch (err) {
            console.error('Delete attendance error:', err);
            res.status(500).json({
                status: 500,
                mess: err.code,
                mess_body: err.message
            });
        }
    },

    getAttendanceStats: async function (req, res) {
        try {
            const { month, year } = req.query;
            
            if (!month || !year) {
                return res.status(400).json({
                    status: 400,
                    mess: "Bad Request",
                    mess_body: "Month and year are required"
                });
            }

            const record = await dbqueryexecute.executeSelect(
                hotelSqlc.getAttendanceStats(req, res)
            );
            
            res.status(200).json({
                status: 200,
                mess: "Record Found!",
                mess_body: "Attendance stats retrieved successfully",
                data: record
            });
        } catch (err) {
            console.error('Attendance stats error:', err);
            res.status(500).json({
                status: 500,
                mess: err.code,
                mess_body: err.message
            });
        }
    },

    /* ------------------- Attendance Reports --------------------- */
    getAttendanceReport: async function (req, res) {
        try {
            const { start_date, end_date } = req.query;
            
            if (!start_date || !end_date) {
                return res.status(400).json({
                    status: 400,
                    mess: "Bad Request",
                    mess_body: "start_date and end_date are required"
                });
            }

            const record = await dbqueryexecute.executeSelect(
                hotelSqlc.getAttendanceReport(req, res)
            );
            
            // Calculate working days in the period
            const start = new Date(start_date);
            const end = new Date(end_date);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            
            res.status(200).json({
                status: 200,
                mess: "Record Found!",
                mess_body: "Attendance report generated successfully",
                data: record,
                meta: {
                    start_date,
                    end_date,
                    total_days: diffDays
                }
            });
        } catch (err) {
            console.error('Attendance report error:', err);
            res.status(500).json({
                status: 500,
                mess: err.code,
                mess_body: err.message
            });
        }
    },

    getDetailedAttendanceReport: async function (req, res) {
        try {
            const { start_date, end_date } = req.query;
            
            if (!start_date || !end_date) {
                return res.status(400).json({
                    status: 400,
                    mess: "Bad Request",
                    mess_body: "start_date and end_date are required"
                });
            }

            const record = await dbqueryexecute.executeSelect(
                hotelSqlc.getDetailedAttendanceReport(req, res)
            );
            
            res.status(200).json({
                status: 200,
                mess: "Record Found!",
                mess_body: "Detailed attendance report generated successfully",
                data: record
            });
        } catch (err) {
            console.error('Detailed attendance report error:', err);
            res.status(500).json({
                status: 500,
                mess: err.code,
                mess_body: err.message
            });
        }
    },

    getMonthlyAttendanceSummary: async function (req, res) {
        try {
            const { year } = req.query;
            
            if (!year) {
                return res.status(400).json({
                    status: 400,
                    mess: "Bad Request",
                    mess_body: "year is required"
                });
            }

            const record = await dbqueryexecute.executeSelect(
                hotelSqlc.getMonthlyAttendanceSummary(req, res)
            );
            
            res.status(200).json({
                status: 200,
                mess: "Record Found!",
                mess_body: "Monthly attendance summary generated successfully",
                data: record
            });
        } catch (err) {
            console.error('Monthly attendance summary error:', err);
            res.status(500).json({
                status: 500,
                mess: err.code,
                mess_body: err.message
            });
        }
    },

    /* ------------------- Room Types Management --------------------- */
    getRoomTypeById: async function (req, res) {
        try {
            const record = await dbqueryexecute.executeSelect(hotelSqlc.getRoomTypeById(req, res));
            if (record.length > 0) {
                res.status(200).json({
                    status: 200,
                    mess: "Record Found!",
                    mess_body: "Room type details retrieved",
                    data: record[0]
                });
            } else {
                res.status(404).json({
                    status: 404,
                    mess: "Not Found",
                    mess_body: "Room type not found"
                });
            }
        } catch (err) {
            res.status(500).json({
                status: 500,
                mess: err.code,
                mess_body: err.message
            });
        }
    },

    saveRoomType: async function (req, res) {
        try {
            const record = await dbqueryexecute.executeUpdate(hotelSqlc.saveRoomType(req, res));
            res.status(200).json({
                status: 200,
                mess: "Record Saved!",
                mess_body: "Room type added successfully",
                data: { insertId: record.insertId }
            });
        } catch (err) {
            res.status(500).json({
                status: 500,
                mess: err.code,
                mess_body: err.message
            });
        }
    },

    updateRoomType: async function (req, res) {
        try {
            await dbqueryexecute.executeUpdate(hotelSqlc.updateRoomType(req, res));
            res.status(200).json({
                status: 200,
                mess: "Record Updated!",
                mess_body: "Room type updated successfully"
            });
        } catch (err) {
            res.status(500).json({
                status: 500,
                mess: err.code,
                mess_body: err.message
            });
        }
    },

    deleteRoomTypeById: async function (req, res) {
        try {
            // Check if room type is being used by any room
            const usedRooms = await dbqueryexecute.executeSelect(
                hotelSqlc.checkRoomTypeUsage(req, res)
            );
            
            if (usedRooms.length > 0) {
                return res.status(400).json({
                    status: 400,
                    mess: "Delete Failed",
                    mess_body: "Cannot delete room type. It is currently used by " + usedRooms.length + " room(s)."
                });
            }
            
            await dbqueryexecute.executeUpdate(hotelSqlc.deleteRoomTypeById(req, res));
            res.status(200).json({
                status: 200,
                mess: "Record Deleted!",
                mess_body: "Room type deleted successfully"
            });
        } catch (err) {
            res.status(500).json({
                status: 500,
                mess: err.code,
                mess_body: err.message
            });
        }
    },
};