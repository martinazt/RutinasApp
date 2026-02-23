import { supabase } from './supabase';
import type { Routine, Student, Exercise, Gym, ClassSession } from '../types';

/**
 * Universal ID generator with fallback for older mobile browsers
 */
export const generateID = (): string => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    // Fallback for older browsers (not globally unique but sufficient for local/small scale)
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

// Helper to generate deterministic UUIDs from simple mock IDs
const getDeterministicUUID = (id: string): string => {
    // If it's already likely a UUID, return it
    if (id.length > 30) return id;

    // Fixed mappings for known non-numeric mock IDs
    const map: Record<string, string> = {
        'g1': '11111111-1111-1111-1111-111111111111',
        'g2': '22222222-2222-2222-2222-222222222222',
        's1': '33333333-3333-3333-3333-333333333331',
        's2': '33333333-3333-3333-3333-333333333332',
        's3': '33333333-3333-3333-3333-333333333333',
    };
    if (map[id]) return map[id];

    // For numeric IDs (Exercises 1-32), pad them
    // 00000000-0000-0000-0000-0000000000XX
    const num = parseInt(id);
    if (!isNaN(num)) {
        const hex = num.toString(16).padStart(12, '0');
        return `00000000-0000-0000-0000-${hex}`;
    }

    // Fallback: Generate a random one
    return generateID();
};

