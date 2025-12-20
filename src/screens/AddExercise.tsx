import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExercises } from '../context/ExerciseContext';
import { Button } from '../components/Button';
import { Exercise, ExerciseType, ExerciseCategory } from '../models/Exercise';
import './EditExercise.css';

export const AddExercise: React.FC = () => {
    const navigate = useNavigate();
    const { exercises, addExercise } = useExercises();

    const [exercise, setExercise] = useState<Omit<Exercise, 'id'>>({
        name: '',
        category: 'Core Stability',
        type: 'rep',
        sets: 3,
        reps: 10,
        holdDuration: 30,
        restTime: 30,
        instructions: [''],
        isPaired: false,
    });

    const categories: ExerciseCategory[] = ['Core Stability', 'Lower Body', 'Upper Body', 'Mobility', 'Other'];

    const handleSave = () => {
        if (!exercise.name.trim()) {
            return;
        }

        // Generate new ID
        const maxId = exercises.reduce((max, ex) => Math.max(max, ex.id), 0);
        const newExercise: Exercise = {
            ...exercise,
            id: maxId + 1,
            instructions: exercise.instructions.filter(i => i.trim() !== ''),
        };

        addExercise(newExercise);
        navigate('/exercises');
    };

    return (
        <div className="page edit-page">
            <div className="edit-header">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6"/>
                    </svg>
                    <span>Back</span>
                </button>
                <h1>New Exercise</h1>
                <button 
                    className="save-button" 
                    onClick={handleSave}
                    disabled={!exercise.name.trim()}
                    style={{ opacity: exercise.name.trim() ? 1 : 0.4 }}
                >
                    Add
                </button>
            </div>

            <div className="page-content">
                <div className="edit-form">

                    {/* Name Input */}
                    <div className="form-group">
                        <label className="form-label">Exercise Name</label>
                        <input
                            className="form-input"
                            type="text"
                            value={exercise.name}
                            onChange={e => setExercise({ ...exercise, name: e.target.value })}
                            placeholder="Enter exercise name"
                            autoFocus
                        />
                    </div>

                    {/* Category Selection */}
                    <div className="form-group">
                        <label className="form-label">Category</label>
                        <div className="category-selector">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    className={`category-option ${exercise.category === cat ? 'active' : ''}`}
                                    onClick={() => setExercise({ ...exercise, category: cat })}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Type Selection */}
                    <div className="form-group">
                        <label className="form-label">Exercise Type</label>
                        <div className="segment-control">
                            <button
                                className={`segment ${exercise.type === 'rep' ? 'active' : ''}`}
                                onClick={() => setExercise({ ...exercise, type: 'rep' as ExerciseType })}
                            >
                                Reps
                            </button>
                            <button
                                className={`segment ${exercise.type === 'hold' ? 'active' : ''}`}
                                onClick={() => setExercise({ ...exercise, type: 'hold' as ExerciseType })}
                            >
                                Hold
                            </button>
                        </div>
                    </div>

                    {/* Paired Toggle */}
                    <div className="form-row-inline">
                        <div className="form-row-info">
                            <span className="form-label">Bilateral (L + R)</span>
                            <span className="form-hint">Exercise both sides separately</span>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={exercise.isPaired}
                                onChange={e => {
                                    const isPaired = e.target.checked;
                                    if (isPaired) {
                                        // Apply L+R exercise defaults
                                        setExercise({
                                            ...exercise,
                                            isPaired: true,
                                            sets: 5,
                                            holdDuration: 13,
                                            restTime: 6,
                                        });
                                    } else {
                                        setExercise({ ...exercise, isPaired: false });
                                    }
                                }}
                            />
                            <span className="toggle-track">
                                <span className="toggle-thumb" />
                            </span>
                        </label>
                    </div>

                    {/* Numeric Inputs */}
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Sets</label>
                            <div className="stepper">
                                <button 
                                    className="stepper-btn"
                                    onClick={() => setExercise({ ...exercise, sets: Math.max(1, exercise.sets - 1) })}
                                >
                                    −
                                </button>
                                <span className="stepper-value">{exercise.sets}</span>
                                <button 
                                    className="stepper-btn"
                                    onClick={() => setExercise({ ...exercise, sets: exercise.sets + 1 })}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {exercise.type === 'rep' ? (
                            <div className="form-group">
                                <label className="form-label">Reps</label>
                                <div className="stepper">
                                    <button 
                                        className="stepper-btn"
                                        onClick={() => setExercise({ ...exercise, reps: Math.max(1, (exercise.reps || 1) - 1) })}
                                    >
                                        −
                                    </button>
                                    <span className="stepper-value">{exercise.reps || 0}</span>
                                    <button 
                                        className="stepper-btn"
                                        onClick={() => setExercise({ ...exercise, reps: (exercise.reps || 0) + 1 })}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="form-group">
                                <label className="form-label">Hold (sec)</label>
                                <div className="stepper">
                                    <button 
                                        className="stepper-btn"
                                        onClick={() => setExercise({ ...exercise, holdDuration: Math.max(5, (exercise.holdDuration || 5) - 5) })}
                                    >
                                        −
                                    </button>
                                    <span className="stepper-value">{exercise.holdDuration || 0}</span>
                                    <button 
                                        className="stepper-btn"
                                        onClick={() => setExercise({ ...exercise, holdDuration: (exercise.holdDuration || 0) + 5 })}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Rest Time (seconds)</label>
                        <div className="stepper stepper-wide">
                            <button 
                                className="stepper-btn"
                                onClick={() => setExercise({ ...exercise, restTime: Math.max(5, exercise.restTime - 5) })}
                            >
                                −
                            </button>
                            <span className="stepper-value">{exercise.restTime}s</span>
                            <button 
                                className="stepper-btn"
                                onClick={() => setExercise({ ...exercise, restTime: exercise.restTime + 5 })}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Equipment (optional) */}
                    <div className="form-group">
                        <label className="form-label">Equipment (optional)</label>
                        <input
                            className="form-input"
                            type="text"
                            value={exercise.equipmentNeeded || ''}
                            onChange={e => setExercise({ ...exercise, equipmentNeeded: e.target.value || undefined })}
                            placeholder="e.g., Resistance band, Yoga mat"
                        />
                    </div>

                    {/* Save Button */}
                    <div className="form-actions">
                        <Button 
                            fullWidth 
                            variant="primary" 
                            size="lg" 
                            onClick={handleSave}
                            disabled={!exercise.name.trim()}
                        >
                            Add Exercise
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    );
};

