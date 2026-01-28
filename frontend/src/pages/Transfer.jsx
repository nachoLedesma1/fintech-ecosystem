import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const Transfer = () => {
    const navigate = useNavigate();
    
    // Estado para guardar las cuentas del usuario (para el select "Desde")
    const [myAccounts, setMyAccounts] = useState([]);
    
    // Estado del formulario
    const [sourceCbu, setSourceCbu] = useState('');
    const [destination, setDestination] = useState(''); // Puede ser CBU o ALIAS
    const [amount, setAmount] = useState('');
    
    // Estado visual (feedback)
    const [status, setStatus] = useState({ loading: false, error: '', success: '' });

    // 1. Cargar mis cuentas al entrar para llenar el "Select"
    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                // Usamos el endpoint que creamos en el paso anterior
                // Si tu controller de cuentas tiene "/api/accounts/me" o "/api/core/accounts/me"
                const response = await api.get('/accounts/me'); 
                setMyAccounts(response.data);
                
                // Seleccionar la primera cuenta por defecto si existe
                if (response.data.length > 0) {
                    setSourceCbu(response.data[0].number);
                }
            } catch (error) {
                console.error("Error cargando cuentas", error);
                setStatus({ ...status, error: 'No se pudieron cargar tus cuentas.' });
            }
        };
        fetchAccounts();
    }, []);

    // 2. Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: '', success: '' });

        // Armamos el objeto tal cual lo pide tu TransferRequest de Java
        const payload = {
            sourceCbu: sourceCbu,       // String
            destinationCbu: destination,// String (Tu backend revisará si es Alias o CBU)
            amount: parseFloat(amount)  // BigDecimal
        };

        try {
            // Llamamos a tu TransactionController: @RequestMapping("/transactions") + @PostMapping("/transfer")
            await api.post('/transactions/transfer', payload);
            
            setStatus({ loading: false, error: '', success: '¡Transferencia enviada con éxito! 💸' });
            
            // Redirigir al Dashboard después de 2 segundos
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);

        } catch (err) {
            console.error(err);
            // Intentamos leer el mensaje de error que lanza tu RuntimeException en Java
            const errorMsg = err.response?.data?.message || err.response?.data || 'Falló la transferencia';
            setStatus({ loading: false, success: '', error: errorMsg });
        }
    };

    // Helper para mostrar el símbolo de moneda de la cuenta seleccionada
    const getSelectedCurrency = () => {
        const account = myAccounts.find(acc => acc.number === sourceCbu);
        return account ? account.currency : '$';
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-lg border border-gray-700">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
                    💸 Nueva Transferencia
                </h2>

                {/* Mensajes de Error / Éxito */}
                {status.error && (
                    <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4 border border-red-500/50">
                        ⚠️ {status.error}
                    </div>
                )}
                {status.success && (
                    <div className="bg-green-500/20 text-green-400 p-3 rounded mb-4 border border-green-500/50">
                        ✅ {status.success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Seleccionar cuenta de origen */}
                    <div>
                        <label className="block text-gray-400 mb-2 font-medium">Pagar desde cuenta:</label>
                        <select
                            value={sourceCbu}
                            onChange={(e) => setSourceCbu(e.target.value)}
                            className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            {myAccounts.map((acc) => (
                                <option key={acc.id} value={acc.number}> 
                                    {/* Asumo que AccountResponseDTO tiene 'cbu' y 'alias' */}
                                    {acc.currency} - {acc.alias || acc.number} (Saldo: ${acc.balance})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/*Destino CBU Alias*/}
                    <div>
                        <label className="block text-gray-400 mb-2 font-medium">Destinatario (CBU o Alias):</label>
                        <input
                            type="text"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            placeholder="Ej: NACHO.PRINCIPAL.ARS"
                            className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-500"
                            required
                        />
                    </div>

                    {/* Monto*/}
                    <div>
                        <label className="block text-gray-400 mb-2 font-medium">Monto a transferir:</label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-400 font-bold">
                                {getSelectedCurrency()}
                            </span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                min="0.01"
                                step="0.01"
                                className="w-full bg-gray-700 text-white p-3 pl-12 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-3 rounded-lg font-bold transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={status.loading}
                            className={`flex-1 py-3 rounded-lg font-bold text-white transition shadow-lg ${
                                status.loading 
                                ? 'bg-blue-800 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/30'
                            }`}
                        >
                            {status.loading ? 'Procesando...' : 'Confirmar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Transfer;