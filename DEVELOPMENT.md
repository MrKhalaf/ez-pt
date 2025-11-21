# Rehabber: Technical Blueprint & Rewrite Plan

## Project Overview

**Rehabber** is a digital rehabilitation assistant designed to help users follow, track, and complete physical therapy routines prescribed by their therapists. The app enables users to upload PT notes, auto-parse exercises with AI, track daily progress, and receive feedback on their rehabilitation journey. this document outlines a plan to rebuild it as a modern, robust, and iOS-optimized Expo (React Native) app, addressing all design and logic issues that existed in the old version.

---

## 1. Core Features & User Flow

### 1.1. User Journey
- **Onboarding:** User is introduced to the app, sets up basic profile, and optionally uploads PT notes.
- **Exercise Management:**
  - Upload PT notes (text) to auto-generate exercises.
  - Add/edit custom exercises manually.
  - View exercises grouped by category (Core Stability, Lower Body, Upper Body, Mobility, Other).
- **Routine Execution:**
  - Start a daily routine, follow guided timers for each exercise.
  - For each exercise: see instructions, sets, reps/hold, rest, and equipment.
  - Timer supports both rep-based and hold-based exercises, with paired side logic (left/right).
- **Progress Tracking:**
  - Visualize daily/weekly progress, completion streaks, and focus areas.
  - View history of completed exercises.
- **Settings:**
  - Customize default rest/hold durations, side strategy, and display preferences.

