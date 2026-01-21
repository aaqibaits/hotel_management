import api from './api';

// Get attendance for a specific month
export const getAttendanceByMonth = async (month, year) => {
    try {
        const response = await api.get('/attendance', {
            params: { month, year }
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching attendance:', error);
        throw error;
    }
};

// Mark or update attendance
export const markAttendance = async (attendanceData) => {
    try {
        const response = await api.post('/attendance', attendanceData);
        return response.data;
    } catch (error) {
        console.error('Error marking attendance:', error);
        throw error;
    }
};

// Delete attendance record
export const deleteAttendance = async (empId, attendanceDate) => {
    try {
        const response = await api.delete('/attendance', {
            data: {
                emp_id: empId,
                attendance_date: attendanceDate
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting attendance:', error);
        throw error;
    }
};

// Get attendance statistics for a month
export const getAttendanceStats = async (month, year) => {
    try {
        const response = await api.get('/attendance/stats', {
            params: { month, year }
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching attendance stats:', error);
        throw error;
    }
};

// Get attendance report (summary)
export const getAttendanceReport = async (startDate, endDate, empId = null) => {
    try {
        const params = {
            start_date: startDate,
            end_date: endDate
        };
        
        if (empId) {
            params.emp_id = empId;
        }
        
        const response = await api.get('/attendance/report', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching attendance report:', error);
        throw error;
    }
};

// Get detailed attendance report
export const getDetailedAttendanceReport = async (startDate, endDate, empId = null) => {
    try {
        const params = {
            start_date: startDate,
            end_date: endDate
        };
        
        if (empId) {
            params.emp_id = empId;
        }
        
        const response = await api.get('/attendance/report/detailed', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching detailed attendance report:', error);
        throw error;
    }
};

// Get monthly attendance summary
export const getMonthlyAttendanceSummary = async (year) => {
    try {
        const response = await api.get('/attendance/report/monthly', {
            params: { year }
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching monthly attendance summary:', error);
        throw error;
    }
};