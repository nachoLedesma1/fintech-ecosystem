import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const Investments = () => {
    const navigate = useNavigate();
    
    // Datos
    const [investments, setInvestments] = useState([]);
    const [accounts, setAccounts] = useState([]);
    
    // Formulario
    const [form, setForm] = useState({
        cbu: '',
        amount: '',
        days: 30 // Mínimo por defecto
    });

    // Simulador
    const [simulation, setSimulation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ text: '', type: '' });

    // Constante TNA (Debe coincidir con Backend: 70%)
    const TNA = 0.70; 

    useEffect(() => {
        fetchData();
    }, []);

    // Cada vez que cambian monto o días, recalculamos la ganancia visualmente
    useEffect(() => {
        if (form.amount > 0 && form.days >= 30) {
            const amount = parseFloat(form.amount);
            const days = parseInt(form.days);
            
            // Misma fórmula que Java: Monto * (TNA / 365) * Días
            const interest = amount * (TNA / 365) * days;
            const final = amount + interest;

            setSimulation({
                interest: interest.toFixed(2),
                final: final.toFixed(2),
                rate: (TNA * 100).toFixed(0) + '%'
            });
        } else {
            setSimulation(null);
        }
    }, [form.amount, form.days]);

    const fetchData = async () => {
        try {
            // Cargar Cuentas (para saber de dónde sacar la plata)
            const accRes = await api.get('/accounts/me');
            setAccounts(accRes.data);
            if (accRes.data.length > 0) {
                setForm(prev => ({ ...prev, cbu: accRes.data[0].number })); // Usamos .number que es el CBU
            }

            // Cargar Inversiones existentes
            const invRes = await api.get('/investments');
            setInvestments(invRes.data);

        } catch (error) {
            console.error("Error cargando datos", error);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg({ text: '', type: '' });

        try {
            // Enviamos el payload tal cual pide InvestmentRequest
            await api.post('/investments', {
                cbu: form.cbu,
                amount: parseFloat(form.amount),
                days: parseInt(form.days)
            });

            setMsg({ text: '¡Inversión creada con éxito! 🚀', type: 'success' });
            fetchData(); // Recargar lista
            setForm({ ...form, amount: '' }); // Limpiar monto
        } catch (err) {
            console.error(err);
            let errorText = 'Error al crear inversión';
            if (err.response?.data) {
                const d = err.response.data;
                errorText = d.error || d.message || (typeof d === 'string' ? d : errorText);
            }
            setMsg({ text: errorText, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8 flex justify-center">
            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Columna izquierda: Formulario y simulador */}
                <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-2">
                        <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white text-xl">←</button>
                        <h2 className="text-3xl font-bold">📈 Nueva Inversión</h2>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                        <h3 className="text-xl font-bold mb-4 text-purple-400">Plazo Fijo</h3>
                        <p className="text-sm text-gray-400 mb-6">Haz crecer tus ahorros con una tasa del <span className="text-white font-bold">{TNA * 100}% TNA</span>.</p>

                        {msg.text && (
                            <div className={`p-3 rounded mb-4 text-sm border ${msg.type === 'success' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                                {msg.text}
                            </div>
                        )}

                        <form onSubmit={handleCreate} className="space-y-4">
                            {/* Seleccionar Cuenta */}
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Origen de Fondos</label>
                                <select 
                                    className="w-full bg-gray-700 text-white p-3 rounded border border-gray-600 focus:border-purple-500 outline-none"
                                    value={form.cbu}
                                    onChange={e => setForm({...form, cbu: e.target.value})}
                                >
                                    {accounts.map(acc => (
                                        <option key={acc.id} value={acc.number}>
                                            {acc.currency} - {acc.alias || acc.number} ($ {acc.balance})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Monto */}
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Monto a Invertir</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 text-gray-400">$</span>
                                    <input 
                                        type="number" 
                                        required min="1" step="0.01"
                                        className="w-full bg-gray-700 text-white p-3 pl-8 rounded border border-gray-600 focus:border-purple-500 outline-none"
                                        value={form.amount}
                                        onChange={e => setForm({...form, amount: e.target.value})}
                                    />
                                </div>
                            </div>

                            {/* Días */}
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Duración (Días)</label>
                                <input 
                                    type="number" 
                                    required min="30" max="365"
                                    className="w-full bg-gray-700 text-white p-3 rounded border border-gray-600 focus:border-purple-500 outline-none"
                                    value={form.days}
                                    onChange={e => setForm({...form, days: e.target.value})}
                                />
                                <p className="text-xs text-gray-500 mt-1">Mínimo 30 días.</p>
                            </div>

                            {/* Tarjeta de simulación visual  */}
                            {simulation && (
                                <div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-lg mt-4 animate-pulse-once">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-300">Interés Ganado:</span>
                                        <span className="text-green-400 font-bold">+ $ {simulation.interest}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold border-t border-purple-500/30 pt-2">
                                        <span className="text-white">Recibirás:</span>
                                        <span className="text-white">$ {simulation.final}</span>
                                    </div>
                                </div>
                            )}

                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 rounded font-bold transition shadow-lg shadow-purple-600/20 mt-4"
                            >
                                {loading ? 'Constituyendo...' : 'Confirmar Inversión'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Columna derecha: Mis inversiones*/}
                <div>
                    <h3 className="text-2xl font-bold mb-6 text-gray-200">Mis Inversiones</h3>
                    
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {investments.length === 0 ? (
                            <div className="text-center py-10 bg-gray-800 rounded-xl border border-gray-700 text-gray-500">
                                No tienes inversiones activas. <br/> ¡Empieza hoy! 🚀
                            </div>
                        ) : (
                            investments.map(inv => (
                                <div key={inv.id} className="bg-gray-800 p-5 rounded-xl border border-gray-700 relative overflow-hidden group hover:border-purple-500/50 transition">
                                    <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-lg ${
                                        inv.active ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-300'
                                    }`}>
                                        {inv.active ? 'ACTIVA' : 'FINALIZADA'}
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-gray-400 text-xs uppercase font-bold">Capital Invertido</p>
                                        <p className="text-xl font-bold text-white">$ {inv.amount}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-500">Finalización</p>
                                            <p className="text-white font-mono">{inv.endDate}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Monto Final</p>
                                            <p className="text-green-400 font-bold">$ {inv.finalAmount}</p>
                                        </div>
                                    </div>
                                    
                                    {inv.active && (
                                        <div className="mt-4 w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                                            {/* Barra de progreso visual (decorativa) */}
                                            <div className="bg-purple-500 h-full w-1/3"></div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Investments;