### 1.2. Main Screens
- Home (Today's Recovery, Progress Summary, Exercise Categories)
- Add/Edit Exercise (manual or PT notes upload)
- Exercise Detail (instructions, parameters, video, start/edit)
- Timer (guided, with rest/hold logic, side switching)
- Progress (stats, weekly chart, focus areas)
- History (past 7 days)
- Settings

---

## 2. Data Model & Default Exercises

### 2.1. Exercise Model
- `id`: number
- `name`: string
- `category`: enum [Core Stability, Lower Body, Upper Body, Mobility, Other]
- `type`: enum [rep, hold, step]
- `sets`: number
- `reps`: number (for rep-based)
- `holdDuration`: number (seconds, for hold-based)
- `restTime`: number (seconds)
- `instructions`: string[]
- `isPaired`: boolean (left/right sides)
- `equipmentNeeded`: string
- `videoUrl`: string
- `notes`: string

### 2.2. Default Exercises (with updated durations)

#### Core Stability
- **McGill Big 3 - Bird Dog**
  - Type: hold, Sets: 4, Hold: **13s**, Rest: **10s**, Paired: true
  - Instructions: Start on hands/knees, extend opposite arm/leg, hold, switch sides.
- **McGill Big 3 - Side Plank**
  - Type: hold, Sets: 3, Hold: **13s**, Rest: **10s**, Paired: true
  - Instructions: Lie on side, elbow under shoulder, lift hips, hold, switch sides.
- **McGill Big 3 - Curl-up**
  - Type: hold, Sets: 4, Hold: **13s**, Rest: **10s**, Paired: false
  - Instructions: Lie on back, one knee bent, hands under lower back, lift head/shoulders, hold.

#### Lower Body
- **Glute Bridge**
  - Type: rep, Sets: 3, Reps: 15, Rest: 10s
  - Instructions: Lie on back, knees bent, lift hips, squeeze glutes, lower down.
- **Bodyweight Squat**
  - Type: rep, Sets: 3, Reps: 10, Rest: 10s
  - Instructions: Stand feet shoulder-width, squat down, keep chest up, return to stand.

#### Upper Body
- **Wall Push-up**
  - Type: rep, Sets: 3, Reps: 12, Rest: 10s
  - Instructions: Stand facing wall, hands at shoulder height, bend elbows, push back.
- **Resistance Band Rows**
  - Type: rep, Sets: 4, Reps: 10, Rest: 10s
  - Equipment: Red resistance band
  - Instructions: Secure band at chest height, pull to chest, squeeze shoulder blades, return.

---

## 3. Technical Architecture (Expo Rewrite)

### 3.1. Stack
- **Frontend:** Expo (React Native), TypeScript, React Navigation, Context API or Redux for state
- **Backend:** (Optional) Node.js/Express or Firebase for cloud sync, but local storage (AsyncStorage/SQlite) for offline-first
- **Styling:** Tailwind CSS (via NativeWind) or styled-components
- **Testing:** Jest, React Native Testing Library

### 3.2. Key Components
- **Exercise Parser:** Robust, deterministic parser for PT notes (avoid regex bugs, use a state machine or LLM API fallback)
- **Timer Engine:**
  - Accurate, background-safe timer for both hold and rep-based exercises
  - Handles rest, set, and side transitions
  - Prevents skipping/logic bugs (e.g., double-completion, missed sets)
- **Progress Engine:**
  - Tracks daily/weekly completion, streaks, and focus areas
  - Stores history locally, syncs to cloud if enabled
- **UI/UX:**
  - iOS-first design: large touch targets, haptics, dark/light mode, accessibility
  - Smooth transitions, clear feedback, error handling
  - Modern navigation (tab bar, stack navigation)

### 3.3. Data Flow
- **Exercise CRUD:** All exercise data is stored locally, with optional cloud backup
- **Progress Tracking:** Each exercise completion is timestamped; daily routines reset at 4AM (not midnight)
- **Settings:** User can customize default hold/rest durations, side strategy, and display options

---

## 4. Design & Logic Improvements

### 4.1. Avoiding Bugs
- **Timer:**
  - Use a single source of truth for timer state (avoid desync between UI and logic)
  - Prevent multiple timers running simultaneously
  - Ensure rest/hold durations are always correct (e.g., 13s hold, 10s rest)
- **Exercise Completion:**
  - Only mark as complete when all sets (and both sides, if paired) are finished
  - Prevent duplicate progress entries for the same day
- **Parser:**
  - Use a robust parser for PT notes (fallback to manual entry if parsing fails)
  - Validate all parsed data before adding to routine
- **UI Consistency:**
  - Consistent button placement, color, and feedback
  - Responsive layouts for all iOS devices

### 4.2. iOS-Optimized UX
- Haptic feedback on key actions (start, complete, error)
- Native date/time pickers for scheduling
- Accessibility: VoiceOver, large fonts, color contrast
- Offline-first: All features work without network

---

## 5. Expo Project Structure (Recommended)

```
Rehabber/
├── App.tsx
├── package.json
├── assets/
├── src/
│   ├── components/
│   ├── screens/
│   ├── navigation/
│   ├── context/
│   ├── hooks/
│   ├── utils/
│   └── models/
├── README.md
└── DEVELOPMENT.md
```

---

## 6. LLM Blueprint: What to Recreate

- All features and flows described above
- All default exercises (with updated durations/rests)
- Robust, bug-free timer and progress logic
- iOS-optimized, beautiful UI
- Deterministic, testable data model and parser
- Offline-first, with optional cloud sync
- Settings and customization
- Clear, maintainable code structure

---

## 7. Final Notes

This document is a comprehensive technical blueprint for rebuilding the Rehabber app as a world-class, iOS-first Expo project. It captures all essential features, data models, and design requirements, and corrects all known bugs and inconsistencies in the current implementation. Use this as the single source of truth for your LLM or development team to create a superior rehabilitation assistant app from the ground up. 

---

## 8. Sprint Task Breakdown & Design Best Practices

### 8.1. Sprint Task Checklist (Ordered for Logical Flow)

Organize your development sprint using the following categories and tasks. Each task is a checklist item that can be completed and verified by an LLM or developer. **Tasks are ordered to ensure foundational decisions are made before dependent work begins.**

#### 1. Project Setup & Architecture
- [ ] Initialize Expo project with TypeScript
- [ ] Set up folder structure as recommended
- [ ] Configure navigation (React Navigation: tab + stack)
- [ ] Set up state management (Context API or Redux)
- [ ] Integrate AsyncStorage or SQLite for local data
- [ ] Set up basic theming (light/dark mode)

#### 2. Data Model & Storage
- [ ] Define Exercise, Progress, and Settings models
- [ ] Implement local CRUD for exercises
- [ ] Implement local progress tracking (with 4AM reset logic)
- [ ] Implement settings storage and retrieval
- [ ] (Optional) Integrate cloud sync (Firebase/Express)

#### 3. Design System & Best Practices
- [ ] Establish color palette, typography, spacing, and iconography
- [ ] Document design tokens and reusable components
- [ ] Review and apply design best practices (see 8.2 below)
- [ ] Plan for accessibility, haptics, and iOS-native feel

#### 4. Core Feature Implementation
- [ ] Build Add Exercise screen (manual entry)
- [ ] Build Edit Exercise screen
- [ ] Implement PT Notes parser (robust, deterministic)
- [ ] Add fallback/manual correction for parser errors
- [ ] Display exercises by category
- [ ] Build Exercise Detail screen (instructions, parameters, video)
- [ ] Implement Timer screen (hold/rep, rest, set, side logic)
- [ ] Ensure timer is background-safe and accurate
- [ ] Prevent multiple timers/logic bugs
- [ ] Mark exercise as complete only when all sets/sides are done
- [ ] Build Progress screen (stats, weekly chart, focus areas)
- [ ] Build History screen (last 7 days)
- [ ] Implement streak and completion logic
- [ ] Visualize focus areas and improvement suggestions
- [ ] Build Settings screen (rest/hold durations, side strategy, display)
- [ ] Add onboarding and motivational copy

#### 5. UI/UX Polish & Accessibility
- [ ] Apply iOS-first design system (spacing, typography, color)
- [ ] Ensure large touch targets and clear feedback
- [ ] Add smooth transitions and animations
- [ ] Test all screens for responsiveness and accessibility
- [ ] Add accessibility options (font size, color contrast)
- [ ] Add haptic feedback and iOS-specific enhancements

#### 6. Testing & QA
- [ ] Write unit tests for core logic (timer, parser, progress)
- [ ] Write integration tests for main flows
- [ ] Test offline/online transitions
- [ ] Test on multiple iOS devices and screen sizes

#### 7. Launch & Documentation
- [ ] Write user-facing README and onboarding guide
- [ ] Document all code and data models
- [ ] Prepare App Store assets/screenshots
- [ ] Final QA and bugfixes

---

### 8.2. Design Best Practices for a Motivating, Beautiful App

**Establish and reference these best practices before building UI components.**

- **Simplicity & Clarity:** Use a clean, minimal interface with clear hierarchy. Avoid clutter—show only what's needed for the current step.
- **Motivational Visuals:** Use progress bars, streaks, and celebratory animations (e.g., confetti, haptics) when users complete routines.
- **Color & Typography:** Use a calming, health-oriented palette (blues, greens, whites). Use large, readable fonts and high contrast for accessibility.
- **iOS Native Feel:** Use native navigation, modals, and gestures. Leverage haptics and smooth transitions for delight.
- **Large Touch Targets:** Ensure all buttons and controls are easy to tap, especially for users with limited dexterity.
- **Feedback & Guidance:** Provide instant feedback on actions (e.g., vibration, color change, sound). Use tooltips or onboarding to guide new users.
- **Personalization:** Allow users to set goals, favorite exercises, and customize their routine.
- **Accessibility:** Support VoiceOver, dynamic font sizes, and colorblind-friendly modes.
- **Offline-First:** Ensure all features work without network connectivity; sync when online.
- **Motivational Copy:** Use encouraging language throughout (e.g., "Great job!", "You're on a streak!").
- **Visual Consistency:** Use consistent iconography, spacing, and card layouts across all screens.
- **Progressive Disclosure:** Don't overwhelm users—reveal advanced features as they become relevant.

---

**Use this checklist and these design principles to guide your sprint and ensure Rehabber becomes a best-in-class, motivating, and beautiful rehabilitation app.** 