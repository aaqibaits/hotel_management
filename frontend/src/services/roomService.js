import api from './api';

export const getRooms = async () => {
    try {
        const response = await api.get('/rooms');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching rooms:', error);
        throw error;
    }
};

export const getAvailableRooms = async () => {
    try {
        const response = await api.get('/rooms/available');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching available rooms:', error);
        throw error;
    }
};

export const getRoomTypes = async () => {
    try {
        const response = await api.get('/rooms/types');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching room types:', error);
        throw error;
    }
};

export const getRoomById = async (id) => {
    try {
        const response = await api.get(`/rooms/${id}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching room:', error);
        throw error;
    }
};

export const createRoom = async (roomData) => {
    try {
        const response = await api.post('/rooms', roomData);
        return response.data;
    } catch (error) {
        console.error('Error creating room:', error);
        throw error;
    }
};

export const updateRoom = async (id, roomData) => {
    try {
        const response = await api.put(`/rooms/${id}`, roomData);
        return response.data;
    } catch (error) {
        console.error('Error updating room:', error);
        throw error;
    }
};

// Add these functions to your existing roomService.js

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

export const deleteRoom = async (id) => {
    try {
        const response = await api.delete(`/rooms/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting room:', error);
        throw error;
    }
};