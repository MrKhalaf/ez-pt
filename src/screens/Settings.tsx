import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './Settings.css';

export const Settings: React.FC = () => {
    const { settings, updateSettings, theme } = useTheme();

    return (
        <div className="page settings-page">
            <div className="page-header">
                <h1>Settings</h1>
            </div>

            <div className="page-content">
                {/* Appearance Section */}
                <section className="settings-section fade-in">
                    <h2 className="settings-section-title">Appearance</h2>
                    <div className="settings-group">
                        <div className="settings-row">
                            <div className="settings-row-icon">
                                {theme === 'dark' ? '🌙' : '☀️'}
                            </div>
                            <div className="settings-row-content">
                                <span className="settings-row-label">Theme</span>
                                <span className="settings-row-value">
                                    {theme === 'dark' ? 'Dark' : 'Light'}
                                </span>
                            </div>
                            <div className="theme-toggle-group">
                                <button 
                                    className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                                    onClick={() => updateSettings({ theme: 'light' })}
                                    aria-label="Light theme"
                                >
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                        <circle cx="10" cy="10" r="4"/>
                                        <path d="M10 1v2M10 17v2M1 10h2M17 10h2M3.93 3.93l1.41 1.41M14.66 14.66l1.41 1.41M3.93 16.07l1.41-1.41M14.66 5.34l1.41-1.41"/>
                                    </svg>
                                </button>
                                <button 
                                    className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                                    onClick={() => updateSettings({ theme: 'dark' })}
                                    aria-label="Dark theme"
                                >
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Timer Section */}
                <section className="settings-section fade-in stagger-1">
                    <h2 className="settings-section-title">Timer Defaults</h2>
                    <div className="settings-group">
                        <div className="settings-row">
                            <div className="settings-row-icon">⏱️</div>
                            <div className="settings-row-content">
                                <span className="settings-row-label">Rest Time</span>
                                <span className="settings-row-hint">Between sets</span>
                            </div>
                            <div className="stepper-compact">
                                <button 
                                    className="stepper-btn"
                                    onClick={() => updateSettings({ 
                                        defaultRestTime: Math.max(5, settings.defaultRestTime - 5) 
                                    })}
                                >
                                    −
                                </button>
                                <span className="stepper-value">{settings.defaultRestTime}s</span>
                                <button 
                                    className="stepper-btn"
                                    onClick={() => updateSettings({ 
                                        defaultRestTime: Math.min(120, settings.defaultRestTime + 5) 
                                    })}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="settings-divider" />

                        <div className="settings-row">
                            <div className="settings-row-icon">⏳</div>
                            <div className="settings-row-content">
                                <span className="settings-row-label">Hold Duration</span>
                                <span className="settings-row-hint">For hold exercises</span>
                            </div>
                            <div className="stepper-compact">
                                <button 
                                    className="stepper-btn"
                                    onClick={() => updateSettings({ 
                                        defaultHoldTime: Math.max(5, settings.defaultHoldTime - 5) 
                                    })}
                                >
                                    −
                                </button>
                                <span className="stepper-value">{settings.defaultHoldTime}s</span>
                                <button 
                                    className="stepper-btn"
                                    onClick={() => updateSettings({ 
                                        defaultHoldTime: Math.min(60, settings.defaultHoldTime + 5) 
                                    })}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Preferences Section */}
                <section className="settings-section fade-in stagger-2">
                    <h2 className="settings-section-title">Preferences</h2>
                    <div className="settings-group">
                        <div className="settings-row">
                            <div className="settings-row-icon">📳</div>
                            <div className="settings-row-content">
                                <span className="settings-row-label">Haptic Feedback</span>
                                <span className="settings-row-hint">Vibrate on timer events</span>
                            </div>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={settings.hapticFeedback}
                                    onChange={(e) => updateSettings({ hapticFeedback: e.target.checked })}
                                />
                                <span className="toggle-track">
                                    <span className="toggle-thumb" />
                                </span>
                            </label>
                        </div>

                        <div className="settings-divider" />

                        <div className="settings-row">
                            <div className="settings-row-icon">📖</div>
                            <div className="settings-row-content">
                                <span className="settings-row-label">Show Instructions</span>
                                <span className="settings-row-hint">Display exercise guidance</span>
                            </div>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={settings.showInstructions}
                                    onChange={(e) => updateSettings({ showInstructions: e.target.checked })}
                                />
                                <span className="toggle-track">
                                    <span className="toggle-thumb" />
                                </span>
                            </label>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section className="settings-section fade-in stagger-3">
                    <h2 className="settings-section-title">About</h2>
                    <div className="about-card">
                        <div className="about-header">
                            <div className="about-icon">
                                <div className="about-ring outer" />
                                <div className="about-ring middle" />
                                <div className="about-ring inner" />
                            </div>
                            <div className="about-info">
                                <h3 className="about-name">Rehabber</h3>
                                <span className="about-tagline">Your recovery companion</span>
                            </div>
                        </div>
                        <div className="about-version">
                            <span className="version-label">Version</span>
                            <span className="version-number">1.0.0</span>
                        </div>
                        <p className="about-description">
                            Track your physical therapy exercises, build consistent habits, and stay motivated on your recovery journey.
                        </p>
                    </div>
                </section>

                {/* Footer */}
                <footer className="settings-footer fade-in stagger-4">
                    <p>Made with ❤️ for your recovery</p>
                </footer>
            </div>
        </div>
    );
};
