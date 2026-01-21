import api from './api';

export const getCustomers = async () => {
    try {
        const response = await api.get('/customers');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching customers:', error);
        throw error;
    }
};

export const getCustomerById = async (id) => {
    try {
        const response = await api.get(`/customers/${id}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching customer:', error);
        throw error;
    }
};

export const createCustomer = async (customerData) => {
    try {
        const response = await api.post('/customers', customerData);
        return response.data;
    } catch (error) {
        console.error('Error creating customer:', error);
        throw error;
    }
};

export const updateCustomer = async (id, customerData) => {
    try {
        const response = await api.put(`/customers/${id}`, customerData);
        return response.data;
    } catch (error) {
        console.error('Error updating customer:', error);
        throw error;
    }
};

export const deleteCustomer = async (id) => {
    try {
        const response = await api.delete(`/customers/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting customer:', error);
        throw error;
    }
};

export const getIdCardTypes = async () => {
    try {
        const response = await api.get('/customers/id-card-types');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching ID card types:', error);
        throw error;
    }
};

// New functions for person management
export const getCustomerPersons = async (customerId) => {
    try {
        const response = await api.get(`/customers/${customerId}/persons`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching customer persons:', error);
        throw error;
    }
};

// Helper function to convert file to base64
export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};