import React, { createContext, useContext, useEffect, useState } from 'react';
import { Exercise } from '../models/Exercise';
import { exerciseStorage, categoryStorage, DEFAULT_CATEGORIES } from '../utils/storage';
import { defaultExercises } from '../data/defaultExercises';

interface ExerciseContextType {
    exercises: Exercise[];
    categories: string[];
    addExercise: (exercise: Exercise) => void;
    updateExercise: (id: number, exercise: Exercise) => void;
    deleteExercise: (id: number) => void;
    getExerciseById: (id: number) => Exercise | undefined;
    getExercisesByCategory: (category: string) => Exercise[];
    addCategory: (name: string) => void;
    deleteCategory: (name: string) => void;
    syncNewDefaults: () => number;
}

const ExerciseContext = createContext<ExerciseContextType | undefined>(undefined);

export const ExerciseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);

    useEffect(() => {
        setCategories(categoryStorage.getAll());
    }, []);

    useEffect(() => {
        // Load exercises from storage, or use defaults if empty
        const stored = exerciseStorage.getAll();
        if (stored.length === 0) {
            exerciseStorage.save(defaultExercises);
            setExercises(defaultExercises);
        } else {
            // Auto-sync: Add any new default exercises that don't exist
            const existingIds = new Set(stored.map(ex => ex.id));
            const newDefaults = defaultExercises.filter(def => !existingIds.has(def.id));

            if (newDefaults.length > 0) {
                const merged = [...stored, ...newDefaults];
                exerciseStorage.save(merged);
                setExercises(merged);
            } else {
                setExercises(stored);
            }
        }
    }, []);

    const addExercise = (exercise: Exercise) => {
        const newExercises = [...exercises, exercise];
        setExercises(newExercises);
        exerciseStorage.save(newExercises);
    };

    const updateExercise = (id: number, updatedExercise: Exercise) => {
        const newExercises = exercises.map(ex =>
            ex.id === id ? updatedExercise : ex
        );
        setExercises(newExercises);
        exerciseStorage.save(newExercises);
    };

    const deleteExercise = (id: number) => {
        const newExercises = exercises.filter(ex => ex.id !== id);
        setExercises(newExercises);
        exerciseStorage.save(newExercises);
    };

    const getExerciseById = (id: number) => {
        return exercises.find(ex => ex.id === id);
    };

    const getExercisesByCategory = (category: string) => {
        return exercises.filter(ex => ex.category === category);
    };

    const addCategory = (name: string) => {
        const trimmed = name.trim();
        if (!trimmed || categories.includes(trimmed)) return;
        const updated = [...categories, trimmed];
        setCategories(updated);
        categoryStorage.save(updated);
    };

    const deleteCategory = (name: string) => {
        const updated = categories.filter(c => c !== name);
        setCategories(updated);
        categoryStorage.save(updated);
    };

    const syncNewDefaults = () => {
        // Add any default exercises that don't exist in current list
        const existingIds = new Set(exercises.map(ex => ex.id));
        const newExercises = defaultExercises.filter(def => !existingIds.has(def.id));

        if (newExercises.length > 0) {
            const updated = [...exercises, ...newExercises];
            setExercises(updated);
            exerciseStorage.save(updated);
        }

        return newExercises.length;
    };

    return (
        <ExerciseContext.Provider value={{
            exercises,
            categories,
            addExercise,
            updateExercise,
            deleteExercise,
            getExerciseById,
            getExercisesByCategory,
            addCategory,
            deleteCategory,
            syncNewDefaults
        }}>
            {children}
        </ExerciseContext.Provider>
    );
};

export const useExercises = () => {
    const context = useContext(ExerciseContext);
    if (!context) {
        throw new Error('useExercises must be used within ExerciseProvider');
    }
    return context;
};
