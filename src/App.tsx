import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ExerciseProvider } from './context/ExerciseContext';
import { ProgressProvider } from './context/ProgressContext';
import { ThemeProvider } from './context/ThemeContext';
import { BottomNav } from './components/BottomNav';
import { Home } from './screens/Home';
import { ExerciseList } from './screens/ExerciseList';
import { EditExercise } from './screens/EditExercise';
import { TimerScreen } from './screens/TimerScreen';
import { Progress } from './screens/Progress';
import { Settings } from './screens/Settings';
import './index.css';

function App() {
    return (
        <BrowserRouter>
            <ThemeProvider>
                <ExerciseProvider>
                    <ProgressProvider>
                        <div className="app">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/exercises" element={<ExerciseList />} />
                                <Route path="/exercises/edit/:id" element={<EditExercise />} />
                                <Route path="/timer/:id" element={<TimerScreen />} />
                                <Route path="/progress" element={<Progress />} />
                                <Route path="/settings" element={<Settings />} />
                            </Routes>
                            <BottomNav />
                        </div>
                    </ProgressProvider>
                </ExerciseProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
