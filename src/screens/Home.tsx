import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useExercises } from '../context/ExerciseContext';
import { useProgress } from '../context/ProgressContext';
import './Home.css';

export const Home: React.FC = () => {
    const { exercises, categories, addCategory, deleteCategory } = useExercises();
    const { todayProgress, streak } = useProgress();
    const [isEditing, setIsEditing]         = useState(false);
    const [isAdding, setIsAdding]           = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const completedCount = todayProgress.length;
    const totalCount     = exercises.length;

    const today   = new Date();
    const dayName = today.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();

    useEffect(() => {
        if (isAdding) inputRef.current?.focus();
    }, [isAdding]);

    const getCategoryStatus = (catName: string) => {
        const catExs       = exercises.filter(ex => ex.category === catName);
        const catCompleted = todayProgress.filter(p => catExs.some(ex => ex.id === p.exerciseId)).length;
        const count        = catExs.length;
        if (count === 0) return { isComplete: false, count: 0 };
        return { isComplete: catCompleted === count, count };
    };

    const handleAddCategory = () => {
        if (newCategoryName.trim()) {
            addCategory(newCategoryName.trim());
        }
        setNewCategoryName('');
        setIsAdding(false);
    };

    const handleDeleteCategory = (name: string) => {
        const hasExercises = exercises.some(ex => ex.category === name);
        if (hasExercises) return; // don't delete non-empty sessions
        deleteCategory(name);
    };

    const handleDone = () => {
        setIsEditing(false);
        setIsAdding(false);
        setNewCategoryName('');
    };

    return (
        <div className="page home-page">
            {/* Sticky header */}
            <header className="home-header">
                <div className="home-header-inner">
                    <div className="home-header-left">
                        <span className="material-symbols-outlined home-menu-icon">menu</span>
                        <h1 className="home-title">Sessions</h1>
                    </div>
                    {isEditing ? (
                        <button className="home-edit-btn" onClick={handleDone}>Done</button>
                    ) : (
                        <button className="home-edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
                    )}
                </div>
            </header>

            <main className="home-main">
                <section className="sessions-list fade-in">
                    {categories.map((cat, i) => {
                        const status    = getCategoryStatus(cat);
                        const hasExs    = status.count > 0;
                        const canDelete = !hasExs;

                        if (isEditing) {
                            return (
                                <div
                                    key={cat}
                                    className="session-item session-item--edit"
                                    style={{ animationDelay: `${i * 40}ms` }}
                                >
                                    <Link
                                        to={`/exercises?category=${encodeURIComponent(cat)}&edit=true`}
                                        className="session-item-edit-body"
                                    >
                                        <div className="session-info">
                                            <span className="session-cat-label">
                                                {hasExs ? `${status.count} exercise${status.count !== 1 ? 's' : ''}` : 'Empty'}
                                            </span>
                                            <h2 className="session-name">{cat}</h2>
                                        </div>
                                        <span className="material-symbols-outlined session-edit-chevron">chevron_right</span>
                                    </Link>
                                    <button
                                        className={`session-delete-btn ${!canDelete ? 'session-delete-btn--disabled' : ''}`}
                                        onClick={() => handleDeleteCategory(cat)}
                                        disabled={!canDelete}
                                        title={canDelete ? 'Remove session' : 'Remove all exercises first'}
                                    >
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>
                            );
                        }

                        return (
                            <Link
                                key={cat}
                                to={`/exercises?category=${encodeURIComponent(cat)}`}
                                className="session-item"
                                style={{ animationDelay: `${i * 40}ms` }}
                            >
                                <div className="session-info">
                                    <span className={`session-cat-label ${status.isComplete ? 'done' : ''}`}>
                                        {cat.toUpperCase()}
                                    </span>
                                    <h2 className="session-name">{cat}</h2>
                                </div>
                                <div className="session-hover-hint">
                                    <span className="session-hint-text">View Routine</span>
                                    <span className="material-symbols-outlined session-hint-icon">chevron_right</span>
                                </div>
                            </Link>
                        );
                    })}

                    {/* Add session row — only in edit mode */}
                    {isEditing && (
                        <div className="session-add-row">
                            {isAdding ? (
                                <div className="session-add-input-row">
                                    <input
                                        ref={inputRef}
                                        className="session-add-input"
                                        value={newCategoryName}
                                        onChange={e => setNewCategoryName(e.target.value)}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') handleAddCategory();
                                            if (e.key === 'Escape') { setIsAdding(false); setNewCategoryName(''); }
                                        }}
                                        onBlur={handleAddCategory}
                                        placeholder="Session name..."
                                        maxLength={32}
                                    />
                                    <span className="session-add-hint">Return to confirm</span>
                                </div>
                            ) : (
                                <button
                                    className="session-add-btn"
                                    onClick={() => setIsAdding(true)}
                                >
                                    <span className="material-symbols-outlined session-add-icon">add</span>
                                    <span className="session-add-label">Add Session</span>
                                </button>
                            )}
                        </div>
                    )}
                </section>

                {/* Divider + stats footer */}
                <div className="home-divider" />
                <div className="home-stats-row">
                    <span>{dayName}</span>
                    <span className="home-stats-dot">&bull;</span>
                    <span>{completedCount}/{totalCount} Done</span>
                    <span className="home-stats-dot">&bull;</span>
                    <span>{streak} Day Streak</span>
                </div>
            </main>
        </div>
    );
};
