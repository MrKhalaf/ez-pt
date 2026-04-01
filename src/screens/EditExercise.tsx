import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useExercises } from '../context/ExerciseContext';
import { Button } from '../components/Button';
import { Exercise, ExerciseType } from '../models/Exercise';

import './EditExercise.css';

export const EditExercise: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getExerciseById, updateExercise, deleteExercise, categories } = useExercises();

    const [exercise, setExercise] = useState<Exercise | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (id) {
            const found = getExerciseById(Number(id));
            if (found) {
                setExercise(JSON.parse(JSON.stringify(found))); // Deep copy
            } else {
                navigate('/exercises');
            }
        }
    }, [id, getExerciseById, navigate]);

    const handleSave = () => {
        if (exercise && id) {
            updateExercise(Number(id), exercise);
            navigate('/exercises');
        }
    };

    const handleDelete = () => {
        if (id) {
            deleteExercise(Number(id));
            navigate('/exercises');
        }
    };

    if (!exercise) return null;

    return (
        <div className="page edit-page">
            <div className="edit-header">
                <button className="back-button" onClick={() => navigate('/exercises')}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6"/>
                    </svg>
                    <span>Exercises</span>
                </button>
                <h1>Edit</h1>
                <button className="save-button" onClick={handleSave}>
                    Save
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
                        />
                    </div>

                    {/* Category */}
                    <div className="form-group">
                        <label className="form-label">Session</label>
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
                                onChange={e => setExercise({ ...exercise, isPaired: e.target.checked })}
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

                    {/* Save Button */}
                    <div className="form-actions">
                        <Button fullWidth variant="primary" size="lg" onClick={handleSave}>
                            Save Changes
                        </Button>
                    </div>

                    {/* Delete Button */}
                    <div className="form-actions-danger">
                        <button
                            className="delete-exercise-btn"
                            onClick={() => setShowDeleteConfirm(true)}
                        >
                            Remove Exercise
                        </button>
                    </div>

                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2>Remove Exercise?</h2>
                        <p>"{exercise.name}" will be removed from your exercises. This cannot be undone.</p>
                        <div className="modal-actions">
                            <button
                                className="modal-btn modal-btn-cancel"
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="modal-btn modal-btn-delete"
                                onClick={handleDelete}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
