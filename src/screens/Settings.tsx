import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './Settings.css';

export const Settings: React.FC = () => {
    const { settings, updateSettings } = useTheme();

    return (
        <div className="page settings-page">
            {/* Header */}
            <header className="settings-header">
                <div className="settings-header-inner">
                    <div className="settings-header-left">
                        <span className="material-symbols-outlined">menu</span>
                        <h1 className="settings-title">Profile</h1>
                    </div>
                </div>
            </header>

            <main className="settings-main">
                {/* App name block */}
                <div className="settings-hero fade-in">
                    <p className="settings-hero-sub">Physical Therapy Tracker</p>
                    <h2 className="settings-hero-name">PT LOG</h2>
                    <span className="settings-hero-version">v1.0.0</span>
                </div>

                {/* Timer defaults */}
                <section className="settings-section fade-in stagger-1">
                    <h3 className="settings-section-label">Timer Defaults</h3>

                    <div className="settings-rows">
                        <div className="settings-row">
                            <div className="settings-row-info">
                                <span className="settings-row-label">Rest Time</span>
                                <span className="settings-row-hint">Between sets</span>
                            </div>
                            <div className="stepper">
                                <button
                                    className="stepper-btn"
                                    onClick={() => updateSettings({ defaultRestTime: Math.max(5, settings.defaultRestTime - 5) })}
                                >−</button>
                                <span className="stepper-val">{settings.defaultRestTime}s</span>
                                <button
                                    className="stepper-btn"
                                    onClick={() => updateSettings({ defaultRestTime: Math.min(120, settings.defaultRestTime + 5) })}
                                >+</button>
                            </div>
                        </div>

                        <div className="settings-divider" />

                        <div className="settings-row">
                            <div className="settings-row-info">
                                <span className="settings-row-label">Hold Duration</span>
                                <span className="settings-row-hint">For hold exercises</span>
                            </div>
                            <div className="stepper">
                                <button
                                    className="stepper-btn"
                                    onClick={() => updateSettings({ defaultHoldTime: Math.max(5, settings.defaultHoldTime - 5) })}
                                >−</button>
                                <span className="stepper-val">{settings.defaultHoldTime}s</span>
                                <button
                                    className="stepper-btn"
                                    onClick={() => updateSettings({ defaultHoldTime: Math.min(60, settings.defaultHoldTime + 5) })}
                                >+</button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Preferences */}
                <section className="settings-section fade-in stagger-2">
                    <h3 className="settings-section-label">Preferences</h3>

                    <div className="settings-rows">
                        {[
                            { key: 'hapticFeedback', label: 'Haptic Feedback', hint: 'Vibrate on timer events' },
                            { key: 'timerSound',     label: 'Timer Sounds',    hint: 'Play sounds on state changes' },
                            { key: 'showInstructions', label: 'Show Instructions', hint: 'Display exercise guidance' },
                        ].map((pref, i) => (
                            <React.Fragment key={pref.key}>
                                {i > 0 && <div className="settings-divider" />}
                                <div className="settings-row">
                                    <div className="settings-row-info">
                                        <span className="settings-row-label">{pref.label}</span>
                                        <span className="settings-row-hint">{pref.hint}</span>
                                    </div>
                                    <label className="toggle">
                                        <input
                                            type="checkbox"
                                            checked={settings[pref.key as keyof typeof settings] as boolean}
                                            onChange={e => updateSettings({ [pref.key]: e.target.checked })}
                                        />
                                        <span className="toggle-track">
                                            <span className="toggle-thumb" />
                                        </span>
                                    </label>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </section>

                {/* Data */}
                <section className="settings-section fade-in stagger-3">
                    <h3 className="settings-section-label">Data</h3>

                    <div className="settings-rows">
                        <Link to="/exercises/add" className="settings-row settings-link">
                            <div className="settings-row-info">
                                <span className="settings-row-label">Add New Exercise</span>
                                <span className="settings-row-hint">Create a custom exercise</span>
                            </div>
                            <span className="material-symbols-outlined settings-chevron">chevron_right</span>
                        </Link>
                    </div>
                </section>

                <footer className="settings-footer fade-in stagger-4">
                    <p>Recovery is a journey — show up for yourself.</p>
                </footer>
            </main>
        </div>
    );
};
