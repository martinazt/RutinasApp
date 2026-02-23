import { Home, Users, Dumbbell, FileText, Calendar, MapPin, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
    { icon: Home, label: 'Inicio', path: '/' },
    { icon: Users, label: 'Alumnos', path: '/students' },
    { icon: FileText, label: 'Rutinas', path: '/routines' },
    { icon: Dumbbell, label: 'Ejercicios', path: '/exercises' },
    { icon: Calendar, label: 'Agenda', path: '/classes' },
    { icon: MapPin, label: 'Sedes', path: '/gyms' },
    { icon: Settings, label: 'Config', path: '/settings' },
];

export function BottomNav() {
    const location = useLocation();

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#1a1a1a] border-t border-gray-800/80 pb-safe">
            <div className="flex overflow-x-auto no-scrollbar h-16">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path ||
                        (item.path !== '/' && location.pathname.startsWith(item.path));

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center justify-center min-w-[64px] flex-1 h-full transition-all duration-200 relative
                                ${isActive ? 'text-primary' : 'text-gray-500 active:text-gray-300'}`}
                        >
                            {isActive && (
                                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                            )}
                            <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                            <span className="text-[9px] mt-0.5 font-medium tracking-wide">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
