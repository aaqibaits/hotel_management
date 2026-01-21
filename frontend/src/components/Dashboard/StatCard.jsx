import React from 'react';
import { Card } from 'react-bootstrap';
import { FaBed, FaUsers, FaCalendarCheck, FaUserTie, FaExclamationTriangle } from 'react-icons/fa';

const iconMap = {
    rooms: FaBed,
    customers: FaUsers,
    bookings: FaCalendarCheck,
    staff: FaUserTie,
    complaints: FaExclamationTriangle
};

const StatCard = ({ title, value, type, color = 'primary' }) => {
    const Icon = iconMap[type] || FaBed;

    return (
        <Card className={`border-${color}`}>
            <Card.Body className="d-flex justify-content-between align-items-center">
                <div>
                    <Card.Title className="text-muted mb-1">{title}</Card.Title>
                    <Card.Text className="h3 mb-0">{value}</Card.Text>
                </div>
                <Icon className={`text-${color}`} size={48} />
            </Card.Body>
        </Card>
    );
};

export default StatCard;