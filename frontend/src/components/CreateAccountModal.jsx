import { useState } from 'react';
import api from '../api/axiosConfig';

const CreateAccountModal = ({ onClose, onUpdate }) => {
    const [currency, setCurrency] = useState('ARS');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Enviamos el payload exacto que pide tu CreateAccountRequest
            await api.post('/accounts', { currency });
            
            onUpdate(); // Recargar el dashboard
            onClose();
        } catch (err) {
            console.error(err);
            let msg = 'Error al crear cuenta';
            if (err.response?.data) {
                const data = err.response.data;
                msg = data.error || data.message || (typeof data === 'string' ? data : msg);
            }
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-gray-800 rounded-xl p-8 w-full max-w-sm border border-gray-700 shadow-2xl relative">
                
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>

                <h3 className="text-2xl font-bold text-white mb-6 text-center">Nueva Cuenta</h3>

                {error && <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4 text-sm border border-red-500/30">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <label className="block text-gray-400 text-sm font-bold mb-3">Selecciona la Moneda:</label>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <button
                            type="button"
                            onClick={() => setCurrency('ARS')}
                            className={`p-4 rounded-lg border-2 transition flex flex-col items-center gap-2 ${
                                currency === 'ARS' 
                                ? 'border-blue-500 bg-blue-500/10 text-white' 
                                : 'border-gray-600 text-gray-400 hover:border-gray-500'
                            }`}
                        >
                            <span className="text-2xl">🇦🇷</span>
                            <span className="font-bold">Pesos</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setCurrency('USD')}
                            className={`p-4 rounded-lg border-2 transition flex flex-col items-center gap-2 ${
                                currency === 'USD' 
                                ? 'border-green-500 bg-green-500/10 text-white' 
                                : 'border-gray-600 text-gray-400 hover:border-gray-500'
                            }`}
                        >
                            <span className="text-2xl">🇺🇸</span>
                            <span className="font-bold">Dólares</span>
                        </button>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`w-full py-3 rounded-lg font-bold text-white transition shadow-lg ${
                            loading ? 'bg-blue-900 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/30'
                        }`}
                    >
                        {loading ? 'Creando...' : 'Confirmar Apertura'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateAccountModal;