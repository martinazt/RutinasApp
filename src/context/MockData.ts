import type { Exercise, Gym, Student, Routine } from '../types';

export const MOCK_EXERCISES: Exercise[] = [
    // Piernas - con músculos específicos
    {
        id: '1', name: 'Sentadilla Libre', muscleGroup: 'Piernas',
        primaryMuscles: ['Cuádriceps', 'Glúteos'],
        secondaryMuscles: ['Isquios', 'Core', 'Gemelos']
    },
    {
        id: '2', name: 'Prensa 45°', muscleGroup: 'Piernas',
        primaryMuscles: ['Cuádriceps', 'Glúteos'],
        secondaryMuscles: ['Isquios']
    },
    {
        id: '3', name: 'Estocadas', muscleGroup: 'Piernas',
        primaryMuscles: ['Cuádriceps', 'Glúteos'],
        secondaryMuscles: ['Isquios', 'Core']
    },
    {
        id: '4', name: 'Sillón Cuádriceps', muscleGroup: 'Piernas',
        primaryMuscles: ['Cuádriceps']
    },
    {
        id: '5', name: 'Peso Muerto Rumano', muscleGroup: 'Piernas',
        primaryMuscles: ['Isquios', 'Glúteos'],
        secondaryMuscles: ['Dorsales', 'Trapecios', 'Core']
    },
    {
        id: '6', name: 'Curl Femoral Tumbado', muscleGroup: 'Piernas',
        primaryMuscles: ['Isquios'],
        secondaryMuscles: ['Glúteos', 'Gemelos']
    },
    {
        id: '7', name: 'Elevación de Gemelos', muscleGroup: 'Piernas',
        primaryMuscles: ['Gemelos']
    },
    {
        id: '8', name: 'Hip Thrust', muscleGroup: 'Piernas',
        primaryMuscles: ['Glúteos'],
        secondaryMuscles: ['Isquios', 'Core']
    },
    {
        id: '9', name: 'Sentadilla Búlgara', muscleGroup: 'Piernas',
        primaryMuscles: ['Cuádriceps', 'Glúteos'],
        secondaryMuscles: ['Isquios', 'Core']
    },
    {
        id: '10', name: 'Abductores en Máquina', muscleGroup: 'Piernas',
        primaryMuscles: ['Glúteos'],
        secondaryMuscles: ['Piernas']
    },

    // Pecho
    {
        id: '11', name: 'Press Banca Plano', muscleGroup: 'Pecho',
        primaryMuscles: ['Pecho'],
        secondaryMuscles: ['Hombros', 'Tríceps']
    },
    {
        id: '12', name: 'Press Inclinado con Mancuernas', muscleGroup: 'Pecho',
        primaryMuscles: ['Pecho'],
        secondaryMuscles: ['Hombros', 'Tríceps']
    },
    {
        id: '13', name: 'Aperturas en Polea', muscleGroup: 'Pecho',
        primaryMuscles: ['Pecho']
    },
    {
        id: '14', name: 'Flexiones', muscleGroup: 'Pecho',
        primaryMuscles: ['Pecho'],
        secondaryMuscles: ['Tríceps', 'Core', 'Hombros']
    },
    {
        id: '15', name: 'Fondos en Paralelas', muscleGroup: 'Pecho',
        primaryMuscles: ['Pecho', 'Tríceps'],
        secondaryMuscles: ['Hombros']
    },

    // Espalda
    {
        id: '16', name: 'Dominadas', muscleGroup: 'Espalda',
        primaryMuscles: ['Dorsales'],
        secondaryMuscles: ['Bíceps', 'Trapecios', 'Core']
    },
    {
        id: '17', name: 'Remo con Barra', muscleGroup: 'Espalda',
        primaryMuscles: ['Dorsales', 'Trapecios'],
        secondaryMuscles: ['Bíceps', 'Core', 'Isquios']
    },
    {
        id: '18', name: 'Jalón al Pecho', muscleGroup: 'Espalda',
        primaryMuscles: ['Dorsales'],
        secondaryMuscles: ['Bíceps', 'Trapecios']
    },
    {
        id: '19', name: 'Remo Gironda', muscleGroup: 'Espalda',
        primaryMuscles: ['Dorsales', 'Espalda'],
        secondaryMuscles: ['Bíceps', 'Trapecios']
    },
    {
        id: '20', name: 'Pullface', muscleGroup: 'Espalda',
        primaryMuscles: ['Trapecios', 'Espalda'],
        secondaryMuscles: ['Hombros']
    },

    // Hombros
    {
        id: '21', name: 'Press Militar', muscleGroup: 'Hombros',
        primaryMuscles: ['Hombros'],
        secondaryMuscles: ['Trapecios', 'Tríceps', 'Core']
    },
    {
        id: '22', name: 'Vuelos Laterales', muscleGroup: 'Hombros',
        primaryMuscles: ['Hombros']
    },
    {
        id: '23', name: 'Pájaros', muscleGroup: 'Hombros',
        primaryMuscles: ['Hombros', 'Espalda'],
        secondaryMuscles: ['Trapecios']
    },
    {
        id: '24', name: 'Remo al Mentón', muscleGroup: 'Hombros',
        primaryMuscles: ['Hombros', 'Trapecios'],
        secondaryMuscles: ['Bíceps']
    },

    // Brazos
    {
        id: '25', name: 'Curl de Bíceps con Barra', muscleGroup: 'Brazos',
        primaryMuscles: ['Bíceps'],
        secondaryMuscles: ['Antebrazos']
    },
    {
        id: '26', name: 'Curl Martillo', muscleGroup: 'Brazos',
        primaryMuscles: ['Bíceps', 'Antebrazos']
    },
    {
        id: '27', name: 'Extensiones de Tríceps en Polea', muscleGroup: 'Brazos',
        primaryMuscles: ['Tríceps']
    },
    {
        id: '28', name: 'Press Francés', muscleGroup: 'Brazos',
        primaryMuscles: ['Tríceps']
    },

    // Core
    {
        id: '29', name: 'Plancha Abdominal', muscleGroup: 'Core',
        primaryMuscles: ['Core'],
        secondaryMuscles: ['Hombros', 'Glúteos']
    },
    {
        id: '30', name: 'Crunch', muscleGroup: 'Core',
        primaryMuscles: ['Core']
    },
    {
        id: '31', name: 'Elevación de Piernas', muscleGroup: 'Core',
        primaryMuscles: ['Core', 'Cuádriceps']
    },
    {
        id: '32', name: 'Rueda Abdominal', muscleGroup: 'Core',
        primaryMuscles: ['Core'],
        secondaryMuscles: ['Dorsales', 'Hombros']
    },
];

export const MOCK_GYMS: Gym[] = [
    { id: 'g1', name: 'Iron Paradise', location: 'Centro' },
    { id: 'g2', name: 'CrossFit Box', location: 'Norte' },
];

export const MOCK_STUDENTS: Student[] = [
    { id: 's1', name: 'Juan Pérez', age: 25, goal: 'Hipertrofia', gymId: 'g1', isActive: true, createdAt: '2024-01-01' },
    { id: 's2', name: 'Maria Lopez', age: 30, goal: 'Pérdida de Peso', gymId: 'g2', isActive: true, createdAt: '2024-01-01' },
    { id: 's3', name: 'Carlos Gomez', age: 22, goal: 'Fuerza', gymId: 'g1', isActive: true, createdAt: '2024-01-01' },
];

export const MOCK_ROUTINES: Routine[] = [
    {
        id: 'r1',
        name: 'Rutina Full Body A',
        studentId: 's1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['Día 1'],
        exercises: [
            { exerciseId: '1', sets: 4, reps: '8-10', rpe: 8 },
            { exerciseId: '11', sets: 4, reps: '8-10', rpe: 8 },
            { exerciseId: '17', sets: 4, reps: '8-10', rpe: 8 },
        ]
    }
];
