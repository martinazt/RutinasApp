import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { DataService } from '../services/data';
import { Search, Plus, User, Edit2, Trash2, X, Save, Filter, Activity, HeartPulse } from 'lucide-react';
import type { Student } from '../types';

export function Students() {
    const { students, gyms, refreshStudents } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const [gymFilter, setGymFilter] = useState<string>('all');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<Student>>({
        name: '',
        gymId: '',
        goal: '',
        birthDate: '',
        injuries: '',
        conditions: '',
        observations: '',
        isActive: true
    });

    const openModal = (student?: Student) => {
        if (student) {
            setEditingStudent(student);
            setFormData({
                name: student.name,
                gymId: student.gymId,
                goal: student.goal,
                birthDate: student.birthDate || '',
                injuries: student.injuries || '',
                conditions: student.conditions || '',
                observations: student.observations || '',
                isActive: student.isActive
            });
        } else {
            setEditingStudent(null);
            setFormData({
                name: '',
                gymId: gyms[0]?.id || '',
                goal: '',
                birthDate: '',
                injuries: '',
                conditions: '',
                observations: '',
                isActive: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!formData.name) return alert('El nombre es obligatorio');
        if (!formData.gymId) return alert('Debes seleccionar un gimnasio');

        const studentToSave: Student = {
            id: editingStudent ? editingStudent.id : crypto.randomUUID(),
            name: formData.name,
            gymId: formData.gymId,
            goal: formData.goal || '',
            age: 0, // Legacy, can Calculate from birthDate if needed or ignore
            isActive: formData.isActive ?? true,
            createdAt: editingStudent ? editingStudent.createdAt : new Date().toISOString(),
            // New Fields
            birthDate: formData.birthDate,
            injuries: formData.injuries,
            conditions: formData.conditions,
            observations: formData.observations
        };

        try {
            if (editingStudent) {
                await DataService.updateStudent(studentToSave);
            } else {
                await DataService.createStudent(studentToSave);
            }
            await refreshStudents();
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
            alert('Error al guardar alumno');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este alumno? Se borrarán sus rutinas.')) return;
        try {
            await DataService.deleteStudent(id);
            await refreshStudents();
        } catch (error) {
            console.error(error);
            alert('Error al eliminar alumno');
        }
    };

    const getRecencyStatus = (createdAt: string) => {
        const created = new Date(createdAt);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays < 30) return { label: 'Nuevo', color: 'bg-green-500/20 text-green-400' };
        if (diffDays < 90) return { label: 'Activo', color: 'bg-blue-500/20 text-blue-400' };
        return { label: 'Consolidado', color: 'bg-purple-500/20 text-purple-400' };
    };

    const filteredStudents = useMemo(() => {
        return students.filter(student => {
            const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesGym = gymFilter === 'all' || student.gymId === gymFilter;
            return matchesSearch && matchesGym;
        });
    }, [students, searchTerm, gymFilter]);

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white">Alumnos</h2>
                    <p className="text-gray-400">Gestiona perfiles, salud y objetivos</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="bg-primary hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors w-full md:w-auto justify-center"
                >
                    <Plus size={20} />
                    Nuevo Alumno
                </button>
            </header>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre..."
                        className="w-full bg-secondary border border-gray-800 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative w-full md:w-64">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                    <select
                        className="w-full bg-secondary border border-gray-800 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary appearance-none cursor-pointer"
                        value={gymFilter}
                        onChange={(e) => setGymFilter(e.target.value)}
                    >
                        <option value="all">Todas las Sedes</option>
                        {gyms.map(g => (
                            <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStudents.map(student => {
                    const recency = getRecencyStatus(student.createdAt);
                    return (
                        <div key={student.id} className="bg-secondary p-5 rounded-xl border border-gray-800 hover:border-gray-700 transition-all group flex flex-col">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-xl font-bold text-white overflow-hidden">
                                        {student.avatar ? <img src={student.avatar} className="w-full h-full object-cover" /> : student.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg leading-tight">{student.name}</h3>
                                        <p className="text-xs text-gray-400 mt-0.5">{gyms.find(g => g.id === student.gymId)?.name}</p>
                                    </div>
                                </div>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${recency.color} border border-white/5`}>
                                    {recency.label}
                                </span>
                            </div>

                            <div className="space-y-2 mb-4 text-sm text-gray-400 flex-1">
                                <div className="flex items-center gap-2">
                                    <Activity size={14} className="text-primary" />
                                    <span className="truncate">{student.goal || 'Sin objetivo definido'}</span>
                                </div>
                                {student.injuries && (
                                    <div className="flex items-center gap-2 text-red-400">
                                        <HeartPulse size={14} />
                                        <span className="truncate">Lesiones: {student.injuries}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2 pt-4 border-t border-gray-800">
                                <button
                                    onClick={() => openModal(student)}
                                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors"
                                >
                                    <Edit2 size={16} /> Ver / Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(student.id)}
                                    className="px-3 bg-red-900/20 hover:bg-red-900/40 text-red-500 rounded-lg flex items-center justify-center transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Edit/Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-[#1e1e1e] p-6 rounded-xl w-full max-w-2xl border border-gray-800 my-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold flex items-center gap-2">
                                <User className="text-primary" />
                                {editingStudent ? 'Editar Alumno' : 'Nuevo Alumno'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)}><X className="text-gray-400 hover:text-white" /></button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* General Info */}
                            <div className="space-y-4">
                                <h4 className="font-semibold text-gray-300 border-b border-gray-700 pb-2">Información General</h4>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Nombre Completo</label>
                                    <input
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-black/40 border border-gray-700 rounded-lg p-2.5 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Gimnasio</label>
                                    <select
                                        value={formData.gymId}
                                        onChange={e => setFormData({ ...formData, gymId: e.target.value })}
                                        className="w-full bg-black/40 border border-gray-700 rounded-lg p-2.5 text-white"
                                    >
                                        <option value="">Seleccionar...</option>
                                        {gyms.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Objetivo</label>
                                    <input
                                        value={formData.goal}
                                        onChange={e => setFormData({ ...formData, goal: e.target.value })}
                                        className="w-full bg-black/40 border border-gray-700 rounded-lg p-2.5 text-white"
                                        placeholder="Ej. Hipertrofia, Salud..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Fecha de Nacimiento</label>
                                    <input
                                        type="date"
                                        value={formData.birthDate}
                                        onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                                        className="w-full bg-black/40 border border-gray-700 rounded-lg p-2.5 text-white"
                                    />
                                </div>
                            </div>

                            {/* Health & Profile */}
                            <div className="space-y-4">
                                <h4 className="font-semibold text-gray-300 border-b border-gray-700 pb-2">Datos de Salud</h4>
                                <div>
                                    <label className="block text-sm text-red-400 mb-1 font-medium">Lesiones</label>
                                    <textarea
                                        value={formData.injuries}
                                        onChange={e => setFormData({ ...formData, injuries: e.target.value })}
                                        className="w-full bg-black/40 border border-red-900/30 rounded-lg p-2.5 text-white h-20 resize-none"
                                        placeholder="Ej. Menisco rodilla derecha..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Condiciones Médicas</label>
                                    <input
                                        value={formData.conditions}
                                        onChange={e => setFormData({ ...formData, conditions: e.target.value })}
                                        className="w-full bg-black/40 border border-gray-700 rounded-lg p-2.5 text-white"
                                        placeholder="Ej. Hipertensión, Asma..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Observaciones</label>
                                    <textarea
                                        value={formData.observations}
                                        onChange={e => setFormData({ ...formData, observations: e.target.value })}
                                        className="w-full bg-black/40 border border-gray-700 rounded-lg p-2.5 text-white h-20 resize-none"
                                        placeholder="Notas adicionales..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-4">
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
                                <Save size={20} /> Guardar Alumno
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
