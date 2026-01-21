import api from './api';

export const getRoomTypes = async () => {
    try {
        const response = await api.get('/rooms/types');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching room types:', error);
        throw error;
    }
};

export const getRoomTypeById = async (id) => {
    try {
        const response = await api.get(`/rooms/types/${id}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching room type:', error);
        throw error;
    }
};

export const createRoomType = async (roomTypeData) => {
    try {
        const response = await api.post('/rooms/types', roomTypeData);
        return response.data;
    } catch (error) {
        console.error('Error creating room type:', error);
        throw error;
    }
};

export const updateRoomType = async (id, roomTypeData) => {
    try {
        const response = await api.put(`/rooms/types/${id}`, roomTypeData);
        return response.data;
    } catch (error) {
        console.error('Error updating room type:', error);
        throw error;
    }
};

export const deleteRoomType = async (id) => {
    try {
        const response = await api.delete(`/rooms/types/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting room type:', error);
        throw error;
    }
};