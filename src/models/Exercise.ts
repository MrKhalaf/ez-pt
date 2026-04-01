export type ExerciseCategory = string;

export type ExerciseType = 'rep' | 'hold' | 'step';

export interface Exercise {
    id: number;
    name: string;
    category: ExerciseCategory;
    type: ExerciseType;
    sets: number;
    reps?: number; // For rep-based exercises
    holdDuration?: number; // Seconds, for hold-based exercises
    restTime: number; // Seconds
    instructions: string[];
    isPaired: boolean; // Left/right sides
    equipmentNeeded?: string;
    videoUrl?: string;
    notes?: string;
}

export interface ExerciseProgress {
    exerciseId: number;
    completedSets: number;
    completedAt?: Date;
    date: string; // YYYY-MM-DD format
}
