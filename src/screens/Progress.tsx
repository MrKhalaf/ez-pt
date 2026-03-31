import React from 'react';
import { useProgress } from '../context/ProgressContext';
import { useExercises } from '../context/ExerciseContext';
import { progressStorage } from '../utils/storage';
import './Progress.css';

export const Progress: React.FC = () => {
    const { streak }    = useProgress();
    const { exercises } = useExercises();

    const last7Days = progressStorage.getLast7Days();

    const progressByDate: Record<string, number> = {};
    last7Days.forEach(p => {
        progressByDate[p.date] = (progressByDate[p.date] || 0) + 1;
    });

    // Last 7 date strings
    const dates: string[] = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dates.push(d.toISOString().split('T')[0]);
    }

    const todayCompleted  = progressByDate[dates[6]] || 0;
    const completionRate  = exercises.length > 0
        ? Math.round((todayCompleted / exercises.length) * 100)
        : 0;
    const weeklyTotal     = dates.reduce((s, d) => s + (progressByDate[d] || 0), 0);
    const weeklyAvg       = Math.round(weeklyTotal / 7);
    const bestDay         = Math.max(...dates.map(d => progressByDate[d] || 0));

    const today    = new Date();
    const dateStr  = today.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
    const monthStr = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();

    return (
        <div className="page progress-page">
            {/* Header */}
            <header className="progress-header">
                <div className="progress-header-inner">
                    <div className="progress-header-left">
                        <span className="material-symbols-outlined">menu</span>
                        <h1 className="progress-header-title">PT LOG {dateStr}</h1>
                    </div>
                    <span className="progress-header-sub">{weeklyTotal} WK</span>
                </div>
            </header>

            <main className="progress-main">
                {/* Month label + title */}
                <div className="progress-title-row fade-in">
                    <p className="progress-month-label">{monthStr}</p>
                    <h2 className="progress-page-title">Analytics</h2>
                </div>

                {/* Big stats row */}
                <div className="progress-big-stats fade-in stagger-1">
                    <div className="progress-big-stat">
                        <span className="progress-big-num">{streak}</span>
                        <span className="progress-big-label">Day Streak</span>
                    </div>
                    <div className="progress-stat-divider" />
                    <div className="progress-big-stat">
                        <span className="progress-big-num">{completionRate}%</span>
                        <span className="progress-big-label">Today</span>
                    </div>
                    <div className="progress-stat-divider" />
                    <div className="progress-big-stat">
                        <span className="progress-big-num">{weeklyAvg}</span>
                        <span className="progress-big-label">Avg / Day</span>
                    </div>
                </div>

                {/* Weekly bar chart */}
                <section className="progress-section fade-in stagger-2">
                    <div className="progress-section-header">
                        <h3 className="progress-section-title">This Week</h3>
                        <span className="progress-section-meta">{weeklyTotal} total</span>
                    </div>

                    <div className="progress-chart">
                        {dates.map((date, i) => {
                            const count   = progressByDate[date] || 0;
                            const pct     = exercises.length > 0
                                ? Math.min((count / exercises.length) * 100, 100)
                                : 0;
                            const isToday = i === 6;
                            const dayLbl  = new Date(date + 'T12:00:00')
                                .toLocaleDateString('en-US', { weekday: 'short' })
                                .charAt(0);

                            return (
                                <div key={date} className={`chart-col ${isToday ? 'is-today' : ''}`}>
                                    <div className="chart-bar-wrap">
                                        <div
                                            className="chart-bar"
                                            style={{
                                                height: `${Math.max(pct, 4)}%`,
                                                animationDelay: `${i * 50}ms`
                                            }}
                                        />
                                    </div>
                                    <span className="chart-day">{dayLbl}</span>
                                    <span className="chart-count">{count > 0 ? count : '–'}</span>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Highlights grid */}
                <section className="progress-section fade-in stagger-3">
                    <div className="progress-section-header">
                        <h3 className="progress-section-title">Highlights</h3>
                    </div>

                    <div className="highlights-grid">
                        {[
                            { num: streak,        label: 'Day Streak',   hint: streak >= 7 ? 'Amazing!' : streak >= 3 ? 'Keep going!' : 'Build it up!' },
                            { num: bestDay,        label: 'Best Day',     hint: 'This week' },
                            { num: `${completionRate}%`, label: "Today's Rate", hint: completionRate >= 100 ? 'Complete!' : completionRate >= 50 ? 'Halfway!' : 'Get started!' },
                            { num: weeklyTotal,    label: 'This Week',    hint: `${exercises.length * 7} goal` },
                        ].map((h, i) => (
                            <div key={i} className="highlight-card">
                                <span className="highlight-num">{h.num}</span>
                                <span className="highlight-label">{h.label.toUpperCase()}</span>
                                <span className="highlight-hint">{h.hint}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Motivation */}
                <section className="progress-section fade-in stagger-4">
                    <div className="motivation-block">
                        <span className="motivation-label">
                            {streak >= 7 ? "You're crushing it" : streak >= 3 ? 'Great momentum' : 'Every rep counts'}
                        </span>
                        <p className="motivation-text">
                            {streak >= 7
                                ? 'A week-long streak is incredible. Your consistency is paying off.'
                                : streak >= 3
                                ? "You're building a strong habit. Keep the energy going."
                                : 'Recovery is a journey. Show up for yourself today.'}
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
};
