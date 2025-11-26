import React from 'react';
import { useProgress } from '../context/ProgressContext';
import { useExercises } from '../context/ExerciseContext';
import { progressStorage } from '../utils/storage';
import './Progress.css';

// Activity Ring Component
const ActivityRing: React.FC<{
    progress: number;
    size: number;
    strokeWidth: number;
    color: string;
}> = ({ progress, size, strokeWidth, color }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (Math.min(progress, 100) / 100) * circumference;

    return (
        <svg width={size} height={size} className="activity-ring">
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                opacity={0.3}
            />
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

    // Calculate weekly stats
    const weeklyTotal = dates.reduce((sum, date) => sum + (progressByDate[date] || 0), 0);
    const weeklyAverage = Math.round(weeklyTotal / 7);
    const bestDay = Math.max(...dates.map(date => progressByDate[date] || 0));

    // Get month and year
    const today = new Date();
    const monthYear = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
        <div className="page progress-page">
            <div className="page-header">
                <span className="header-month">{monthYear.toUpperCase()}</span>
                <h1>Activity</h1>
            </div>

            <div className="page-content">
                {/* Today's Activity Card */}
                <div className="activity-summary-card fade-in">
                    <div className="summary-rings">
                        <div className="summary-ring-stack">
                            <ActivityRing progress={completionRate} size={140} strokeWidth={14} color="var(--color-move)" />
                            <ActivityRing progress={streak * 10} size={110} strokeWidth={14} color="var(--color-exercise)" />
                            <ActivityRing progress={weeklyAverage * 10} size={80} strokeWidth={14} color="var(--color-stand)" />
                        </div>
                    </div>
                    <div className="summary-stats">
                        <div className="summary-stat">
                            <div className="stat-dot move" />
                            <div className="stat-info">
                                <span className="stat-value text-move">{todayCompleted}</span>
                                <span className="stat-label">Today</span>
                            </div>
                        </div>
                        <div className="summary-stat">
                            <div className="stat-dot exercise" />
                            <div className="stat-info">
                                <span className="stat-value text-exercise">{streak}</span>
                                <span className="stat-label">Streak</span>
                            </div>
                        </div>
                        <div className="summary-stat">
                            <div className="stat-dot stand" />
                            <div className="stat-info">
                                <span className="stat-value text-stand">{weeklyAverage}</span>
                                <span className="stat-label">Avg/Day</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Weekly Chart */}
                <section className="section fade-in stagger-1">
                    <div className="section-header">
                        <h2 className="section-title">This Week</h2>
                        <span className="section-meta">{weeklyTotal} total</span>
                    </div>

                    <div className="weekly-chart-card">
                        <div className="chart-bars">
                            {dates.map((date, index) => {
                                const count = progressByDate[date] || 0;
                                const percentage = exercises.length > 0
                                    ? (count / exercises.length) * 100
                                    : 0;
                                const isToday = index === 6;
                                const dayLabel = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });

                                return (
                                    <div key={date} className={`chart-column ${isToday ? 'today' : ''}`}>
                                        <div className="bar-wrapper">
                                            <div 
                                                className="bar"
                                                style={{ 
                                                    height: `${Math.max(percentage, 4)}%`,
                                                    animationDelay: `${index * 50}ms`
                                                }}
                                            />
                                        </div>
                                        <span className="day-label">{dayLabel.charAt(0)}</span>
                                        <span className="day-count">{count > 0 ? count : '–'}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Stats Grid */}
                <section className="section fade-in stagger-2">
                    <div className="section-header">
                        <h2 className="section-title">Highlights</h2>
                    </div>

                    <div className="highlights-grid">
                        <div className="highlight-card">
                            <div className="highlight-icon">🔥</div>
                            <div className="highlight-info">
                                <span className="highlight-value">{streak}</span>
                                <span className="highlight-label">Day Streak</span>
                            </div>
                            <div className="highlight-detail">
                                {streak >= 7 ? 'Amazing!' : streak >= 3 ? 'Keep going!' : 'Build it up!'}
                            </div>
                        </div>

                        <div className="highlight-card">
                            <div className="highlight-icon">🏆</div>
                            <div className="highlight-info">
                                <span className="highlight-value">{bestDay}</span>
                                <span className="highlight-label">Best Day</span>
                            </div>
                            <div className="highlight-detail">This week</div>
                        </div>

                        <div className="highlight-card">
                            <div className="highlight-icon">📊</div>
                            <div className="highlight-info">
                                <span className="highlight-value">{completionRate}%</span>
                                <span className="highlight-label">Today's Rate</span>
                            </div>
                            <div className="highlight-detail">
                                {completionRate >= 100 ? 'Complete!' : completionRate >= 50 ? 'Halfway!' : 'Get started!'}
                            </div>
                        </div>

                        <div className="highlight-card">
                            <div className="highlight-icon">⭐</div>
                            <div className="highlight-info">
                                <span className="highlight-value">{weeklyTotal}</span>
                                <span className="highlight-label">This Week</span>
                            </div>
                            <div className="highlight-detail">{exercises.length * 7} goal</div>
                        </div>
                    </div>
                </section>

                {/* Motivation Card */}
                <section className="section fade-in stagger-3">
                    <div className="motivation-card">
                        <div className="motivation-bg" />
                        <div className="motivation-content">
                            {streak >= 7 ? (
                                <>
                                    <span className="motivation-emoji">🏆</span>
                                    <h3>You're crushing it!</h3>
                                    <p>A week-long streak is incredible. Your consistency is paying off!</p>
                                </>
                            ) : streak >= 3 ? (
                                <>
                                    <span className="motivation-emoji">⚡</span>
                                    <h3>Great momentum!</h3>
                                    <p>You're building a strong habit. Keep the energy going!</p>
                                </>
                            ) : (
                                <>
                                    <span className="motivation-emoji">💪</span>
                                    <h3>Every rep counts</h3>
                                    <p>Recovery is a journey. Show up for yourself today!</p>
                                </>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};
