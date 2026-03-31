import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useExercises } from '../context/ExerciseContext';
import { useProgress } from '../context/ProgressContext';
import './Home.css';

const CATEGORIES = [
    { name: 'Mobility',       label: 'Flexibility'   },
    { name: 'Core Stability', label: 'Core'          },
    { name: 'Lower Body',     label: 'Lower Body'    },
    { name: 'Upper Body',     label: 'Upper Body'    },
];

export const Home: React.FC = () => {
    const { exercises } = useExercises();
    const { todayProgress, streak } = useProgress();
    const navigate = useNavigate();

    const completedCount = todayProgress.length;
    const totalCount    = exercises.length;

    const today    = new Date();
    const dayName  = today.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();

    const getCategoryStatus = (catName: string) => {
        const catExs       = exercises.filter(ex => ex.category === catName);
        const catCompleted = todayProgress.filter(p => catExs.some(ex => ex.id === p.exerciseId)).length;
        const count        = catExs.length;
        if (count === 0) return { label: null, isComplete: false, count: 0 };
        const isComplete = catCompleted === count;
        return { label: catName, isComplete, count };
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
                    <button className="home-edit-btn" onClick={() => navigate('/exercises/add')}>
                        Edit
                    </button>
                </div>
            </header>

            <main className="home-main">
                {/* Session list */}
                <section className="sessions-list fade-in">
                    {CATEGORIES.map((cat, i) => {
                        const status = getCategoryStatus(cat.name);
                        return (
                            <Link
                                key={cat.name}
                                to={`/exercises?category=${encodeURIComponent(cat.name)}`}
                                className="session-item"
                                style={{ animationDelay: `${i * 40}ms` }}
                            >
                                <div className="session-info">
                                    <span className={`session-cat-label ${status.isComplete ? 'done' : ''}`}>
                                        {cat.label.toUpperCase()}
                                    </span>
                                    <h2 className="session-name">{cat.name}</h2>
                                </div>
                                <div className="session-hover-hint">
                                    <span className="session-hint-text">View Routine</span>
                                    <span className="material-symbols-outlined session-hint-icon">chevron_right</span>
                                </div>
                            </Link>
                        );
                    })}
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
