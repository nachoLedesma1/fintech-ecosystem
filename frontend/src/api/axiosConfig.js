import axios from 'axios';

// Apuntamos al Gateway (Puerto 8080)
const api = axios.create({
    baseURL: 'http://localhost:8080/api/core',
    headers: {
        'Content-Type': 'application/json',
    }
});

// Interceptor: Antes de cada petición, inyecta el Token si existe
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;