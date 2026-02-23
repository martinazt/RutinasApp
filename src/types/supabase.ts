export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            exercises: {
                Row: {
                    created_at: string
                    description: string | null
                    id: string
                    muscle_group: string
                    name: string
                    thumbnail_url: string | null
                    video_url: string | null
                }
                Insert: {
                    created_at?: string
                    description?: string | null
                    id?: string
                    muscle_group: string
                    name: string
                    thumbnail_url?: string | null
                    video_url?: string | null
                }
                Update: {
                    created_at?: string
                    description?: string | null
                    id?: string
                    muscle_group?: string
                    name?: string
                    thumbnail_url?: string | null
                    video_url?: string | null
                }
            }
            gyms: {
                Row: {
                    created_at: string
                    id: string
                    location: string | null
                    logo_url: string | null
                    name: string
                }
                Insert: {
                    created_at?: string
                    id?: string
                    location?: string | null
                    logo_url?: string | null
                    name: string
                }
                Update: {
                    created_at?: string
                    id?: string
                    location?: string | null
                    logo_url?: string | null
                    name?: string
                }
            }
            routine_exercises: {
                Row: {
                    exercise_id: string
                    id: string
                    notes: string | null
                    order: number
                    reps: string
                    rest_seconds: number | null
                    routine_id: string
                    rpe: number | null
                    sets: number
                }
                Insert: {
                    exercise_id: string
                    id?: string
                    notes?: string | null
                    order?: number
                    reps: string
                    rest_seconds?: number | null
                    routine_id: string
                    rpe?: number | null
                    sets: number
                }
                Update: {
                    exercise_id?: string
                    id?: string
                    notes?: string | null
                    order?: number
                    reps?: string
                    rest_seconds?: number | null
                    routine_id?: string
                    rpe?: number | null
                    sets?: number
                }
            }
            routines: {
                Row: {
                    created_at: string
                    id: string
                    name: string
                    student_id: string
                    tags: string[] | null
                    updated_at: string
                }
                Insert: {
                    created_at?: string
                    id?: string
                    name: string
                    student_id: string
                    tags?: string[] | null
                    updated_at?: string
                }
                Update: {
                    created_at?: string
                    id?: string
                    name?: string
                    student_id?: string
                    tags?: string[] | null
                    updated_at?: string
                }
            }
            students: {
                Row: {
                    age: number | null
                    avatar_url: string | null
                    created_at: string
                    email: string | null
                    goal: string | null
                    gym_id: string | null
                    id: string
                    is_active: boolean
                    name: string
                }
                Insert: {
                    age?: number | null
                    avatar_url?: string | null
                    created_at?: string
                    email?: string | null
                    goal?: string | null
                    gym_id?: string | null
                    id?: string
                    is_active?: boolean
                    name: string
                }
                Update: {
                    age?: number | null
                    avatar_url?: string | null
                    created_at?: string
                    email?: string | null
                    goal?: string | null
                    gym_id?: string | null
                    id?: string
                    is_active?: boolean
                    name?: string
                }
            }
            classes: {
                Row: {
                    id: string
                    gym_id: string
                    name: string
                    day_of_week: number | null
                    time_start: string
                    is_sporadic: boolean
                    specific_date: string | null
                    routine_id: string | null
                }
                Insert: {
                    id?: string
                    gym_id: string
                    name: string
                    day_of_week?: number | null
                    time_start: string
                    is_sporadic: boolean
                    specific_date?: string | null
                    routine_id?: string | null
                }
                Update: {
                    id?: string
                    gym_id?: string
                    name?: string
                    day_of_week?: number | null
                    time_start?: string
                    is_sporadic?: boolean
                    specific_date?: string | null
                    routine_id?: string | null
                }
            }
        }
    }
}
