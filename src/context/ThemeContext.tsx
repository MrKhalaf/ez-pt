import React, { createContext, useContext, useEffect, useState } from 'react';
import { Settings, defaultSettings } from '../models/Settings';
import { settingsStorage } from '../utils/storage';

interface ThemeContextType {
    theme: 'light' | 'dark';
    settings: Settings;
    updateSettings: (updates: Partial<Settings>) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');

    useEffect(() => {
        const stored = settingsStorage.get();
        setSettings(stored);

        const resolvedTheme = stored.theme === 'auto'
            ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
            : stored.theme;

        setTheme(resolvedTheme);
        document.documentElement.setAttribute('data-theme', resolvedTheme);
    }, []);

    const updateSettings = (updates: Partial<Settings>) => {
        const newSettings = { ...settings, ...updates };
        setSettings(newSettings);
        settingsStorage.save(newSettings);

        if (updates.theme) {
            const resolvedTheme = updates.theme === 'auto'
                ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
                : updates.theme;
            setTheme(resolvedTheme);
            document.documentElement.setAttribute('data-theme', resolvedTheme);
        }
    };

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        updateSettings({ theme: newTheme });
    };

    return (
        <ThemeContext.Provider value={{ theme, settings, updateSettings, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};
