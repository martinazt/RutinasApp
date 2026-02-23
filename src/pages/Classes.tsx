import { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { DataService, generateID } from '../services/data';
import { Plus, Trash2, Calendar, Clock, MapPin, X, Save, Filter, PlusCircle } from 'lucide-react';
import { WeeklySchedule } from '../components/WeeklySchedule';
import type { ClassSession } from '../types';

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

// Helper type for the form
interface ScheduleItem {
    id: string;
    dayOfWeek: number;
    timeStart: string;
}

export function Classes() {
    const { gyms, routines, refreshRoutines } = useApp();
    const [classes, setClasses] = useState<ClassSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [gymFilter, setGymFilter] = useState<string>('all');
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [className, setClassName] = useState('');
    const [gymId, setGymId] = useState('');
    const [isSporadic, setIsSporadic] = useState(false);
    const [specificDate, setSpecificDate] = useState('');
    const [routineId, setRoutineId] = useState('');

    // Multi-schedule state for Fixed Classes
    const [schedules, setSchedules] = useState<ScheduleItem[]>([
        { id: '1', dayOfWeek: 1, timeStart: '10:00' }
    ]);

    // Single schedule for Sporadic
    const [sporadicTime, setSporadicTime] = useState('10:00');

    const fetchClasses = async () => {
        try {
            setLoading(true);
            const data = await DataService.getClasses();
            setClasses(data);
        } catch (error) {
            console.error('Error fetching classes:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    const openModal = () => {
        refreshRoutines(); // Ensure latest routines are loaded
        setClassName('');
        setGymId(gyms[0]?.id || '');
        setIsSporadic(false);
        setSpecificDate('');
        setRoutineId('');
        setSchedules([{ id: generateID(), dayOfWeek: 1, timeStart: '10:00' }]);
        setSporadicTime('10:00');
        setIsModalOpen(true);
    };

    const handleAddSchedule = () => {
        setSchedules([...schedules, { id: generateID(), dayOfWeek: 1, timeStart: '10:00' }]);
    };

    const handleRemoveSchedule = (id: string) => {
        if (schedules.length === 1) return;
        setSchedules(prev => prev.filter(s => s.id !== id));
    };

    const handleScheduleChange = (id: string, field: keyof ScheduleItem, value: any) => {
        setSchedules(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const handleSave = async () => {
        if (!className || !gymId) {
            return alert('Completa el nombre y la sede');
        }

        try {
            if (isSporadic) {
                if (!specificDate) return alert('Selecciona una fecha para el evento');
                // Single sporadic class
                const newClass: ClassSession = {
                    id: generateID(),
                    name: className,
                    gymId,
                    timeStart: sporadicTime,
                    isSporadic: true,
                    specificDate,
                    routineId: routineId || undefined
                };
                await DataService.createClass(newClass);
            } else {
                // Multiple fixed classes
                const promises = schedules.map(s => {
                    const newClass: ClassSession = {
                        id: generateID(),
                        name: className,
                        gymId,
                        timeStart: s.timeStart,
                        dayOfWeek: s.dayOfWeek,
                        isSporadic: false,
                        routineId: routineId || undefined
                    };
                    return DataService.createClass(newClass);
                });
                await Promise.all(promises);
            }

            await fetchClasses();
            setIsModalOpen(false);
        } catch (error: any) {
            console.error('Full error object:', error);
            alert(`Error al crear clase: ${error.message || JSON.stringify(error)}`);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar clase?')) return;
        try {
            await DataService.deleteClass(id);
            await fetchClasses();
        } catch (error) {
            console.error(error);
        }
    };

    const filteredClasses = useMemo(() => {
        let filtered = classes;
        if (gymFilter !== 'all') {
            filtered = filtered.filter(c => c.gymId === gymFilter);
        }
        return filtered.sort((a, b) => {
            const dayA = a.dayOfWeek ?? 7;
            const dayB = b.dayOfWeek ?? 7;
            if (dayA !== dayB) return dayA - dayB;
            return a.timeStart.localeCompare(b.timeStart);
        });
    }, [classes, gymFilter]);

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center gap-2">
                {/* Title hidden on mobile — Layout top bar handles it */}
                <div className="hidden md:block">
                    <h2 className="text-3xl font-bold text-white">Clases y Agenda</h2>
                    <p className="text-gray-400">Organiza tus horarios en cada sede</p>
                </div>
                <button
                    onClick={openModal}
                    className="ml-auto bg-primary hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold"
                >
                    <Plus size={18} />
                    <span className="hidden sm:inline">Nueva Clase</span>
                    <span className="sm:hidden">Nueva</span>
                </button>
            </header>

            {/* Filters */}
            <div className="flex items-center gap-4 bg-secondary p-3 rounded-lg border border-gray-800 w-fit">
                <Filter size={18} className="text-gray-400" />
                <select
                    className="bg-transparent text-white outline-none cursor-pointer"
                    value={gymFilter}
                    onChange={(e) => setGymFilter(e.target.value)}
                >
                    <option value="all">Todas las Sedes</option>
                    {gyms.map(g => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                </select>
            </div>

            {/* View Toggle */}
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setViewMode('calendar')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === 'calendar' ? 'bg-primary text-white' : 'bg-secondary text-gray-400 hover:bg-black/40'}`}
                >
                    Vista Calendario
                </button>
                <button
                    onClick={() => setViewMode('list')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-secondary text-gray-400 hover:bg-black/40'}`}
                >
                    Vista Lista
                </button>
            </div>

            {/* Content */}
            {viewMode === 'calendar' ? (
                <WeeklySchedule classes={filteredClasses} gyms={gyms} routines={routines} onDelete={handleDelete} />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredClasses.map(cls => (
                        <div key={cls.id} className="bg-secondary p-4 rounded-xl border border-gray-800 flex flex-col justify-between hover:border-primary/40 transition-colors">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg">{cls.name}</h3>
                                    <div className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300">
                                        {cls.isSporadic ? 'Evento' : 'Fija'}
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} className="text-primary" />
                                        <span>
                                            {cls.isSporadic && cls.specificDate ? cls.specificDate : DAYS[cls.dayOfWeek || 0]} - {cls.timeStart}hs
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} />
                                        <span>{gyms.find(g => g.id === cls.gymId)?.name}</span>
                                    </div>
                                    {cls.routineId && (
                                        <div className="flex items-center gap-2 text-blue-400">
                                            <Calendar size={16} />
                                            <span>Rutina: {routines.find(r => r.id === cls.routineId)?.name}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={() => handleDelete(cls.id)}
                                className="mt-4 w-full py-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors"
                            >
                                <Trash2 size={16} /> Eliminar
                            </button>
                        </div>
                    ))}

                    {filteredClasses.length === 0 && !loading && (
                        <div className="col-span-full text-center py-10 text-gray-500">
                            No hay clases registradas para esta selección.
                        </div>
                    )}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-0 md:p-4 z-[90] backdrop-blur-sm overflow-y-auto">
                    <div className="bg-[#1e1e1e] p-6 rounded-xl w-full max-w-md border border-gray-800 space-y-4 my-auto modal-mobile-full">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold">Agendar Clase</h3>
                            <button onClick={() => setIsModalOpen(false)}><X className="text-gray-400" /></button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Nombre</label>
                                <input
                                    placeholder="Ej. Clase Funcional"
                                    className="w-full bg-black/40 border border-gray-700 rounded-lg p-2.5 text-white"
                                    value={className}
                                    onChange={e => setClassName(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Sede</label>
                                <select
                                    className="w-full bg-black/40 border border-gray-700 rounded-lg p-2.5 text-white"
                                    value={gymId}
                                    onChange={e => setGymId(e.target.value)}
                                >
                                    <option value="">Seleccionar Sede...</option>
                                    {gyms.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                                </select>
                            </div>

                            <div className="flex items-center gap-2 bg-black/20 p-2 rounded lg">
                                <input
                                    type="checkbox"
                                    id="sporadic"
                                    checked={isSporadic}
                                    onChange={e => setIsSporadic(e.target.checked)}
                                    className="rounded border-gray-700 bg-black/40 text-primary focus:ring-primary"
                                />
                                <label htmlFor="sporadic" className="text-gray-400 text-sm">Es una clase única (evento)</label>
                            </div>

                            {isSporadic ? (
                                <div className="space-y-3 p-3 bg-black/20 rounded-lg border border-gray-800">
                                    <h4 className="font-semibold text-sm text-gray-300">Detalles del Evento</h4>
                                    <input
                                        type="date"
                                        className="w-full bg-black/40 border border-gray-700 rounded-lg p-2.5 text-white"
                                        value={specificDate}
                                        onChange={e => setSpecificDate(e.target.value)}
                                    />
                                    <input
                                        type="time"
                                        className="w-full bg-black/40 border border-gray-700 rounded-lg p-2.5 text-white"
                                        value={sporadicTime}
                                        onChange={e => setSporadicTime(e.target.value)}
                                    />
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="block text-sm text-gray-400">Horarios Semanales</label>
                                        <button onClick={handleAddSchedule} className="text-primary text-xs flex items-center gap-1 hover:text-red-400">
                                            <PlusCircle size={14} /> Agregar Horario
                                        </button>
                                    </div>

                                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                                        {schedules.map((schedule) => (
                                            <div key={schedule.id} className="flex gap-2 items-center">
                                                <select
                                                    className="flex-1 bg-black/40 border border-gray-700 rounded-lg p-2 text-sm text-white"
                                                    value={schedule.dayOfWeek}
                                                    onChange={e => handleScheduleChange(schedule.id, 'dayOfWeek', Number(e.target.value))}
                                                >
                                                    {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
                                                </select>
                                                <input
                                                    type="time"
                                                    className="w-24 bg-black/40 border border-gray-700 rounded-lg p-2 text-sm text-white"
                                                    value={schedule.timeStart}
                                                    onChange={e => handleScheduleChange(schedule.id, 'timeStart', e.target.value)}
                                                />
                                                <button
                                                    onClick={() => handleRemoveSchedule(schedule.id)}
                                                    className="text-gray-500 hover:text-red-500 p-1"
                                                    disabled={schedules.length === 1}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Vincular Rutina (Opcional)</label>
                                <select
                                    className="w-full bg-black/40 border border-gray-700 rounded-lg p-2.5 text-white"
                                    value={routineId}
                                    onChange={e => setRoutineId(e.target.value)}
                                >
                                    <option value="">Ninguna</option>
                                    {routines.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={handleSave}
                            className="w-full bg-primary hover:bg-red-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 mt-4"
                        >
                            <Save size={20} /> Guardar Clases
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
