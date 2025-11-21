export interface Settings {
    defaultRestTime: number; // Seconds
    defaultHoldTime: number; // Seconds
    theme: 'light' | 'dark' | 'auto';
    hapticFeedback: boolean;
    dailyResetTime: string; // HH:MM format (default "04:00")
    sideStrategy: 'alternate' | 'complete-left-first' | 'complete-right-first';
    showInstructions: boolean;
    timerSound: boolean;
}

export const defaultSettings: Settings = {
    defaultRestTime: 10,
    defaultHoldTime: 13,
    theme: 'dark',
    hapticFeedback: true,
    dailyResetTime: '04:00',
    sideStrategy: 'alternate',
    showInstructions: true,
    timerSound: true,
};
