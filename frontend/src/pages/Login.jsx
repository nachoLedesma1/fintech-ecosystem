import { useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Llamamos al endpoint de Auth
            const response = await api.post('/auth/login', { email, password });

            // Guardamos el token en el navegador
            const { token, role } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);

            // Redirigimos al Dashboard 
            navigate('/dashboard');

        } catch (err) {
            console.error(err);
            setError('Credenciales inválidas o error de conexión');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
            <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-8">
                <h2 className="text-3xl font-bold text-center text-white mb-6">
                    Fintech <span className="text-blue-500">Login</span>
                </h2>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 text-center p-2 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-gray-400 text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="tu@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 text-sm font-bold mb-2">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                    >
                        Ingresar
                    </button>
                    <div className="mt-6 text-center text-sm text-gray-400">
                        ¿No tienes cuenta?{' '}
                        <Link to="/register" className="text-blue-400 hover:text-blue-300 font-bold transition">
                            Regístrate aquí
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;