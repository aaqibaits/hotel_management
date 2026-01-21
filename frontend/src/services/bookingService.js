// bookingService.js - Updated service for Advance Booking system

import api from './api';

// Regular bookings (includes confirmed advance bookings)
export const getBookings = async () => {
    try {
        const response = await api.get('/bookings');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching bookings:', error);
        throw error;
    }
};

// NEW: Get only advance bookings
export const getAdvanceBookings = async () => {
    try {
        const response = await api.get('/bookings/advance');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching advance bookings:', error);
        throw error;
    }
};

export const getBookingById = async (id) => {
    try {
        const response = await api.get(`/bookings/${id}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching booking:', error);
        throw error;
    }
};

export const createBooking = async (bookingData) => {
    try {
        const response = await api.post('/bookings', bookingData);
        return response.data;
    } catch (error) {
        console.error('Error creating booking:', error);
        throw error;
    }
};

// NEW: Confirm advance booking
export const confirmAdvanceBooking = async (id) => {
    try {
        const response = await api.put(`/bookings/${id}/confirm`);
        return response.data;
    } catch (error) {
        console.error('Error confirming booking:', error);
        throw error;
    }
};

export const updateBooking = async (id, bookingData) => {
    try {
        const response = await api.put(`/bookings/${id}`, bookingData);
        return response.data;
    } catch (error) {
        console.error('Error updating booking:', error);
        throw error;
    }
};

export const deleteBooking = async (id) => {
    try {
        const response = await api.delete(`/bookings/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting booking:', error);
        throw error;
    }
};

export const checkInBooking = async (id) => {
    try {
        const response = await api.put(`/bookings/${id}/checkin`);
        return response.data;
    } catch (error) {
        console.error('Error checking in:', error);
        throw error;
    }
};

export const checkOutBooking = async (id) => {
    try {
        const response = await api.put(`/bookings/${id}/checkout`);
        return response.data;
    } catch (error) {
        console.error('Error checking out:', error);
        throw error;
    }
};

export const updateBookingPayment = async (id, paymentData) => {
    try {
        const response = await api.put(`/bookings/${id}/payment`, paymentData);
        return response.data;
    } catch (error) {
        console.error('Error updating payment:', error);
        throw error;
    }
};