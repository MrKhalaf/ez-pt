import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useExercises } from '../context/ExerciseContext';
import { useProgress } from '../context/ProgressContext';
import { useTheme } from '../context/ThemeContext';
import { formatTime, haptics, sounds } from '../utils/helpers';
import './TimerScreen.css';

type TimerState = 'ready' | 'work' | 'rest' | 'complete';
type Side = 'left' | 'right' | 'both';

export const TimerScreen: React.FC = () => {
    const { id }     = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const navigate   = useNavigate();
    const { getExerciseById, getExercisesByCategory } = useExercises();
    const { markExerciseComplete, isExerciseCompleted } = useProgress();
    const { settings }             = useTheme();

    const category = searchParams.get('category');
    const exercise = getExerciseById(Number(id));

    // Routine: ordered exercises in this category
    const routineExercises = category ? getExercisesByCategory(category) : [];
    const currentIndex = routineExercises.findIndex(ex => ex.id === Number(id));

    // Find the next uncompleted exercise after the current one
    const nextExercise = routineExercises.length > 0
        ? routineExercises.find((ex, i) => i > currentIndex && !isExerciseCompleted(ex.id, ex.sets))
        : undefined;
    const isRoutineComplete = category
        ? routineExercises.every(ex => ex.id === Number(id) || isExerciseCompleted(ex.id, ex.sets))
        : false;

    const [timerState, setTimerState] = useState<TimerState>('ready');
    const [currentSet, setCurrentSet] = useState(1);
    const [currentSide, setCurrentSide] = useState<Side>(exercise?.isPaired ? 'left' : 'both');
    const [timeLeft, setTimeLeft]       = useState(0);
    const [isRunning, setIsRunning]     = useState(false);

    // Reset all state when navigating to a different exercise (same component reused by router)
    useEffect(() => {
        setTimerState('ready');
        setCurrentSet(1);
        setCurrentSide(exercise?.isPaired ? 'left' : 'both');
        setTimeLeft(0);
        setIsRunning(false);
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!exercise) navigate('/exercises');
    }, [exercise, navigate]);

    const completeExercise = useCallback(() => {
        setTimerState('complete');
        markExerciseComplete(exercise!.id, exercise!.sets);
        if (settings.hapticFeedback) haptics.success();
        if (settings.timerSound)     sounds.success();
    }, [exercise, markExerciseComplete, settings]);

    const startWork = useCallback(() => {
        if (!exercise) return;
        setTimerState('work');
        const duration = exercise.type === 'hold'
            ? (exercise.holdDuration || settings.defaultHoldTime)
            : 0;
        setTimeLeft(duration);
        setIsRunning(exercise.type === 'hold');
        if (settings.hapticFeedback) haptics.medium();
        if (settings.timerSound)     sounds.start();
    }, [exercise, settings]);

    const handleTimerComplete = useCallback(() => {
        setIsRunning(false);
        if (settings.hapticFeedback) haptics.success();

        if (timerState === 'work') {
            if (settings.timerSound) sounds.complete();

            if (exercise?.isPaired && currentSide === 'left') {
                setCurrentSide('right');
                setTimerState('rest');
                setTimeLeft(exercise.restTime);
                setIsRunning(true);
            } else if (exercise?.isPaired && currentSide === 'right') {
                setCurrentSide('left');
                if (currentSet < (exercise?.sets || 0)) {
                    setTimerState('rest');
                    setTimeLeft(exercise.restTime);
                    setIsRunning(true);
                } else {
                    completeExercise();
                }
            } else {
                if (currentSet < (exercise?.sets || 0)) {
                    setTimerState('rest');
                    setTimeLeft(exercise!.restTime);
                    setIsRunning(true);
                } else {
                    completeExercise();
                }
            }
        } else if (timerState === 'rest') {
            if (settings.timerSound) sounds.rest();
            if (exercise?.isPaired && currentSide === 'left') {
                setCurrentSet(prev => prev + 1);
            } else if (!exercise?.isPaired) {
                setCurrentSet(prev => prev + 1);
            }
            startWork();
        }
    }, [timerState, exercise, currentSide, currentSet, settings, completeExercise, startWork]);

    useEffect(() => {
        if (!isRunning || timeLeft <= 0) return;
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) { handleTimerComplete(); return 0; }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [isRunning, timeLeft, handleTimerComplete]);

    if (!exercise) return null;

    const today   = new Date();
    const dateStr = today.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });

    // Progress bar percentage for the thin line above nav
    const totalSets = exercise.sets * (exercise.isPaired ? 2 : 1);
    const doneSets  = (currentSet - 1) * (exercise.isPaired ? 2 : 1)
        + (exercise.isPaired ? (currentSide === 'right' ? 1 : 0) : 0);
    const overallProgress = totalSets > 0 ? (doneSets / totalSets) * 100 : 0;

    const holdDuration   = exercise.holdDuration || settings.defaultHoldTime;
    const timerProgress  = timerState === 'work' && exercise.type === 'hold'
        ? ((holdDuration - timeLeft) / holdDuration) * 100
        : timerState === 'rest'
        ? ((exercise.restTime - timeLeft) / exercise.restTime) * 100
        : 0;

    return (
        <div className="timer-screen">
            {/* ── Header ── */}
            <header className="timer-header">
                <div className="timer-header-inner">
                    <div className="timer-header-left">
                        <button className="timer-back" onClick={() => navigate(-1)}>
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <span className="timer-header-title">PT LOG {dateStr}</span>
                    </div>
                    <span className="timer-header-count">{currentSet}/{exercise.sets}</span>
                </div>
            </header>

            {/* ── Content ── */}
            <main className="timer-main">

                {/* ═══ READY ═══ */}
                {timerState === 'ready' && (
                    <div className="timer-state fade-in">
                        <section className="timer-title-section">
                            <h2 className="timer-exercise-name">{exercise.name}</h2>
                            <p className="timer-set-label">
                                {exercise.sets} SETS &bull;&nbsp;
                                {exercise.type === 'hold'
                                    ? `${exercise.holdDuration || settings.defaultHoldTime}S HOLD`
                                    : `${exercise.reps} REPS`}
                                {exercise.isPaired ? '\u00a0\u2022\u00a0L + R' : ''}
                            </p>
                        </section>

                        <section className="timer-ready-content">
                            {exercise.instructions.length > 0 && (
                                <div className="timer-instructions">
                                    <span className="timer-instr-label">Instructions</span>
                                    <p className="timer-instr-text">{exercise.instructions[0]}</p>
                                </div>
                            )}
                        </section>

                        <div className="timer-actions">
                            <button
                                className="timer-btn-primary"
                                onClick={startWork}
                            >
                                Start Workout
                            </button>
                        </div>
                    </div>
                )}

                {/* ═══ WORK ═══ */}
                {timerState === 'work' && (
                    <div className="timer-state fade-in">
                        <section className="timer-title-section">
                            <h2 className="timer-exercise-name">{exercise.name}</h2>
                            <p className="timer-set-label">
                                SET {currentSet} OF {exercise.sets}
                                {exercise.isPaired && (
                                    <span className={`timer-side-badge timer-side-badge--${currentSide}`}>
                                        &nbsp;&bull;&nbsp;{currentSide === 'left' ? 'LEFT' : 'RIGHT'}
                                    </span>
                                )}
                            </p>
                        </section>

                        <section className="timer-display-section">
                            {exercise.type === 'hold' ? (
                                /* Hold timer — huge countdown */
                                <div className="timer-hold-display">
                                    <span className="timer-digits">{formatTime(timeLeft)}</span>
                                    <div className="timer-hold-controls">
                                        <button className="timer-pause-btn" onClick={() => setIsRunning(r => !r)}>
                                            <span
                                                className="material-symbols-outlined timer-pause-icon"
                                                style={{ fontVariationSettings: `'FILL' 1, 'wght' 400` }}
                                            >
                                                {isRunning ? 'pause' : 'play_arrow'}
                                            </span>
                                            <span className="timer-pause-label">{isRunning ? 'Pause' : 'Resume'}</span>
                                        </button>
                                        <div className="timer-target-divider" />
                                        <div className="timer-target-info">
                                            <span className="timer-target-label">Target</span>
                                            <span className="timer-target-value">{formatTime(holdDuration)}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* Rep count — massive number */
                                <div className="timer-rep-display">
                                    <div className="timer-rep-number-row">
                                        <span className="timer-rep-count">{exercise.reps}</span>
                                        <span className="timer-rep-unit">REPS</span>
                                    </div>
                                </div>
                            )}
                        </section>

                        {exercise.type !== 'hold' && (
                            <div className="timer-actions">
                                <button className="timer-btn-primary" onClick={handleTimerComplete}>
                                    Complete Set
                                </button>
                                <button className="timer-btn-secondary" onClick={() => {
                                    /* increment — could adjust reps if needed */
                                }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
                                    Increment
                                </button>
                            </div>
                        )}

                        {exercise.instructions.length > 0 && (
                            <section className="timer-technique-section">
                                <span className="timer-technique-label">Technique Focus</span>
                                <p className="timer-technique-text">{exercise.instructions[0]}</p>
                            </section>
                        )}
                    </div>
                )}

                {/* ═══ REST ═══ */}
                {timerState === 'rest' && (
                    <div className="timer-state fade-in">
                        <section className="timer-title-section">
                            <h2 className="timer-exercise-name">Rest</h2>
                            <p className="timer-set-label">
                                {exercise.isPaired && currentSide === 'right'
                                    ? 'RIGHT SIDE NEXT'
                                    : `SET ${Math.min(currentSet + 1, exercise.sets)} NEXT`}
                            </p>
                        </section>

                        <section className="timer-display-section">
                            <div className="timer-hold-display">
                                <span className="timer-digits">{formatTime(timeLeft)}</span>
                                <div className="timer-hold-controls">
                                    <div className="timer-target-info">
                                        <span className="timer-target-label">Rest Period</span>
                                        <span className="timer-target-value">{formatTime(exercise.restTime)}</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="timer-actions">
                            <button
                                className="timer-btn-secondary"
                                onClick={() => { setIsRunning(false); handleTimerComplete(); }}
                            >
                                Skip Rest
                            </button>
                        </div>
                    </div>
                )}

                {/* ═══ COMPLETE ═══ */}
                {timerState === 'complete' && (
                    <div className="timer-state fade-in">
                        <section className="timer-title-section">
                            <span className="timer-complete-label">
                                {isRoutineComplete ? 'Routine Complete' : 'Exercise Complete'}
                            </span>
                            <h2 className="timer-exercise-name">{exercise.name}</h2>
                        </section>

                        <section className="timer-complete-stats">
                            <div className="timer-complete-stat">
                                <span className="timer-complete-num">{exercise.sets}</span>
                                <span className="timer-complete-stat-label">SETS</span>
                            </div>
                            <div className="timer-complete-divider" />
                            <div className="timer-complete-stat">
                                <span className="timer-complete-num">
                                    {exercise.type === 'hold'
                                        ? `${(exercise.holdDuration || 30) * exercise.sets}s`
                                        : (exercise.reps || 0) * exercise.sets}
                                </span>
                                <span className="timer-complete-stat-label">
                                    {exercise.type === 'hold' ? 'TOTAL SEC' : 'TOTAL REPS'}
                                </span>
                            </div>
                        </section>

                        {/* Routine progress indicator */}
                        {category && routineExercises.length > 1 && (
                            <section className="timer-routine-progress">
                                <span className="timer-routine-label">
                                    {isRoutineComplete
                                        ? `${routineExercises.length}/${routineExercises.length} EXERCISES`
                                        : `${currentIndex + 1}/${routineExercises.length} EXERCISES`}
                                </span>
                                <div className="timer-routine-dots">
                                    {routineExercises.map((ex) => (
                                        <div
                                            key={ex.id}
                                            className={`timer-routine-dot ${
                                                ex.id === Number(id) || isExerciseCompleted(ex.id, ex.sets)
                                                    ? 'timer-routine-dot--done'
                                                    : ''
                                            }`}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        <div className="timer-actions">
                            {nextExercise ? (
                                <>
                                    <button
                                        className="timer-btn-primary"
                                        onClick={() => navigate(`/timer/${nextExercise.id}?category=${encodeURIComponent(category!)}`, { replace: true })}
                                    >
                                        Next: {nextExercise.name}
                                    </button>
                                    <button
                                        className="timer-btn-ghost"
                                        onClick={() => navigate(`/exercises?category=${encodeURIComponent(category!)}`)}
                                    >
                                        Back to Routine
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        className="timer-btn-primary"
                                        onClick={() => navigate(category ? `/exercises?category=${encodeURIComponent(category)}` : '/exercises')}
                                    >
                                        {isRoutineComplete ? 'Done' : 'Continue'}
                                    </button>
                                    <button
                                        className="timer-btn-ghost"
                                        onClick={() => navigate('/')}
                                    >
                                        Back to Sessions
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* ── Thin progress bar above nav ── */}
            <div className="timer-progress-bar">
                <div
                    className="timer-progress-fill"
                    style={{ width: `${timerState === 'complete' ? 100 : timerProgress || overallProgress}%` }}
                />
            </div>
        </div>
    );
};
