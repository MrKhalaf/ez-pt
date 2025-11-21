import React from 'react';
import { useExercises } from '../context/ExerciseContext';
import { useProgress } from '../context/ProgressContext';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import './Home.css';

export const Home: React.FC = () => {
    const { exercises } = useExercises();
    const { todayProgress, streak } = useProgress();

    const categories = ['Core Stability', 'Lower Body', 'Upper Body', 'Mobility'];

    const completedToday = todayProgress.length;
    const totalExercises = exercises.length;
    const completionRate = totalExercises > 0
        ? Math.round((completedToday / totalExercises) * 100)
        : 0;

    return (
        <div className="page">
            <div className="page-header">
                <h1>Today's Recovery</h1>
                <p className="text-secondary">Let's keep your body moving strong 💪</p>
            </div>

            <div className="page-content">
                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card stat-primary">
                        <div className="stat-icon">🔥</div>
                        <div className="stat-value">{streak}</div>
                        <div className="stat-label">Day Streak</div>
                    </div>

                    <div className="stat-card stat-secondary">
                        <div className="stat-icon">✅</div>
                        <div className="stat-value">{completedToday}/{totalExercises}</div>
                        <div className="stat-label">Completed</div>
                    </div>

                    <div className="stat-card stat-accent">
                        <div className="stat-icon">📈</div>
                        <div className="stat-value">{completionRate}%</div>
                        <div className="stat-label">Progress</div>
                    </div>
                </div>

                {/* Categories */}
                <div className="section">
                    <h2>Exercise Categories</h2>
                    <div className="categories-grid">
                        {categories.map(category => {
                            const categoryExercises = exercises.filter(ex => ex.category === category);
                            const categoryCompleted = todayProgress.filter(progress =>
                                categoryExercises.some(ex => ex.id === progress.exerciseId)
                            ).length;

                            return (
                                <Link
                                    key={category}
                                    to={`/exercises?category=${encodeURIComponent(category)}`}
                                    className="category-card"
                                >
                                    <div className="category-header">
                                        <h3>{category}</h3>
                                        <span className="category-count">{categoryExercises.length}</span>
                                    </div>
                                    <div className="category-progress">
                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{
                                                    width: `${categoryExercises.length > 0
                                                        ? (categoryCompleted / categoryExercises.length) * 100
                                                        : 0}%`
                                                }}
                                            />
                                        </div>
                                        <span className="progress-text">
                                            {categoryCompleted}/{categoryExercises.length} done
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="section">
                    <Link to="/exercises">
                        <Button fullWidth variant="primary" size="lg">
                            View All Exercises →
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
