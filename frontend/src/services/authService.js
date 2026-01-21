import api from './api';

export const login = async (username, password) => {
    try {
        const response = await api.post('/login', { username, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('token');
};

export const getCurrentUser = async () => {
    try {
        const response = await api.get('/verify');
        return response.data;
    } catch (error) {
        console.error('Get user error:', error);
        throw error;
    }
};