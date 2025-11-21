import React, { createContext, useContext, useEffect, useState } from 'react';
import { ExerciseProgress } from '../models/Exercise';
import { progressStorage, calculateStreak } from '../utils/storage';

interface ProgressContextType {
    todayProgress: ExerciseProgress[];
    streak: number;
    markExerciseComplete: (exerciseId: number, completedSets: number) => void;
    getExerciseProgress: (exerciseId: number) => ExerciseProgress | undefined;
    isExerciseCompleted: (exerciseId: number, totalSets: number) => boolean;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [todayProgress, setTodayProgress] = useState<ExerciseProgress[]>([]);
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        loadTodayProgress();
        updateStreak();
    }, []);

    const loadTodayProgress = () => {
        const progress = progressStorage.getTodayProgress();
        setTodayProgress(progress);
    };

    const updateStreak = () => {
        const currentStreak = calculateStreak();
        setStreak(currentStreak);
    };

    const markExerciseComplete = (exerciseId: number, completedSets: number) => {
        progressStorage.addProgress(exerciseId, completedSets);
        loadTodayProgress();
        updateStreak();
    };

    const getExerciseProgress = (exerciseId: number) => {
        return todayProgress.find(p => p.exerciseId === exerciseId);
    };

    const isExerciseCompleted = (exerciseId: number, totalSets: number) => {
        const progress = getExerciseProgress(exerciseId);
        return progress ? progress.completedSets >= totalSets : false;
    };

    return (
        <ProgressContext.Provider value={{
            todayProgress,
            streak,
            markExerciseComplete,
            getExerciseProgress,
            isExerciseCompleted
        }}>
            {children}
        </ProgressContext.Provider>
    );
};

export const useProgress = () => {
    const context = useContext(ProgressContext);
    if (!context) {
        throw new Error('useProgress must be used within ProgressProvider');
    }
    return context;
};
