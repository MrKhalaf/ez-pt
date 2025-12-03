# Rehabber - iOS Quickstart Guide

Welcome to **Rehabber**, your digital rehabilitation assistant! This guide will help you get started on your iPhone or iPad in just a few minutes.

---

## 🚀 Running the Latest Version

### Option 1: Access the Live App (Recommended)
If Rehabber is already deployed, simply visit the app URL in Safari on your iOS device.

### Option 2: Run Locally for Development

#### Prerequisites
- Node.js 18+ installed on your development machine
- An iPhone or iPad on the same WiFi network (for testing)

#### Steps

1. **Clone and Install**
   ```bash
   cd /Users/mohammadkhalaf/Projects/ez-pt
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   The app will start on `http://localhost:5173` (or similar port)

3. **Access from iPhone/iPad**
   - Find your computer's local IP address:
     ```bash
     # On Mac
     ipconfig getifaddr en0
     ```
   - Open Safari on your iOS device
   - Navigate to `http://[YOUR_IP]:5173` (e.g., `http://192.168.1.100:5173`)

---

## 📱 Add App Icon to iOS Home Screen

Rehabber is a **Progressive Web App (PWA)**, which means you can install it directly to your home screen for a native app experience!

### Installation Steps

1. **Open in Safari**
   - ⚠️ **Important**: You MUST use **Safari** browser (not Chrome or other browsers)
   - Navigate to your Rehabber app URL

2. **Tap the Share Button**
   - Look for the share icon at the bottom of Safari (square with an arrow pointing up)
   - Tap it to open the share menu

3. **Select "Add to Home Screen"**
   - Scroll down in the share menu
   - Tap **"Add to Home Screen"**

4. **Customize and Confirm**
   - You'll see a preview of the app icon and name
   - The app name will be **"Rehabber"**
   - Tap **"Add"** in the top-right corner

5. **Launch Your App!**
   - The Rehabber icon will now appear on your home screen
   - Tap it to launch the app in full-screen mode (no browser UI)
   - The app will feel just like a native iOS app!

### What You Get

✅ **Full-screen experience** - No browser toolbars  
✅ **iOS-native feel** - Smooth transitions and gestures  
✅ **App icon on home screen** - Quick access like any other app  
✅ **Offline support** - Works without internet once cached  
✅ **Dark/Light mode** - Automatically matches your iOS settings  
✅ **Status bar styling** - Integrated with iOS design  

---

## 🎨 App Features

Once installed, you can:
- 📝 Track your physical therapy exercises
- ⏱️ Use built-in timers for sets and reps
- 📊 View your progress and streaks
- 🎯 Follow guided routines
- 💪 Stay motivated on your recovery journey

---

## 🛠️ Troubleshooting

### The icon doesn't appear
- Make sure you used **Safari** (not Chrome or Firefox)
- Check that you tapped "Add to Home Screen" (not "Add Bookmark")
- Try restarting your device if the icon doesn't show

### App won't load offline
- Open the app at least once while online to cache all resources
- Check your Safari settings allow offline storage

### App looks different in other browsers
- PWA features only work fully in Safari on iOS
- For the best experience, always use Safari and install to home screen

---

## 🔄 Updating the App

The app automatically checks for updates when you open it with an internet connection. If a new version is available, it will update in the background and prompt you to reload.

To manually check for updates:
1. Open the app
2. Pull down to refresh
3. If an update is available, you'll see a notification

---

## 📚 Additional Resources

- **Full Documentation**: See `DEVELOPMENT.md` for technical details
- **App Version**: v1.0.0 (see `package.json`)
- **Support**: Report issues via the app's feedback feature

---

## ✨ Pro Tips

1. **Enable notifications** (if prompted) to get reminders for your PT routines
2. **Bookmark your favorite exercises** for quick access
3. **Use dark mode** for easier viewing during nighttime routines
4. **Keep screen awake** during timer sessions (iOS does this automatically for full-screen apps)

---

**Happy rehabbing! 💪**
