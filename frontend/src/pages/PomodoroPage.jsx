// src/pages/PomodoroPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const PomodoroPage = () => {
  // Constants
  const DEFAULT_POMODORO = 25 * 60;
  const DEFAULT_SHORT_BREAK = 5 * 60;
  const DEFAULT_LONG_BREAK = 15 * 60;

  // State
  const [sessionType, setSessionType] = useState('pomodoro');
  const [currentTime, setCurrentTime] = useState(DEFAULT_POMODORO);
  const [isRunning, setIsRunning] = useState(false);
  const [isStudySession, setIsStudySession] = useState(true);
  const [customMinutes, setCustomMinutes] = useState('');
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [plannedDuration, setPlannedDuration] = useState(DEFAULT_POMODORO);
  const [sessionStart, setSessionStart] = useState(null);

  // Ref to prevent double‐logging
  const hasLoggedRef = useRef(false);
  const timerRef = useRef(null);

  // Fetch tasks once when the component mounts
  useEffect(() => {
    axios
      .get('http://localhost:8080/api/tasks')
      .then(res => setTasks(res.data))
      .catch(err => console.error('Error fetching tasks:', err));
  }, []);

  // Reset timer whenever sessionType changes
  useEffect(() => {
    pauseTimer();
    hasLoggedRef.current = false;
    if (sessionType === 'pomodoro') {
      setPlannedDuration(DEFAULT_POMODORO);
      setCurrentTime(DEFAULT_POMODORO);
      setIsStudySession(true);
    } else if (sessionType === 'short-break') {
      setPlannedDuration(DEFAULT_SHORT_BREAK);
      setCurrentTime(DEFAULT_SHORT_BREAK);
      setIsStudySession(false);
    } else if (sessionType === 'long-break') {
      setPlannedDuration(DEFAULT_LONG_BREAK);
      setCurrentTime(DEFAULT_LONG_BREAK);
      setIsStudySession(false);
    } else if (sessionType === 'custom') {
      const secs = (parseInt(customMinutes, 10) || 0) * 60;
      setPlannedDuration(secs);
      setCurrentTime(secs);
      setIsStudySession(true);
    }
    setSessionStart(null);
  }, [sessionType]);

  // Countdown effect
  useEffect(() => {
    if (isRunning) {
      if (!sessionStart) setSessionStart(Date.now());
      timerRef.current = setInterval(() => {
        setCurrentTime(t => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            handleNaturalFinish();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  // Called when timer hits zero
  const handleNaturalFinish = () => {
    if (selectedTaskId && !hasLoggedRef.current) {
      const minutes =
        sessionType === 'custom'
          ? parseInt(customMinutes, 10) || 0
          : Math.ceil(plannedDuration / 60);
      hasLoggedRef.current = true;
      axios
        .post(`http://localhost:8080/api/tasks/log/${selectedTaskId}`, { minutes })
        .then(res =>
          setTasks(ts => ts.map(t => (t.id === selectedTaskId ? res.data : t)))
        )
        .catch(err => console.error('Error logging time:', err));
    }
    alert(isStudySession ? 'Session complete! Great job!' : 'Break is over!');
    pauseTimer();
    setSessionStart(null);
  };

  // Pause (formerly Stop) — does NOT log time
  const handlePause = () => {
    pauseTimer();
    // leave sessionStart unchanged so resume will continue
  };

  const pauseTimer = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
  };

  // Start / resume
  const startTimer = () => {
    if (!isRunning && currentTime > 0) {
      setIsRunning(true);
    }
  };

  // Reset entirely
  const resetTimer = () => {
    pauseTimer();
    hasLoggedRef.current = false;
    setCurrentTime(plannedDuration);
    setSessionStart(null);
  };

  // Apply custom minutes
  const handleSetCustomMinutes = () => {
    const mins = parseInt(customMinutes, 10);
    if (!isNaN(mins) && mins > 0) {
      const secs = mins * 60;
      setPlannedDuration(secs);
      setCurrentTime(secs);
    }
  };

  // Format seconds into MM:SS
  const formatTime = secs => {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <h1>Pomodoro Timer</h1>
      <div style={{ fontSize: '4rem', fontWeight: 'bold', margin: '20px 0' }}>
        {formatTime(currentTime)}
      </div>
      <div style={{ marginBottom: '20px', fontWeight: 'bold' }}>
        {isStudySession ? 'Study Session' : 'Break'}
      </div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setSessionType('pomodoro')}>Pomodoro</button>
        <button onClick={() => setSessionType('short-break')}>Short Break</button>
        <button onClick={() => setSessionType('long-break')}>Long Break</button>
        <button onClick={() => setSessionType('custom')}>Custom</button>
      </div>
      {sessionType === 'custom' && (
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <input
            type="number"
            placeholder="Minutes"
            value={customMinutes}
            onChange={e => setCustomMinutes(e.target.value)}
            style={{ padding: '8px', width: '100px', marginRight: '8px' }}
          />
          <button onClick={handleSetCustomMinutes}>Set</button>
        </div>
      )}
      <div style={{ width: '100%', maxWidth: '300px', marginBottom: '20px' }}>
        <h3>Tasks</h3>
        {tasks.length === 0 ? (
          <p>No tasks available</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {tasks.map(task => (
              <li key={task.id} style={{ marginBottom: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="taskSelection"
                    checked={selectedTaskId === task.id}
                    onChange={() => setSelectedTaskId(task.id)}
                    style={{ marginRight: '8px' }}
                  />
                  <span>
                    {task.title} — Logged: {task.loggedTime} min / Target: {task.targetTime} min
                  </span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={startTimer}>Start</button>
        <button onClick={handlePause}>Pause</button>
        <button onClick={resetTimer}>Reset</button>
      </div>
    </div>
  );
};

export default PomodoroPage;
