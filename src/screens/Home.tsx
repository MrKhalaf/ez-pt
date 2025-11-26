import React from 'react';
import { useExercises } from '../context/ExerciseContext';
import { useProgress } from '../context/ProgressContext';
import { Link } from 'react-router-dom';
import './Home.css';

// Activity Ring Component
const ActivityRing: React.FC<{
    progress: number;
    size: number;
    strokeWidth: number;
    color: string;
    bgOpacity?: number;
}> = ({ progress, size, strokeWidth, color, bgOpacity = 0.3 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (Math.min(progress, 100) / 100) * circumference;

    return (
        <svg width={size} height={size} className="activity-ring">
            {/* Background ring */}
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                opacity={bgOpacity}
            />
            {/* Progress ring */}
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                style={{ transition: 'stroke-dashoffset 1s ease-out' }}
            />
        </svg>
    );
};

// Triple Ring Component (Apple Fitness style)
const TripleRings: React.FC<{
    moveProgress: number;
    exerciseProgress: number;
    standProgress: number;
}> = ({ moveProgress, exerciseProgress, standProgress }) => {
    return (
        <div className="triple-rings">
            <ActivityRing progress={moveProgress} size={180} strokeWidth={16} color="var(--color-move)" />
            <ActivityRing progress={exerciseProgress} size={140} strokeWidth={16} color="var(--color-exercise)" />
            <ActivityRing progress={standProgress} size={100} strokeWidth={16} color="var(--color-stand)" />
        </div>
    );
};

export const Home: React.FC = () => {
    const { exercises } = useExercises();
    const { todayProgress, streak } = useProgress();

    const categories = ['Mobility', 'Core Stability', 'Lower Body', 'Upper Body'];

    const completedToday = todayProgress.length;
    const totalExercises = exercises.length;
    const completionRate = totalExercises > 0
        ? Math.round((completedToday / totalExercises) * 100)
        : 0;

    // Calculate category-based progress for rings
    const getCategoryProgress = (category: string) => {
        const categoryExercises = exercises.filter(ex => ex.category === category);
        const completed = todayProgress.filter(progress =>
            categoryExercises.some(ex => ex.id === progress.exerciseId)
        ).length;
        return categoryExercises.length > 0 ? (completed / categoryExercises.length) * 100 : 0;
    };

    const mobilityProgress = getCategoryProgress('Mobility');
    const coreProgress = getCategoryProgress('Core Stability');
    const lowerProgress = getCategoryProgress('Lower Body');

    // Get current date info
    const today = new Date();
    const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
    const dateStr = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

    return (
        <div className="page home-page">
            <div className="page-header">
                <span className="header-date">{dayName.toUpperCase()}</span>
                <h1>Summary</h1>
            </div>

            <div className="page-content">
                {/* Activity Rings Card */}
                <div className="activity-card fade-in">
                    <div className="activity-card-header">
                        <span className="activity-label">Activity</span>
                        <span className="activity-date">{dateStr}</span>
                    </div>
                    
                    <div className="activity-card-content">
                        <TripleRings
                            moveProgress={completionRate}
                            exerciseProgress={mobilityProgress}
                            standProgress={coreProgress}
                        />
                        
                        <div className="activity-stats">
                            <div className="activity-stat">
                                <div className="stat-ring-indicator move" />
                                <div className="stat-content">
                                    <span className="stat-value text-move">{completedToday}/{totalExercises}</span>
                                    <span className="stat-label">Exercises</span>
                                </div>
                            </div>
                            
                            <div className="activity-stat">
                                <div className="stat-ring-indicator exercise" />
                                <div className="stat-content">
                                    <span className="stat-value text-exercise">{streak}</span>
                                    <span className="stat-label">Day Streak</span>
                                </div>
                            </div>
                            
                            <div className="activity-stat">
                                <div className="stat-ring-indicator stand" />
                                <div className="stat-content">
                                    <span className="stat-value text-stand">{completionRate}%</span>
                                    <span className="stat-label">Complete</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Categories Section */}
                <section className="section fade-in stagger-1">
                    <div className="section-header">
                        <h2 className="section-title">Workouts</h2>
                        <Link to="/exercises" className="section-action">Show All</Link>
                    </div>

                    <div className="category-scroll">
                        {categories.map((category, index) => {
                            const categoryExercises = exercises.filter(ex => ex.category === category);
                            const categoryCompleted = todayProgress.filter(progress =>
                                categoryExercises.some(ex => ex.id === progress.exerciseId)
                            ).length;
                            const progress = categoryExercises.length > 0
                                ? (categoryCompleted / categoryExercises.length) * 100
                                : 0;

                            const categoryIcons: Record<string, string> = {
                                'Mobility': '🧘',
                                'Core Stability': '💪',
                                'Lower Body': '🦵',
                                'Upper Body': '🏋️'
                            };

                            const categoryColors: Record<string, string> = {
                                'Mobility': 'var(--color-accent-purple)',
                                'Core Stability': 'var(--color-move)',
                                'Lower Body': 'var(--color-exercise)',
                                'Upper Body': 'var(--color-stand)'
                            };

                            return (
                                <Link
                                    key={category}
                                    to={`/exercises?category=${encodeURIComponent(category)}`}
                                    className="category-card"
                                    style={{ 
                                        '--category-color': categoryColors[category],
                                        animationDelay: `${index * 50}ms`
                                    } as React.CSSProperties}
                                >
                                    <div className="category-card-bg" />
                                    <div className="category-card-content">
                                        <span className="category-icon">{categoryIcons[category]}</span>
                                        <h3 className="category-name">{category}</h3>
                                        <div className="category-meta">
                                            <span className="category-count">{categoryExercises.length} exercises</span>
                                            {categoryCompleted > 0 && (
                                                <span className="category-progress-text">
                                                    {categoryCompleted} done
                                                </span>
                                            )}
                                        </div>
                                        <div className="category-progress-bar">
                                            <div 
                                                className="category-progress-fill"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>

                {/* Quick Start Section */}
                <section className="section fade-in stagger-2">
                    <div className="section-header">
                        <h2 className="section-title">Continue</h2>
                    </div>

                    {exercises.slice(0, 3).map((exercise, index) => {
                        const isCompleted = todayProgress.some(p => p.exerciseId === exercise.id);
                        
                        return (
                            <Link
                                key={exercise.id}
                                to={`/timer/${exercise.id}`}
                                className={`continue-card ${isCompleted ? 'completed' : ''}`}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className="continue-info">
                                    <h4 className="continue-name">{exercise.name}</h4>
                                    <span className="continue-meta">
                                        {exercise.sets} sets · {exercise.type === 'hold' ? `${exercise.holdDuration}s hold` : `${exercise.reps} reps`}
                                    </span>
                                </div>
                                <div className="continue-action">
                                    {isCompleted ? (
                                        <span className="completed-check">✓</span>
                                    ) : (
                                        <span className="play-icon">▶</span>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </section>
            </div>
        </div>
    );
};
