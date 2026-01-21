import api from './api';

export const getComplaints = async () => {
    try {
        const response = await api.get('/complaints');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching complaints:', error);
        throw error;
    }
};

export const getComplaintById = async (id) => {
    try {
        const response = await api.get(`/complaints/${id}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching complaint:', error);
        throw error;
    }
};

export const createComplaint = async (complaintData) => {
    try {
        const response = await api.post('/complaints', complaintData);
        return response.data;
    } catch (error) {
        console.error('Error creating complaint:', error);
        throw error;
    }
};

export const updateComplaint = async (id, complaintData) => {
    try {
        const response = await api.put(`/complaints/${id}`, complaintData);
        return response.data;
    } catch (error) {
        console.error('Error updating complaint:', error);
        throw error;
    }
};

export const deleteComplaint = async (id) => {
    try {
        const response = await api.delete(`/complaints/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting complaint:', error);
        throw error;
    }
};

export const resolveComplaint = async (id, budget) => {
    try {
        const response = await api.put(`/complaints/${id}/resolve`, { budget });
        return response.data;
    } catch (error) {
        console.error('Error resolving complaint:', error);
        throw error;
    }
};