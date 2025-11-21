// Haptic feedback using Vibration API
export const haptics = {
    light: () => {
        if ('vibrate' in navigator) {
            navigator.vibrate(10);
        }
    },

    medium: () => {
        if ('vibrate' in navigator) {
            navigator.vibrate(20);
        }
    },

    heavy: () => {
        if ('vibrate' in navigator) {
            navigator.vibrate(30);
        }
    },

    success: () => {
        if ('vibrate' in navigator) {
            navigator.vibrate([10, 50, 10]);
        }
    },

    error: () => {
        if ('vibrate' in navigator) {
            navigator.vibrate([20, 100, 20, 100, 20]);
        }
    }
};

// Format time (seconds to MM:SS)
export const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Format date
export const formatDate = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });
};

// Get today's date in YYYY-MM-DD format
export const getTodayString = (): string => {
    return new Date().toISOString().split('T')[0];
};

// Check if it's time for daily reset (default 4AM)
export const shouldResetDaily = (lastResetTime: string, resetHour: number = 4): boolean => {
    const now = new Date();
    const lastReset = new Date(lastResetTime);

    const currentHour = now.getHours();
    const lastResetHour = lastReset.getHours();

    // If we've crossed the reset hour since last reset
    if (currentHour >= resetHour && lastResetHour < resetHour) {
        return true;
    }

    // If it's a new day and past reset hour
    if (now.getDate() !== lastReset.getDate() && currentHour >= resetHour) {
        return true;
    }

    return false;
};

// Generate unique ID
export const generateId = (): number => {
    return Date.now() + Math.floor(Math.random() * 1000);
};

// Calculate completion percentage
export const calculateCompletionRate = (completed: number, total: number): number => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
};
