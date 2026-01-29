import axios from 'axios';

// 1. Instancia para core banking (default)

const apiCore = axios.create({
    baseURL: 'http://localhost:8080/api/core',
    headers: { 'Content-Type': 'application/json' }
});

//Instancia para audit service 

export const apiAudit = axios.create({
    baseURL: 'http://localhost:8080/api/audit', 
    headers: { 'Content-Type': 'application/json' }
});

// Creamos una función para no repetir código y se la aplicamos a ambos
const addTokenInterceptor = (instance) => {
    instance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );
};

// Aplicamos seguridad a ambas instancias
addTokenInterceptor(apiCore);
addTokenInterceptor(apiAudit);

// Exportamos 'apiCore' por defecto para NO ROMPER todo lo programado
export default apiCore;