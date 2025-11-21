import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/Button';
import './Settings.css';

export const Settings: React.FC = () => {
    const { settings, updateSettings, toggleTheme, theme } = useTheme();

    return (
        <div className="page">
            <div className="page-header">
                <h1>Settings</h1>
                <p className="text-secondary">Customize your experience</p>
            </div>

            <div className="page-content">
                <div className="settings-section">
                    <h2>Appearance</h2>
                    <div className="setting-item">
                        <div className="setting-info">
                            <div className="setting-label">Theme</div>
                            <div className="setting-description">
                                Current: {theme === 'dark' ? 'Dark' : 'Light'}
                            </div>
                        </div>
                        <Button variant="secondary" onClick={toggleTheme}>
                            Toggle Theme
                        </Button>
                    </div>
                </div>

                <div className="settings-section">
                    <h2>Timer Defaults</h2>
                    <div className="setting-item">
                        <div className="setting-info">
                            <label htmlFor="rest-time" className="setting-label">Rest Time (seconds)</label>
                            <div className="setting-description">
                                Default rest between sets
                            </div>
                        </div>
                        <input
                            id="rest-time"
                            type="number"
                            min="5"
                            max="120"
                            value={settings.defaultRestTime}
                            onChange={(e) => updateSettings({ defaultRestTime: Number(e.target.value) })}
                            className="setting-input"
                        />
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <label htmlFor="hold-time" className="setting-label">Hold Time (seconds)</label>
                            <div className="setting-description">
                                Default hold duration for exercises
                            </div>
                        </div>
                        <input
                            id="hold-time"
                            type="number"
                            min="5"
                            max="60"
                            value={settings.defaultHoldTime}
                            onChange={(e) => updateSettings({ defaultHoldTime: Number(e.target.value) })}
                            className="setting-input"
                        />
                    </div>
                </div>

                <div className="settings-section">
                    <h2>Preferences</h2>
                    <div className="setting-item">
                        <div className="setting-info">
                            <div className="setting-label">Haptic Feedback</div>
                            <div className="setting-description">
                                Vibrate on timer events
                            </div>
                        </div>
                        <label className="toggle">
                            <input
                                type="checkbox"
                                checked={settings.hapticFeedback}
                                onChange={(e) => updateSettings({ hapticFeedback: e.target.checked })}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <div className="setting-label">Show Instructions</div>
                            <div className="setting-description">
                                Display exercise instructions
                            </div>
                        </div>
                        <label className="toggle">
                            <input
                                type="checkbox"
                                checked={settings.showInstructions}
                                onChange={(e) => updateSettings({ showInstructions: e.target.checked })}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                </div>

                <div className="settings-section">
                    <h2>About</h2>
                    <div className="about-card">
                        <h3>Rehabber</h3>
                        <p>Your digital rehabilitation assistant</p>
                        <p className="version">Version 1.0.0</p>
                        <p className="description">
                            Track your physical therapy exercises, build consistent habits, and stay motivated on your recovery journey.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
