const express = require("express");
const hotelCtrl = require("./hotelController");

const router = express.Router();

/* ------------------- Authentication --------------------- */
router.post("/login", hotelCtrl.login);

/* ------------------- Dashboard --------------------- */
router.get("/dashboard/stats", hotelCtrl.getDashboardStats);
router.get("/dashboard/recent-bookings", hotelCtrl.getRecentBookings);

/* ------------------- Room Management --------------------- */
router.get("/rooms", hotelCtrl.getAllRooms);
router.get("/rooms/types", hotelCtrl.getRoomTypes);
router.get("/rooms/:id", hotelCtrl.getRoomById);
router.post("/rooms", hotelCtrl.saveRoom);
router.put("/rooms/:id", hotelCtrl.updateRoom);
router.delete("/rooms/:id", hotelCtrl.deleteRoomById);

/* ------------------- Booking Management --------------------- */
router.get("/bookings", hotelCtrl.getAllBookings); // Gets regular + confirmed advance bookings
router.get("/bookings/advance", hotelCtrl.getAdvanceBookings); //  Gets only advance bookings
router.get("/bookings/:id", hotelCtrl.getBookingById);
router.post("/bookings", hotelCtrl.saveBooking);
router.put("/bookings/:id/confirm", hotelCtrl.confirmAdvanceBooking); //  Confirm advance booking
router.put("/bookings/:id/checkin", hotelCtrl.checkIn); 
router.put("/bookings/:id/checkout", hotelCtrl.checkOut); 
router.put("/bookings/:id/payment", hotelCtrl.updateBookingPayment); 
router.put("/bookings/:id", hotelCtrl.updateBooking); 
router.delete("/bookings/:id", hotelCtrl.deleteBooking); 

/* ------------------- Customer Management --------------------- */
router.get("/customers", hotelCtrl.getAllCustomersUpdated); // Update this
router.post("/customers", hotelCtrl.saveCustomerWithPersons); // Update this
router.put("/customers/:id", hotelCtrl.updateCustomerWithPersons); // Update this
router.get("/customers/:customerId/persons", hotelCtrl.getCustomerPersons); // New route
router.get("/customers/id-card-types", hotelCtrl.getIdCardTypes); // Keep existing

/* ------------------- Complaint Management --------------------- */
router.get("/complaints", hotelCtrl.getAllComplaints);

/* ------------------- Staff Management --------------------- */
router.get("/staff", hotelCtrl.getAllStaff);
router.get("/staff/:id", hotelCtrl.getStaffById);
router.post("/staff", hotelCtrl.saveStaff);
router.put("/staff/:id", hotelCtrl.updateStaff);
router.delete("/staff/:id", hotelCtrl.deleteStaffById);
router.get("/staff/types", hotelCtrl.getStaffTypes);
router.get("/staff/shifts", hotelCtrl.getShifts);

/* ------------------- Staff Attendance --------------------- */
router.get("/attendance", hotelCtrl.getAttendanceByMonth);
router.post("/attendance", hotelCtrl.markAttendance);
router.delete("/attendance", hotelCtrl.deleteAttendance);
router.get("/attendance/stats", hotelCtrl.getAttendanceStats);

/* ------------------- Attendance Reports --------------------- */
router.get("/attendance/report", hotelCtrl.getAttendanceReport);
router.get("/attendance/report/detailed", hotelCtrl.getDetailedAttendanceReport);
router.get("/attendance/report/monthly", hotelCtrl.getMonthlyAttendanceSummary);

/* ------------------- Room Types Management --------------------- */
router.get("/rooms/types/:id", hotelCtrl.getRoomTypeById);
router.post("/rooms/types", hotelCtrl.saveRoomType);
router.put("/rooms/types/:id", hotelCtrl.updateRoomType);
router.delete("/rooms/types/:id", hotelCtrl.deleteRoomTypeById);

module.exports = router;