export const DataService = {
    async getExercises() {
        const { data, error } = await (supabase.from('exercises') as any).select('*') as any;
        if (error) throw error;
        return (data || []).map((e: any) => ({
            ...e,
            muscleGroup: e.muscle_group,
            videoUrl: e.video_url,
            thumbnail: e.thumbnail_url,
            isCustom: e.is_custom
        })) as Exercise[];
    },

    async createExercise(exercise: Exercise) {
        const { data, error } = await (supabase.from('exercises') as any).insert({
            id: exercise.id,
            name: exercise.name,
            muscle_group: exercise.muscleGroup,
            description: exercise.description,
            video_url: exercise.videoUrl,
            thumbnail_url: exercise.thumbnail,
            is_custom: true
        }).select().single() as any;

        if (error) throw error;
        return data;
    },

    async updateExercise(exercise: Exercise) {
        const { data, error } = await (supabase.from('exercises') as any).update({
            name: exercise.name,
            muscle_group: exercise.muscleGroup,
            description: exercise.description,
            video_url: exercise.videoUrl,
            thumbnail_url: exercise.thumbnail
        }).eq('id', exercise.id).select().single() as any;

        if (error) throw error;
        return data;
    },

    async deleteExercise(id: string) {
        const { error } = await (supabase.from('exercises') as any).delete().eq('id', id);
        if (error) throw error;
        return true;
    },

    async getStudents() {
        const { data, error } = await (supabase.from('students') as any).select('*') as any;
        if (error) throw error;
        return (data || []).map((s: any) => ({
            ...s,
            gymId: s.gym_id,
            isActive: s.is_active,
            avatar: s.avatar_url,
            createdAt: s.created_at,
            birthDate: s.birth_date,
            injuries: s.injuries,
            conditions: s.conditions,
            observations: s.observations
        })) as Student[];
    },

    async getGyms() {
        const { data, error } = await (supabase.from('gyms') as any).select('*') as any;
        if (error) throw error;
        return (data || []).map((g: any) => ({
            ...g,
            logoUrl: g.logo_url
        })) as Gym[];
    },

    async getClasses() {
        const { data, error } = await (supabase.from('classes') as any).select('*') as any;
        if (error) throw error;
        return (data || []).map((c: any) => ({
            id: c.id,
            gymId: c.gym_id,
            name: c.name,
            dayOfWeek: c.day_of_week,
            timeStart: c.time_start,
            isSporadic: c.is_sporadic,
            specificDate: c.specific_date,
            routineId: c.routine_id
        })) as ClassSession[];
    },

    async createClass(classSession: ClassSession) {
        const { data, error } = await (supabase.from('classes') as any).insert({
            id: classSession.id,
            gym_id: classSession.gymId,
            name: classSession.name,
            day_of_week: classSession.dayOfWeek,
            time_start: classSession.timeStart,
            is_sporadic: classSession.isSporadic,
            specific_date: classSession.specificDate,
            routine_id: classSession.routineId
        }).select().single() as any;

        if (error) throw error;
        return data;
    },

    async deleteClass(id: string) {
        const { error } = await (supabase.from('classes') as any).delete().eq('id', id);
        if (error) throw error;
        return true;
    },

    async createGym(gym: Gym) {
        const { data, error } = await (supabase.from('gyms') as any).insert({
            id: gym.id,
            name: gym.name,
            location: gym.location,
            logo_url: gym.logoUrl
        }).select().single() as any;

        if (error) throw error;
        return data;
    },

    async updateGym(gym: Gym) {
        const { data, error } = await (supabase.from('gyms') as any).update({
            name: gym.name,
            location: gym.location,
            logo_url: gym.logoUrl
        }).eq('id', gym.id).select().single() as any;

        if (error) throw error;
        return data;
    },

    async deleteGym(id: string) {
        const { error } = await (supabase.from('gyms') as any).delete().eq('id', id);
        if (error) throw error;
        return true;
    },

    async getRoutines() {
        // Fetch routines and their related exercises
        const { data, error } = await supabase
            .from('routines')
            .select(`
                *,
                routine_exercises (
                    *,
                    exercise: exercises (*)
                )
            `) as any;

        if (error) throw error;

        return (data || []).map((r: any) => ({
            id: r.id,
            name: r.name,
            studentId: r.student_id,
            createdAt: r.created_at,
            updatedAt: r.updated_at,
            tags: r.tags,
            exercises: (r.routine_exercises || []).sort((a: any, b: any) => a.order - b.order).map((re: any) => ({
                exerciseId: re.exercise_id,
                sets: re.sets,
                reps: re.reps,
                rpe: re.rpe,
                restSeconds: re.rest_seconds,
                notes: re.notes
            }))
        })) as Routine[];
    },

    async createStudent(student: Student) {
        const { data, error } = await (supabase.from('students') as any).insert({
            id: student.id,
            name: student.name,
            age: student.age,
            goal: student.goal,
            gym_id: student.gymId,
            is_active: student.isActive,
            avatar_url: student.avatar
        }).select().single() as any;

        if (error) throw error;
        return data;
    },

    async updateStudent(student: Student) {
        const { data, error } = await (supabase.from('students') as any).update({
            name: student.name,
            age: student.age,
            goal: student.goal,
            gym_id: student.gymId,
            is_active: student.isActive,
            avatar_url: student.avatar,
            birth_date: student.birthDate,
            injuries: student.injuries,
            conditions: student.conditions,
            observations: student.observations
        }).eq('id', student.id).select().single() as any;

        if (error) throw error;
        return data;
    },

    async deleteStudent(id: string) {
        const { error } = await (supabase.from('students') as any).delete().eq('id', id);
        if (error) throw error;
        return true;
    },

    async upsertRoutine(routine: Routine) {
        // 1. Upsert Routine (Create or Update)
        const { error: routineError } = await (supabase.from('routines') as any).upsert({
            id: routine.id,
            name: routine.name,
            student_id: routine.studentId,
            tags: routine.tags,
            created_at: routine.createdAt,
            updated_at: routine.updatedAt
        });

        if (routineError) throw routineError;

        // 2. Sync Exercises (Delete old ones, insert new ones)
        const { error: deleteError } = await (supabase
            .from('routine_exercises') as any)
            .delete()
            .eq('routine_id', routine.id);

        if (deleteError) throw deleteError;

        // 3. Insert new exercises
        if (routine.exercises.length > 0) {
            const exercisesPayload = routine.exercises.map((ex, index) => ({
                routine_id: routine.id,
                exercise_id: ex.exerciseId,
                sets: ex.sets,
                reps: ex.reps,
                rpe: ex.rpe,
                rest_seconds: ex.restSeconds,
                notes: ex.notes,
                order: index
            }));

            const { error: exercisesError } = await (supabase.from('routine_exercises') as any).insert(exercisesPayload);
            if (exercisesError) throw exercisesError;
        }

        return routine;
    },

    async seedDatabase(mockGyms: Gym[], mockExercises: Exercise[]) {
        // Seed Gyms
        const { error: gymsError } = await (supabase.from('gyms') as any).upsert(
            mockGyms.map(g => ({
                id: getDeterministicUUID(g.id),
                name: g.name,
                location: g.location,
                logo_url: g.logoUrl
            }))
        );
        if (gymsError) throw gymsError;

        // Seed Exercises
        const { error: exercisesError } = await (supabase.from('exercises') as any).upsert(
            mockExercises.map(e => ({
                id: getDeterministicUUID(e.id),
                name: e.name,
                muscle_group: e.muscleGroup,
                description: e.description,
                video_url: e.videoUrl,
                thumbnail_url: e.thumbnail
            }))
        );
        if (exercisesError) throw exercisesError;

        return true;
    }
};
