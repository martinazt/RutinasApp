import { Home, Users, Dumbbell, FileText, Settings, MapPin, Calendar } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Alumnos', path: '/students' },
    { icon: FileText, label: 'Rutinas', path: '/routines' },
    { icon: Dumbbell, label: 'Ejercicios', path: '/exercises' },
    { icon: MapPin, label: 'Gimnasios', path: '/gyms' },
    { icon: Calendar, label: 'Agenda', path: '/classes' },
    { icon: Settings, label: 'Configuración', path: '/settings' },
];

export function Sidebar() {
    const location = useLocation();
    const { isConnected } = useApp();

    return (
        <aside className="hidden md:flex flex-col w-64 h-screen bg-secondary border-r border-gray-800 text-white fixed left-0 top-0">
            <div className="p-6">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                    FitFlow Pro
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                ? 'bg-primary/10 text-primary'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                        >
                            <Icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-800">
                <div className="flex items-center gap-3 px-4 py-2">
                    <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                            <span className="text-sm font-bold">B</span>
                        </div>
                        <div
                            className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-secondary ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
                            title={isConnected ? 'Conectado a la nube' : 'Modo Offline'}
                        />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium">Bianca</p>
                        <p className="text-xs text-gray-500">Entrenadora</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
