import { useState } from 'react';
import api from '../api/axiosConfig';

const AliasModal = ({ account, onClose, onUpdate }) => {
    const [newAlias, setNewAlias] = useState(account.alias || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Llamada al endpoint que ya tienes en TransactionController
            await api.put('/transactions/alias', {
                cbu: account.number, // Tu backend pide 'cbu' en el AliasRequest
                alias: newAlias
            });

            // Avisamos al Dashboard que recargue
            onUpdate();
            onClose();
        } catch (err) {
            console.error("Error backend:", err);

            let msg = 'Error al actualizar alias';

            if (err.response && err.response.data) {
                const data = err.response.data;

                // 1. Prioridad: Clave "error" (La que usas en tu GlobalExceptionHandler)
                if (data.error) {
                    msg = data.error;
                }
                // 2. Clave "message" (Estándar de Spring Boot por defecto)
                else if (data.message) {
                    msg = data.message;
                }
                // 3. Texto plano
                else if (typeof data === 'string') {
                    msg = data;
                }
            }

            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-4">Editar Alias</h3>

                <p className="text-sm text-gray-400 mb-2">Cuenta: {account.number}</p>
                <p className="text-sm text-gray-400 mb-6">Moneda: {account.currency}</p>

                {error && (
                    <div className="bg-red-500/20 text-red-400 p-2 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <label className="block text-gray-300 text-sm font-bold mb-2">Nuevo Alias</label>
                    <input
                        type="text"
                        value={newAlias}
                        onChange={(e) => setNewAlias(e.target.value.toUpperCase())} // Alias suele ser Mayusculas
                        className="w-full bg-gray-700 text-white p-3 rounded border border-gray-600 focus:outline-none focus:border-blue-500 mb-6"
                        placeholder="Ej: MI.ALIAS.NUEVO"
                        pattern="^[A-Z0-9.]+$"
                        title="Solo letras, números y puntos"
                        required
                    />

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-300 hover:text-white transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded transition shadow-lg disabled:opacity-50"
                        >
                            {loading ? 'Guardando...' : 'Guardar Alias'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AliasModal;