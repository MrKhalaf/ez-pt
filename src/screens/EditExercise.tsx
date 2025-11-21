import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useExercises } from '../context/ExerciseContext';
import { Button } from '../components/Button';
import { Exercise, ExerciseType } from '../models/Exercise';
import './EditExercise.css';

export const EditExercise: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getExerciseById, updateExercise } = useExercises();

    const [exercise, setExercise] = useState<Exercise | null>(null);

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

    if (!exercise) return null;

    return (
        <div className="page">
            <div className="page-header">
                <Button variant="ghost" onClick={() => navigate('/exercises')}>
                    ← Back
                </Button>
                <h1>Edit Exercise</h1>
            </div>

            <div className="page-content">
                <div className="edit-form">

                    {/* Basic Info */}
                    <div className="form-section">
                        <label className="form-label">Name</label>
                        <input
                            className="form-input"
                            value={exercise.name}
                            onChange={e => setExercise({ ...exercise, name: e.target.value })}
                        />
                    </div>

                    {/* Type & Sides */}
                    <div className="form-row">
                        <div className="form-section">
                            <label className="form-label">Type</label>
                            <select
                                className="form-select"
                                value={exercise.type}
                                onChange={e => setExercise({ ...exercise, type: e.target.value as ExerciseType })}
                            >
                                <option value="rep">Reps</option>
                                <option value="hold">Hold (Time)</option>
                            </select>
                        </div>

                        <div className="form-section">
                            <label className="form-label">Sides</label>
                            <div className="toggle-wrapper">
                                <label className="toggle-label">
                                    <input
                                        type="checkbox"
                                        checked={exercise.isPaired}
                                        onChange={e => setExercise({ ...exercise, isPaired: e.target.checked })}
                                    />
                                    <span className="toggle-text">{exercise.isPaired ? 'L + R' : 'Single'}</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Parameters */}
                    <div className="form-row">
                        <div className="form-section">
                            <label className="form-label">Sets</label>
                            <input
                                type="number"
                                className="form-input"
                                value={exercise.sets}
                                onChange={e => setExercise({ ...exercise, sets: Number(e.target.value) })}
                            />
                        </div>

                        {exercise.type === 'rep' ? (
                            <div className="form-section">
                                <label className="form-label">Reps</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={exercise.reps || 0}
                                    onChange={e => setExercise({ ...exercise, reps: Number(e.target.value) })}
                                />
                            </div>
                        ) : (
                            <div className="form-section">
                                <label className="form-label">Hold (sec)</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={exercise.holdDuration || 0}
                                    onChange={e => setExercise({ ...exercise, holdDuration: Number(e.target.value) })}
                                />
                            </div>
                        )}
                    </div>

                    <div className="form-section">
                        <label className="form-label">Rest Time (seconds)</label>
                        <input
                            type="number"
                            className="form-input"
                            value={exercise.restTime}
                            onChange={e => setExercise({ ...exercise, restTime: Number(e.target.value) })}
                        />
                    </div>

                    <div className="form-actions">
                        <Button fullWidth variant="primary" onClick={handleSave}>
                            Save Changes
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    );
};
