import { useState } from 'react';
import api from '../api/axiosConfig';

const DepositModal = ({ accounts, onClose, onUpdate }) => {
    // Si hay cuentas, seleccionamos la primera por defecto
    const [selectedCbu, setSelectedCbu] = useState(accounts.length > 0 ? accounts[0].number : '');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ text: '', type: '' });

    const handleDeposit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg({ text: '', type: '' });

        try {
            // Llamada exacta a tu TransactionController
            await api.post('/transactions/deposit', {
                cbu: selectedCbu,        // Campo 'cbu' del DTO TransactionRequest
                amount: parseFloat(amount) // Campo 'amount' del DTO TransactionRequest
            });

            setMsg({ text: '¡Depósito exitoso! 💰', type: 'success' });

            // Esperamos 1.5 seg para que el usuario lea y cerramos
            setTimeout(() => {
                onUpdate(); // Refrescar saldo en Dashboard
                onClose();
            }, 1500);

        } catch (err) {
            console.error("Error depósito:", err);
            
            // Lógica de error robusta (la misma que ya usamos en los otros modales)
            let errorText = 'Error al realizar el depósito';
            if (err.response?.data) {
                const d = err.response.data;
                errorText = d.message || d.error || (typeof d === 'string' ? d : errorText);
            }
            setMsg({ text: errorText, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-gray-800 rounded-xl p-6 w-full max-w-sm border border-gray-700 shadow-2xl relative">
                
                {/* Botón cerrar */}
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>

                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    🏧 Ingresar Dinero
                </h3>

                {msg.text && (
                    <div className={`p-3 rounded mb-4 text-sm font-bold text-center border ${
                        msg.type === 'success' 
                        ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                        : 'bg-red-500/20 text-red-400 border-red-500/30'
                    }`}>
                        {msg.text}
                    </div>
                )}

                <form onSubmit={handleDeposit} className="space-y-4">
                    {/* Selector de Cuenta Destino */}
                    <div>
                        <label className="block text-gray-400 text-sm mb-1 font-bold">Cuenta de Destino</label>
                        <select 
                            className="w-full bg-gray-700 text-white p-3 rounded border border-gray-600 outline-none focus:border-green-500 transition"
                            value={selectedCbu}
                            onChange={(e) => setSelectedCbu(e.target.value)}
                        >
                            {accounts.map(acc => (
                                <option key={acc.id} value={acc.number}>
                                    {acc.alias || 'Sin Alias'} ({acc.currency}) - Saldo: ${acc.balance}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">CBU: {selectedCbu}</p>
                    </div>

                    {/* Input Monto */}
                    <div>
                        <label className="block text-gray-400 text-sm mb-1 font-bold">Monto a Depositar</label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-400">$</span>
                            <input 
                                type="number" 
                                min="1" 
                                step="0.01"
                                placeholder="Ej: 10000"
                                className="w-full bg-gray-700 text-white p-3 pl-8 rounded border border-gray-600 outline-none focus:border-green-500 transition"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={loading || !selectedCbu}
                        className={`w-full py-3 rounded font-bold text-white shadow-lg transition ${
                            loading 
                            ? 'bg-green-800 cursor-not-allowed' 
                            : 'bg-green-600 hover:bg-green-500 shadow-green-600/20'
                        }`}
                    >
                        {loading ? 'Procesando...' : 'Confirmar Depósito'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DepositModal;