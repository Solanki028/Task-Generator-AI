import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const generateSpec = async (data) => {
    const response = await api.post('/specs/generate', data);
    return response.data;
};

export const getSpecs = async (limit = 5) => {
    const response = await api.get(`/specs?limit=${limit}`);
    return response.data;
};

export const getSpecById = async (id) => {
    const response = await api.get(`/specs/${id}`);
    return response.data;
};

export const updateSpec = async (id, data) => {
    const response = await api.put(`/specs/${id}`, data);
    return response.data;
};

export const getStatus = async () => {
    const response = await api.get('/status');
    return response.data;
};

export const deleteSpec = async (id) => {
    const response = await api.delete(`/specs/${id}`);
    return response.data;
};

export default api;
