import React from 'react';
import { useProgress } from '../context/ProgressContext';
import { useExercises } from '../context/ExerciseContext';
import { progressStorage } from '../utils/storage';
import './Progress.css';

export const Progress: React.FC = () => {
    const { streak } = useProgress();
    const { exercises } = useExercises();

    const last7Days = progressStorage.getLast7Days();

    // Group by date
    const progressByDate: Record<string, number> = {};
    last7Days.forEach(progress => {
        progressByDate[progress.date] = (progressByDate[progress.date] || 0) + 1;
    });

    // Generate last 7 days
    const dates = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
    }

    const todayCompleted = progressByDate[dates[6]] || 0;
    const completionRate = exercises.length > 0
        ? Math.round((todayCompleted / exercises.length) * 100)
        : 0;

    return (
        <div className="page">
            <div className="page-header">
                <h1>Progress</h1>
                <p className="text-secondary">Track your rehabilitation journey</p>
            </div>

            <div className="page-content">
                {/* Key Stats */}
                <div className="progress-stats">
                    <div className="progress-stat-card">
                        <div className="stat-icon">🔥</div>
                        <div className="stat-info">
                            <div className="stat-value">{streak}</div>
                            <div className="stat-label">Day Streak</div>
                        </div>
                    </div>

                    <div className="progress-stat-card">
                        <div className="stat-icon">📈</div>
                        <div className="stat-info">
                            <div className="stat-value">{completionRate}%</div>
                            <div className="stat-label">Today's Rate</div>
                        </div>
                    </div>

                    <div className="progress-stat-card">
                        <div className="stat-icon">💪</div>
                        <div className="stat-info">
                            <div className="stat-value">{todayCompleted}</div>
                            <div className="stat-label">Completed Today</div>
                        </div>
                    </div>
                </div>

                {/* Weekly Chart */}
                <div className="section">
                    <h2>Last 7 Days</h2>
                    <div className="weekly-chart">
                        {dates.map(date => {
                            const count = progressByDate[date] || 0;
                            const percentage = exercises.length > 0
                                ? (count / exercises.length) * 100
                                : 0;

                            return (
                                <div key={date} className="chart-bar">
                                    <div className="bar-container">
                                        <div
                                            className="bar-fill"
                                            style={{ height: `${Math.min(percentage, 100)}%` }}
                                        />
                                    </div>
                                    <div className="bar-label">{new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                                    <div className="bar-count">{count}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Motivational Message */}
                <div className="motivation-card">
                    {streak >= 7 ? (
                        <>
                            <div className="motivation-icon">🏆</div>
                            <h3>You're on fire!</h3>
                            <p>Keep up the amazing work. Consistency is key to recovery!</p>
                        </>
                    ) : streak >= 3 ? (
                        <>
                            <div className="motivation-icon">⭐</div>
                            <h3>Great momentum!</h3>
                            <p>You're building a strong habit. Keep it going!</p>
                        </>
                    ) : (
                        <>
                            <div className="motivation-icon">💚</div>
                            <h3>Every step counts</h3>
                            <p>Your recovery is a journey. Stay consistent!</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
