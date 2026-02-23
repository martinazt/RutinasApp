import { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, Dumbbell, Sparkles, Plus } from 'lucide-react';
import type { RoutineExercise } from '../types';
import { optimizeRoutine, getActiveMusclesDetailed, analyzeRisks, suggestExercises } from '../utils/ai-optimizer';

export function RoutineEditor() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { students, exercises: allExercises, addRoutine, routines } = useApp();

    const [name, setName] = useState('');
    const [studentId, setStudentId] = useState('');
    const [selectedExercises, setSelectedExercises] = useState<RoutineExercise[]>([]);

    useEffect(() => {
        if (id) {
            const routineToEdit = routines.find(r => r.id === id);
            if (routineToEdit) {
                setName(routineToEdit.name);
                setStudentId(routineToEdit.studentId);
                setSelectedExercises(routineToEdit.exercises);
            }
        }
    }, [id, routines]);

    const { primary: primaryMuscles, secondary: secondaryMuscles } = getActiveMusclesDetailed(selectedExercises, allExercises);

    const [optimized, setOptimized] = useState(false);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isSuggesting, setIsSuggesting] = useState(false);

    const selectedStudent = useMemo(() =>
        students.find(s => s.id === studentId),
        [students, studentId]);

    const handleOptimize = () => {
        if (selectedExercises.length < 2) {
            alert('Agrega al menos 2 ejercicios para optimizar el orden');
            return;
        }
        const result = optimizeRoutine(selectedExercises, allExercises);
        setSelectedExercises(result);
        setOptimized(true);
        setTimeout(() => setOptimized(false), 2500);
    };

    const handleSuggest = () => {
        if (!studentId || !selectedStudent) {
            alert('Selecciona un alumno primero para obtener sugerencias personalizadas');
            return;
        }
        setIsSuggesting(true);
        const suggested = suggestExercises(selectedStudent, selectedExercises, allExercises);
        setSuggestions(suggested);
        setIsSuggesting(false);
    };

    const addSuggested = (ex: any) => {
        setSelectedExercises([
            ...selectedExercises,
            {
                exerciseId: ex.id,
                sets: 3,
                reps: '12',
                restSeconds: 60
            }
        ]);
        setSuggestions(prev => prev.filter(s => s.id !== ex.id));
    };

    const riskAnalysis = useMemo(() => {
        if (!selectedStudent) return { hasRisks: false, warnings: [] };
        return analyzeRisks(selectedExercises, allExercises, selectedStudent);
    }, [selectedExercises, selectedStudent, allExercises]);


    // Temporary state for the exercise being added
    const [currentExerciseId, setCurrentExerciseId] = useState('');
    const [sets, setSets] = useState(3);
    const [reps, setReps] = useState('10');
    const [restSeconds, setRestSeconds] = useState<number | undefined>(undefined);
    const [exNotes, setExNotes] = useState('');

    const handleAddExercise = () => {
        if (!currentExerciseId) return;
        setSelectedExercises([
            ...selectedExercises,
            {
                exerciseId: currentExerciseId,
                sets,
                reps,
                restSeconds: restSeconds || undefined,
                notes: exNotes || undefined
            }
        ]);
        setCurrentExerciseId('');
        setRestSeconds(undefined);
        setExNotes('');
    };

    const handleSave = () => {
        if (!name || !studentId) return;

        addRoutine({
            id: id || crypto.randomUUID(),
            name,
            studentId,
            exercises: selectedExercises,
            createdAt: id ? (routines.find(r => r.id === id)?.createdAt || new Date().toISOString()) : new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            tags: id ? (routines.find(r => r.id === id)?.tags) : ['Nueva']
        });
        navigate('/routines');
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-10">
            <header className="flex justify-between items-center gap-2">
                <h2 className="text-xl md:text-2xl font-bold">{id ? 'Editar Rutina' : 'Nueva Rutina'}</h2>
                <button
                    onClick={handleSave}
                    className="bg-primary hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold transition-colors"
                >
                    <Save size={18} />
                    <span className="hidden sm:inline">Guardar Rutina</span>
                    <span className="sm:hidden">Guardar</span>
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="bg-secondary p-6 rounded-xl border border-gray-800 space-y-4 shadow-sm">
                    <h3 className="font-semibold text-lg border-b border-gray-700 pb-2">Información General</h3>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Nombre de la Rutina</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full bg-black/40 border border-gray-700 rounded-lg p-2 text-white outline-none focus:border-primary transition-colors"
                            placeholder="Ej. Hipertrofia Día 1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Alumno Asignado</label>
                        <select
                            value={studentId}
                            onChange={e => setStudentId(e.target.value)}
                            className="w-full bg-black/40 border border-gray-700 rounded-lg p-2 text-white outline-none focus:border-primary transition-colors"
                        >
                            <option value="">Seleccionar Alumno</option>
                            {students.map(s => (
                                <option key={s.id} value={s.id}>{s.name} ({s.goal})</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Exercise Selector */}
                <div className="bg-secondary p-6 rounded-xl border border-gray-800 space-y-4 shadow-sm">
                    <h3 className="font-semibold text-lg border-b border-gray-700 pb-2">Agregar Ejercicios</h3>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Ejercicio</label>
                        <select
                            value={currentExerciseId}
                            onChange={e => setCurrentExerciseId(e.target.value)}
                            className="w-full bg-black/40 border border-gray-700 rounded-lg p-2 text-white outline-none focus:border-primary transition-colors"
                        >
                            <option value="">Buscar ejercicio...</option>
                            {allExercises.map(ex => (
                                <option key={ex.id} value={ex.id}>{ex.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className="block text-sm text-gray-400 mb-1">Series</label>
                            <input type="number" value={sets} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSets(Number(e.target.value))} className="w-full bg-black/40 border border-gray-700 rounded-lg p-2 text-white outline-none focus:border-primary transition-colors" />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm text-gray-400 mb-1">Reps</label>
                            <input type="text" value={reps} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReps(e.target.value)} className="w-full bg-black/40 border border-gray-700 rounded-lg p-2 text-white outline-none focus:border-primary transition-colors" placeholder="10 / 8-12" />
                        </div>
                        <div className="w-20">
                            <label className="block text-sm text-gray-400 mb-1">Desc. (s)</label>
                            <input type="number" value={restSeconds ?? ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRestSeconds(e.target.value ? Number(e.target.value) : undefined)} className="w-full bg-black/40 border border-gray-700 rounded-lg p-2 text-white outline-none focus:border-primary transition-colors" placeholder="60" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Nota (opcional)</label>
                        <input type="text" value={exNotes} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setExNotes(e.target.value)} className="w-full bg-black/40 border border-gray-700 rounded-lg p-2 text-white outline-none focus:border-primary transition-colors" placeholder="Ej. Agarre supino, controlar excéntrico..." />
                    </div>
                    <button onClick={handleAddExercise} className="w-full bg-gray-700 hover:bg-gray-600 py-2 rounded-lg text-white font-medium transition-colors">
                        Agregar a la lista
                    </button>

                    {/* AI Tools */}
                    <div className="mt-6 pt-6 border-t border-gray-800">
                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                            <Sparkles className="text-yellow-400" size={20} />
                            Tools IA
                        </h3>
                        <div className="space-y-3">
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSuggest}
                                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2.5 rounded-lg hover:opacity-90 transition-all font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/10"
                                >
                                    <Sparkles size={16} />
                                    {isSuggesting ? 'Pensando...' : 'Sugerir Ejercicios'}
                                </button>
                                <button
                                    onClick={handleOptimize}
                                    className={`px-3 rounded-lg border border-gray-700 hover:bg-gray-700 transition-all ${optimized ? 'bg-green-600 border-green-500 text-white' : 'text-gray-400'}`}
                                    title="Optimizar Orden"
                                >
                                    {optimized ? '✓' : '⇅'}
                                </button>
                            </div>

                            {/* Suggestions List */}
                            {suggestions.length > 0 && (
                                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                                    <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Sugerencias para {selectedStudent?.goal}</p>
                                    {suggestions.map(ex => (
                                        <div key={ex.id} className="flex items-center justify-between p-2 bg-gradient-to-r from-purple-900/10 to-transparent border border-purple-500/20 rounded-lg">
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold text-white truncate">{ex.name}</p>
                                                <p className="text-[10px] text-gray-500">{ex.muscleGroup}</p>
                                            </div>
                                            <button
                                                onClick={() => addSuggested(ex)}
                                                className="bg-purple-600 hover:bg-purple-500 text-white p-1 rounded transition-colors"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Músculos trabajados */}
                            {(primaryMuscles.length > 0 || secondaryMuscles.length > 0) && (
                                <div className="mt-4 bg-black/40 rounded-lg p-3">
                                    <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                                        <Dumbbell size={12} /> Músculos trabajados
                                    </p>
                                    {primaryMuscles.length > 0 && (
                                        <div className="mb-2">
                                            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Primarios</p>
                                            <div className="flex flex-wrap gap-1">
                                                {primaryMuscles.map(m => (
                                                    <span key={m} className="px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/40">
                                                        {m}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {secondaryMuscles.length > 0 && (
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Secundarios</p>
                                            <div className="flex flex-wrap gap-1">
                                                {secondaryMuscles.map(m => (
                                                    <span key={m} className="px-2 py-0.5 rounded-full text-xs text-gray-400 border border-gray-700">
                                                        {m}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* AI Warnings */}
                    {riskAnalysis.hasRisks && (
                        <div className="bg-red-900/20 border border-red-900/50 p-4 rounded-xl animate-pulse mt-4">
                            <h4 className="text-red-400 font-bold flex items-center gap-2 mb-2">
                                <Sparkles size={18} />
                                AI Health Check: Precaución
                            </h4>
                            <ul className="list-disc list-inside text-sm text-red-200 space-y-1">
                                {riskAnalysis.warnings.map((w, i) => (
                                    <li key={i}>{w}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Routine Preview */}
            <div className="bg-secondary p-6 rounded-xl border border-gray-800 shadow-sm">
                <h3 className="font-semibold text-lg mb-4">Ejercicios Seleccionados ({selectedExercises.length})</h3>
                {selectedExercises.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No hay ejercicios agregados aún.</p>
                ) : (
                    <div className="space-y-2">
                        {selectedExercises.map((ex, idx) => {
                            const exerciseDef = allExercises.find(e => e.id === ex.exerciseId);
                            return (
                                <div key={idx} className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-white truncate">{exerciseDef?.name}</p>
                                        {ex.notes && <p className="text-xs text-gray-500 truncate mt-0.5 italic">{ex.notes}</p>}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-400 ml-3 flex-shrink-0">
                                        <span className="font-mono">{ex.sets}×{ex.reps}</span>
                                        {ex.restSeconds && <span className="text-[10px] bg-gray-700 px-1.5 py-0.5 rounded uppercase">{ex.restSeconds >= 60 ? `${Math.floor(ex.restSeconds / 60)}min` : `${ex.restSeconds}s`}</span>}
                                        <button onClick={() => {
                                            setSelectedExercises(prev => prev.filter((_, i) => i !== idx));
                                        }} className="text-red-400 hover:text-red-300 p-1 rounded-lg hover:bg-red-400/10 transition-colors">
                                            <X size={18} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
