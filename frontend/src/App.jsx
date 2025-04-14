// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './NavBar';
import HomePage from './pages/HomePage';
import TaskPage from './pages/TaskPage';
import PomodoroPage from './pages/PomodoroPage';
import CreateTaskPage from './pages/CreateTaskPage';
import UpdateTaskPage from './pages/UpdateTaskPage';

function App() {
  return (
    <Router>
      <NavBar />
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/tasks" element={<TaskPage />} />
          <Route path="/pomodoro" element={<PomodoroPage />} />
          <Route path="/tasks/create" element={<CreateTaskPage />} />
          <Route path="/tasks/update/:id" element={<UpdateTaskPage />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
