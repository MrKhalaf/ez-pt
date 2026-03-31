import React from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useExercises } from '../context/ExerciseContext';
import { useProgress } from '../context/ProgressContext';
import './ExerciseList.css';

export const ExerciseList: React.FC = () => {
    const [searchParams] = useSearchParams();
    const category       = searchParams.get('category');
    const navigate       = useNavigate();

    const { exercises }                              = useExercises();
    const { isExerciseCompleted, todayProgress }     = useProgress();

    const filteredExercises = category
        ? exercises.filter(ex => ex.category === category)
        : exercises;

    const completedCount = filteredExercises.filter(ex =>
        isExerciseCompleted(ex.id, ex.sets)
    ).length;
    const totalCount = filteredExercises.length;

    const today   = new Date();
    const dateStr = today.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });

    // First uncompleted exercise = "in progress"
    const inProgressId = filteredExercises.find(ex =>
        !isExerciseCompleted(ex.id, ex.sets)
    )?.id ?? null;

    const categories = ['Mobility', 'Core Stability', 'Lower Body', 'Upper Body'];

    return (
        <div className="page exercise-page">
            {/* ── Header ── */}
            <header className="exercise-header">
                <div className="exercise-header-inner">
                    <div className="exercise-header-left">
                        <button className="ex-back-btn" onClick={() => navigate(-1)}>
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <h1 className="exercise-header-title">PT LOG {dateStr}</h1>
                    </div>
                    <span className="exercise-header-count">{completedCount}/{totalCount}</span>
                </div>
            </header>

            <main className="exercise-main">
                {/* Session name */}
                <div className="exercise-session-row fade-in">
                    <p className="exercise-session-label">Current Session</p>
                    <h2 className="exercise-session-name">
                        {(category || 'All Exercises').toUpperCase()}
                    </h2>
                </div>

                {/* Category filter chips */}
                {!category && (
                    <div className="ex-filter-row">
                        {['All', ...categories].map(cat => (
                            <Link
                                key={cat}
                                to={cat === 'All' ? '/exercises' : `/exercises?category=${encodeURIComponent(cat)}`}
                                className="ex-chip"
                            >
                                {cat}
                            </Link>
                        ))}
                    </div>
                )}

                {/* Exercise items */}
                <div className="exercise-list-editorial">
                    {filteredExercises.map((exercise, i) => {
                        const completed  = isExerciseCompleted(exercise.id, exercise.sets);
                        const inProgress = !completed && exercise.id === inProgressId;
                        const incomplete = !completed && !inProgress;

                        const doneSets = todayProgress.filter(p => p.exerciseId === exercise.id).length;
                        const metaStr  = exercise.type === 'hold'
                            ? `${exercise.holdDuration}S HOLD`
                            : `${exercise.reps} REPS`;

                        return (
                            <Link
                                key={exercise.id}
                                to={`/timer/${exercise.id}`}
                                className={`ex-item ${completed ? 'is-done' : ''} ${incomplete ? 'is-inactive' : ''}`}
                                style={{ animationDelay: `${i * 35}ms` }}
                            >
                                <div className="ex-item-body">
                                    {/* Status row */}
                                    {completed && (
                                        <div className="ex-status ex-status--done">
                                            <span
                                                className="material-symbols-outlined ex-status-icon"
                                                style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}
                                            >
                                                check_circle
                                            </span>
                                            <span className="ex-status-label">Completed</span>
                                        </div>
                                    )}
                                    {inProgress && (
                                        <div className="ex-status ex-status--active">
                                            <span className="ex-status-dot" />
                                            <span className="ex-status-label">In Progress</span>
                                        </div>
                                    )}

                                    <h3 className="ex-name">{exercise.name.toUpperCase()}</h3>
                                    <p className="ex-meta">
                                        {doneSets} / {exercise.sets} SETS&nbsp;&bull;&nbsp;{metaStr}
                                        {exercise.isPaired ? '\u00a0\u2022\u00a0L + R' : ''}
                                    </p>
                                </div>

                                {/* Trailing chevron only for inactive/incomplete items */}
                                {incomplete && (
                                    <div className="ex-item-trailing">
                                        <span className="material-symbols-outlined ex-play-icon">
                                            chevron_right
                                        </span>
                                    </div>
                                )}
                            </Link>
                        );
                    })}

                    {filteredExercises.length === 0 && (
                        <div className="ex-empty">
                            <p className="ex-empty-title">No exercises</p>
                            <p className="ex-empty-sub">Add one to get started</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Add FAB */}
            <button className="ex-fab" onClick={() => navigate('/exercises/add')} aria-label="Add exercise">
                <span className="material-symbols-outlined">add</span>
            </button>
        </div>
    );
};
