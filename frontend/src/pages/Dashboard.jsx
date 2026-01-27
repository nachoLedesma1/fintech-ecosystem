import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Cargamos Usuario
                const userRes = await api.get('/users/me');
                setUser(userRes.data);

                // 2. Cargamos Cuentas (NUEVO)
                // Ajusta la URL si tu Gateway requiere /core/accounts/me
                const accountsRes = await api.get('/accounts/me');
                setAccounts(accountsRes.data);

            } catch (error) {
                console.error("Error cargando datos", error);
                localStorage.removeItem('token');
                navigate('/');
            }
        };

        fetchData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    if (!user) return <div className="text-white text-center mt-20">Cargando billetera...</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">
                    Hola, <span className="text-blue-500">{user.name}</span> 👋
                </h1>
                <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
                >
                    Cerrar Sesión
                </button>
            </div>

            {/* Tarjeta de Información */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm border border-gray-700">
                <h2 className="text-xl font-semibold mb-4 text-gray-300">Mis Datos</h2>
                <div className="space-y-2">
                    <p><span className="text-gray-500">Email:</span> {user.email}</p>
                    <p><span className="text-gray-500">ID de Cliente:</span> #{user.id}</p>
                    <p>
                        <span className="text-gray-500">Rol:</span>
                        <span className="ml-2 bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">
                            {user.role}
                        </span>
                    </p>
                </div>
            </div>

            <h3 className="text-2xl font-bold mt-10 mb-6 border-l-4 border-blue-500 pl-4">
                Mis Productos
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accounts.length > 0 ? (
                    accounts.map((acc) => (
                        <div key={acc.id} className="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-blue-500/20 transition border border-gray-700">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-gray-400 text-sm uppercase font-bold tracking-wider">
                                        Nro. Cuenta
                                    </p>
                                    <p className="font-mono text-lg text-white">{acc.number}</p>
                                </div>
                                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded">
                                    Activa
                                </span>
                            </div>
                            
                            <div className="mt-4">
                                <p className="text-gray-400 text-sm">Saldo Disponible</p>
                                <p className="text-3xl font-bold text-white">
                                    $ {acc.balance.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                            
                            <div className="mt-6 pt-4 border-t border-gray-700 flex justify-between items-center text-sm">
                                <span className="text-gray-500">{acc.currency}</span>
                                <button className="text-blue-400 hover:text-blue-300 font-medium">
                                    Ver Movimientos →
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 italic">No tienes cuentas abiertas aún.</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;