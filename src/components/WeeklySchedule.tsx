import { useState } from 'react';
import type { ClassSession, Gym, Routine } from '../types';
import { Clock, MapPin, Trash2, ChevronLeft, ChevronRight, FileText } from 'lucide-react';

interface WeeklyScheduleProps {
    classes: ClassSession[];
    gyms: Gym[];
    routines?: Routine[];
    onDelete: (id: string) => void;
}

const DAYS_FULL = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const DAYS_SHORT = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const TIME_SLOTS = Array.from({ length: 15 }, (_, i) => i + 7); // 7:00 to 21:00

export function WeeklySchedule({ classes, gyms, routines = [], onDelete }: WeeklyScheduleProps) {
    // Mobile: show one day at a time
    const todayDow = new Date().getDay(); // 0=Sun
    // Convert JS dayOfWeek (0=Sun) → our index (0=Mon)
    const todayIdx = todayDow === 0 ? 6 : todayDow - 1;
    const [activeDayIdx, setActiveDayIdx] = useState(todayIdx);

    const getClassesForDay = (dayIndex: number) => {
        const targetDayOfWeek = dayIndex === 6 ? 0 : dayIndex + 1;
        return classes
            .filter(c => !c.isSporadic && c.dayOfWeek === targetDayOfWeek)
            .sort((a, b) => a.timeStart.localeCompare(b.timeStart));
    };

    const getClassesForSlot = (dayIndex: number, hour: number) => {
        const targetDayOfWeek = dayIndex === 6 ? 0 : dayIndex + 1;
        return classes.filter(c => {
            if (c.isSporadic) return false;
            if (c.dayOfWeek !== targetDayOfWeek) return false;
            const classHour = parseInt(c.timeStart.split(':')[0]);
            return classHour === hour;
        });
    };

    const ClassCard = ({ cls }: { cls: ClassSession }) => {
        const routine = routines.find(r => r.id === cls.routineId);
        return (
            <div className="bg-primary/15 border-l-2 border-primary p-2.5 rounded-lg flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-sm truncate">{cls.name}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                            <Clock size={10} /> {cls.timeStart}hs
                        </span>
                        <span className="flex items-center gap-1">
                            <MapPin size={10} /> {gyms.find(g => g.id === cls.gymId)?.name}
                        </span>
                        {routine && (
                            <span className="flex items-center gap-1 text-blue-400">
                                <FileText size={10} /> {routine.name}
                            </span>
                        )}
                    </div>
                </div>
                <button
                    onClick={() => onDelete(cls.id)}
                    className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-colors flex-shrink-0"
                >
                    <Trash2 size={14} />
                </button>
            </div>
        );
    };

    const dayClasses = getClassesForDay(activeDayIdx);

    return (
        <div>
            {/* ── MOBILE VIEW: Day picker + list ───── */}
            <div className="md:hidden">
                {/* Day tab bar */}
                <div className="flex items-center gap-2 mb-4">
                    <button
                        onClick={() => setActiveDayIdx(i => (i - 1 + 7) % 7)}
                        className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 flex-shrink-0"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <div className="flex-1 flex gap-1 overflow-x-auto no-scrollbar">
                        {DAYS_SHORT.map((d, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveDayIdx(i)}
                                className={`flex-1 min-w-[36px] py-2 rounded-lg text-xs font-semibold transition-all ${i === activeDayIdx
                                    ? 'bg-primary text-white'
                                    : i === todayIdx
                                        ? 'bg-gray-700 text-white border border-primary/40'
                                        : 'bg-gray-800/50 text-gray-500'
                                    }`}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setActiveDayIdx(i => (i + 1) % 7)}
                        className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 flex-shrink-0"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>

                {/* Classes for selected day */}
                <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">{DAYS_FULL[activeDayIdx]}</h4>
                    {dayClasses.length === 0 ? (
                        <div className="text-center py-10 text-gray-600">
                            <Clock size={28} className="mx-auto mb-2 opacity-30" />
                            <p className="text-sm">Sin clases este día</p>
                        </div>
                    ) : (
                        dayClasses.map(cls => <ClassCard key={cls.id} cls={cls} />)
                    )}
                </div>
            </div>

            {/* ── DESKTOP VIEW: Full grid ──────────── */}
            <div className="hidden md:block overflow-x-auto pb-4">
                <div className="min-w-[800px] bg-secondary rounded-xl border border-gray-800">
                    {/* Header */}
                    <div className="grid grid-cols-8 border-b border-gray-800">
                        <div className="p-4 text-gray-400 font-medium text-sm border-r border-gray-800 bg-black/20">Hora</div>
                        {DAYS_FULL.map(day => (
                            <div key={day} className="p-4 text-center font-bold text-white border-r border-gray-800 last:border-r-0 bg-black/20">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Grid rows */}
                    {TIME_SLOTS.map(hour => (
                        <div key={hour} className="grid grid-cols-8 border-b border-gray-800 last:border-b-0">
                            <div className="p-2 text-gray-500 text-xs font-mono border-r border-gray-800 flex items-center justify-center bg-black/10">
                                {hour}:00
                            </div>
                            {DAYS_FULL.map((_, dayIdx) => {
                                const slotClasses = getClassesForSlot(dayIdx, hour);
                                return (
                                    <div key={dayIdx} className="border-r border-gray-800 last:border-r-0 min-h-[72px] p-1 relative group">
                                        {slotClasses.map(cls => (
                                            <div
                                                key={cls.id}
                                                className="bg-primary/20 border-l-2 border-primary p-1.5 rounded text-xs mb-1 hover:bg-primary/30 transition-colors"
                                            >
                                                <div className="font-bold text-white truncate">{cls.name}</div>
                                                <div className="text-gray-400 flex items-center gap-1">
                                                    <MapPin size={10} />
                                                    <span className="truncate">{gyms.find(g => g.id === cls.gymId)?.name}</span>
                                                </div>
                                                <div className="text-gray-400 flex items-center gap-1">
                                                    <Clock size={10} />
                                                    <span>{cls.timeStart}</span>
                                                </div>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onDelete(cls.id); }}
                                                    className="absolute top-1 right-1 text-red-400 opacity-0 group-hover:opacity-100"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
