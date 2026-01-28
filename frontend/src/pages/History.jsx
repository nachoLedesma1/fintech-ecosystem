import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const History = () => {
    const { cbu } = useParams(); // Leemos el CBU de la URL
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // Llamamos a tu endpoint: @GetMapping("/{cbu}")
                const response = await api.get(`/transactions/${cbu}`);
                setTransactions(response.data);
            } catch (error) {
                console.error("Error al cargar historial", error);
            } finally {
                setLoading(false);
            }
        };

        if (cbu) fetchHistory();
    }, [cbu]);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
            <button 
                onClick={() => navigate('/dashboard')}
                className="mb-6 text-gray-400 hover:text-white flex items-center gap-2 transition"
            >
                ← Volver al Dashboard
            </button>

            <h2 className="text-3xl font-bold mb-6 border-b border-gray-700 pb-4">
                📜 Historial de Movimientos
            </h2>

            {loading ? (
                <div className="text-center mt-10">Cargando movimientos...</div>
            ) : transactions.length === 0 ? (
                <div className="text-center text-gray-500 mt-10 bg-gray-800 p-8 rounded-xl">
                    No hay movimientos registrados en esta cuenta.
                </div>
            ) : (
                <div className="space-y-4 max-w-4xl mx-auto">
                    {transactions.map((tx) => (
                        <div 
                            key={tx.id} 
                            className="bg-gray-800 p-4 rounded-lg flex justify-between items-center border-l-4 border-gray-700 hover:bg-gray-750 transition shadow-md"
                        >
                            <div>
                                <p className="font-bold text-lg">{tx.description}</p>
                                <p className="text-sm text-gray-400">
                                    {new Date(tx.timestamp).toLocaleString()}
                                </p>
                            </div>
                            <div className={`text-xl font-mono font-bold ${
                                tx.amount < 0 ? 'text-red-400' : 'text-green-400'
                            }`}>
                                {tx.amount < 0 ? '-' : '+'} $ {Math.abs(tx.amount).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;