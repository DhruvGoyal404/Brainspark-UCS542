import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Extracts a human-readable error message from any Axios error.
 * Handles: validation errors array, server message string, network errors.
 */
export const getApiError = (err) => {
    const data = err?.response?.data;
    if (!data) return err?.message || 'Network error. Please check your connection.';
    if (Array.isArray(data.errors) && data.errors.length > 0) {
        return data.errors.map(e => e.message).join(' · ');
    }
    return data.message || 'Something went wrong. Please try again.';
};

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle response errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - clear auth and dispatch event for app to handle
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            // Emit custom event for app to listen and navigate
            window.dispatchEvent(new Event('auth-error-401'));
        }
        return Promise.reject(error);
    }
);

export default api;
