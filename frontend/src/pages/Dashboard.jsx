import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import AliasModal from '../components/AliasModal';
import CreateAccountModal from '../components/CreateAccountModal';
import DepositModal from '../components/DepositModal';

const Dashboard = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem('role');

    const [user, setUser] = useState(null);
    const [accounts, setAccounts] = useState([]);
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

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-white text-lg">Cargando billetera...</p>
                </div>
            </div>
        );
    }
    const getTotalBalance = () => {
        return accounts.reduce((sum, acc) => {
            if (acc.currency === 'ARS') {
                return sum + acc.balance;
            }
            return sum;
        }, 0);
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Header mejorado */}
            <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-2xl">💰</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">
                                    Hola, <span className="text-blue-400">{user.name}</span>
                                </h1>
                                <p className="text-sm text-gray-400">Bienvenido a tu billetera virtual</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600/10 hover:bg-red-600/20 border border-red-500/30 text-red-400 px-6 py-2.5 rounded-lg transition-all duration-200 font-medium flex items-center gap-2"
                        >
                            <span>🚪</span>
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Cards de resumen */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Balance Total */}
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 shadow-2xl shadow-blue-500/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full"></div>
                        <div className="relative z-10">
                            <p className="text-blue-100 text-sm font-medium mb-1">Balance Total (ARS)</p>
                            <p className="text-4xl font-bold text-white mb-2">
                                ${getTotalBalance().toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                            </p>
                            <p className="text-blue-200 text-xs">
                                {accounts.length} {accounts.length === 1 ? 'cuenta activa' : 'cuentas activas'}
                            </p>
                        </div>
                    </div>

                    {/* Info del usuario */}
                    <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-700/50">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Usuario</p>
                                <p className="text-white font-semibold text-lg">{user.name}</p>
                            </div>
                            <span className="bg-blue-500/20 text-blue-400 text-xs px-3 py-1.5 rounded-full font-medium border border-blue-500/30">
                                {user.role}
                            </span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center text-sm">
                                <span className="text-gray-500 w-16">Email:</span>
                                <span className="text-gray-300 truncate">{user.email}</span>
                            </div>
                        </div>
                    </div>

                    {/* Acceso rápido */}
                    <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-700/50">
                        <p className="text-gray-400 text-xs uppercase tracking-wider mb-4">Acceso Rápido</p>
                        <div className="space-y-2">
                            <button
                                onClick={() => navigate('/transfer')}
                                className="w-full bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 px-4 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm flex items-center justify-between group"
                            >
                                <span className="flex items-center gap-2">
                                    <span>💸</span>
                                    Transferir
                                </span>
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                            </button>
                            <button
                                onClick={() => setShowDeposit(true)}
                                className="w-full bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 px-4 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm flex items-center justify-between group"
                            >
                                <span className="flex items-center gap-2">
                                    <span>🏧</span>
                                    Ingresar
                                </span>
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Botones de navegación principales */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-700/50 mb-8">
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-4">Servicios</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        <button
                            onClick={() => setShowCreateAccount(true)}
                            className="bg-green-600/10 hover:bg-green-600/20 border border-green-500/30 text-green-400 px-4 py-4 rounded-xl transition-all duration-200 font-medium flex flex-col items-center gap-2 group"
                        >
                            <span className="text-2xl group-hover:scale-110 transition-transform">➕</span>
                            <span className="text-xs">Crear Cuenta</span>
                        </button>

                        <button
                            onClick={() => navigate('/contacts')}
                            className="bg-gray-700/50 hover:bg-gray-700 border border-gray-600/50 text-gray-300 px-4 py-4 rounded-xl transition-all duration-200 font-medium flex flex-col items-center gap-2 group"
                        >
                            <span className="text-2xl group-hover:scale-110 transition-transform">📒</span>
                            <span className="text-xs">Agenda</span>
                        </button>

                        <button
                            onClick={() => navigate('/cards')}
                            className="bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 px-4 py-4 rounded-xl transition-all duration-200 font-medium flex flex-col items-center gap-2 group"
                        >
                            <span className="text-2xl group-hover:scale-110 transition-transform">💳</span>
                            <span className="text-xs">Tarjetas</span>
                        </button>

                        <button
                            onClick={() => navigate('/investments')}
                            className="bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/30 text-purple-400 px-4 py-4 rounded-xl transition-all duration-200 font-medium flex flex-col items-center gap-2 group"
                        >
                            <span className="text-2xl group-hover:scale-110 transition-transform">📈</span>
                            <span className="text-xs">Inversiones</span>
                        </button>

                        {role === 'ADMIN' && (
                            <button
                                onClick={() => navigate('/admin')}
                                className="bg-red-600/10 hover:bg-red-600/20 border border-red-500/30 text-red-400 px-4 py-4 rounded-xl transition-all duration-200 font-medium flex flex-col items-center gap-2 group"
                            >
                                <span className="text-2xl group-hover:scale-110 transition-transform">🛡️</span>
                                <span className="text-xs">Admin</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Sección de cuentas */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                            Mis Cuentas
                        </h3>
                        {accounts.length > 0 && (
                            <button
                                onClick={() => setShowCreateAccount(true)}
                                className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-2 transition-colors"
                            >
                                <span>+</span> Nueva Cuenta
                            </button>
                        )}
                    </div>

                    {accounts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {accounts.map((acc) => (
                                <div
                                    key={acc.id}
                                    className="bg-gradient-to-br from-gray-800 to-gray-800/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 border border-gray-700/50 relative overflow-hidden group"
                                >
                                    {/* Decoración de fondo animada */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-transparent rounded-bl-full group-hover:scale-110 transition-transform duration-300"></div>

                                    <div className="relative z-10">
                                        {/* Header de la tarjeta */}
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${acc.currency === 'ARS'
                                                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                                        : acc.currency === 'USD'
                                                            ? 'bg-green-500/20 text-green-300 border-green-500/30'
                                                            : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                                                        }`}>
                                                        {acc.currency}
                                                    </span>
                                                    <span className="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-lg border border-green-500/30">
                                                        ● Activa
                                                    </span>
                                                </div>
                                                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Alias</p>
                                                <p className="text-white font-bold text-xl truncate">
                                                    {acc.alias || "Sin Alias"}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setEditingAccount(acc)}
                                                className="bg-gray-700/50 hover:bg-gray-700 text-gray-300 hover:text-blue-400 transition-all duration-200 p-2.5 rounded-lg border border-gray-600/50"
                                                title="Editar Alias"
                                            >
                                                ✏️
                                            </button>
                                        </div>

                                        {/* CBU */}
                                        <div className="mb-6 bg-gray-900/30 rounded-lg p-3 border border-gray-700/30">
                                            <p className="text-gray-500 text-xs font-medium mb-1">CBU</p>
                                            <p className="text-gray-300 font-mono text-sm tracking-wide">{acc.number}</p>
                                        </div>

                                        {/* Balance */}
                                        <div className="mb-6">
                                            <p className="text-gray-400 text-sm mb-2">Saldo Disponible</p>
                                            <p className="text-4xl font-bold text-white tracking-tight">
                                                {getCurrencySymbol(acc.currency)} {acc.balance.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                            </p>
                                        </div>

                                        {/* Footer con botón */}
                                        <div className="pt-4 border-t border-gray-700/50">
                                            <button
                                                onClick={() => navigate(`/history/${acc.number}`)}
                                                className="w-full bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-400 px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm flex items-center justify-center gap-2 group"
                                            >
                                                Ver Movimientos
                                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-gray-700/50 text-center">
                            <div className="text-6xl mb-4">🏦</div>
                            <p className="text-gray-400 text-lg mb-6">No tienes cuentas abiertas aún</p>
                            <button
                                onClick={() => setShowCreateAccount(true)}
                                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-medium shadow-lg shadow-blue-500/20 transition-all duration-200"
                            >
                                Crear tu primera cuenta
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Botón flotante de transferencia */}
            <button
                onClick={() => navigate('/transfer')}
                className="fixed bottom-8 right-8 bg-gradient-to-br from-blue-600 to-blue-700 text-white p-5 rounded-2xl shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-110 transition-all duration-200 text-3xl z-50 border border-blue-500/30"
                title="Realizar transferencia"
            >
                💸
            </button>

            {/* Modales */}
            {editingAccount && (
                <AliasModal
                    account={editingAccount}
                    onClose={() => setEditingAccount(null)}
                    onUpdate={refreshAccounts}
                />
            )}
            {showCreateAccount && (
                <CreateAccountModal
                    onClose={() => setShowCreateAccount(false)}
                    onUpdate={refreshAccounts}
                />
            )}
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