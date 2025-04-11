// src/pages/PomodoroPage.jsx
import React, { useState, useEffect, useRef } from 'react';

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
  const [taskName, setTaskName] = useState('');
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [plannedDuration, setPlannedDuration] = useState(DEFAULT_POMODORO);
  const [accumulatedLoggedSeconds, setAccumulatedLoggedSeconds] = useState(0);
  const [sessionStart, setSessionStart] = useState(null);

  // Refs
  const timerRef = useRef(null);

  // Fetch Tasks
  useEffect(() => {
    fetch('/api/tasks')
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  // Session Setup
  useEffect(() => {
    stopTimer();
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
      setPlannedDuration(0);
      setCurrentTime(0);
      setIsStudySession(true);
    }
    setAccumulatedLoggedSeconds(0);
    setSessionStart(null);
  }, [sessionType]);

  // Timer Countdown
  useEffect(() => {
    if (isRunning) {
      if (!sessionStart) {
        setSessionStart(Date.now());
      }
      timerRef.current = setInterval(() => {
        setCurrentTime(prevTime => {
          if (prevTime > 1) {
            return prevTime - 1;
          } else {
            clearInterval(timerRef.current);
            handleNaturalFinish();
            return 0;
          }
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, sessionStart]);

  // Natural Finish
  const handleNaturalFinish = () => {
    const now = Date.now();
    const secondsElapsed = Math.floor((now - sessionStart) / 1000);
    const plannedMinutes = Math.floor(plannedDuration / 60);
    const alreadyLoggedMinutes = Math.floor(accumulatedLoggedSeconds / 60);
    const remainingMinutes = plannedMinutes - alreadyLoggedMinutes;
    if (selectedTask && remainingMinutes > 0) {
      logTaskTime(selectedTask.id, remainingMinutes);
    }
    alert(isStudySession ? 'Session complete! Great job!' : 'Break is over!');
    stopTimer();
    setSessionStart(null);
  };

  // Manual Stop
  const handleManualStop = () => {
    if (sessionStart) {
      const now = Date.now();
      const secondsElapsed = Math.floor((now - sessionStart) / 1000);
      const minutesElapsed = Math.floor(secondsElapsed / 60);
      if (selectedTask && minutesElapsed > 0) {
        logTaskTime(selectedTask.id, minutesElapsed);
        setAccumulatedLoggedSeconds(prev => prev + minutesElapsed * 60);
      }
    }
    stopTimer();
    setSessionStart(null);
  };

  // Log Task
  const logTaskTime = (taskId, minutes) => {
    fetch(`/api/tasks/log/${taskId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ minutes })
    })
      .then(response => response.json())
      .then(updatedTask => {
        setTasks(prevTasks =>
          prevTasks.map(task => (task.id === taskId ? updatedTask : task))
        );
      })
      .catch(error => console.error('Error logging time:', error));
  };

  // Timer Controls
  const startTimer = () => {
    if (!isRunning && currentTime > 0) {
      setIsRunning(true);
    }
  };

  const stopTimer = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
  };

  const resetTimer = () => {
    stopTimer();
    if (sessionType === 'pomodoro') {
      setCurrentTime(DEFAULT_POMODORO);
      setIsStudySession(true);
    } else if (sessionType === 'short-break') {
      setCurrentTime(DEFAULT_SHORT_BREAK);
      setIsStudySession(false);
    } else if (sessionType === 'long-break') {
      setCurrentTime(DEFAULT_LONG_BREAK);
      setIsStudySession(false);
    } else if (sessionType === 'custom') {
      setCurrentTime(0);
    }
    setAccumulatedLoggedSeconds(0);
    setSessionStart(null);
  };

  // Custom Time Setup
  const handleSetCustomMinutes = () => {
    const minutes = parseInt(customMinutes, 10);
    if (!isNaN(minutes) && minutes > 0) {
      const customSeconds = minutes * 60;
      setPlannedDuration(customSeconds);
      setCurrentTime(customSeconds);
    }
  };

  // Format Time
  const formatTime = (seconds) => {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${minutes}:${secs}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      {/* Title */}
      <h1>Pomodoro Timer</h1>
      {/* Timer Display */}
      <div style={{ fontSize: '4rem', fontWeight: 'bold', margin: '20px 0' }}>
        {formatTime(currentTime)}
      </div>
      {/* Session Status */}
      <div style={{ marginBottom: '20px', fontWeight: 'bold' }}>
        {isStudySession ? 'Study Session' : 'Break'}
      </div>
      {/* Session Buttons */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={() => setSessionType('pomodoro')}>Pomodoro</button>
        <button onClick={() => setSessionType('short-break')}>Short Break</button>
        <button onClick={() => setSessionType('long-break')}>Long Break</button>
        <button onClick={() => setSessionType('custom')}>Custom</button>
      </div>
      {/* Custom Time Input */}
      {sessionType === 'custom' && (
        <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <input
            type="number"
            placeholder="Enter minutes"
            value={customMinutes}
            onChange={(e) => setCustomMinutes(e.target.value)}
            style={{ padding: '8px', width: '120px', marginBottom: '10px' }}
          />
          <button onClick={handleSetCustomMinutes}>Set Custom Time</button>
        </div>
      )}
      {/* Task Input */}
      <div style={{ marginBottom: '20px', width: '100%', maxWidth: '300px' }}>
        <input
          type="text"
          placeholder="Task (optional)"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          style={{ padding: '8px', width: '100%' }}
        />
      </div>
      {/* Task List */}
      {tasks.length > 0 && (
        <div style={{ marginBottom: '20px', width: '100%', maxWidth: '300px', textAlign: 'left' }}>
          <h3>Tasks</h3>
          <ul style={{ padding: 0, listStyle: 'none' }}>
            {tasks.map(task => (
              <li key={task.id} style={{ marginBottom: '5px' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    padding: '5px',
                    backgroundColor: selectedTask && selectedTask.id === task.id ? '#ddd' : 'transparent'
                  }}
                  onClick={(e) => {
                    if (selectedTask && selectedTask.id === task.id) {
                      setSelectedTask(null);
                      e.preventDefault();
                    } else {
                      setSelectedTask(task);
                    }
                  }}
                >
                  <input
                    type="radio"
                    name="taskSelection"
                    style={{ marginRight: '8px' }}
                    readOnly
                    checked={selectedTask ? selectedTask.id === task.id : false}
                  />
                  <span>
                    {task.title} - Logged: {task.loggedTime}min / Target: {task.targetTime}min
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Controls */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={startTimer}>Start</button>
        <button onClick={handleManualStop}>Stop</button>
        <button onClick={resetTimer}>Reset</button>
      </div>
    </div>
  );
};

export default PomodoroPage;
