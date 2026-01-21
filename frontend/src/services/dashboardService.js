import api from './api';

export const getDashboardStats = async () => {
    try {
        const response = await api.get('/dashboard/stats');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw error;
    }
};

export const getRecentBookings = async () => {
    try {
        const response = await api.get('/dashboard/recent-bookings');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching recent bookings:', error);
        throw error;
    }
};