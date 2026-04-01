import { Exercise, ExerciseProgress } from '../models/Exercise';
import { Settings, defaultSettings } from '../models/Settings';
import { DailyProgress } from '../models/Progress';

const STORAGE_KEYS = {
    EXERCISES: 'rehabber_exercises',
    PROGRESS: 'rehabber_progress',
    SETTINGS: 'rehabber_settings',
    DAILY_PROGRESS: 'rehabber_daily_progress',
    CATEGORIES: 'rehabber_categories',
} as const;

export const DEFAULT_CATEGORIES = ['Core Stability', 'Lower Body'];

// Generic storage helpers
const getItem = <T>(key: string, defaultValue: T): T => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading ${key} from localStorage:`, error);
        return defaultValue;
    }
};

const setItem = <T>(key: string, value: T): void => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error writing ${key} to localStorage:`, error);
    }
};

// Exercise storage
export const exerciseStorage = {
    getAll: (): Exercise[] => getItem(STORAGE_KEYS.EXERCISES, []),

    save: (exercises: Exercise[]): void => {
        setItem(STORAGE_KEYS.EXERCISES, exercises);
    },

    add: (exercise: Exercise): void => {
        const exercises = exerciseStorage.getAll();
        exercises.push(exercise);
        exerciseStorage.save(exercises);
    },

    update: (id: number, updatedExercise: Exercise): void => {
        const exercises = exerciseStorage.getAll();
        const index = exercises.findIndex(ex => ex.id === id);
        if (index !== -1) {
            exercises[index] = updatedExercise;
            exerciseStorage.save(exercises);
        }
    },

    delete: (id: number): void => {
        const exercises = exerciseStorage.getAll();
        const filtered = exercises.filter(ex => ex.id !== id);
        exerciseStorage.save(filtered);
    },

    getById: (id: number): Exercise | undefined => {
        const exercises = exerciseStorage.getAll();
        return exercises.find(ex => ex.id === id);
    },

    getByCategory: (category: string): Exercise[] => {
        const exercises = exerciseStorage.getAll();
        return exercises.filter(ex => ex.category === category);
    }
};

// Progress storage
export const progressStorage = {
    getAll: (): ExerciseProgress[] => getItem(STORAGE_KEYS.PROGRESS, []),

    save: (progress: ExerciseProgress[]): void => {
        setItem(STORAGE_KEYS.PROGRESS, progress);
    },

    addProgress: (exerciseId: number, completedSets: number): void => {
        const progress = progressStorage.getAll();
        const today = new Date().toISOString().split('T')[0];

        const existing = progress.find(
            p => p.exerciseId === exerciseId && p.date === today
        );

        if (existing) {
            existing.completedSets = completedSets;
            existing.completedAt = new Date();
        } else {
            progress.push({
                exerciseId,
                completedSets,
                completedAt: new Date(),
                date: today
            });
        }

        progressStorage.save(progress);
    },

    getTodayProgress: (): ExerciseProgress[] => {
        const progress = progressStorage.getAll();
        const today = new Date().toISOString().split('T')[0];
        return progress.filter(p => p.date === today);
    },

    getProgressForDate: (date: string): ExerciseProgress[] => {
        const progress = progressStorage.getAll();
        return progress.filter(p => p.date === date);
    },

    getLast7Days: (): ExerciseProgress[] => {
        const progress = progressStorage.getAll();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const cutoffDate = sevenDaysAgo.toISOString().split('T')[0];

        return progress.filter(p => p.date >= cutoffDate);
    }
};

// Daily progress storage
export const dailyProgressStorage = {
    getAll: (): DailyProgress[] => getItem(STORAGE_KEYS.DAILY_PROGRESS, []),

    save: (dailyProgress: DailyProgress[]): void => {
        setItem(STORAGE_KEYS.DAILY_PROGRESS, dailyProgress);
    },

    updateToday: (update: Partial<DailyProgress>): void => {
        const allProgress = dailyProgressStorage.getAll();
        const today = new Date().toISOString().split('T')[0];

        const todayIndex = allProgress.findIndex(p => p.date === today);

        if (todayIndex !== -1) {
            allProgress[todayIndex] = { ...allProgress[todayIndex], ...update };
        } else {
            allProgress.push({
                date: today,
                exercisesCompleted: 0,
                totalExercises: 0,
                streak: 0,
                focusAreas: [],
                ...update
            });
        }

        dailyProgressStorage.save(allProgress);
    },

    getToday: (): DailyProgress | null => {
        const allProgress = dailyProgressStorage.getAll();
        const today = new Date().toISOString().split('T')[0];
        return allProgress.find(p => p.date === today) || null;
    }
};

// Settings storage
export const settingsStorage = {
    get: (): Settings => getItem(STORAGE_KEYS.SETTINGS, defaultSettings),

    save: (settings: Settings): void => {
        setItem(STORAGE_KEYS.SETTINGS, settings);
    },

    update: (updates: Partial<Settings>): void => {
        const current = settingsStorage.get();
        settingsStorage.save({ ...current, ...updates });
    }
};

// Category storage
export const categoryStorage = {
    getAll: (): string[] => getItem(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES),
    save: (categories: string[]): void => setItem(STORAGE_KEYS.CATEGORIES, categories),
};

// Utility: Calculate streak
export const calculateStreak = (): number => {
    const allProgress = dailyProgressStorage.getAll();
    if (allProgress.length === 0) return 0;

    // Sort by date descending
    const sorted = allProgress.sort((a, b) => b.date.localeCompare(a.date));

    let streak = 0;
    let currentDate = new Date();

    for (const progress of sorted) {
        const progressDate = progress.date;
        const expectedDate = currentDate.toISOString().split('T')[0];

        if (progressDate === expectedDate && progress.exercisesCompleted > 0) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            break;
        }
    }

    return streak;
};
