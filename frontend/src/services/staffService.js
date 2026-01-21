import api from './api';

export const getStaff = async () => {
    try {
        const response = await api.get('/staff');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching staff:', error);
        throw error;
    }
};

export const getStaffById = async (id) => {
    try {
        const response = await api.get(`/staff/${id}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching staff:', error);
        throw error;
    }
};

export const createStaff = async (staffData) => {
    try {
        const response = await api.post('/staff', staffData);
        return response.data;
    } catch (error) {
        console.error('Error creating staff:', error);
        throw error;
    }
};

export const updateStaff = async (id, staffData) => {
    try {
        const response = await api.put(`/staff/${id}`, staffData);
        return response.data;
    } catch (error) {
        console.error('Error updating staff:', error);
        throw error;
    }
};

export const deleteStaff = async (id) => {
    try {
        const response = await api.delete(`/staff/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting staff:', error);
        throw error;
    }
};

export const getStaffTypes = async () => {
    try {
        const response = await api.get('/staff/types');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching staff types:', error);
        throw error;
    }
};

export const getShifts = async () => {
    try {
        const response = await api.get('/staff/shifts');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching shifts:', error);
        throw error;
    }
};

export const getStaffHistory = async (empId) => {
    try {
        const response = await api.get(`/staff/${empId}/history`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching staff history:', error);
        throw error;
    }
};