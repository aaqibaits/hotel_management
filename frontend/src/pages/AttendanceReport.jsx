import React, { useState, useEffect } from 'react';
import { 
    Container, Row, Col, Card, Table, Button, 
    Form, Badge, Spinner, Alert
} from 'react-bootstrap';
import { 
    FaCalendarAlt, FaDownload, FaFilter, FaChartBar,
    FaUserCheck, FaUserTimes, FaPercent, FaPrint
} from 'react-icons/fa';
import { getStaff } from '../services/staffService';
import { 
    getAttendanceReport as getReport, 
    getDetailedAttendanceReport 
} from '../services/attendanceService';

const AttendanceReport = () => {
    const [reportType, setReportType] = useState('summary'); // summary, detailed
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedStaff, setSelectedStaff] = useState('');
    const [staffList, setStaffList] = useState([]);
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [metaData, setMetaData] = useState(null);

    useEffect(() => {
        fetchStaff();
        
        // Set default dates (current month)
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        
        setStartDate(firstDay.toISOString().split('T')[0]);
        setEndDate(lastDay.toISOString().split('T')[0]);
    }, []);

    const fetchStaff = async () => {
        try {
            const staffData = await getStaff();
            setStaffList(staffData);
        } catch (error) {
            console.error('Error fetching staff:', error);
            // Fallback to mock data
            setStaffList([
                { emp_id: 1, emp_name: 'Joseph Bow' },
                { emp_id: 2, emp_name: 'Cleta Landon' }
            ]);
        }
    };

    const generateReport = async () => {
        if (!startDate || !endDate) {
            setError('Please select both start and end dates');
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            setError('Start date must be before end date');
            return;
        }

        setLoading(true);
        setError('');

        try {
            let response;
            
            if (reportType === 'summary') {
                response = await getReport(startDate, endDate, selectedStaff || null);
                setReportData(response.data || []);
                setMetaData(response.meta || null);
            } else {
                response = await getDetailedAttendanceReport(startDate, endDate, selectedStaff || null);
                // Group detailed data by employee
                const groupedData = groupDetailedData(response.data || []);
                setReportData(groupedData);
            }
        } catch (error) {
            console.error('Error generating report:', error);
            setError('Failed to generate report. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const groupDetailedData = (data) => {
        const grouped = {};
        data.forEach(record => {
            if (!grouped[record.emp_id]) {
                grouped[record.emp_id] = {
                    emp_id: record.emp_id,
                    emp_name: record.emp_name,
                    staff_type: record.staff_type,
                    records: []
                };
            }
            if (record.attendance_date) {
                grouped[record.emp_id].records.push({
                    date: record.attendance_date,
                    status: record.status,
                    marked_at: record.marked_at
                });
            }
        });
        return Object.values(grouped);
    };

    const exportToCSV = () => {
        if (reportData.length === 0) {
            alert('No data to export');
            return;
        }

        let csvContent = '';

        if (reportType === 'summary') {
            csvContent = 'Employee Name,Position,Shift,Contact,Total Days Marked,Present Days,Absent Days,Attendance %\n';
            reportData.forEach(row => {
                csvContent += `"${row.emp_name}","${row.staff_type || 'N/A'}","${row.shift || 'N/A'}","${row.contact_no || 'N/A'}",${row.total_days_marked || 0},${row.present_days || 0},${row.absent_days || 0},${row.attendance_percentage || 0}%\n`;
            });
        } else {
            csvContent = 'Employee Name,Position,Date,Status,Marked At\n';
            reportData.forEach(emp => {
                emp.records.forEach(record => {
                    const date = new Date(record.date).toLocaleDateString();
                    const markedAt = new Date(record.marked_at).toLocaleString();
                    csvContent += `"${emp.emp_name}","${emp.staff_type || 'N/A'}","${date}","${record.status}","${markedAt}"\n`;
                });
            });
        }

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `attendance_report_${startDate}_to_${endDate}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const printReport = () => {
        window.print();
    };

    const getStatusBadge = (status) => {
        if (status === 'present') {
            return <Badge bg="success">Present</Badge>;
        } else if (status === 'absent') {
            return <Badge bg="danger">Absent</Badge>;
        }
        return <Badge bg="secondary">Not Marked</Badge>;
    };

    const getAttendanceColor = (percentage) => {
        if (percentage >= 90) return 'success';
        if (percentage >= 75) return 'info';
        if (percentage >= 60) return 'warning';
        return 'danger';
    };

    const setPresetRange = (range) => {
        const today = new Date();
        let start, end;

        switch (range) {
            case 'today':
                start = end = today;
                break;
            case 'yesterday':
                start = end = new Date(today.setDate(today.getDate() - 1));
                break;
            case 'thisWeek':
                const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
                start = firstDayOfWeek;
                end = new Date();
                break;
            case 'lastWeek':
                const lastWeekStart = new Date(today.setDate(today.getDate() - today.getDay() - 7));
                const lastWeekEnd = new Date(today.setDate(today.getDate() - today.getDay() - 1));
                start = lastWeekStart;
                end = lastWeekEnd;
                break;
            case 'thisMonth':
                start = new Date(today.getFullYear(), today.getMonth(), 1);
                end = new Date();
                break;
            case 'lastMonth':
                start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                end = new Date(today.getFullYear(), today.getMonth(), 0);
                break;
            default:
                return;
        }

        setStartDate(start.toISOString().split('T')[0]);
        setEndDate(end.toISOString().split('T')[0]);
    };

    return (
        <Container fluid>
            <style>{`
                @media print {
                    .no-print {
                        display: none !important;
                    }
                    .print-only {
                        display: block !important;
                    }
                }
                .print-only {
                    display: none;
                }
            `}</style>

            <Row className="mb-4 no-print">
                <Col>
                    <h2>
                        <FaChartBar className="me-2" />
                        Attendance Report
                    </h2>
                </Col>
            </Row>

            {/* Filter Section */}
            <Card className="mb-4 no-print">
                <Card.Body>
                    <h5 className="mb-3">Report Filters</h5>
                    <Row>
                        <Col md={3}>
                            <Form.Group className="mb-3">
                                <Form.Label>Report Type</Form.Label>
                                <Form.Select
                                    value={reportType}
                                    onChange={(e) => setReportType(e.target.value)}
                                >
                                    <option value="summary">Summary Report</option>
                                    <option value="detailed">Detailed Report</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group className="mb-3">
                                <Form.Label>Start Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group className="mb-3">
                                <Form.Label>End Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group className="mb-3">
                                <Form.Label>Staff Member</Form.Label>
                                <Form.Select
                                    value={selectedStaff}
                                    onChange={(e) => setSelectedStaff(e.target.value)}
                                >
                                    <option value="">All Staff</option>
                                    {staffList.map((staff) => (
                                        <option key={staff.emp_id} value={staff.emp_id}>
                                            {staff.emp_name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Quick Date Presets */}
                    <Row className="mb-3">
                        <Col>
                            <small className="text-muted d-block mb-2">Quick Select:</small>
                            <div className="d-flex gap-2 flex-wrap">
                                <Button size="sm" variant="outline-secondary" onClick={() => setPresetRange('today')}>
                                    Today
                                </Button>
                                <Button size="sm" variant="outline-secondary" onClick={() => setPresetRange('yesterday')}>
                                    Yesterday
                                </Button>
                                <Button size="sm" variant="outline-secondary" onClick={() => setPresetRange('thisWeek')}>
                                    This Week
                                </Button>
                                <Button size="sm" variant="outline-secondary" onClick={() => setPresetRange('lastWeek')}>
                                    Last Week
                                </Button>
                                <Button size="sm" variant="outline-secondary" onClick={() => setPresetRange('thisMonth')}>
                                    This Month
                                </Button>
                                <Button size="sm" variant="outline-secondary" onClick={() => setPresetRange('lastMonth')}>
                                    Last Month
                                </Button>
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Button 
                                variant="primary" 
                                onClick={generateReport}
                                disabled={loading}
                                className="me-2"
                            >
                                {loading ? (
                                    <>
                                        <Spinner animation="border" size="sm" className="me-2" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <FaFilter className="me-2" />
                                        Generate Report
                                    </>
                                )}
                            </Button>
                            {reportData.length > 0 && (
                                <>
                                    <Button 
                                        variant="success" 
                                        onClick={exportToCSV}
                                        className="me-2"
                                    >
                                        <FaDownload className="me-2" />
                                        Export CSV
                                    </Button>
                                    <Button 
                                        variant="info" 
                                        onClick={printReport}
                                    >
                                        <FaPrint className="me-2" />
                                        Print
                                    </Button>
                                </>
                            )}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Error Alert */}
            {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')} className="no-print">
                    {error}
                </Alert>
            )}

            {/* Print Header */}
            <div className="print-only mb-4">
                <h2 className="text-center">Attendance Report</h2>
                <p className="text-center">
                    Period: {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
                </p>
                <hr />
            </div>

            {/* Meta Information */}
            {metaData && reportType === 'summary' && (
                <Card className="mb-4">
                    <Card.Body>
                        <Row>
                            <Col md={4}>
                                <div className="d-flex align-items-center mb-3 mb-md-0">
                                    <FaCalendarAlt className="text-primary me-3" size={32} />
                                    <div>
                                        <small className="text-muted">Report Period</small>
                                        <div className="fw-bold">
                                            {new Date(metaData.start_date).toLocaleDateString()} - {new Date(metaData.end_date).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col md={4}>
                                <div className="d-flex align-items-center mb-3 mb-md-0">
                                    <FaCalendarAlt className="text-info me-3" size={32} />
                                    <div>
                                        <small className="text-muted">Total Days in Period</small>
                                        <div className="fw-bold fs-4">{metaData.total_days} Days</div>
                                    </div>
                                </div>
                            </Col>
                            <Col md={4}>
                                <div className="d-flex align-items-center">
                                    <FaUserCheck className="text-success me-3" size={32} />
                                    <div>
                                        <small className="text-muted">Total Staff Members</small>
                                        <div className="fw-bold fs-4">{reportData.length} Employees</div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            )}

            {/* Report Data */}
            {loading ? (
                <Card>
                    <Card.Body className="text-center py-5">
                        <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
                        <p className="mt-3 text-muted">Generating your report, please wait...</p>
                    </Card.Body>
                </Card>
            ) : reportData.length > 0 ? (
                <Card>
                    <Card.Body>
                        {reportType === 'summary' ? (
                            <div className="table-responsive">
                                <Table striped hover>
                                    <thead className="table-dark">
                                        <tr>
                                            <th>#</th>
                                            <th>Employee Name</th>
                                            <th>Position</th>
                                            <th>Shift</th>
                                            <th>Contact</th>
                                            <th className="text-center">Days Marked</th>
                                            <th className="text-center">
                                                <FaUserCheck className="me-1" />
                                                Present
                                            </th>
                                            <th className="text-center">
                                                <FaUserTimes className="me-1" />
                                                Absent
                                            </th>
                                            <th className="text-center">
                                                <FaPercent className="me-1" />
                                                Attendance %
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportData.map((row, index) => (
                                            <tr key={row.emp_id}>
                                                <td>{index + 1}</td>
                                                <td className="fw-bold">{row.emp_name}</td>
                                                <td>{row.staff_type || 'N/A'}</td>
                                                <td>
                                                    {row.shift ? <Badge bg="info">{row.shift}</Badge> : 'N/A'}
                                                </td>
                                                <td>{row.contact_no || 'N/A'}</td>
                                                <td className="text-center fw-bold">{row.total_days_marked || 0}</td>
                                                <td className="text-center">
                                                    <Badge bg="success" className="px-3 py-2">
                                                        {row.present_days || 0}
                                                    </Badge>
                                                </td>
                                                <td className="text-center">
                                                    <Badge bg="danger" className="px-3 py-2">
                                                        {row.absent_days || 0}
                                                    </Badge>
                                                </td>
                                                <td className="text-center">
                                                    <Badge 
                                                        bg={getAttendanceColor(row.attendance_percentage || 0)}
                                                        className="px-3 py-2 fs-6"
                                                    >
                                                        {row.attendance_percentage || 0}%
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        ) : (
                            <div>
                                {reportData.map((emp) => (
                                    <Card key={emp.emp_id} className="mb-4 shadow-sm">
                                        <Card.Header className="bg-primary text-white">
                                            <Row className="align-items-center">
                                                <Col>
                                                    <h5 className="mb-0">
                                                        <FaUserCheck className="me-2" />
                                                        {emp.emp_name}
                                                    </h5>
                                                </Col>
                                                <Col xs="auto">
                                                    <Badge bg="light" text="dark" className="px-3 py-2">
                                                        {emp.staff_type || 'N/A'}
                                                    </Badge>
                                                </Col>
                                            </Row>
                                        </Card.Header>
                                        <Card.Body>
                                            {emp.records.length > 0 ? (
                                                <Table hover size="sm" className="mb-0">
                                                    <thead className="table-light">
                                                        <tr>
                                                            <th style={{ width: '40%' }}>Date</th>
                                                            <th style={{ width: '20%' }} className="text-center">Status</th>
                                                            <th style={{ width: '40%' }}>Marked At</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {emp.records.map((record, idx) => (
                                                            <tr key={idx}>
                                                                <td className="fw-bold">
                                                                    <FaCalendarAlt className="me-2 text-primary" />
                                                                    {new Date(record.date).toLocaleDateString('en-US', {
                                                                        weekday: 'short',
                                                                        year: 'numeric',
                                                                        month: 'short',
                                                                        day: 'numeric'
                                                                    })}
                                                                </td>
                                                                <td className="text-center">
                                                                    {getStatusBadge(record.status)}
                                                                </td>
                                                                <td className="text-muted">
                                                                    {new Date(record.marked_at).toLocaleString('en-US', {
                                                                        month: 'short',
                                                                        day: 'numeric',
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                            ) : (
                                                <div className="text-center py-4 text-muted">
                                                    <FaCalendarAlt size={48} className="mb-3 opacity-25" />
                                                    <p className="mb-0">No attendance records found for this period</p>
                                                </div>
                                            )}
                                        </Card.Body>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </Card.Body>
                </Card>
            ) : !loading && (
                <Card>
                    <Card.Body className="text-center py-5">
                        <FaChartBar size={64} className="mb-3 text-muted opacity-50" />
                        <h4 className="text-muted">No Report Generated</h4>
                        <p className="text-muted">
                            Select your filters above and click "Generate Report" to view attendance data
                        </p>
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
};

export default AttendanceReport;