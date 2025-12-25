// Haptic feedback using Vibration API
// Note: Vibration API requires user gesture and may not work on all devices (e.g., iOS)
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

// Audio context for sound effects (lazy initialized)
let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
    if (!audioContext && typeof AudioContext !== 'undefined') {
        try {
            audioContext = new AudioContext();
        } catch {
            return null;
        }
    }
    return audioContext;
};

// Sound effects using Web Audio API
export const sounds = {
    // Light click/tap sound
    tap: () => {
        const ctx = getAudioContext();
        if (!ctx) return;

        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.value = 1200;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.08);
    },

    // Start/begin sound - ascending tone
    start: () => {
        const ctx = getAudioContext();
        if (!ctx) return;

        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.setValueAtTime(600, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.15);
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.15);
    },

    // Timer complete - pleasant double beep
    complete: () => {
        const ctx = getAudioContext();
        if (!ctx) return;

        // First beep
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.connect(gain1);
        gain1.connect(ctx.destination);

        osc1.frequency.value = 880;
        osc1.type = 'sine';
        gain1.gain.setValueAtTime(0.12, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc1.start(ctx.currentTime);
        osc1.stop(ctx.currentTime + 0.12);

        // Second beep (higher)
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);

        osc2.frequency.value = 1100;
        osc2.type = 'sine';
        gain2.gain.setValueAtTime(0.12, ctx.currentTime + 0.15);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.27);
        osc2.start(ctx.currentTime + 0.15);
        osc2.stop(ctx.currentTime + 0.27);
    },

    // Success/celebration - ascending triple tone
    success: () => {
        const ctx = getAudioContext();
        if (!ctx) return;

        const frequencies = [700, 880, 1100];

        frequencies.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            const startTime = ctx.currentTime + i * 0.12;
            osc.frequency.value = freq;
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.1, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);
            osc.start(startTime);
            osc.stop(startTime + 0.15);
        });
    },

    // Rest period - soft low tone
    rest: () => {
        const ctx = getAudioContext();
        if (!ctx) return;

        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.value = 440;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.2);
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
