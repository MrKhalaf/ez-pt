export interface DailyProgress {
    date: string; // YYYY-MM-DD
    exercisesCompleted: number;
    totalExercises: number;
    streak: number;
    focusAreas: string[]; // Categories worked on
}

export interface WeeklyStats {
    week: string; // ISO week
    totalSessions: number;
    totalExercises: number;
    focusAreaDistribution: Record<string, number>;
    completionRate: number; // Percentage
}

export interface ProgressHistory {
    dailyProgress: DailyProgress[];
    weeklyStats: WeeklyStats[];
    currentStreak: number;
    longestStreak: number;
}
