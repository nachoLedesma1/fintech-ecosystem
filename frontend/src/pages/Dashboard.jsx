import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import AliasModal from '../components/AliasModal';
import CreateAccountModal from '../components/CreateAccountModal';
import DepositModal from '../components/DepositModal';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const navigate = useNavigate();
    const [editingAccount, setEditingAccount] = useState(null);
    const [showCreateAccount, setShowCreateAccount] = useState(false);
    const [showDeposit, setShowDeposit] = useState(false);

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

    const getCurrencySymbol = (currency) => {
        switch (currency) {
            case 'USD': return 'u$s'; // O 'US$' si prefieres
            case 'EUR': return '€';
            case 'ARS': default: return '$';
        }
    };

    const refreshAccounts = async () => {
        const accountsRes = await api.get('/accounts/me');
        setAccounts(accountsRes.data);
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
            {/* Botones de acción */}
            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => setShowCreateAccount(true)}
                    className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-green-600/20 flex items-center gap-2 transition"
                >
                    ➕ Crear Cuenta
                </button>

                <button
                    onClick={() => setShowDeposit(true)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition"
                >
                    🏧 Ingresar Dinero
                </button>

                <button
                    onClick={() => navigate('/contacts')}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold border border-gray-600 flex items-center gap-2 transition"
                >
                    📒 Agenda
                </button>

                <button
                    onClick={() => navigate('/investments')}
                    className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-purple-600/20 flex items-center gap-2 transition"
                >
                    📈 Inversiones
                </button>
            </div>

            {/* Tarjeta de Información */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm border border-gray-700">
                <h2 className="text-xl font-semibold mb-4 text-gray-300">Mis Datos</h2>
                <div className="space-y-2">
                    <p>
                        <span className="text-gray-500 block text-xs uppercase tracking-wide">Nombre Completo</span>
                        <span className="text-lg font-medium">{user.name}</span>
                    </p>
                    <p><span className="text-gray-500">Email:</span> {user.email}</p>
                    <p>
                        <span className="text-gray-500">Rol:</span>
                        <span className="ml-2 bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">
                            {user.role}
                        </span>
                    </p>
                </div>
            </div>

            <h3 className="text-2xl font-bold mt-10 mb-6 border-l-4 border-blue-500 pl-4">
                Mis Cuentas
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accounts.length > 0 ? (
                    accounts.map((acc) => (
                        <div key={acc.id} className="bg-gray-800 rounded-xl p-6 shadow-xl hover:shadow-blue-500/10 transition duration-300 border border-gray-700 relative overflow-hidden">
                            {/* Decoración de fondo */}
                            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-bl-full"></div>

                            <div className="mb-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        {/* Alias Destacado */}
                                        <p className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">Alias</p>
                                        <p className="text-white font-semibold text-lg truncate">
                                            {acc.alias || "Sin Alias"}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setEditingAccount(acc)}
                                        className="text-gray-400 hover:text-blue-400 transition p-1 relative z-10"
                                        title="Editar Alias"
                                    >
                                        ✏️
                                    </button>
                                </div>
                                {/* CBU más pequeño */}
                                <p className="text-gray-500 text-xs font-mono mt-1">CBU: {acc.number}</p>
                            </div>

                            <div className="flex justify-between items-center mb-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold border ${acc.currency === 'ARS' ? 'bg-blue-900/30 text-blue-300 border-blue-500/30' : 'bg-green-900/30 text-green-300 border-green-500/30'
                                    }`}>
                                    {acc.currency}
                                </span>
                                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded">
                                    Activa
                                </span>
                            </div>

                            <div className="mt-2 mb-6">
                                <p className="text-gray-400 text-sm">Saldo Disponible</p>
                                <p className="text-3xl font-bold text-white tracking-tight">
                                    {getCurrencySymbol(acc.currency)} {acc.balance.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                </p>
                            </div>

                            <div className="pt-4 border-t border-gray-700 flex justify-end">
                                <button
                                    onClick={() => navigate(`/history/${acc.number}`)}
                                    className="text-blue-400 hover:text-white text-sm font-medium flex items-center gap-1 transition-colors"
                                >
                                    Ver Movimientos →
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 italic">No tienes cuentas abiertas aún.</p>
                )}
            </div>
            <button
                onClick={() => navigate('/transfer')}
                className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-500 transition text-2xl"
            >
                💸
            </button>
            {/* Modal de Alias */}
            {editingAccount && (
                <AliasModal
                    account={editingAccount}
                    onClose={() => setEditingAccount(null)}
                    onUpdate={refreshAccounts}
                />
            )}
            {/* Modal Crear Cuenta */}
            {showCreateAccount && (
                <CreateAccountModal
                    onClose={() => setShowCreateAccount(false)}
                    onUpdate={refreshAccounts}
                />
            )}
            {/* Modal Ingresar Dinero */}
            {showDeposit && (
                <DepositModal
                    accounts={accounts}
                    onClose={() => setShowDeposit(false)}
                    onUpdate={refreshAccounts}
                />
            )}
        </div>
    );
};

export default Dashboard;