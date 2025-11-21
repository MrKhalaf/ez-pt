import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useExercises } from '../context/ExerciseContext';
import { useProgress } from '../context/ProgressContext';
import { Button } from '../components/Button';
import './ExerciseList.css';

export const ExerciseList: React.FC = () => {
    const [searchParams] = useSearchParams();
    const category = searchParams.get('category');

    const { exercises } = useExercises();
    const { isExerciseCompleted } = useProgress();

    const filteredExercises = category
        ? exercises.filter(ex => ex.category === category)
        : exercises;

    const categories = ['All', 'Core Stability', 'Lower Body', 'Upper Body', 'Mobility'];

    return (
        <div className="page">
            <div className="page-header">
                <h1>Exercises</h1>
                <p className="text-secondary">Your rehabilitation routine</p>
            </div>

            <div className="page-content">
                {/* Category Filter */}
                <div className="category-filter">
                    {categories.map(cat => (
                        <Link
                            key={cat}
                            to={cat === 'All' ? '/exercises' : `/exercises?category=${encodeURIComponent(cat)}`}
                            className={`filter-btn ${(!category && cat === 'All') || category === cat ? 'active' : ''}`}
                        >
                            {cat}
                        </Link>
                    ))}
                </div>

                {/* Exercise List */}
                <div className="exercise-list">
                    {filteredExercises.map(exercise => {
                        const completed = isExerciseCompleted(exercise.id, exercise.sets);

                        return (
                            <div key={exercise.id} className={`exercise-card ${completed ? 'completed' : ''}`}>
                                <div className="exercise-header">
                                    <div className="exercise-title-wrap">
                                        <h3>{exercise.name}</h3>
                                        <span className="exercise-category">{exercise.category}</span>
                                    </div>
                                    {completed && <span className="completed-badge">✓</span>}
                                </div>

                                <div className="exercise-details">
                                    <div className="detail-item">
                                        <span className="detail-label">Type</span>
                                        <span className="detail-value">{exercise.type}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Sets</span>
                                        <span className="detail-value">{exercise.sets}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">
                                            {exercise.type === 'hold' ? 'Hold' : 'Reps'}
                                        </span>
                                        <span className="detail-value">
                                            {exercise.type === 'hold'
                                                ? `${exercise.holdDuration}s`
                                                : exercise.reps}
                                        </span>
                                    </div>
                                    {exercise.isPaired && (
                                        <div className="detail-item">
                                            <span className="detail-label">Sides</span>
                                            <span className="detail-value">L + R</span>
                                        </div>
                                    )}
                                </div>

                                {exercise.equipmentNeeded && (
                                    <div className="exercise-equipment">
                                        <span className="equipment-icon">🏋️</span>
                                        {exercise.equipmentNeeded}
                                    </div>
                                )}

                                <Link to={`/timer/${exercise.id}`}>
                                    <Button fullWidth variant={completed ? 'secondary' : 'primary'}>
                                        {completed ? 'Do Again' : 'Start Exercise'}
                                    </Button>
                                </Link>
                            </div>
                        );
                    })}
                </div>

                {filteredExercises.length === 0 && (
                    <div className="empty-state">
                        <p>No exercises found in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
