import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useExercises } from '../context/ExerciseContext';
import { useProgress } from '../context/ProgressContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/Button';
import { formatTime, haptics } from '../utils/helpers';
import './TimerScreen.css';

type TimerState = 'ready' | 'work' | 'rest' | 'complete';
type Side = 'left' | 'right' | 'both';

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
            // After work, check if we need to switch sides or rest
            if (exercise?.isPaired && currentSide === 'left') {
                // Switch to right side
                setCurrentSide('right');
                setTimerState('rest');
                setTimeLeft(exercise.restTime);
                setIsRunning(true);
            } else if (exercise?.isPaired && currentSide === 'right') {
                // Completed both sides, move to rest before next set
                setCurrentSide('left');
                if (currentSet < (exercise?.sets || 0)) {
                    setTimerState('rest');
                    setTimeLeft(exercise.restTime);
                    setIsRunning(true);
                } else {
                    // All sets complete
                    completeExercise();
                }
            } else {
                // Not paired, just rest or complete
                if (currentSet < (exercise?.sets || 0)) {
                    setTimerState('rest');
                    setTimeLeft(exercise!.restTime);
                    setIsRunning(true);
                } else {
                    completeExercise();
                }
            }
        } else if (timerState === 'rest') {
            // After rest, start next work period
            if (exercise?.isPaired && currentSide === 'left') {
                // Already switched to left for next set
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
    };

    const handleRepComplete = () => {
        handleTimerComplete();
    };

    if (!exercise) return null;

    return (
        <div className="timer-screen">
            <div className="timer-header">
                <Button variant="ghost" onClick={() => navigate(-1)}>
                    ← Back
                </Button>
                <h2>{exercise.name}</h2>
            </div>

            <div className="timer-content">
                {timerState === 'ready' && (
                    <div className="timer-ready fade-in">
                        <div className="timer-display-large">Ready</div>
                        <p className="timer-instructions">{exercise.instructions[0]}</p>
                        <div className="timer-info">
                            <div className="timer-info-item">
                                <span className="label">Sets</span>
                                <span className="value">{exercise.sets}</span>
                            </div>
                            <div className="timer-info-item">
                                <span className="label">
                                    {exercise.type === 'hold' ? 'Hold' : 'Reps'}
                                </span>
                                <span className="value">
                                    {exercise.type === 'hold'
                                        ? `${exercise.holdDuration}s`
                                        : exercise.reps}
                                </span>
                            </div>
                            {exercise.isPaired && (
                                <div className="timer-info-item">
                                    <span className="label">Sides</span>
                                    <span className="value">L + R</span>
                                </div>
                            )}
                        </div>
                        <Button size="lg" fullWidth onClick={handleStart}>
                            Start Exercise
                        </Button>
                    </div>
                )}

                {timerState === 'work' && (
                    <div className="timer-active fade-in">
                        <div className="timer-set-indicator">
                            Set {currentSet} of {exercise.sets}
                            {exercise.isPaired && ` (${currentSide === 'left' ? 'Left' : 'Right'} Side)`}
                        </div>

                        {exercise.type === 'hold' ? (
                            <div className="timer-display-large timer-countdown">
                                {formatTime(timeLeft)}
                            </div>
                        ) : (
                            <div className="timer-rep-counter">
                                <div className="rep-text">Complete {exercise.reps} reps</div>
                                <Button size="lg" fullWidth onClick={handleRepComplete}>
                                    Done with Reps
                                </Button>
                            </div>
                        )}

                        <div className="timer-progress-ring">
                            <svg width="200" height="200">
                                <circle
                                    cx="100"
                                    cy="100"
                                    r="90"
                                    fill="none"
                                    stroke="var(--color-bg-tertiary)"
                                    strokeWidth="12"
                                />
                                <circle
                                    cx="100"
                                    cy="100"
                                    r="90"
                                    fill="none"
                                    stroke="var(--color-primary)"
                                    strokeWidth="12"
                                    strokeDasharray={`${2 * Math.PI * 90}`}
                                    strokeDashoffset={
                                        exercise.type === 'hold'
                                            ? 2 * Math.PI * 90 * (1 - timeLeft / (exercise.holdDuration || 1))
                                            : 0
                                    }
                                    transform="rotate(-90 100 100)"
                                    style={{ transition: 'stroke-dashoffset 1s linear' }}
                                />
                            </svg>
                        </div>
                    </div>
                )}

                {timerState === 'rest' && (
                    <div className="timer-rest fade-in">
                        <div className="timer-display-large">Rest</div>
                        <div className="timer-countdown-large">{formatTime(timeLeft)}</div>
                        <Button variant="secondary" onClick={handleSkipRest}>
                            Skip Rest
                        </Button>
                    </div>
                )}

                {timerState === 'complete' && (
                    <div className="timer-complete fade-in celebrate">
                        <div className="complete-icon">🎉</div>
                        <h2>Exercise Complete!</h2>
                        <p>Great job! You completed all sets.</p>
                        <div className="complete-actions">
                            <Button fullWidth variant="primary" onClick={() => navigate('/exercises')}>
                                Back to Exercises
                            </Button>
                            <Button fullWidth variant="secondary" onClick={() => navigate('/')}>
                                Go Home
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
