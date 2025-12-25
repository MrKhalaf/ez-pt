import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useExercises } from '../context/ExerciseContext';
import { useProgress } from '../context/ProgressContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/Button';
import { formatTime, haptics, sounds } from '../utils/helpers';
import './TimerScreen.css';

type TimerState = 'ready' | 'work' | 'rest' | 'complete';
type Side = 'left' | 'right' | 'both';

// Circular Progress Ring
const ProgressRing: React.FC<{
    progress: number;
    size: number;
    strokeWidth: number;
    color: string;
    bgColor?: string;
}> = ({ progress, size, strokeWidth, color, bgColor }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (Math.min(progress, 100) / 100) * circumference;

    return (
        <svg width={size} height={size} className="progress-ring">
            {/* Background ring */}
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={bgColor || 'var(--color-gray-4)'}
                strokeWidth={strokeWidth}
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
                style={{ 
                    transition: 'stroke-dashoffset 0.5s ease-out',
                    filter: `drop-shadow(0 0 12px ${color})`
                }}
            />
        </svg>
    );
};

export const TimerScreen: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getExerciseById } = useExercises();
    const { markExerciseComplete } = useProgress();
    const { settings } = useTheme();

    const exercise = getExerciseById(Number(id));

    const [timerState, setTimerState] = useState<TimerState>('ready');
    const [currentSet, setCurrentSet] = useState(1);
    const [currentSide, setCurrentSide] = useState<Side>(exercise?.isPaired ? 'left' : 'both');
    const [timeLeft, setTimeLeft] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        if (!exercise) {
            navigate('/exercises');
            return;
        }
    }, [exercise, navigate]);

    useEffect(() => {
        if (!isRunning || timeLeft <= 0) return;

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    handleTimerComplete();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning, timeLeft]);

    const handleTimerComplete = () => {
        setIsRunning(false);

        if (settings.hapticFeedback) {
            haptics.success();
        }

        if (timerState === 'work') {
            // Play complete sound when work period ends
            if (settings.timerSound) {
                sounds.complete();
            }

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
            // Play rest end sound before starting work
            if (settings.timerSound) {
                sounds.rest();
            }

            if (exercise?.isPaired && currentSide === 'left') {
                setCurrentSet(prev => prev + 1);
            } else if (!exercise?.isPaired) {
                setCurrentSet(prev => prev + 1);
            }
            startWork();
        }
    };

    const startWork = () => {
        if (!exercise) return;

        setTimerState('work');
        const duration = exercise.type === 'hold'
            ? (exercise.holdDuration || settings.defaultHoldTime)
            : 0;

        setTimeLeft(duration);
        setIsRunning(exercise.type === 'hold');

        if (settings.hapticFeedback) {
            haptics.medium();
        }

        if (settings.timerSound) {
            sounds.start();
        }
    };

    const handleStart = () => {
        startWork();
    };

    const handleSkipRest = () => {
        setIsRunning(false);
        handleTimerComplete();
    };

    const completeExercise = () => {
        setTimerState('complete');
        markExerciseComplete(exercise!.id, exercise!.sets);

        if (settings.hapticFeedback) {
            haptics.success();
        }

        if (settings.timerSound) {
            sounds.success();
        }
    };

    const handleRepComplete = () => {
        handleTimerComplete();
    };

    if (!exercise) return null;

    const totalDuration = exercise.type === 'hold' ? (exercise.holdDuration || 30) : 100;
    const workProgress = timerState === 'work' 
        ? ((totalDuration - timeLeft) / totalDuration) * 100 
        : 0;
    const restProgress = timerState === 'rest' 
        ? ((exercise.restTime - timeLeft) / exercise.restTime) * 100 
        : 0;

    const getTimerColor = () => {
        if (timerState === 'work') return 'var(--color-exercise)';
        if (timerState === 'rest') return 'var(--color-stand)';
        return 'var(--color-accent)';
    };

    return (
        <div className="timer-screen">
            {/* Header */}
            <div className="timer-header">
                <button className="close-btn" onClick={() => navigate(-1)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                </button>
                <div className="timer-header-info">
                    <h2 className="timer-exercise-name">{exercise.name}</h2>
                    <span className="timer-exercise-category">{exercise.category}</span>
                </div>
                <div className="header-spacer" />
            </div>

            {/* Content */}
            <div className="timer-content">
                
                {/* Ready State */}
                {timerState === 'ready' && (
                    <div className="timer-state timer-ready fade-in">
                        <div className="ready-ring-container">
                            <ProgressRing 
                                progress={0} 
                                size={280} 
                                strokeWidth={20} 
                                color="var(--color-exercise)"
                            />
                            <div className="ready-inner">
                                <span className="ready-label">READY</span>
                                <span className="ready-instruction">
                                    {exercise.instructions[0]}
                                </span>
                            </div>
                        </div>

                        <div className="ready-stats">
                            <div className="ready-stat">
                                <span className="ready-stat-value">{exercise.sets}</span>
                                <span className="ready-stat-label">Sets</span>
                            </div>
                            <div className="ready-stat-divider" />
                            <div className="ready-stat">
                                <span className="ready-stat-value">
                                    {exercise.type === 'hold' ? `${exercise.holdDuration}s` : exercise.reps}
                                </span>
                                <span className="ready-stat-label">
                                    {exercise.type === 'hold' ? 'Hold' : 'Reps'}
                                </span>
                            </div>
                            {exercise.isPaired && (
                                <>
                                    <div className="ready-stat-divider" />
                                    <div className="ready-stat">
                                        <span className="ready-stat-value">L+R</span>
                                        <span className="ready-stat-label">Sides</span>
                                    </div>
                                </>
                            )}
                        </div>

                        <Button size="lg" fullWidth onClick={handleStart}>
                            Start Workout
                        </Button>
                    </div>
                )}

                {/* Work State */}
                {timerState === 'work' && (
                    <div className="timer-state timer-work fade-in">
                        <div className="set-indicator">
                            <span className="set-label">SET {currentSet} OF {exercise.sets}</span>
                            {exercise.isPaired && (
                                <span className={`side-indicator ${currentSide}`}>
                                    {currentSide === 'left' ? 'Left Side' : 'Right Side'}
                                </span>
                            )}
                        </div>

                        <div className="work-ring-container">
                            <ProgressRing 
                                progress={workProgress} 
                                size={300} 
                                strokeWidth={24} 
                                color={getTimerColor()}
                            />
                            <div className="work-inner">
                                {exercise.type === 'hold' ? (
                                    <>
                                        <span className="timer-display">{formatTime(timeLeft)}</span>
                                        <span className="timer-unit">remaining</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="rep-count">{exercise.reps}</span>
                                        <span className="rep-label">reps</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {exercise.type !== 'hold' && (
                            <Button size="lg" fullWidth onClick={handleRepComplete}>
                                Complete Reps
                            </Button>
                        )}
                    </div>
                )}

                {/* Rest State */}
                {timerState === 'rest' && (
                    <div className="timer-state timer-rest fade-in">
                        <div className="rest-header">
                            <span className="rest-title">Rest</span>
                            <span className="rest-next">
                                {exercise.isPaired && currentSide === 'right' 
                                    ? 'Right side next' 
                                    : `Set ${Math.min(currentSet + 1, exercise.sets)} next`}
                            </span>
                        </div>

                        <div className="rest-ring-container">
                            <ProgressRing 
                                progress={restProgress} 
                                size={280} 
                                strokeWidth={20} 
                                color="var(--color-stand)"
                            />
                            <div className="rest-inner">
                                <span className="timer-display">{formatTime(timeLeft)}</span>
                            </div>
                        </div>

                        <Button variant="secondary" size="lg" fullWidth onClick={handleSkipRest}>
                            Skip Rest
                        </Button>
                    </div>
                )}

                {/* Complete State */}
                {timerState === 'complete' && (
                    <div className="timer-state timer-complete fade-in">
                        <div className="complete-celebration">
                            <div className="complete-rings">
                                <ProgressRing progress={100} size={200} strokeWidth={16} color="var(--color-move)" />
                                <ProgressRing progress={100} size={160} strokeWidth={16} color="var(--color-exercise)" />
                                <ProgressRing progress={100} size={120} strokeWidth={16} color="var(--color-stand)" />
                            </div>
                            <div className="complete-check">
                                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                                    <path 
                                        d="M14 24l8 8 12-16" 
                                        stroke="var(--color-accent-green)" 
                                        strokeWidth="4" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round"
                                        className="check-path"
                                    />
                                </svg>
                            </div>
                        </div>

                        <div className="complete-text">
                            <h2 className="complete-title">Workout Complete!</h2>
                            <p className="complete-subtitle">Great job finishing {exercise.name}</p>
                        </div>

                        <div className="complete-stats">
                            <div className="complete-stat">
                                <span className="complete-stat-value">{exercise.sets}</span>
                                <span className="complete-stat-label">Sets</span>
                            </div>
                            <div className="complete-stat">
                                <span className="complete-stat-value">
                                    {exercise.type === 'hold' 
                                        ? `${(exercise.holdDuration || 0) * exercise.sets}s`
                                        : (exercise.reps || 0) * exercise.sets}
                                </span>
                                <span className="complete-stat-label">
                                    {exercise.type === 'hold' ? 'Total Time' : 'Total Reps'}
                                </span>
                            </div>
                        </div>

                        <div className="complete-actions">
                            <Button fullWidth variant="primary" size="lg" onClick={() => navigate('/exercises')}>
                                Continue
                            </Button>
                            <button className="text-action" onClick={() => navigate('/')}>
                                Back to Summary
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
