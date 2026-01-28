import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const Contacts = () => {
    const navigate = useNavigate();
    const [contacts, setContacts] = useState([]);
    
    // Estado del formulario (ContactRequest)
    const [formData, setFormData] = useState({ name: '', cbuOrAlias: '' });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', msg: '' });

    // Cargar contactos al entrar
    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const res = await api.get('/contacts');
            setContacts(res.data);
        } catch (error) {
            console.error("Error cargando agenda", error);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', msg: '' });

        try {
            await api.post('/contacts', formData);
            setStatus({ type: 'success', msg: 'Contacto agregado correctamente' });
            setFormData({ name: '', cbuOrAlias: '' }); // Limpiar form
            fetchContacts(); // Recargar lista
        } catch (err) {
            let msg = 'Error al agregar contacto';
            if (err.response?.data) {
                const data = err.response.data;
                msg = data.error || data.message || (typeof data === 'string' ? data : msg);
            }
            setStatus({ type: 'error', msg });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if(!window.confirm("¿Seguro que deseas eliminar este contacto?")) return;
        try {
            await api.delete(`/contacts/${id}`);
            fetchContacts(); // Recargar lista tras borrar
        } catch (error) {
            console.error(error);
            alert("No se pudo eliminar el contacto");
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8 flex justify-center">
            <div className="w-full max-w-4xl">
                {/* Header con botón volver */}
                <div className="flex items-center gap-4 mb-8 border-b border-gray-700 pb-4">
                    <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white text-xl">
                        ←
                    </button>
                    <h2 className="text-3xl font-bold">📒 Agenda de Contactos</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* FORMULARIO DE ALTA */}
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg h-fit">
                        <h3 className="text-xl font-bold mb-4 text-blue-400">Nuevo Contacto</h3>
                        
                        {status.msg && (
                            <div className={`p-3 rounded mb-4 text-sm border ${
                                status.type === 'success' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'
                            }`}>
                                {status.msg}
                            </div>
                        )}

                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Nombre / Referencia</label>
                                <input 
                                    type="text" 
                                    placeholder="Ej: Gimnasio, Mamá, Alquiler"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    className="w-full bg-gray-700 text-white p-3 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">CBU o Alias</label>
                                <input 
                                    type="text" 
                                    placeholder="Ingrese CBU o Alias"
                                    value={formData.cbuOrAlias}
                                    onChange={e => setFormData({...formData, cbuOrAlias: e.target.value})}
                                    className="w-full bg-gray-700 text-white p-3 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                                    required
                                />
                            </div>
                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded font-bold transition shadow-lg mt-2"
                            >
                                {loading ? 'Guardando...' : 'Guardar Contacto'}
                            </button>
                        </form>
                    </div>

                    {/* Lista de contactos */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold mb-2 text-gray-300">Mis Guardados</h3>
                        
                        {contacts.length === 0 ? (
                            <p className="text-gray-500 italic">No tienes contactos guardados.</p>
                        ) : (
                            contacts.map(contact => (
                                <div key={contact.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex justify-between items-center hover:bg-gray-750 transition">
                                    <div className="overflow-hidden">
                                        <p className="font-bold text-white text-lg">{contact.name}</p>
                                        <p className="text-gray-400 text-sm font-mono truncate max-w-[200px]">
                                            {contact.cbuOrAlias || contact.cbu} {/* Ajusta según tu modelo Contact */}
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => handleDelete(contact.id)}
                                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded transition"
                                        title="Eliminar"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Contacts;