export type MuscleGroup =
    | 'Pecho' | 'Espalda' | 'Hombros' | 'Brazos' | 'Core'
    | 'Piernas' | 'Cardio' | 'Full Body'
    | 'Bíceps' | 'Tríceps' | 'Cuádriceps' | 'Isquios' | 'Glúteos' | 'Gemelos' | 'Dorsales' | 'Trapecios'
    | 'Pectorales' | 'Deltoides' | 'Antebrazos' | 'Pantorrillas';

export interface Exercise {
    id: string;
    name: string;
    muscleGroup: MuscleGroup;
    /** Specific muscles activated as primary movers */
    primaryMuscles?: MuscleGroup[];
    /** Muscles activated secondarily / stabilizers */
    secondaryMuscles?: MuscleGroup[];
    description?: string;
    videoUrl?: string;
    thumbnail?: string;
    isCustom?: boolean;
}

export interface Student {
    id: string;
    name: string;
    age: number;
    goal: string; // e.g., "Hipertrofia", "Pérdida de peso"
    gymId: string;
    avatar?: string;
    email?: string;
    isActive: boolean;
    createdAt: string;
    birthDate?: string;
    injuries?: string;
    conditions?: string;
    observations?: string;
}

export interface Gym {
    id: string;
    name: string;
    logoUrl?: string;
    location?: string;
}

export interface RoutineExercise {
    exerciseId: string;
    sets: number;
    reps: string; // string to allow "12-15" or "Fallo"
    rpe?: number; // Rate of Perceived Exertion (1-10)
    restSeconds?: number;
    notes?: string;
}

export interface Routine {
    id: string;
    name: string;
    studentId: string;
    exercises: RoutineExercise[];
    createdAt: string;
    updatedAt: string;
    tags?: string[]; // e.g., "Día 1", "Empuje"
    dayLabel?: string;
    activityTypeId?: string;
}

export interface ActivityType {
    id: string;
    name: string;
    description?: string;
}

export interface ClassSession {
    id: string;
    gymId: string;
    name: string;
    dayOfWeek?: number; // 0-6
    timeStart: string; // HH:mm
    isSporadic: boolean;
    specificDate?: string; // YYYY-MM-DD
    routineId?: string;
}
