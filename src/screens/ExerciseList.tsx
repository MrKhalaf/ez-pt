import React from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useExercises } from '../context/ExerciseContext';
import { useProgress } from '../context/ProgressContext';
import './ExerciseList.css';

export const ExerciseList: React.FC = () => {
    const [searchParams] = useSearchParams();
    const category       = searchParams.get('category');
    const isEditMode     = searchParams.get('edit') === 'true';
    const navigate       = useNavigate();

    const { exercises, categories }                  = useExercises();
    const { isExerciseCompleted }     = useProgress();

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


    return (
        <div className="page exercise-page">
            {/* ── Header ── */}
            <header className="exercise-header">
                <div className="exercise-header-inner">
                    <div className="exercise-header-left">
                        <button
                            className="ex-back-btn"
                            onClick={() => {
                                if (isEditMode && category) {
                                    navigate('/exercises?edit=true');
                                } else {
                                    navigate(-1);
                                }
                            }}
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <h1 className="exercise-header-title">
                            {isEditMode ? 'Manage' : `PT LOG ${dateStr}`}
                        </h1>
                    </div>
                    {isEditMode ? (
                        <button
                            className="ex-edit-done-btn"
                            onClick={() => navigate('/')}
                        >
                            Done
                        </button>
                    ) : (
                        <span className="exercise-header-count">{completedCount}/{totalCount}</span>
                    )}
                </div>
            </header>

            <main className="exercise-main">
                {/* Session name */}
                <div className="exercise-session-row fade-in">
                    <p className="exercise-session-label">
                        {isEditMode ? 'Editing Session' : 'Current Session'}
                    </p>
                    <h2 className="exercise-session-name">
                        {(category || 'All Exercises').toUpperCase()}
                    </h2>
                </div>

                {/* Category filter chips */}
                {!category && (
                    <div className="ex-filter-row">
                        {['All', ...categories].map(cat => {
                            const editSuffix = isEditMode ? '&edit=true' : '';
                            const to = cat === 'All'
                                ? `/exercises${isEditMode ? '?edit=true' : ''}`
                                : `/exercises?category=${encodeURIComponent(cat)}${editSuffix}`;
                            return (
                                <Link key={cat} to={to} className="ex-chip">
                                    {cat}
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* Exercise items */}
                <div className="exercise-list-editorial">
                    {filteredExercises.map((exercise, i) => {
                        const completed  = isExerciseCompleted(exercise.id, exercise.sets);
                        const inProgress = !completed && exercise.id === inProgressId;
                        const incomplete = !completed && !inProgress;

                        const metaStr  = exercise.type === 'hold'
                            ? `${exercise.holdDuration}S HOLD`
                            : `${exercise.reps} REPS`;

                        const destination = isEditMode
                            ? `/exercises/edit/${exercise.id}`
                            : `/timer/${exercise.id}${category ? `?category=${encodeURIComponent(category)}` : ''}`;

                        return (
                            <Link
                                key={exercise.id}
                                to={destination}
                                className={`ex-item ${!isEditMode && completed ? 'is-done' : ''} ${!isEditMode && incomplete ? 'is-inactive' : ''} ${isEditMode ? 'is-edit' : ''}`}
                                style={{ animationDelay: `${i * 35}ms` }}
                            >
                                <div className="ex-item-body">
                                    {/* Status row — hidden in edit mode */}
                                    {!isEditMode && completed && (
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
                                    {!isEditMode && inProgress && (
                                        <div className="ex-status ex-status--active">
                                            <span className="ex-status-dot" />
                                            <span className="ex-status-label">In Progress</span>
                                        </div>
                                    )}

                                    <h3 className="ex-name">{exercise.name.toUpperCase()}</h3>
                                    <p className="ex-meta">
                                        {`${exercise.sets} SETS\u00a0\u2022\u00a0${metaStr}${exercise.isPaired ? '\u00a0\u2022\u00a0L + R' : ''}`}
                                    </p>
                                </div>

                                {/* Trailing icon */}
                                <div className="ex-item-trailing">
                                    {isEditMode ? (
                                        <span className="material-symbols-outlined ex-edit-icon">
                                            edit
                                        </span>
                                    ) : incomplete ? (
                                        <span className="material-symbols-outlined ex-play-icon">
                                            chevron_right
                                        </span>
                                    ) : null}
                                </div>
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

            {/* Add FAB — always visible, routes to add with category pre-filled */}
            <button
                className="ex-fab"
                onClick={() => navigate(category
                    ? `/exercises/add?category=${encodeURIComponent(category)}`
                    : '/exercises/add'
                )}
                aria-label="Add exercise"
            >
                <span className="material-symbols-outlined">add</span>
            </button>
        </div>
    );
};
