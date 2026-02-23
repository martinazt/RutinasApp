import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, FileText, Download, Trash2, Edit, Copy, Timer, Eye, X, Dumbbell, Clock, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import { RestTimer } from '../components/tools/RestTimer';
import { getActiveMusclesDetailed } from '../utils/ai-optimizer';

export function Routines() {
    const { routines, students, gyms, exercises, getStudentName, addRoutine } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const [studentFilter, setStudentFilter] = useState('all');
    const [showTimer, setShowTimer] = useState(false);
    const [viewRoutine, setViewRoutine] = useState<any | null>(null);

    const handleDuplicate = (routine: any) => {
        const newRoutine = {
            ...routine,
            id: crypto.randomUUID(),
            name: `${routine.name} (Copia)`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        addRoutine(newRoutine);
    };

    const filteredRoutines = routines.filter(routine => {
        const studentName = getStudentName(routine.studentId).toLowerCase();
        const routineName = routine.name.toLowerCase();
        const searchLower = searchTerm.toLowerCase();

        const matchesSearch = routineName.includes(searchLower) || studentName.includes(searchLower);
        const matchesStudent = studentFilter === 'all' || routine.studentId === studentFilter;

        return matchesSearch && matchesStudent;
    });

    const generatePDF = async (routine: any) => {
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const student = students.find(s => s.id === routine.studentId);
        const gym = gyms.find(g => g.id === student?.gymId);
        const pageW = 210;
        const pageH = 297;
        const margin = 15;
        const contentW = pageW - margin * 2;

        // ── HEADER ─────────────────────────────────────────────────
        doc.setFillColor(20, 20, 20);
        doc.rect(0, 0, pageW, 42, 'F');

        if (gym?.logoUrl) {
            try {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                await new Promise<void>((res, rej) => {
                    img.onload = () => res();
                    img.onerror = () => rej();
                    img.src = gym.logoUrl!;
                });
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                canvas.getContext('2d')!.drawImage(img, 0, 0);
                const dataUrl = canvas.toDataURL('image/png');
                doc.addImage(dataUrl, 'PNG', margin, 8, 24, 24);
            } catch { /* skip logo if error */ }
        }

        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text(gym?.name || 'Gimnasio', gym?.logoUrl ? margin + 27 : margin, 20);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(180, 180, 180);
        doc.text(gym?.location || 'Plan de Entrenamiento Personalizado', gym?.logoUrl ? margin + 27 : margin, 28);

        doc.setFillColor(239, 68, 68);
        doc.rect(0, 42, pageW, 3, 'F');

        // ── ROUTINE TITLE ──────────────────────────────────────────
        let y = 55;
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 30, 30);
        doc.text(routine.name, margin, y);

        if (routine.tags?.length) {
            let tagX = margin + doc.getTextWidth(routine.name) + 4;
            routine.tags.forEach((tag: string) => {
                doc.setFillColor(239, 68, 68);
                doc.roundedRect(tagX, y - 4.5, doc.getTextWidth(tag) + 6, 6.5, 1.5, 1.5, 'F');
                doc.setFontSize(8);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(255, 255, 255);
                doc.text(tag, tagX + 3, y);
                tagX += doc.getTextWidth(tag) + 9;
            });
        }

        // ── STUDENT INFO BOX ───────────────────────────────────────
        y += 10;
        doc.setFillColor(247, 247, 247);
        doc.roundedRect(margin, y, contentW, 22, 2, 2, 'F');
        doc.setDrawColor(220, 220, 220);
        doc.roundedRect(margin, y, contentW, 22, 2, 2, 'S');

        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100, 100, 100);
        doc.text('ALUMNO', margin + 5, y + 7);
        doc.text('OBJETIVO', margin + 70, y + 7);
        doc.text('FECHA', margin + 130, y + 7);

        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(20, 20, 20);
        doc.text(student?.name || 'Sin asignar', margin + 5, y + 16);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(student?.goal || '-', margin + 70, y + 16);
        doc.text(new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' }), margin + 130, y + 16);

        // ── EXERCISES TABLE ────────────────────────────────────────
        y += 30;

        // Column positions — notes now has enough space
        // ExName: margin+9 .. sets col, Notes: last wide col
        const cols = {
            num: margin + 4,
            ex: margin + 9,
            sets: margin + 88,
            reps: margin + 108,
            rest: margin + 128,
            notes: margin + 150
        };
        const noteColW = pageW - margin - (margin + 150) - 2; // ~40mm

        // Table header
        doc.setFillColor(30, 30, 30);
        doc.rect(margin, y, contentW, 8, 'F');

        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text('EJERCICIO', cols.ex, y + 5.5);
        doc.text('SERIES', cols.sets, y + 5.5);
        doc.text('REPS', cols.reps, y + 5.5);
        doc.text('DESC.', cols.rest, y + 5.5);
        doc.text('OBSERVACIONES', cols.notes, y + 5.5);
        y += 8;

        // Rows — notes go in the NOTES COLUMN, not below the name
        routine.exercises.forEach((re: any, idx: number) => {
            const exName = exercises.find((e: any) => e.id === re.exerciseId)?.name || `Ejercicio ${idx + 1}`;
            const rowH = 9;
            const isEven = idx % 2 === 0;

            if (y + rowH > pageH - 30) {
                doc.addPage();
                y = 20;
            }

            // Row background
            doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 248, isEven ? 255 : 250);
            doc.rect(margin, y, contentW, rowH, 'F');

            // Number circle
            doc.setFillColor(239, 68, 68);
            doc.circle(cols.num, y + 4.5, 2.8, 'F');
            doc.setFontSize(7);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(255, 255, 255);
            doc.text(String(idx + 1), cols.num, y + 5.3, { align: 'center' });

            // Exercise name (truncated to fit before sets col)
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(20, 20, 20);
            const maxNameChars = 32;
            const truncName = exName.length > maxNameChars ? exName.substring(0, maxNameChars - 1) + '…' : exName;
            doc.text(truncName, cols.ex, y + 5.5);

            // Values
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(60, 60, 60);
            doc.text(String(re.sets ?? '-'), cols.sets, y + 5.5);
            doc.text(String(re.reps ?? '-'), cols.reps, y + 5.5);
            const rest = re.restSeconds
                ? (re.restSeconds >= 60 ? `${Math.floor(re.restSeconds / 60)}min` : `${re.restSeconds}s`)
                : '-';
            doc.text(rest, cols.rest, y + 5.5);

            // Notes in COLUMN (not below name)
            if (re.notes) {
                doc.setFontSize(7.5);
                doc.setFont('helvetica', 'italic');
                doc.setTextColor(80, 80, 80);
                // Wrap to fit column width
                const wrappedNote = doc.splitTextToSize(re.notes, noteColW);
                doc.text(wrappedNote[0], cols.notes, y + 5.5); // Only 1 line per row
            } else {
                doc.setFontSize(7.5);
                doc.setTextColor(180, 180, 180);
                doc.text('-', cols.notes, y + 5.5);
            }

            // Row separator
            doc.setDrawColor(220, 220, 220);
            doc.line(margin, y + rowH, margin + contentW, y + rowH);
            y += rowH;
        });

        // ── MUSCLE SUMMARY ──────────────────────────────────────────
        y += 6;
        const { primary, secondary } = getActiveMusclesDetailed(routine.exercises, exercises);
        const allMuscles = [...primary, ...secondary];

        if (allMuscles.length > 0) {
            // Check if enough space, else new page
            if (y + 24 > pageH - 20) {
                doc.addPage();
                y = 20;
            }

            // Section title
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(30, 30, 30);
            doc.text('MÚSCULOS TRABAJADOS', margin, y + 5);

            // Red underline
            doc.setFillColor(239, 68, 68);
            doc.rect(margin, y + 6.5, 50, 0.8, 'F');

            y += 10;

            // Pills for primary muscles
            let pillX = margin;
            const pillH = 6;
            const pillPad = 4;

            primary.forEach((m: string) => {
                doc.setFontSize(8);
                const w = doc.getTextWidth(m) + pillPad * 2;
                if (pillX + w > pageW - margin) { pillX = margin; y += pillH + 2; }
                doc.setFillColor(239, 68, 68);
                doc.roundedRect(pillX, y, w, pillH, 1.5, 1.5, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFont('helvetica', 'bold');
                doc.text(m, pillX + pillPad, y + 4.3);
                pillX += w + 2;
            });

            secondary.forEach((m: string) => {
                doc.setFontSize(8);
                const w = doc.getTextWidth(m) + pillPad * 2;
                if (pillX + w > pageW - margin) { pillX = margin; y += pillH + 2; }
                doc.setFillColor(80, 80, 80);
                doc.roundedRect(pillX, y, w, pillH, 1.5, 1.5, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFont('helvetica', 'normal');
                doc.text(m, pillX + pillPad, y + 4.3);
                pillX += w + 2;
            });

            y += pillH + 4;

            // Legend
            doc.setFontSize(7.5);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(130, 130, 130);
            doc.setFillColor(239, 68, 68);
            doc.rect(margin, y + 0.5, 3, 3, 'F');
            doc.text('Principal', margin + 5, y + 3.5);
            doc.setFillColor(80, 80, 80);
            doc.rect(margin + 24, y + 0.5, 3, 3, 'F');
            doc.text('Secundario', margin + 29, y + 3.5);
        }

        // ── FOOTER ─────────────────────────────────────────────────
        doc.setFillColor(245, 245, 245);
        doc.rect(0, pageH - 15, pageW, 15, 'F');
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(150, 150, 150);
        doc.text(`Generado el ${new Date().toLocaleDateString('es-AR')} · ${gym?.name || 'FitFlow Pro'}`, margin, pageH - 6);
        doc.text('fitflow.app', pageW - margin, pageH - 6, { align: 'right' });

        doc.save(`${routine.name}_${student?.name || 'alumno'}.pdf`);
    };

    return (
        <div className="space-y-4">
            <header className="flex justify-between items-center gap-2">
                <div className="hidden md:block">
                    <h2 className="text-3xl font-bold text-white">Rutinas</h2>
                    <p className="text-gray-400">Diseña y organiza entrenamientos</p>
                </div>
                <div className="flex gap-2 ml-auto">
                    <button
                        onClick={() => setShowTimer(!showTimer)}
                        className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <Timer size={18} />
                        <span className="hidden sm:inline">Timer</span>
                    </button>
                    <Link
                        to="/routines/new"
                        className="bg-primary hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-semibold"
                    >
                        <Plus size={18} />
                        <span className="hidden sm:inline">Nueva Rutina</span>
                        <span className="sm:hidden">Nueva</span>
                    </Link>
                </div>
            </header>

            {showTimer && <RestTimer onClose={() => setShowTimer(false)} />}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 bg-secondary p-3 rounded-xl border border-gray-800">
                <div className="flex-1 relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por rutina o alumno..."
                        className="w-full bg-black/40 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:border-primary transition-colors outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="w-full sm:w-48">
                    <select
                        className="w-full bg-black/40 border border-gray-700 rounded-lg py-2 px-3 text-sm text-white focus:border-primary transition-colors outline-none"
                        value={studentFilter}
                        onChange={(e) => setStudentFilter(e.target.value)}
                    >
                        <option value="all">Todos los Alumnos</option>
                        {students.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Routines List */}
            <div className="space-y-3">
                {filteredRoutines.map(routine => {
                    const { primary } = getActiveMusclesDetailed(routine.exercises ?? [], exercises);
                    return (
                        <div key={routine.id} className="bg-secondary p-4 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors">
                            <div className="flex items-start gap-4">
                                {/* Icon */}
                                <div className="w-11 h-11 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                                    <FileText size={22} />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-base text-white truncate">{routine.name}</h3>
                                    <p className="text-sm text-gray-400 truncate">Alumno: {getStudentName(routine.studentId)}</p>
                                    {/* Muscle pills */}
                                    {primary.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1.5">
                                            {primary.slice(0, 4).map((m: string) => (
                                                <span key={m} className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-medium">
                                                    {m}
                                                </span>
                                            ))}
                                            {primary.length > 4 && (
                                                <span className="text-[10px] text-gray-500 px-1 py-0.5">+{primary.length - 4}</span>
                                            )}
                                        </div>
                                    )}
                                    {/* Tags */}
                                    {(routine.tags?.length ?? 0) > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {routine.tags!.map((tag: string) => (
                                                <span key={tag} className="text-[10px] bg-gray-700 px-1.5 py-0.5 rounded text-gray-300">{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-800/60">
                                {/* View */}
                                <button
                                    onClick={() => setViewRoutine(routine)}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors text-sm font-medium"
                                    title="Ver rutina"
                                >
                                    <Eye size={16} /> <span className="hidden sm:inline">Ver</span>
                                </button>
                                {/* PDF */}
                                <button
                                    onClick={() => generatePDF(routine)}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-green-400 transition-colors text-sm"
                                    title="Exportar PDF"
                                >
                                    <Download size={16} /> <span className="hidden sm:inline">PDF</span>
                                </button>
                                {/* Duplicate */}
                                <button
                                    onClick={() => handleDuplicate(routine)}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-blue-400 transition-colors text-sm"
                                    title="Duplicar"
                                >
                                    <Copy size={16} /> <span className="hidden sm:inline">Duplicar</span>
                                </button>
                                {/* Edit */}
                                <Link
                                    to={`/routines/edit/${routine.id}`}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-yellow-400 transition-colors text-sm"
                                    title="Editar"
                                >
                                    <Edit size={16} /> <span className="hidden sm:inline">Editar</span>
                                </Link>
                                {/* Delete */}
                                <button
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-gray-400 hover:bg-red-900/30 hover:text-red-400 transition-colors text-sm"
                                    title="Eliminar"
                                >
                                    <Trash2 size={16} /> <span className="hidden sm:inline">Eliminar</span>
                                </button>
                            </div>
                        </div>
                    );
                })}

                {filteredRoutines.length === 0 && (
                    <div className="text-center py-16 text-gray-600">
                        <FileText size={40} className="mx-auto mb-3 opacity-20" />
                        <p className="text-base">No hay rutinas todavía</p>
                        <Link to="/routines/new" className="inline-block mt-3 text-primary hover:text-red-400 text-sm font-medium">
                            + Crear primera rutina
                        </Link>
                    </div>
                )}
            </div>

            {/* ── VIEW ROUTINE MODAL ────────────────────────────────── */}
            {viewRoutine && (
                <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-4">
                    <div className="bg-[#1a1a1a] w-full md:max-w-lg max-h-[92dvh] rounded-t-2xl md:rounded-2xl border border-gray-800 flex flex-col overflow-hidden">
                        {/* Modal header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-800 flex-shrink-0">
                            <div className="min-w-0 flex-1">
                                <h3 className="font-bold text-white text-lg truncate">{viewRoutine.name}</h3>
                                <p className="text-sm text-gray-400 truncate">Alumno: {getStudentName(viewRoutine.studentId)}</p>
                            </div>
                            <button
                                onClick={() => setViewRoutine(null)}
                                className="ml-3 p-2 hover:bg-gray-700 rounded-lg text-gray-400 flex-shrink-0"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Exercises list */}
                        <div className="overflow-y-auto flex-1 p-4 space-y-3">
                            {(viewRoutine.exercises ?? []).length === 0 && (
                                <p className="text-center text-gray-500 py-8">Sin ejercicios cargados</p>
                            )}
                            {(viewRoutine.exercises ?? []).map((re: any, idx: number) => {
                                const exDef = exercises.find((e: any) => e.id === re.exerciseId);
                                const restLabel = re.restSeconds
                                    ? (re.restSeconds >= 60 ? `${Math.floor(re.restSeconds / 60)}min` : `${re.restSeconds}s`)
                                    : null;
                                return (
                                    <div key={idx} className="bg-black/30 border border-gray-800 rounded-xl p-3">
                                        <div className="flex items-center gap-3">
                                            <span className="w-6 h-6 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">
                                                {idx + 1}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-white truncate">{exDef?.name || 'Ejercicio'}</p>
                                                {exDef?.muscleGroup && (
                                                    <p className="text-[11px] text-gray-500">{exDef.muscleGroup}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-3 mt-2 ml-9 text-sm flex-wrap">
                                            <span className="flex items-center gap-1 text-gray-300">
                                                <Dumbbell size={13} className="text-primary" />
                                                {re.sets} series × {re.reps} reps
                                            </span>
                                            {restLabel && (
                                                <span className="flex items-center gap-1 text-gray-400">
                                                    <Clock size={13} /> {restLabel} desc.
                                                </span>
                                            )}
                                        </div>
                                        {re.notes && (
                                            <p className="text-xs text-gray-500 italic mt-1 ml-9">{re.notes}</p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Bottom actions */}
                        <div className="flex gap-2 p-4 border-t border-gray-800 flex-shrink-0">
                            <button
                                onClick={() => generatePDF(viewRoutine)}
                                className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
                            >
                                <Download size={16} /> Descargar PDF
                            </button>
                            <Link
                                to={`/routines/edit/${viewRoutine.id}`}
                                className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-red-600 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
                                onClick={() => setViewRoutine(null)}
                            >
                                <Edit size={16} /> Editar
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
