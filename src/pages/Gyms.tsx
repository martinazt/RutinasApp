import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DataService } from '../services/data';
import { Plus, Edit2, Trash2, MapPin, Image as ImageIcon, X, Save } from 'lucide-react';
import type { Gym } from '../types';

export function Gyms() {
    const { gyms, refreshGyms } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGym, setEditingGym] = useState<Gym | null>(null);

    // Form State
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [logoUrl, setLogoUrl] = useState('');

    const openModal = (gym?: Gym) => {
        if (gym) {
            setEditingGym(gym);
            setName(gym.name);
            setLocation(gym.location || '');
            setLogoUrl(gym.logoUrl || '');
        } else {
            setEditingGym(null);
            setName('');
            setLocation('');
            setLogoUrl('');
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!name) return alert('El nombre es obligatorio');

        const newGym: Gym = {
            id: editingGym ? editingGym.id : crypto.randomUUID(),
            name,
            location,
            logoUrl
        };

        try {
            if (editingGym) {
                await DataService.updateGym(newGym);
                await refreshGyms();
            } else {
                await DataService.createGym(newGym);
                await refreshGyms();
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
            alert('Error al guardar gimnasio');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este gimnasio?')) return;
        try {
            await DataService.deleteGym(id);
            await refreshGyms();
        } catch (error) {
            console.error(error);
            alert('Error al eliminar gimnasio');
        }
    };

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                        Gimnasios
                    </h2>
                    <p className="text-gray-400">Gestiona las sedes y su branding</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="bg-primary hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <Plus size={20} /> Nuevo Gimnasio
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gyms.map(gym => (
                    <div key={gym.id} className="bg-secondary p-6 rounded-xl border border-gray-800 flex flex-col gap-4 group hover:border-primary/50 transition-colors">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-lg bg-black/40 flex items-center justify-center overflow-hidden border border-gray-700">
                                    {gym.logoUrl ? (
                                        <img src={gym.logoUrl} alt={gym.name} className="w-full h-full object-contain" />
                                    ) : (
                                        <ImageIcon className="text-gray-600" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{gym.name}</h3>
                                    {gym.location && (
                                        <div className="flex items-center gap-1 text-sm text-gray-400">
                                            <MapPin size={14} />
                                            <span>{gym.location}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-auto pt-4 border-t border-gray-800">
                            <button
                                onClick={() => openModal(gym)}
                                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 text-sm"
                            >
                                <Edit2 size={16} /> Editar
                            </button>
                            <button
                                onClick={() => handleDelete(gym.id)}
                                className="px-3 bg-red-900/20 hover:bg-red-900/40 text-red-500 rounded-lg flex items-center justify-center"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-secondary p-6 rounded-xl border border-gray-800 w-full max-w-md space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">{editingGym ? 'Editar Gimnasio' : 'Nuevo Gimnasio'}</h3>
                            <button onClick={() => setIsModalOpen(false)}><X className="text-gray-400" /></button>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Nombre</label>
                            <input
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full bg-black/40 border border-gray-700 rounded-lg p-2 text-white"
                                placeholder="Ej. Sede Central"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Ubicación</label>
                            <input
                                value={location}
                                onChange={e => setLocation(e.target.value)}
                                className="w-full bg-black/40 border border-gray-700 rounded-lg p-2 text-white"
                                placeholder="Ej. Calle Falsa 123"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">URL del Logo (Imagen)</label>
                            <input
                                value={logoUrl}
                                onChange={e => setLogoUrl(e.target.value)}
                                className="w-full bg-black/40 border border-gray-700 rounded-lg p-2 text-white"
                                placeholder="https://..."
                            />
                            {logoUrl && (
                                <div className="mt-2 text-center p-2 bg-white/5 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Vista Previa:</p>
                                    <img src={logoUrl} alt="Preview" className="h-16 mx-auto object-contain" />
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleSave}
                            className="w-full bg-primary hover:bg-red-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 mt-4"
                        >
                            <Save size={20} /> Guardar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
