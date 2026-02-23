import { useEffect, useState } from 'react';
import { Users, Calendar, TrendingUp, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DataService } from '../services/data';
import type { ClassSession } from '../types';

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export function Dashboard() {
    const { students, routines, gyms } = useApp();
    const [classes, setClasses] = useState<ClassSession[]>([]);

    useEffect(() => {
        DataService.getClasses().then(setClasses).catch(console.error);
    }, []);

    const activeStudents = students.filter(s => s.isActive).length;
    const totalRoutines = routines.length;

    // Today's day of week (0=Sunday, 1=Monday...)
    const todayDow = new Date().getDay();
    const todayISO = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

    const todaysClasses = classes
        .filter(c => {
            if (c.isSporadic) return c.specificDate === todayISO;
            return c.dayOfWeek === todayDow;
        })
        .sort((a, b) => a.timeStart.localeCompare(b.timeStart));

    return (
        <div className="space-y-6">
            {/* Header — hidden on mobile, layout top bar handles it */}
            <header className="hidden md:block">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    Panel de Control
                </h2>
                <p className="text-gray-400 mt-1">Bienvenida, Martina · {DAYS[todayDow]}</p>
            </header>
            {/* Mobile welcome (compact) */}
            <div className="md:hidden">
                <p className="text-gray-400 text-sm">Bienvenida, Martina · {DAYS[todayDow]}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard icon={Users} label="Alumnos Activos" value={activeStudents} color="text-blue-400" bg="bg-blue-400/10" />
                <StatCard icon={FileText} label="Rutinas Creadas" value={totalRoutines} color="text-purple-400" bg="bg-purple-400/10" />
                <StatCard icon={Calendar} label="Clases Hoy" value={todaysClasses.length} color="text-green-400" bg="bg-green-400/10" />
                <StatCard icon={TrendingUp} label="Progreso Semanal" value="+12%" color="text-orange-400" bg="bg-orange-400/10" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Clases de Hoy — from real agenda */}
                <div className="bg-secondary p-6 rounded-xl border border-gray-800">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Calendar size={20} className="text-green-400" />
                        Clases de Hoy
                        <span className="ml-auto text-sm font-normal text-gray-500">{DAYS[todayDow]}</span>
                    </h3>

                    {todaysClasses.length === 0 ? (
                        <div className="text-center py-8 text-gray-600">
                            <Calendar size={32} className="mx-auto mb-2 opacity-30" />
                            <p className="text-sm">Sin clases programadas para hoy</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {todaysClasses.map(cls => {
                                const gym = gyms.find(g => g.id === cls.gymId);
                                return (
                                    <div key={cls.id} className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-lg transition-colors">
                                        <div className="w-14 h-14 rounded-xl bg-green-500/10 border border-green-500/20 flex flex-col items-center justify-center flex-shrink-0">
                                            <span className="font-bold text-green-400 text-sm">{cls.timeStart}</span>
                                            <span className="text-[10px] text-green-600">hs</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-white truncate">{cls.name}</h4>
                                            <p className="text-sm text-gray-400 truncate">
                                                {gym?.name || 'Sede no definida'}
                                                {cls.isSporadic && <span className="ml-2 text-xs text-orange-400 border border-orange-400/30 px-1 rounded">Evento</span>}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Alumnos Recientes */}
                <div className="bg-secondary p-6 rounded-xl border border-gray-800">
                    <h3 className="text-xl font-semibold mb-4">Alumnos Recientes</h3>
                    <div className="space-y-3">
                        {students.slice(0, 4).map(student => (
                            <div key={student.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center font-bold text-white flex-shrink-0">
                                        {student.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-medium">{student.name}</p>
                                        <p className="text-xs text-gray-400">{student.goal}</p>
                                    </div>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full ${student.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {student.isActive ? 'Activo' : 'Inactivo'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

import type { LucideIcon } from 'lucide-react';

function StatCard({ icon: Icon, label, value, color, bg }: { icon: LucideIcon, label: string, value: string | number, color: string, bg: string }) {
    return (
        <div className="bg-secondary p-4 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors">
            <div className={`w-10 h-10 rounded-lg ${bg} ${color} flex items-center justify-center mb-3`}>
                <Icon size={20} />
            </div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-gray-400">{label}</p>
        </div>
    );
}
