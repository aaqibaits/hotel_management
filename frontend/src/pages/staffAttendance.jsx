import React, { useState, useEffect } from 'react';
import { getStaff } from '../services/staffService';
import { 
    getAttendanceByMonth, 
    markAttendance, 
    deleteAttendance 
} from '../services/attendanceService';

const AttendanceTracker = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const today = new Date().getDate();
  const todayMonth = new Date().getMonth();
  const todayYear = new Date().getFullYear();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const [attendance, setAttendance] = useState({});

  // Fetch staff and attendance data
  useEffect(() => {
    fetchStaffAndAttendance();
  }, [currentMonth, currentYear]);

  const fetchStaffAndAttendance = async () => {
    try {
      setLoading(true);
      
      // Fetch all staff using service
      const staffList = await getStaff();
      
      // Extract staff names and IDs
      const staffData = staffList.map(staff => ({
        emp_id: staff.emp_id,
        emp_name: staff.emp_name
      }));
      setUsers(staffData);

      // Fetch attendance for current month using service
      const attendanceRecords = await getAttendanceByMonth(currentMonth + 1, currentYear);
      
      // Initialize attendance object
      const attendanceObj = {};
      staffData.forEach(staff => {
        attendanceObj[staff.emp_id] = {};
        for (let day = 1; day <= daysInMonth; day++) {
          attendanceObj[staff.emp_id][day] = null;
        }
      });

      // Populate with existing attendance data
      attendanceRecords.forEach(record => {
        const date = new Date(record.attendance_date);
        const day = date.getDate();
        if (attendanceObj[record.emp_id]) {
          attendanceObj[record.emp_id][day] = record.status === 'present';
        }
      });

      setAttendance(attendanceObj);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback to mock data if API fails
      const mockUsers = [
        { emp_id: 1, emp_name: 'Joseph Bow' },
        { emp_id: 2, emp_name: 'Cleta Landon' }
      ];
      setUsers(mockUsers);
      
      const mockAttendance = {};
      mockUsers.forEach(user => {
        mockAttendance[user.emp_id] = {};
        for (let day = 1; day <= daysInMonth; day++) {
          mockAttendance[user.emp_id][day] = null;
        }
      });
      setAttendance(mockAttendance);
    } finally {
      setLoading(false);
    }
  };

  const toggleAttendance = async (empId, day) => {
    const isCurrentMonth = currentMonth === todayMonth && currentYear === todayYear;
    if (!isCurrentMonth || day !== today) {
      return;
    }

    const currentStatus = attendance[empId][day];
    let newStatus = null;
    
    // Cycle: null -> true (present) -> false (absent) -> null
    if (currentStatus === null) {
      newStatus = true; // present
    } else if (currentStatus === true) {
      newStatus = false; // absent
    } else {
      newStatus = null; // unmarked
    }

    // Optimistic update
    setAttendance(prev => ({
      ...prev,
      [empId]: {
        ...prev[empId],
        [day]: newStatus
      }
    }));

    try {
      const attendanceDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      if (newStatus === null) {
        // Delete attendance record using service
        await deleteAttendance(empId, attendanceDate);
      } else {
        // Mark attendance using service
        await markAttendance({
          emp_id: empId,
          attendance_date: attendanceDate,
          status: newStatus ? 'present' : 'absent'
        });
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
      alert('Failed to update attendance. Please try again.');
      
      // Revert on error
      setAttendance(prev => ({
        ...prev,
        [empId]: {
          ...prev[empId],
          [day]: currentStatus
        }
      }));
    }
  };

  const changeMonth = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #2196F3',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#495057' }}>Loading attendance...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '600', color: '#1a1a1a', margin: 0 }}>
            Attendance Tracker
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => changeMonth('prev')}
              style={{ 
                padding: '10px 20px', 
                backgroundColor: '#2196F3', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px', 
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              ← Prev
            </button>
            <span style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a', minWidth: '150px', textAlign: 'center' }}>
              {monthNames[currentMonth]} {currentYear}
            </span>
            <button
              onClick={() => changeMonth('next')}
              style={{ 
                padding: '10px 20px', 
                backgroundColor: '#2196F3', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px', 
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Next →
            </button>
          </div>
        </div>

        {/* Card Container */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          {/* Legend */}
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #e9ecef' }}>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ 
                  width: '28px', 
                  height: '28px', 
                  backgroundColor: '#22c55e', 
                  color: 'white', 
                  borderRadius: '6px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}>P</span>
                <span style={{ fontSize: '14px', color: '#495057' }}>Present</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ 
                  width: '28px', 
                  height: '28px', 
                  backgroundColor: '#ef4444', 
                  color: 'white', 
                  borderRadius: '6px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}>A</span>
                <span style={{ fontSize: '14px', color: '#495057' }}>Absent</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ 
                  width: '28px', 
                  height: '28px', 
                  border: '2px solid #dee2e6', 
                  borderRadius: '6px',
                  backgroundColor: '#f8f9fa'
                }}></span>
                <span style={{ fontSize: '14px', color: '#495057' }}>Not Marked</span>
              </div>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ 
                    position: 'sticky', 
                    left: 0, 
                    backgroundColor: '#f8f9fa', 
                    padding: '16px 24px', 
                    textAlign: 'left', 
                    fontWeight: '600', 
                    fontSize: '14px',
                    color: '#495057',
                    borderBottom: '2px solid #dee2e6',
                    zIndex: 10,
                    minWidth: '180px'
                  }}>
                    Name
                  </th>
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
                    <th key={day} style={{ 
                      padding: '16px 8px', 
                      textAlign: 'center', 
                      fontWeight: '600', 
                      fontSize: '14px',
                      color: '#495057',
                      borderBottom: '2px solid #dee2e6',
                      minWidth: '50px'
                    }}>
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr key={user.emp_id} style={{ 
                    backgroundColor: idx % 2 === 0 ? 'white' : '#f8f9fa',
                    borderBottom: '1px solid #e9ecef'
                  }}>
                    <td style={{ 
                      position: 'sticky', 
                      left: 0, 
                      padding: '16px 24px', 
                      fontWeight: '500', 
                      fontSize: '14px',
                      color: '#212529',
                      backgroundColor: 'inherit',
                      zIndex: 5
                    }}>
                      {user.emp_name}
                    </td>
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                      const isCurrentMonth = currentMonth === todayMonth && currentYear === todayYear;
                      const isToday = isCurrentMonth && day === today;
                      const isDisabled = !isToday;
                      const status = attendance[user.emp_id]?.[day];
                      
                      let backgroundColor = '#f8f9fa';
                      let color = 'transparent';
                      let cursor = 'not-allowed';
                      let opacity = '0.6';
                      
                      if (status === true) {
                        backgroundColor = '#22c55e';
                        color = 'white';
                        opacity = '1';
                        if (isToday) cursor = 'pointer';
                      } else if (status === false) {
                        backgroundColor = '#ef4444';
                        color = 'white';
                        opacity = '1';
                        if (isToday) cursor = 'pointer';
                      } else if (isToday) {
                        backgroundColor = '#e9ecef';
                        cursor = 'pointer';
                        opacity = '1';
                      }
                      
                      return (
                        <td key={day} style={{ padding: '12px 8px', textAlign: 'center' }}>
                          <button
                            onClick={() => toggleAttendance(user.emp_id, day)}
                            disabled={isDisabled}
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '6px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                              color: color,
                              backgroundColor: backgroundColor,
                              border: 'none',
                              cursor: cursor,
                              opacity: opacity,
                              fontSize: '14px',
                              transition: 'all 0.2s'
                            }}
                          >
                            {status === true ? 'P' : status === false ? 'A' : ''}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracker;