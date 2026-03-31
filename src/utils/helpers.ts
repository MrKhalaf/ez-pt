export const haptics = {
    light: () => {
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    },

    medium: () => {
        if ('vibrate' in navigator) {
            navigator.vibrate(100);
        }
    },

    heavy: () => {
        if ('vibrate' in navigator) {
            navigator.vibrate(150);
        }
    },

    success: () => {
        if ('vibrate' in navigator) {
            navigator.vibrate([50, 80, 100]);
        }
    },

    error: () => {
        if ('vibrate' in navigator) {
            navigator.vibrate([100, 50, 100, 50, 100]);
        }
    }
};

let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
    if (!audioContext && typeof AudioContext !== 'undefined') {
        try {
            audioContext = new AudioContext();
        } catch {
            return null;
        }
    }
    // Resume if browser suspended the context during inactivity
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    }
    return audioContext;
};

const playTone = (
    freq: number,
    duration: number,
    volume: number,
    offset = 0,
    freqRamp?: number,
): void => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const start = ctx.currentTime + offset;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, start);
    if (freqRamp) {
        osc.frequency.exponentialRampToValueAtTime(freqRamp, start + duration);
    }

    gain.gain.setValueAtTime(volume, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

    osc.start(start);
    osc.stop(start + duration);
};

export const sounds = {
    tap: () => playTone(1200, 0.08, 0.1),

    start: () => playTone(600, 0.15, 0.15, 0, 900),

    complete: () => {
        playTone(880, 0.12, 0.12);
        playTone(1100, 0.12, 0.12, 0.15);
    },

    success: () => {
        [700, 880, 1100].forEach((freq, i) => playTone(freq, 0.15, 0.1, i * 0.12));
    },

    rest: () => playTone(440, 0.2, 0.08),
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
