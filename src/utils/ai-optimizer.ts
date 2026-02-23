import type { RoutineExercise, Exercise, Student, MuscleGroup } from '../types';
import { lookupMusclesByName } from './exercise-muscles';

export function optimizeRoutine(exercises: RoutineExercise[], allExercises: Exercise[]): RoutineExercise[] {
    // Logic: Group exercises by muscle group to minimize switching fatigue
    const enriched = exercises.map(ex => ({
        ...ex,
        details: allExercises.find(e => e.id === ex.exerciseId)
    }));

    const grouped: Record<string, typeof enriched> = {};

    enriched.forEach(ex => {
        const group = ex.details?.muscleGroup || 'Other';
        if (!grouped[group]) grouped[group] = [];
        grouped[group].push(ex);
    });

    const optimized: RoutineExercise[] = [];
    Object.values(grouped).forEach(group => {
        group.forEach(ex => {
            const { details, ...original } = ex;
            optimized.push(original);
        });
    });

    return optimized;
}

export function getActiveMuscles(exercises: RoutineExercise[], allExercises: Exercise[]): MuscleGroup[] {
    const muscles = new Set<MuscleGroup>();
    exercises.forEach(ex => {
        const details = allExercises.find(e => e.id === ex.exerciseId);
        if (!details) return;
        // 1. Use explicitly set primaryMuscles if present
        if (details.primaryMuscles?.length) {
            details.primaryMuscles.forEach(m => muscles.add(m));
            details.secondaryMuscles?.forEach(m => muscles.add(m));
            return;
        }
        // 2. Try lookup by exercise name
        const looked = lookupMusclesByName(details.name);
        if (looked) {
            looked.primary.forEach(m => muscles.add(m));
            looked.secondary?.forEach(m => muscles.add(m));
            return;
        }
        // 3. Last resort: broad muscle group
        muscles.add(details.muscleGroup);
    });
    return Array.from(muscles);
}

/** Returns { primary, secondary } muscle sets for dual-color highlighting */
export function getActiveMusclesDetailed(exercises: RoutineExercise[], allExercises: Exercise[]) {
    const primary = new Set<MuscleGroup>();
    const secondary = new Set<MuscleGroup>();
    exercises.forEach(ex => {
        const details = allExercises.find(e => e.id === ex.exerciseId);
        if (!details) return;
        // 1. Explicitly set primaryMuscles
        if (details.primaryMuscles?.length) {
            details.primaryMuscles.forEach(m => primary.add(m));
            details.secondaryMuscles?.forEach(m => secondary.add(m));
            return;
        }
        // 2. Lookup by exercise name
        const looked = lookupMusclesByName(details.name);
        if (looked) {
            looked.primary.forEach(m => primary.add(m));
            looked.secondary?.forEach(m => secondary.add(m));
            return;
        }
        // 3. Fallback: broad group
        primary.add(details.muscleGroup);
    });
    // Deduplicate: remove from secondary anything already in primary
    primary.forEach(m => secondary.delete(m));
    return { primary: Array.from(primary), secondary: Array.from(secondary) };
}



// NEW: Context Awareness
interface RiskAnalysis {
    hasRisks: boolean;
    warnings: string[];
}

export function analyzeRisks(exercises: RoutineExercise[], allExercises: Exercise[], student: Student): RiskAnalysis {
    const warnings: string[] = [];

    if (!student.injuries && !student.conditions) {
        return { hasRisks: false, warnings: [] };
    }

    const injuries = (student.injuries || '').toLowerCase();
    const conditions = (student.conditions || '').toLowerCase();

    // Map keywords to risky muscle groups
    // This is a basic rule-based engine. In a real app, this could be more sophisticated.
    const rules: { keywords: string[], muscles: MuscleGroup[], reason: string }[] = [
        { keywords: ['rodilla', 'menisco', 'ligamento'], muscles: ['Cuádriceps', 'Isquios', 'Gemelos', 'Piernas'], reason: 'Lesión de rodilla detectada' },
        { keywords: ['hombro', 'manguito'], muscles: ['Hombros', 'Pecho', 'Trapecios'], reason: 'Lesión de hombro detectada' },
        { keywords: ['lumbar', 'espalda baja', 'hernia'], muscles: ['Espalda', 'Core', 'Peso Muerto' as any], reason: 'Problemas lumbares detectados' },
        { keywords: ['muñeca'], muscles: ['Bíceps', 'Tríceps', 'Brazos'], reason: 'Lesión de muñeca detectada' },
    ];

    exercises.forEach(routineEx => {
        const exDetails = allExercises.find(e => e.id === routineEx.exerciseId);
        if (!exDetails) return;

        rules.forEach(rule => {
            // Check if student has this injury
            const hasInjury = rule.keywords.some(k => injuries.includes(k) || conditions.includes(k));

            // Check if exercise targets the risky muscle
            const involvesMuscle = rule.muscles.includes(exDetails.muscleGroup);

            if (hasInjury && involvesMuscle) {
                warnings.push(`⚠️ Precaución: "${exDetails.name}" impacta ${exDetails.muscleGroup} (${rule.reason}).`);
            }
        });
    });

    return {
        hasRisks: warnings.length > 0,
        warnings: Array.from(new Set(warnings)) // Dedupe
    };
}

export function suggestExercises(
    student: Student,
    currentExercises: RoutineExercise[],
    allExercises: Exercise[]
): Exercise[] {
    const goal = student.goal.toLowerCase();
    const currentIds = new Set(currentExercises.map(ex => ex.exerciseId));

    // Get already worked muscles to avoid too much overlap
    const worked = getActiveMusclesDetailed(currentExercises, allExercises);
    const workedSet = new Set([...worked.primary, ...worked.secondary]);

    // 1. Identify Target muscle groups and themes based on goal
    let targetGroups: MuscleGroup[] = [];
    if (goal.includes('hipertrofia') || goal.includes('volumen')) {
        targetGroups = ['Pecho', 'Espalda', 'Piernas', 'Brazos', 'Hombros'];
    } else if (goal.includes('fuerza')) {
        targetGroups = ['Pecho', 'Espalda', 'Piernas', 'Core'];
    } else if (goal.includes('pérdida') || goal.includes('bajar') || goal.includes('resistencia')) {
        targetGroups = ['Cardio', 'Full Body', 'Core', 'Piernas'];
    } else {
        targetGroups = ['Full Body', 'Core'];
    }

    // 2. Filter available exercises
    const available = allExercises.filter(ex => !currentIds.has(ex.id));

    // 3. Score exercises
    const scored = available.map(ex => {
        let score = Math.random() * 2; // Add some low-level randomness/variety

        // Match target group
        if (targetGroups.includes(ex.muscleGroup)) score += 5;

        // Bonus for muscles NOT yet worked in the routine
        if (!workedSet.has(ex.muscleGroup)) score += 3;
        if (ex.primaryMuscles?.some(m => !workedSet.has(m))) score += 2;

        // Goal specific bonuses
        if (goal.includes('fuerza') && ['Piernas', 'Espalda', 'Pecho'].includes(ex.muscleGroup)) score += 2;
        if (goal.includes('brazos') && ['Brazos', 'Bíceps', 'Tríceps'].includes(ex.muscleGroup)) score += 4;

        return { ex, score };
    });

    // 4. Return top 3 unique suggestions
    return scored
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(s => s.ex);
}
