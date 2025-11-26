import React from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useExercises } from '../context/ExerciseContext';
import { useProgress } from '../context/ProgressContext';
import './ExerciseList.css';

const getCategoryGradient = (category: string): string => {
    const gradients: Record<string, string> = {
        'Mobility': 'linear-gradient(135deg, #BF5AF2 0%, #8944AB 100%)',
        'Core Stability': 'linear-gradient(135deg, #FA114F 0%, #C20D3E 100%)',
        'Lower Body': 'linear-gradient(135deg, #92E82A 0%, #6AB31F 100%)',
        'Upper Body': 'linear-gradient(135deg, #00D4FF 0%, #00A3C4 100%)'
    };
    return gradients[category] || 'linear-gradient(135deg, #0A84FF 0%, #0066CC 100%)';
};

const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
        'Mobility': '🧘',
        'Core Stability': '💪',
        'Lower Body': '🦵',
        'Upper Body': '🏋️'
    };
    return icons[category] || '🎯';
};

export const ExerciseList: React.FC = () => {
    const [searchParams] = useSearchParams();
    const category = searchParams.get('category');
    const navigate = useNavigate();

    const { exercises } = useExercises();
    const { isExerciseCompleted, todayProgress } = useProgress();

    const filteredExercises = category
        ? exercises.filter(ex => ex.category === category)
        : exercises;

    const categories = ['All', 'Mobility', 'Core Stability', 'Lower Body', 'Upper Body'];

    // Group exercises by category when showing all
    const groupedExercises = !category
        ? exercises.reduce((acc, ex) => {
            if (!acc[ex.category]) acc[ex.category] = [];
            acc[ex.category].push(ex);
            return acc;
        }, {} as Record<string, typeof exercises>)
        : null;

    const completedCount = category
        ? filteredExercises.filter(ex => isExerciseCompleted(ex.id, ex.sets)).length
        : todayProgress.length;

    const totalCount = category ? filteredExercises.length : exercises.length;

    return (
        <div className="page exercise-page">
            <div className="page-header">
                <div className="header-row">
                    <div className="header-text">
                        <span className="header-subtitle">WORKOUTS</span>
                        <h1>{category || 'All Exercises'}</h1>
                    </div>
                    <button 
                        className="add-exercise-btn"
                        onClick={() => navigate('/exercises/add')}
                        aria-label="Add exercise"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M12 5v14M5 12h14"/>
                        </svg>
                    </button>
                </div>
                <p className="progress-summary">
                    {completedCount} of {totalCount} completed today
                </p>
            </div>

            <div className="page-content">
                {/* Category Filter Pills */}
                <div className="filter-container">
                    <div className="filter-scroll">
                        {categories.map(cat => (
                            <Link
                                key={cat}
                                to={cat === 'All' ? '/exercises' : `/exercises?category=${encodeURIComponent(cat)}`}
                                className={`filter-pill ${(!category && cat === 'All') || category === cat ? 'active' : ''}`}
                            >
                                {cat}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Exercise List */}
                {category ? (
                    // Single category view
                    <div className="exercise-list">
                        {filteredExercises.map((exercise, index) => {
                            const completed = isExerciseCompleted(exercise.id, exercise.sets);

                            return (
                                <div 
                                    key={exercise.id} 
                                    className={`exercise-card ${completed ? 'completed' : ''}`}
                                    style={{ animationDelay: `${index * 30}ms` }}
                                >
                                    <div className="exercise-card-main">
                                        <div className="exercise-info">
                                            <div className="exercise-header">
                                                <h3 className="exercise-name">{exercise.name}</h3>
                                                {completed && (
                                                    <span className="completed-badge">
                                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                                            <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm3.78 6.28l-4.5 4.5a.75.75 0 01-1.06 0l-2-2a.75.75 0 111.06-1.06L6.75 9.19l3.97-3.97a.75.75 0 111.06 1.06z"/>
                                                        </svg>
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <div className="exercise-details">
                                                <span className="detail-chip">
                                                    {exercise.sets} sets
                                                </span>
                                                <span className="detail-chip">
                                                    {exercise.type === 'hold' 
                                                        ? `${exercise.holdDuration}s hold` 
                                                        : `${exercise.reps} reps`}
                                                </span>
                                                {exercise.isPaired && (
                                                    <span className="detail-chip paired">
                                                        L + R
                                                    </span>
                                                )}
                                            </div>

                                            {exercise.equipmentNeeded && (
                                                <div className="exercise-equipment">
                                                    <span className="equipment-icon">🏋️</span>
                                                    <span>{exercise.equipmentNeeded}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="exercise-actions">
                                            <Link 
                                                to={`/exercises/edit/${exercise.id}`} 
                                                className="action-btn edit"
                                                aria-label="Edit exercise"
                                            >
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                    <path d="M14.85 2.85a1.5 1.5 0 012.1 2.1L6.1 15.8l-3.6.9.9-3.6L14.85 2.85z"/>
                                                </svg>
                                            </Link>
                                            <Link 
                                                to={`/timer/${exercise.id}`}
                                                className="action-btn start"
                                            >
                                                {completed ? (
                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                        <path d="M3 10h14M10 3v14"/>
                                                    </svg>
                                                ) : (
                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M6 4.5v11l9-5.5-9-5.5z"/>
                                                    </svg>
                                                )}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    // Grouped category view
                    <div className="exercise-groups">
                        {Object.entries(groupedExercises || {}).map(([cat, exs], groupIndex) => (
                            <section key={cat} className="exercise-group" style={{ animationDelay: `${groupIndex * 50}ms` }}>
                                <div className="group-header">
                                    <div 
                                        className="group-icon"
                                        style={{ background: getCategoryGradient(cat) }}
                                    >
                                        {getCategoryIcon(cat)}
                                    </div>
                                    <div className="group-info">
                                        <h3 className="group-name">{cat}</h3>
                                        <span className="group-count">
                                            {exs.filter(ex => isExerciseCompleted(ex.id, ex.sets)).length} of {exs.length} done
                                        </span>
                                    </div>
                                    <Link 
                                        to={`/exercises?category=${encodeURIComponent(cat)}`}
                                        className="group-action"
                                    >
                                        See All
                                    </Link>
                                </div>

                                <div className="group-exercises">
                                    {exs.slice(0, 3).map((exercise, index) => {
                                        const completed = isExerciseCompleted(exercise.id, exercise.sets);
                                        
                                        return (
                                            <Link
                                                key={exercise.id}
                                                to={`/timer/${exercise.id}`}
                                                className={`mini-exercise-card ${completed ? 'completed' : ''}`}
                                                style={{ animationDelay: `${(groupIndex * 50) + (index * 30)}ms` }}
                                            >
                                                <div className="mini-info">
                                                    <span className="mini-name">{exercise.name}</span>
                                                    <span className="mini-meta">
                                                        {exercise.sets} × {exercise.type === 'hold' 
                                                            ? `${exercise.holdDuration}s` 
                                                            : `${exercise.reps}`}
                                                    </span>
                                                </div>
                                                {completed ? (
                                                    <span className="mini-check">✓</span>
                                                ) : (
                                                    <span className="mini-play">▶</span>
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </section>
                        ))}
                    </div>
                )}

                {filteredExercises.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-icon">🔍</div>
                        <h3>No exercises found</h3>
                        <p>Try selecting a different category</p>
                    </div>
                )}
            </div>
        </div>
    );
};
