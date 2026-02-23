import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { DataService } from '../services/data';
import { Search, Plus, Dumbbell, Edit2, Trash2, X, Save, PlayCircle } from 'lucide-react';
import type { Exercise, MuscleGroup } from '../types';

const MUSCLE_GROUPS: MuscleGroup[] = [
    'Pecho', 'Espalda', 'Hombros', 'Brazos', 'Bíceps', 'Tríceps',
    'Core', 'Piernas', 'Cuádriceps', 'Isquios', 'Glúteos', 'Gemelos',
    'Dorsales', 'Trapecios', 'Cardio', 'Full Body'
];

const ALL_MUSCLES: MuscleGroup[] = [
    'Pecho', 'Dorsales', 'Trapecios', 'Espalda', 'Hombros',
    'Bíceps', 'Tríceps', 'Antebrazos',
    'Core', 'Glúteos', 'Cuádriceps', 'Isquios', 'Gemelos',
    'Piernas', 'Brazos', 'Full Body'
];

export function Exercises() {
    const { exercises, refreshExercises } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | 'All'>('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

    const [formData, setFormData] = useState<Partial<Exercise>>({
        name: '', muscleGroup: 'Full Body', description: '', videoUrl: '', thumbnail: ''
    });
    const [primaryMuscles, setPrimaryMuscles] = useState<MuscleGroup[]>([]);
    const [secondaryMuscles, setSecondaryMuscles] = useState<MuscleGroup[]>([]);

    const openModal = (exercise?: Exercise) => {
        if (exercise) {
            setEditingExercise(exercise);
            setFormData({
                name: exercise.name,
                muscleGroup: exercise.muscleGroup,
                description: exercise.description || '',
                videoUrl: exercise.videoUrl || '',
                thumbnail: exercise.thumbnail || ''
            });
            setPrimaryMuscles(exercise.primaryMuscles ?? []);
            setSecondaryMuscles(exercise.secondaryMuscles ?? []);
        } else {
            setEditingExercise(null);
            setFormData({ name: '', muscleGroup: 'Full Body', description: '', videoUrl: '', thumbnail: '' });
            setPrimaryMuscles([]);
            setSecondaryMuscles([]);
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!formData.name) return alert('El nombre es obligatorio');

        const exerciseToSave: Exercise = {
            id: editingExercise ? editingExercise.id : crypto.randomUUID(),
            name: formData.name!,
            muscleGroup: (primaryMuscles[0] ?? formData.muscleGroup) as MuscleGroup,
            primaryMuscles: primaryMuscles.length > 0 ? primaryMuscles : undefined,
            secondaryMuscles: secondaryMuscles.length > 0 ? secondaryMuscles : undefined,
            description: formData.description,
            videoUrl: formData.videoUrl,
            thumbnail: formData.thumbnail,
            isCustom: true
        };

        try {
            if (editingExercise) {
                await DataService.updateExercise(exerciseToSave);
            } else {
                await DataService.createExercise(exerciseToSave);
            }
            await refreshExercises();
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
            alert('Error al guardar ejercicio');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar ejercicio?')) return;
        try {
            await DataService.deleteExercise(id);
            await refreshExercises();
        } catch (error) {
            console.error(error);
            alert('Error al eliminar ejercicio');
        }
    };

    const filteredExercises = useMemo(() => {
        return exercises.filter(ex => {
            const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesMuscle = selectedMuscle === 'All' || ex.muscleGroup === selectedMuscle;
            return matchesSearch && matchesMuscle;
        });
    }, [exercises, searchTerm, selectedMuscle]);

    const renderPreview = (url?: string) => {
        if (!url) return <DumbbellIcon />;
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            return <PlayCircle size={48} className="text-red-500 opacity-80" />;
        }
        return <img src={url} alt="Preview" className="w-full h-full object-cover" />;
    };

    const togglePrimary = (m: MuscleGroup) => {
        setPrimaryMuscles(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);
        setSecondaryMuscles(prev => prev.filter(x => x !== m));
    };

    const toggleSecondary = (m: MuscleGroup) => {
        setSecondaryMuscles(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);
    };

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white">Ejercicios</h2>
                    <p className="text-gray-400">Biblioteca de movimientos y técnica</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="bg-primary hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 w-full md:w-auto justify-center"
                >
                    <Plus size={20} /> Nuevo Ejercicio
                </button>
            </header>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar ejercicio..."
                        className="w-full bg-secondary border border-gray-800 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 no-scrollbar">
                    <button
                        onClick={() => setSelectedMuscle('All')}
                        className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors border ${selectedMuscle === 'All'
                            ? 'bg-primary text-white border-primary'
                            : 'bg-secondary text-gray-400 border-gray-800 hover:bg-gray-800'
                            }`}
                    >
                        Todos
                    </button>
                    {MUSCLE_GROUPS.map(group => (
                        <button
                            key={group}
                            onClick={() => setSelectedMuscle(group)}
                            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors border ${selectedMuscle === group
                                ? 'bg-primary text-white border-primary'
                                : 'bg-secondary text-gray-400 border-gray-800 hover:bg-gray-800'
                                }`}
                        >
                            {group}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExercises.map(exercise => (
                    <div key={exercise.id} className="bg-secondary rounded-xl overflow-hidden border border-gray-800 hover:border-primary/50 transition-all group flex flex-col">
                        <div className="aspect-video bg-black/50 relative flex items-center justify-center overflow-hidden">
                            {renderPreview(exercise.videoUrl || exercise.thumbnail)}
                            <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-white backdrop-blur-sm">
                                {exercise.muscleGroup}
                            </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                            <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{exercise.name}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">{exercise.description || 'Sin descripción disponible.'}</p>
                            {/* Show specific muscles if available */}
                            {(exercise.primaryMuscles?.length ?? 0) > 0 && (
                                <div className="flex flex-wrap gap-1 mb-3">
                                    {exercise.primaryMuscles!.map(m => (
                                        <span key={m} className="px-1.5 py-0.5 rounded-full text-[10px] bg-primary/20 text-primary border border-primary/30">{m}</span>
                                    ))}
                                    {exercise.secondaryMuscles?.map(m => (
                                        <span key={m} className="px-1.5 py-0.5 rounded-full text-[10px] bg-gray-700/50 text-gray-500 border border-gray-700">{m}</span>
                                    ))}
                                </div>
                            )}
                            <div className="flex gap-2 pt-2 border-t border-gray-800/50">
                                <button
                                    onClick={() => openModal(exercise)}
                                    className="flex-1 bg-gray-700/50 hover:bg-gray-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors"
                                >
                                    <Edit2 size={16} /> Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(exercise.id)}
                                    className="px-3 bg-red-900/10 hover:bg-red-900/30 text-red-500 rounded-lg flex items-center justify-center transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-start justify-center p-4 z-50 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-[#1e1e1e] p-6 rounded-xl w-full max-w-lg border border-gray-800 my-8">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Dumbbell className="text-primary" />
                                {editingExercise ? 'Editar Ejercicio' : 'Nuevo Ejercicio'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)}>
                                <X className="text-gray-400 hover:text-white" />
                            </button>
                        </div>

                        <div className="space-y-5">
                            {/* Name */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Nombre del Ejercicio</label>
                                <input
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-black/40 border border-gray-700 rounded-lg p-3 text-white focus:border-primary outline-none"
                                    placeholder="Ej. Press de Banca Plana"
                                />
                            </div>

                            {/* Primary Muscles */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">
                                    Músculos Primarios
                                    <span className="text-xs text-gray-600 ml-2">(los que más trabaja)</span>
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {ALL_MUSCLES.map(m => (
                                        <button
                                            key={m}
                                            type="button"
                                            onClick={() => togglePrimary(m)}
                                            className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${primaryMuscles.includes(m)
                                                    ? 'bg-primary/30 text-primary border-primary/60'
                                                    : 'bg-black/30 text-gray-500 border-gray-700 hover:border-gray-500'
                                                }`}
                                        >
                                            {m}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Secondary Muscles */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">
                                    Músculos Secundarios
                                    <span className="text-xs text-gray-600 ml-2">(estabilizan / asisten)</span>
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {ALL_MUSCLES.filter(m => !primaryMuscles.includes(m)).map(m => (
                                        <button
                                            key={m}
                                            type="button"
                                            onClick={() => toggleSecondary(m)}
                                            className={`px-2.5 py-1 rounded-full text-xs border transition-all ${secondaryMuscles.includes(m)
                                                    ? 'bg-gray-600/50 text-gray-300 border-gray-500'
                                                    : 'bg-black/30 text-gray-600 border-gray-800 hover:border-gray-600'
                                                }`}
                                        >
                                            {m}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Muscle Group (category fallback) */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Grupo Muscular (categoría)</label>
                                <select
                                    value={formData.muscleGroup}
                                    onChange={e => setFormData({ ...formData, muscleGroup: e.target.value as MuscleGroup })}
                                    className="w-full bg-black/40 border border-gray-700 rounded-lg p-3 text-white focus:border-primary outline-none"
                                >
                                    {MUSCLE_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                                </select>
                            </div>

                            {/* Video URL */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">URL de Video / GIF</label>
                                <div className="relative">
                                    <PlayCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                                    <input
                                        value={formData.videoUrl}
                                        onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                                        className="w-full bg-black/40 border border-gray-700 rounded-lg pl-10 pr-3 py-3 text-white focus:border-primary outline-none"
                                        placeholder="https://... (GIF o YouTube)"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Recomendado: GIFs de Giphy o Tenor para reproducción automática.</p>
                            </div>

                            {formData.videoUrl && (
                                <div className="rounded-lg overflow-hidden border border-gray-700 h-32 bg-black/50 flex items-center justify-center">
                                    <img src={formData.videoUrl} alt="Preview" className="h-full object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                                    <span className="absolute text-xs text-gray-500 pointer-events-none">Vista previa</span>
                                </div>
                            )}

                            {/* Description */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Descripción / Técnica</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-black/40 border border-gray-700 rounded-lg p-3 text-white h-24 resize-none focus:border-primary outline-none"
                                    placeholder="Explicación breve de la técnica correcta..."
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-6 flex gap-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-1 bg-primary hover:bg-red-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
                            >
                                <Save size={20} /> Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function DumbbellIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48" height="48" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="1"
            strokeLinecap="round" strokeLinejoin="round"
            className="text-gray-700"
        >
            <path d="m6.5 6.5 11 11" />
            <path d="m21 21-1-1" />
            <path d="m3 3 1 1" />
            <path d="m18 22 4-4" />
            <path d="m2 6 4-4" />
            <path d="m3 10 7.9-7.9a2.1 2.1 0 0 1 2.97 3L2 17l10 1" />
            <path d="m12 9 7.9-7.9a2.1 2.1 0 0 1 2.97 3L11 16l1-10" />
        </svg>
    );
}
