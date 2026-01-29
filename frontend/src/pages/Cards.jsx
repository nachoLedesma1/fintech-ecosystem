import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import CardComponent from '../components/CardComponent';

const Cards = () => {
    const navigate = useNavigate();
    const [cards, setCards] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estado para el modal de "Pedir Tarjeta"
    const [showModal, setShowModal] = useState(false);
    const [selectedCbu, setSelectedCbu] = useState('');
    const [cardType, setCardType] = useState('DEBIT');

    // Estado Errores 
    const [error, setError] = useState('');
    const [modalError, setModalError] = useState(''); // Error específico del modal
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [cardsRes, accountsRes] = await Promise.all([
                api.get('/cards'),
                api.get('/accounts/me')
            ]);
            setCards(cardsRes.data);
            setAccounts(accountsRes.data);

            // Pre-seleccionar la primera cuenta
            if (accountsRes.data.length > 0) {
                setSelectedCbu(accountsRes.data[0].number);
            }
        } catch (err) {
            console.error("Error cargando datos", err);
            setError('No se pudieron cargar las tarjetas. Intente más tarde.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCard = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setModalError(''); // Limpiar errores previos


        try {
            await api.post('/cards', {
                cbu: selectedCbu,
                type: cardType
            });
            setShowModal(false);
            fetchData(); // Recargar lista
            alert("¡Tarjeta emitida exitosamente!");
        } catch (err) {
            console.error(err);
            // Lógica robusta de error
            let msg = 'Error al emitir tarjeta';
            if (err.response && err.response.data) {
                const d = err.response.data;
                // Buscamos error, message o devolvemos el string directo
                msg = d.error || d.message || (typeof d === 'string' ? d : msg);
            }
            setModalError(msg); // Mostramos el error dentro del modal
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8 flex justify-center">
            <div className="w-full max-w-6xl">

                {/* Header */}
                <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white text-2xl">←</button>
                        <h2 className="text-3xl font-bold">Mis Tarjetas</h2>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-bold shadow-lg transition"
                    >
                        + Nueva Tarjeta
                    </button>
                </div>

                {/* Error de Carga General */}
                {error && (
                    <div className="bg-red-500/20 text-red-400 p-4 rounded mb-6 border border-red-500/30 text-center">
                        {error}
                    </div>
                )}

                {/* Grid de Tarjetas */}
                {loading ? (
                    <p className="text-center text-gray-500">Cargando plásticos...</p>
                ) : cards.length === 0 ? (
                    <div className="text-center py-20 bg-gray-800 rounded-xl border border-gray-700">
                        <p className="text-xl text-gray-400 mb-4">No tienes tarjetas activas.</p>
                        <button onClick={() => setShowModal(true)} className="text-blue-400 underline">¡Solicita la primera gratis!</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {cards.map(card => (
                            // Pasamos la tarjeta al componente visual
                            <CardComponent key={card.id} card={card} />
                        ))}
                    </div>
                )}
                {/* Modal solicitud */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                        <div className="bg-gray-800 p-6 rounded-xl w-full max-w-sm border border-gray-700 shadow-2xl relative">
                            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>

                            <h3 className="text-xl font-bold mb-4 text-white">Solicitar Nueva Tarjeta</h3>

                            {/* Error dentro del Modal */}
                            {modalError && (
                                <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4 text-sm border border-red-500/30">
                                    {modalError}
                                </div>
                            )}

                            <form onSubmit={handleCreateCard} className="space-y-4">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">Cuenta Asociada</label>
                                    <select
                                        className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                                        value={selectedCbu}
                                        onChange={e => setSelectedCbu(e.target.value)}
                                    >
                                        {accounts.map(acc => (
                                            <option key={acc.id} value={acc.number}>
                                                {acc.alias || acc.number} ({acc.currency})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">Tipo de Tarjeta</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer p-3 bg-gray-700 rounded w-full border border-gray-600 hover:bg-gray-600 transition">
                                            <input
                                                type="radio" name="type" value="DEBIT"
                                                checked={cardType === 'DEBIT'}
                                                onChange={() => setCardType('DEBIT')}
                                                className="accent-blue-500"
                                            />
                                            <span className="font-bold text-sm">Débito</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer p-3 bg-gray-700 rounded w-full border border-gray-600 hover:bg-gray-600 transition">
                                            <input
                                                type="radio" name="type" value="CREDIT"
                                                checked={cardType === 'CREDIT'}
                                                onChange={() => setCardType('CREDIT')}
                                                className="accent-orange-500"
                                            />
                                            <span className="font-bold text-sm">Crédito</span>
                                        </label>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={`w-full py-3 rounded text-white font-bold shadow-lg mt-2 transition ${processing
                                            ? 'bg-blue-800 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-500'
                                        }`}
                                >
                                    {processing ? 'Emitiendo...' : 'Confirmar Solicitud'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cards;