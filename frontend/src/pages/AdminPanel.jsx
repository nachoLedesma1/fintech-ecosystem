import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { apiAudit } from '../api/axiosConfig';

const AdminPanel = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Seguridad en Frontend: Si no es admin, fuera.
        const role = localStorage.getItem('role');
       // console.log("Rol actual:", role);
        if (role !== 'ADMIN') {
            navigate('/dashboard');
            return;
        }

        if (activeTab === 'users') fetchUsers();
        if (activeTab === 'logs') fetchLogs();
    }, [activeTab]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            // Usamos TU endpoint real
            const res = await api.get('/api/admin/users');
            setUsers(res.data);
        } catch (error) {
            console.error("Error cargando usuarios", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchLogs = async () => {
        setLoading(true);
        try {

            // Nota: Asegúrate de que tu API Gateway redirija /audit al microservicio correcto
            const res = await apiAudit.get('/audit');
            setLogs(res.data);
        } catch (error) {
            console.error("Error cargando logs", error);
        } finally {
            setLoading(false);
        }
    };

    // Función simple para formatear fecha
    const formatDate = (isoString) => {
        if (!isoString) return '-';
        return new Date(isoString).toLocaleString('es-AR');
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8 flex justify-center">
            <div className="w-full max-w-6xl">
                <div className="flex items-center gap-4 mb-8 border-b border-gray-700 pb-4">
                    <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white text-2xl">←</button>
                    <h2 className="text-3xl font-bold text-red-500">🛡️ Panel de Administración</h2>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-4 py-2 rounded font-bold ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'}`}
                    >
                        👥 Usuarios
                    </button>
                    <button
                        onClick={() => setActiveTab('logs')}
                        className={`px-4 py-2 rounded font-bold ${activeTab === 'logs' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-400'}`}
                    >
                        📋 Audit Logs
                    </button>
                </div>

                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 shadow-xl">

                    {/* Tabla de usuarios */}
                    {activeTab === 'users' && (
                        <div>
                            {loading ? <p>Cargando...</p> : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {users.map(u => (
                                        <div key={u.email} className="bg-gray-700 p-4 rounded border border-gray-600">
                                            <p className="font-bold text-lg">{u.name}</p>
                                            <p className="text-gray-400 text-sm">{u.email}</p>
                                            <div className="mt-2">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'ADMIN' ? 'bg-red-500 text-white' : 'bg-green-500 text-black'
                                                    }`}>
                                                    {u.role}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tabla logs */}
                    {activeTab === 'logs' && (
                        <div>
                            {loading ? <p className="text-gray-400 text-center">Cargando auditoría...</p> : (
                                <div className="overflow-x-auto rounded-lg border border-gray-700">
                                    <table className="w-full text-left border-collapse bg-gray-900/50">
                                        <thead>
                                            <tr className="text-gray-400 bg-gray-800 border-b border-gray-700 text-xs uppercase tracking-wider">
                                                <th className="p-4">Fecha</th>
                                                <th className="p-4">Evento</th>
                                                <th className="p-4">Usuario</th>
                                                <th className="p-4">Detalle</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-700 text-sm">
                                            {logs.length === 0 ? (
                                                <tr><td colSpan="4" className="p-4 text-center text-gray-500">No hay registros aún.</td></tr>
                                            ) : logs.map((log) => (
                                                <tr key={log.id} className="hover:bg-gray-700/30 transition">
                                                    <td className="p-4 text-gray-400 font-mono text-xs whitespace-nowrap">
                                                        {formatDate(log.timestamp)}
                                                    </td>
                                                    <td className="p-4">
                                                        <span className="bg-purple-500/10 text-purple-400 px-2 py-1 rounded border border-purple-500/20 font-bold text-xs">
                                                            {log.eventType}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 font-bold text-white">
                                                        {log.username}
                                                    </td>
                                                    <td className="p-4 text-gray-300">
                                                        {log.message}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;