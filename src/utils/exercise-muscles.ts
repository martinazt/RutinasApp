import type { MuscleGroup } from '../types';

/**
 * Client-side lookup table: exercise name → specific muscles.
 * Used as fallback when exercises loaded from DB lack primaryMuscles/secondaryMuscles.
 * Keys are lowercase for case-insensitive matching.
 */
export const EXERCISE_MUSCLE_MAP: Record<string, { primary: MuscleGroup[]; secondary?: MuscleGroup[] }> = {
    // ── PIERNAS ──────────────────────────────────
    'sentadilla libre': { primary: ['Cuádriceps', 'Glúteos'], secondary: ['Isquios', 'Core', 'Gemelos'] },
    'sentadilla': { primary: ['Cuádriceps', 'Glúteos'], secondary: ['Isquios', 'Core'] },
    'prensa 45°': { primary: ['Cuádriceps', 'Glúteos'], secondary: ['Isquios'] },
    'prensa': { primary: ['Cuádriceps', 'Glúteos'], secondary: ['Isquios'] },
    'estocadas': { primary: ['Cuádriceps', 'Glúteos'], secondary: ['Isquios', 'Core'] },
    'sillón cuádriceps': { primary: ['Cuádriceps'] },
    'sillon cuadriceps': { primary: ['Cuádriceps'] },
    'extensión cuádriceps': { primary: ['Cuádriceps'] },
    'peso muerto rumano': { primary: ['Isquios', 'Glúteos'], secondary: ['Dorsales', 'Trapecios', 'Core'] },
    'peso muerto': { primary: ['Isquios', 'Glúteos', 'Dorsales'], secondary: ['Trapecios', 'Core', 'Cuádriceps'] },
    'curl femoral tumbado': { primary: ['Isquios'], secondary: ['Glúteos', 'Gemelos'] },
    'curl femoral': { primary: ['Isquios'], secondary: ['Glúteos'] },
    'elevación de gemelos': { primary: ['Gemelos'] },
    'gemelos en máquina': { primary: ['Gemelos'] },
    'hip thrust': { primary: ['Glúteos'], secondary: ['Isquios', 'Core'] },
    'sentadilla búlgara': { primary: ['Cuádriceps', 'Glúteos'], secondary: ['Isquios', 'Core'] },
    'sentadilla bulgara': { primary: ['Cuádriceps', 'Glúteos'], secondary: ['Isquios', 'Core'] },
    'abductores en máquina': { primary: ['Glúteos'] },
    'abductores': { primary: ['Glúteos'] },
    'prensa pierna': { primary: ['Cuádriceps', 'Glúteos'], secondary: ['Isquios'] },
    'zancadas': { primary: ['Cuádriceps', 'Glúteos'], secondary: ['Isquios'] },

    // ── PECHO ─────────────────────────────────────
    'press banca plano': { primary: ['Pecho'], secondary: ['Hombros', 'Tríceps'] },
    'press banca': { primary: ['Pecho'], secondary: ['Hombros', 'Tríceps'] },
    'press inclinado con mancuernas': { primary: ['Pecho'], secondary: ['Hombros', 'Tríceps'] },
    'press inclinado': { primary: ['Pecho'], secondary: ['Hombros', 'Tríceps'] },
    'aperturas en polea': { primary: ['Pecho'] },
    'aperturas': { primary: ['Pecho'], secondary: ['Hombros'] },
    'flexiones': { primary: ['Pecho'], secondary: ['Tríceps', 'Core', 'Hombros'] },
    'fondos en paralelas': { primary: ['Pecho', 'Tríceps'], secondary: ['Hombros'] },
    'fondos': { primary: ['Pecho', 'Tríceps'], secondary: ['Hombros'] },
    'press declinado': { primary: ['Pecho'], secondary: ['Tríceps', 'Hombros'] },
    'pec deck': { primary: ['Pecho'] },
    'crossover': { primary: ['Pecho'], secondary: ['Hombros'] },

    // ── ESPALDA ───────────────────────────────────
    'dominadas': { primary: ['Dorsales'], secondary: ['Bíceps', 'Trapecios', 'Core'] },
    'remo con barra': { primary: ['Dorsales', 'Trapecios'], secondary: ['Bíceps', 'Core', 'Isquios'] },
    'remo': { primary: ['Dorsales', 'Trapecios'], secondary: ['Bíceps'] },
    'jalón al pecho': { primary: ['Dorsales'], secondary: ['Bíceps', 'Trapecios'] },
    'jalon al pecho': { primary: ['Dorsales'], secondary: ['Bíceps', 'Trapecios'] },
    'remo gironda': { primary: ['Dorsales', 'Espalda'], secondary: ['Bíceps', 'Trapecios'] },
    'pullface': { primary: ['Trapecios', 'Espalda'], secondary: ['Hombros'] },
    'pull face': { primary: ['Trapecios', 'Espalda'], secondary: ['Hombros'] },
    'jalón en polea': { primary: ['Dorsales'], secondary: ['Bíceps'] },
    'remo con mancuerna': { primary: ['Dorsales'], secondary: ['Bíceps', 'Trapecios'] },
    'pullover': { primary: ['Dorsales'], secondary: ['Pecho'] },
    'hiperextensiones': { primary: ['Isquios', 'Glúteos'], secondary: ['Dorsales', 'Core'] },

    // ── HOMBROS ───────────────────────────────────
    'press militar': { primary: ['Hombros'], secondary: ['Trapecios', 'Tríceps', 'Core'] },
    'press de hombros': { primary: ['Hombros'], secondary: ['Trapecios', 'Tríceps'] },
    'vuelos laterales': { primary: ['Hombros'] },
    'pájaros': { primary: ['Hombros', 'Espalda'], secondary: ['Trapecios'] },
    'pajaros': { primary: ['Hombros', 'Espalda'], secondary: ['Trapecios'] },
    'remo al mentón': { primary: ['Hombros', 'Trapecios'], secondary: ['Bíceps'] },
    'remo al menton': { primary: ['Hombros', 'Trapecios'], secondary: ['Bíceps'] },
    'elevaciones frontales': { primary: ['Hombros'] },
    'press arnold': { primary: ['Hombros'], secondary: ['Trapecios', 'Tríceps'] },

    // ── BRAZOS ────────────────────────────────────
    'curl de bíceps con barra': { primary: ['Bíceps'], secondary: ['Antebrazos'] },
    'curl de biceps con barra': { primary: ['Bíceps'], secondary: ['Antebrazos'] },
    'curl bíceps': { primary: ['Bíceps'], secondary: ['Antebrazos'] },
    'curl biceps': { primary: ['Bíceps'], secondary: ['Antebrazos'] },
    'curl martillo': { primary: ['Bíceps', 'Antebrazos'] },
    'extensiones de tríceps en polea': { primary: ['Tríceps'] },
    'extensiones de triceps en polea': { primary: ['Tríceps'] },
    'extensiones de tríceps': { primary: ['Tríceps'] },
    'press francés': { primary: ['Tríceps'] },
    'press frances': { primary: ['Tríceps'] },
    'curl concentrado': { primary: ['Bíceps'] },
    'dips': { primary: ['Tríceps'], secondary: ['Pecho', 'Hombros'] },
    'patada de tríceps': { primary: ['Tríceps'] },

    // ── CORE ──────────────────────────────────────
    'plancha abdominal': { primary: ['Core'], secondary: ['Hombros', 'Glúteos'] },
    'plancha': { primary: ['Core'], secondary: ['Hombros'] },
    'crunch': { primary: ['Core'] },
    'elevación de piernas': { primary: ['Core', 'Cuádriceps'] },
    'elevacion de piernas': { primary: ['Core', 'Cuádriceps'] },
    'rueda abdominal': { primary: ['Core'], secondary: ['Dorsales', 'Hombros'] },
    'abdominales': { primary: ['Core'] },
    'oblicuos': { primary: ['Core'] },
    'russian twist': { primary: ['Core'] },
    'dead bug': { primary: ['Core'] },
};

/**
 * Look up specific muscles for an exercise by name.
 * Tries exact match first, then partial match.
 */
export function lookupMusclesByName(exerciseName: string) {
    const lower = exerciseName.toLowerCase().trim();

    // 1. Exact match
    if (EXERCISE_MUSCLE_MAP[lower]) return EXERCISE_MUSCLE_MAP[lower];

    // 2. Partial match (exercise name contains key or key contains exercise name)
    const keys = Object.keys(EXERCISE_MUSCLE_MAP);
    for (const key of keys) {
        if (lower.includes(key) || key.includes(lower)) {
            return EXERCISE_MUSCLE_MAP[key];
        }
    }

    return null;
}
