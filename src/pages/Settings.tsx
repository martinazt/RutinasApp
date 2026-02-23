import { useState } from 'react';
import { User, Moon, Sun, LogOut, Shield, Database } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DataService } from '../services/data';
import { MOCK_GYMS, MOCK_EXERCISES } from '../context/MockData';

export function Settings() {
    const { students, routines, darkMode, toggleDarkMode } = useApp();
    const [seeding, setSeeding] = useState(false);

    // Profile Edit State
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileName, setProfileName] = useState('Bianca');
    const [profileTitle, setProfileTitle] = useState('Entrenadora Personal');

    const handleSeed = async () => {
        if (!confirm('¿Estás seguro? Esto agregará datos de prueba (Ejercicios y Gimnasios) a la base de datos.')) return;
        setSeeding(true);
        try {
            await DataService.seedDatabase(MOCK_GYMS, MOCK_EXERCISES);
            alert('¡Datos sembrados correctamente! Recarga la página.');
        } catch (error: any) {
            console.error(error);
            alert(`Error al sembrar datos: ${error.message || JSON.stringify(error)}`);
        } finally {
            setSeeding(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <header>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    Configuración
                </h2>
                <p className="text-gray-400">Gestiona tu perfil y preferencias de la aplicación</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-secondary p-6 rounded-xl border border-gray-800 flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-4xl font-bold text-white mb-4">
                            {profileName.charAt(0)}
                        </div>
                        <h3 className="text-xl font-bold">
                            {isEditingProfile ? (
                                <input
                                    value={profileName}
                                    onChange={e => setProfileName(e.target.value)}
                                    className="bg-black/40 border border-gray-600 rounded px-2 py-1 text-center w-full text-white"
                                />
                            ) : profileName}
                        </h3>
                        <p className="text-gray-400 text-sm">
                            {isEditingProfile ? (
                                <input
                                    value={profileTitle}
                                    onChange={e => setProfileTitle(e.target.value)}
                                    className="bg-black/40 border border-gray-600 rounded px-2 py-1 text-center w-full mt-1 text-white"
                                />
                            ) : profileTitle}
                        </p>
                        <div className="mt-4 flex gap-2 w-full">
                            <div className="flex-1 bg-black/20 rounded p-2">
                                <span className="block text-lg font-bold text-primary">{students.length}</span>
                                <span className="text-xs text-gray-500">Alumnos</span>
                            </div>
                            <div className="flex-1 bg-black/20 rounded p-2">
                                <span className="block text-lg font-bold text-green-400">{routines.length}</span>
                                <span className="text-xs text-gray-500">Rutinas</span>
                            </div>
                        </div>
                        <button className="mt-6 w-full flex items-center justify-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-900/10 py-2 rounded-lg transition-colors">
                            <LogOut size={18} />
                            Cerrar Sesión
                        </button>
                    </div>
                </div>

                {/* Settings Sections */}
                <div className="md:col-span-2 space-y-6">
                    {/* Appearance */}
                    <div className="bg-secondary p-6 rounded-xl border border-gray-800">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <Sun size={20} className="text-yellow-400" />
                            Apariencia
                        </h3>
                        <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                            <div className="flex items-center gap-3">
                                {darkMode ? <Moon size={18} className="text-purple-400" /> : <Sun size={18} className="text-yellow-400" />}
                                <div>
                                    <p className="font-medium">Modo Oscuro</p>
                                    <p className="text-xs text-gray-400">Ajusta el tema para reducir la fatiga visual</p>
                                </div>
                            </div>
                            <button
                                onClick={toggleDarkMode}
                                className={`w-12 h-6 rounded-full p-1 transition-colors ${darkMode ? 'bg-primary' : 'bg-gray-600'}`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    </div>

                    {/* Security & Data */}
                    <div className="bg-secondary p-6 rounded-xl border border-gray-800">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <Shield size={20} className="text-green-400" />
                            Seguridad y Datos
                        </h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => setIsEditingProfile(!isEditingProfile)}
                                className="w-full flex items-center justify-between p-3 bg-black/20 rounded-lg hover:bg-black/40 transition-colors text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <User size={18} className="text-gray-400" />
                                    <span>{isEditingProfile ? 'Guardar Perfil' : 'Editar Perfil'}</span>
                                </div>
                                <span className="text-xs text-gray-500">Actualizar datos personales</span>
                            </button>
                            <button className="w-full flex items-center justify-between p-3 bg-black/20 rounded-lg hover:bg-black/40 transition-colors text-left">
                                <div className="flex items-center gap-3">
                                    <Database size={18} className="text-gray-400" />
                                    <span>Exportar Datos</span>
                                </div>
                                <span className="text-xs text-gray-500">Descargar copia de seguridad (JSON)</span>
                            </button>
                            <button
                                onClick={handleSeed}
                                disabled={seeding}
                                className="w-full flex items-center justify-between p-3 bg-black/20 rounded-lg hover:bg-black/40 transition-colors text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <Database size={18} className="text-yellow-400" />
                                    <span>Inicializar Base de Datos</span>
                                </div>
                                <span className="text-xs text-gray-500">{seeding ? 'Sembrando...' : 'Cargar Ejercicios y Gimnasios Básicos'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
