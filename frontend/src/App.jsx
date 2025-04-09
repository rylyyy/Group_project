// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './NavBar';
import HomePage from './pages/HomePage';
import PomodoroPage from './pages/PomodoroPage';
import RewardsPage from './pages/RewardsPage';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/pomodoro" element={<PomodoroPage />} />
        <Route path="/rewards" element={<RewardsPage />} />
        {/* Redirect any unknown paths to Home */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
