import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Student, Gym, Routine, Exercise } from '../types';
import { MOCK_STUDENTS, MOCK_GYMS, MOCK_ROUTINES, MOCK_EXERCISES } from './MockData';
import { DataService } from '../services/data';


interface AppState {
    students: Student[];
    gyms: Gym[];
    routines: Routine[];
    exercises: Exercise[];
    addRoutine: (routine: Routine) => Promise<void>;
    addStudent: (student: Student) => Promise<void>;
    refreshGyms: () => Promise<void>;
    refreshStudents: () => Promise<void>;
    refreshExercises: () => Promise<void>;
    refreshRoutines: () => Promise<void>;
    getStudentName: (id: string) => string;
    getExerciseName: (id: string) => string;
    isLoading: boolean;
    error: string | null;
    isConnected: boolean;
    darkMode: boolean;
    toggleDarkMode: () => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    // Initial state from Mocks to avoid empty screen if DB not connected
    const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
    const [gyms, setGyms] = useState<Gym[]>(MOCK_GYMS);
    const [routines, setRoutines] = useState<Routine[]>(MOCK_ROUTINES);
    const [exercises, setExercises] = useState<Exercise[]>(MOCK_EXERCISES);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    // Dark Mode Logic
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('fitflow_theme');
        return saved ? JSON.parse(saved) : true; // Default to dark
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('fitflow_theme', JSON.stringify(darkMode));
    }, [darkMode]);

    const toggleDarkMode = () => setDarkMode(!darkMode);

    useEffect(() => {
        const loadData = async () => {
            // Check connection by checking URL/Key existence
            if (!import.meta.env.VITE_SUPABASE_URL) {
                console.log('Running in Offline/Mock Mode');
                setIsLoading(false);
                return;
            }

            try {
                // Try to fetch to verify connection valid
                setIsLoading(true);
                const [fetchedExercises, fetchedStudents, fetchedGyms, fetchedRoutines] = await Promise.all([
                    DataService.getExercises(),
                    DataService.getStudents(),
                    DataService.getGyms(),
                    DataService.getRoutines()
                ]);

                // If successful, replace mocks (even if empty, to ensure we don't mix mocks with real DB)
                setExercises(fetchedExercises);
                setStudents(fetchedStudents);
                setGyms(fetchedGyms);
                setRoutines(fetchedRoutines);

                setIsConnected(true);
            } catch (err) {
                console.error('Failed to load data from Supabase, falling back to mocks', err);
                setError('Modo Offline: Usando datos de prueba');
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    const addRoutine = async (routine: Routine) => {
        // Optimistic update: Check if exists to replace, else append
        setRoutines(prev => {
            const exists = prev.some(r => r.id === routine.id);
            if (exists) {
                return prev.map(r => r.id === routine.id ? routine : r);
            }
            return [...prev, routine];
        });

        if (isConnected) {
            try {
                await DataService.upsertRoutine(routine); // Use upsert instead of create
            } catch (err) {
                console.error('Error saving routine', err);
                setError('Error al guardar en la nube');
                // Could revert state here
            }
        }
    };

    const addStudent = async (student: Student) => {
        setStudents(prev => [...prev, student]);

        if (isConnected) {
            try {
                await DataService.createStudent(student);
            } catch (err) {
                console.error('Error saving student', err);
                setError('Error al guardar alumno en la nube');
            }
        }
    };

    const refreshGyms = async () => {
        try {
            const fetchedGyms = await DataService.getGyms();
            setGyms(fetchedGyms);
        } catch (err) {
            console.error('Error refreshing gyms', err);
        }
    };

    const refreshStudents = async () => {
        try {
            const fetchedStudents = await DataService.getStudents();
            setStudents(fetchedStudents);
        } catch (err) {
            console.error('Error refreshing students', err);
        }
    };

    const refreshExercises = async () => {
        try {
            const fetchedExercises = await DataService.getExercises();
            setExercises(fetchedExercises);
        } catch (err) {
            console.error('Error refreshing exercises', err);
        }
    };

    const getStudentName = (id: string) => {
        return students.find(s => s.id === id)?.name || 'Unknown';
    };

    const getExerciseName = (id: string) => {
        return exercises.find(e => e.id === id)?.name || 'Unknown';
    };

    return (
        <AppContext.Provider value={{
            students,
            gyms,
            routines,
            exercises,
            addRoutine,
            addStudent,
            refreshGyms,
            refreshStudents,
            refreshGyms,
            refreshStudents,
            refreshExercises,
            refreshRoutines: async () => {
                const fetched = await DataService.getRoutines();
                setRoutines(fetched);
            },
            getStudentName,
            getExerciseName,
            isLoading,
            error,
            isConnected,
            darkMode,
            toggleDarkMode
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
