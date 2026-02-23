import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { useLocation } from 'react-router-dom';

export function Layout() {
    const location = useLocation();
    // Derive a page title for the mobile top bar
    const titles: Record<string, string> = {
        '/': 'Panel de Control',
        '/students': 'Alumnos',
        '/routines': 'Rutinas',
        '/exercises': 'Ejercicios',
        '/classes': 'Agenda',
        '/gyms': 'Gimnasios',
        '/settings': 'Configuración',
    };
    const title = titles[location.pathname] ?? (location.pathname.startsWith('/routines') ? 'Rutinas' : 'FitFlow Pro');

    return (
        <div className="min-h-screen min-h-dvh bg-[#121212] text-white">
            {/* Desktop Sidebar */}
            <Sidebar />

            {/* Mobile Top Bar */}
            <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#1a1a1a]/95 backdrop-blur border-b border-gray-800/60 flex items-center px-4 pt-safe" style={{ height: 'calc(52px + env(safe-area-inset-top, 0px))' }}>
                <h1 className="text-base font-bold text-white">{title}</h1>
                <span className="ml-auto text-xs font-semibold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">FitFlow Pro</span>
            </header>

            {/* Main content */}
            <main className="md:ml-64 transition-all duration-300"
                style={{ paddingTop: 'calc(52px + env(safe-area-inset-top, 0px))' }}>
                {/* Remove top padding override on md+ since sidebar has no top bar */}
                <div className="md:pt-0 p-4 md:p-8 pb-24 md:pb-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>

            {/* Mobile Bottom Nav */}
            <BottomNav />
        </div>
    );
}
