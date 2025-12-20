import { Exercise } from '../models/Exercise';

export const defaultExercises: Exercise[] = [
    // Core Stability
    {
        id: 1,
        name: 'McGill Big 3 - Bird Dog',
        category: 'Core Stability',
        type: 'hold',
        sets: 4,
        holdDuration: 13,
        restTime: 10,
        isPaired: true,
        instructions: [
            'Start on hands and knees in a tabletop position',
            'Extend your right arm forward and left leg backward',
            'Keep your core engaged and back flat',
            'Hold for the specified duration',
            'Return to start and switch to opposite arm and leg'
        ],
        notes: 'Focus on stability - avoid rotating your hips or shoulders'
    },
    {
        id: 2,
        name: 'McGill Big 3 - Side Plank',
        category: 'Core Stability',
        type: 'hold',
        sets: 3,
        holdDuration: 13,
        restTime: 10,
        isPaired: true,
        instructions: [
            'Lie on your side with elbow directly under shoulder',
            'Stack your feet or stagger them for easier variation',
            'Lift your hips off the ground, forming a straight line',
            'Keep your core tight and hold the position',
            'Switch to the other side after rest'
        ],
        notes: 'Keep your body in a straight line - don\'t let hips sag'
    },
    {
        id: 3,
        name: 'McGill Big 3 - Curl-up',
        category: 'Core Stability',
        type: 'hold',
        sets: 4,
        holdDuration: 13,
        restTime: 10,
        isPaired: false,
        instructions: [
            'Lie on your back with one knee bent, other leg straight',
            'Place hands under your lower back for support',
            'Lift head and shoulders slightly off the ground',
            'Hold this position without pulling on your neck',
            'Lower down slowly and repeat'
        ],
        notes: 'Minimal movement - focus on isometric hold'
    },

    // Lower Body
    {
        id: 4,
        name: 'Glute Bridge',
        category: 'Lower Body',
        type: 'rep',
        sets: 3,
        reps: 15,
        restTime: 10,
        isPaired: false,
        instructions: [
            'Lie on your back with knees bent, feet flat on floor',
            'Keep arms at your sides, palms down',
            'Push through your heels to lift hips toward ceiling',
            'Squeeze glutes at the top',
            'Lower hips back down with control'
        ],
        notes: 'Focus on glute activation, not lower back'
    },
    {
        id: 5,
        name: 'Bodyweight Squat',
        category: 'Lower Body',
        type: 'rep',
        sets: 3,
        reps: 10,
        restTime: 10,
        isPaired: false,
        instructions: [
            'Stand with feet shoulder-width apart',
            'Keep chest up and core engaged',
            'Lower down as if sitting in a chair',
            'Keep knees tracking over toes',
            'Push through heels to return to standing'
        ],
        notes: 'Maintain good form - depth is secondary to proper technique'
    },

    // Upper Body
    {
        id: 6,
        name: 'Wall Push-up',
        category: 'Upper Body',
        type: 'rep',
        sets: 3,
        reps: 12,
        restTime: 10,
        isPaired: false,
        instructions: [
            'Stand facing a wall, hands at shoulder height',
            'Place hands on wall slightly wider than shoulders',
            'Bend elbows to lean toward wall',
            'Keep body in a straight line',
            'Push back to starting position'
        ],
        notes: 'Great starting point before progressing to floor push-ups'
    },
    {
        id: 7,
        name: 'Resistance Band Rows',
        category: 'Upper Body',
        type: 'rep',
        sets: 4,
        reps: 10,
        restTime: 10,
        isPaired: false,
        equipmentNeeded: 'Red resistance band',
        instructions: [
            'Secure band at chest height to a stable anchor',
            'Hold handles with arms extended',
            'Pull handles toward your chest',
            'Squeeze shoulder blades together',
            'Return to start with control'
        ],
        notes: 'Focus on back muscles, not just pulling with arms'
    },

    // Mobility
    {
        id: 8,
        name: 'Cat-Cow Stretch',
        category: 'Mobility',
        type: 'rep',
        sets: 2,
        reps: 10,
        restTime: 5,
        isPaired: false,
        instructions: [
            'Start on hands and knees',
            'Arch your back, lifting head and tailbone (Cow)',
            'Round your back, tucking chin and tailbone (Cat)',
            'Move smoothly between positions',
            'Breathe deeply with each movement'
        ],
        notes: 'Great for spinal mobility and warm-up'
    },
    {
        id: 9,
        name: 'Hip Flexor Stretch',
        category: 'Mobility',
        type: 'hold',
        sets: 2,
        holdDuration: 20,
        restTime: 5,
        isPaired: true,
        instructions: [
            'Kneel on one knee, other foot flat in front',
            'Keep torso upright, core engaged',
            'Gently push hips forward',
            'Feel stretch in front of back hip',
            'Switch sides after rest'
        ],
        notes: 'Essential for desk workers and anyone with tight hip flexors'
    },

    // Glute Activation
    {
        id: 10,
        name: 'Side Plank Clamshell',
        category: 'Lower Body',
        type: 'hold',
        sets: 5,
        reps: 8,
        holdDuration: 5,
        restTime: 6,
        isPaired: true,
        instructions: [
            'Lie on your side in a side plank position on your elbow',
            'Bend knees at 90 degrees, feet stacked',
            'Drive hips up toward the ceiling',
            'Twist pelvis open slightly while lifting top knee',
            'Hold for 5 seconds, maintaining hip height',
            'Focus on engaging the down-side glutes'
        ],
        notes: 'Focus on the down-side glutes - keep hips lifted throughout'
    },
    {
        id: 11,
        name: 'Lock Clam',
        category: 'Lower Body',
        type: 'hold',
        sets: 5,
        reps: 15,
        holdDuration: 3,
        restTime: 6,
        isPaired: true,
        instructions: [
            'Lie on your side with knees bent at 90 degrees',
            'Keep feet together and locked in place',
            'Lift top knee up while keeping feet touching',
            'Hold at the top for 3 seconds',
            'Lower with control and repeat'
        ],
        notes: 'See "best daily core routine (only 8 minutes)" video for demo'
    },
    {
        id: 12,
        name: 'Bridge with Band on Knees',
        category: 'Lower Body',
        type: 'hold',
        sets: 5,
        reps: 10,
        holdDuration: 5,
        restTime: 6,
        isPaired: false,
        equipmentNeeded: 'Resistance band',
        instructions: [
            'Lie on back with knees bent, feet flat on floor',
            'Place resistance band around both knees',
            'Push knees outward against the band',
            'Lift hips toward ceiling, squeezing glutes',
            'Hold at top for 5 seconds while maintaining knee pressure',
            'Lower with control and repeat'
        ],
        notes: 'Keep pressing knees out against band throughout the movement'
    },
    {
        id: 13,
        name: 'Kickstand Squat with Band',
        category: 'Lower Body',
        type: 'rep',
        sets: 2,
        reps: 10,
        restTime: 10,
        isPaired: true,
        equipmentNeeded: 'Resistance band',
        instructions: [
            'Stand with one foot forward, back foot on toes (kickstand position)',
            'Place band around front thigh trying to pull knee inward',
            'Hinge at hips like an RDL until you feel the glute activate',
            'Once you feel the glute, transition into a squat',
            'Push through front heel to stand',
            'Only go through pain-free range of motion'
        ],
        notes: 'Think: RDL first, then squat once glute engages. Pain-free motion only.'
    },
    {
        id: 14,
        name: 'Squat with Band on Shins',
        category: 'Lower Body',
        type: 'rep',
        sets: 3,
        reps: 10,
        restTime: 10,
        isPaired: false,
        equipmentNeeded: 'Resistance band',
        instructions: [
            'Stand with feet shoulder-width apart',
            'Place resistance band around shins',
            'Focus on full foot stability - tripod foot position',
            'Push knees out against band as you squat down',
            'Go to full depth if pain-free',
            'Drive through heels to stand, maintaining outward knee pressure'
        ],
        notes: 'Focus on opening hips against band - full depth if pain-free'
    }
];
