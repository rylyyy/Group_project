// src/pages/PomodoroPage.jsx
import React, { useState, useEffect, useRef } from 'react';

const PomodoroPage = () => {
  // Default durations in seconds
  const DEFAULT_POMODORO = 25 * 60;
  const DEFAULT_SHORT_BREAK = 5 * 60;
  const DEFAULT_LONG_BREAK = 15 * 60;

  const [sessionType, setSessionType] = useState('pomodoro'); 
  const [currentTime, setCurrentTime] = useState(DEFAULT_POMODORO);
  const [isRunning, setIsRunning] = useState(false);
  const [isStudySession, setIsStudySession] = useState(true);
  const [customMinutes, setCustomMinutes] = useState('');
  const [taskName, setTaskName] = useState('');
  
  // For tasks fetched from backend
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  const timerRef = useRef(null);

  // Fetch tasks when component mounts
  useEffect(() => {
    fetch('/api/tasks')
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  // Adjust timer when session type changes
  useEffect(() => {
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
      setIsStudySession(true);
    }
  }, [sessionType]);

  // Timer countdown effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setCurrentTime(prevTime => {
          if (prevTime > 1) {
            return prevTime - 1;
          } else {
            clearInterval(timerRef.current);
            handleSessionEnd();
            return 0;
          }
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const handleSessionEnd = () => {
    // When the session ends, log the time if a task was selected
    const minutesUsed = Math.floor(DEFAULT_POMODORO / 60) - Math.floor(currentTime / 60);
    if (selectedTask) {
      logTaskTime(selectedTask.id, minutesUsed);
    }
    alert(isStudySession ? 'Session complete! Great job!' : 'Break is over! Back to study.');
    stopTimer();
  };

  const logTaskTime = (taskId, minutes) => {
    fetch(`/api/tasks/log/${taskId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ minutes })
    })
      .then(response => response.json())
      .then(updatedTask => {
        // Update the tasks list with the new logged time for the task
        setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
      })
      .catch(error => console.error('Error logging time:', error));
  };

  const startTimer = () => {
    if (!isRunning && currentTime > 0) {
      setIsRunning(true);
      // Optionally record session start with an API call.
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
  };

  const handleSetCustomMinutes = () => {
    const minutes = parseInt(customMinutes, 10);
    if (!isNaN(minutes) && minutes > 0) {
      setCurrentTime(minutes * 60);
    }
  };

  const formatTime = (seconds) => {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${minutes}:${secs}`;
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px'
    }}>
      <h1>Pomodoro Timer</h1>
      <div style={{ fontSize: '4rem', fontWeight: 'bold', margin: '20px 0' }}>
        {formatTime(currentTime)}
      </div>
      <div style={{ marginBottom: '20px', fontWeight: 'bold' }}>
        {isStudySession ? 'Study Session' : 'Break'}
      </div>

      {/* Session Selection Buttons */}
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

      {/* Optional Task Input */}
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
      <ul style={{ padding: 0, listStyle: 'none' }}>
  {tasks.map(task => (
    <li
      key={task.id}
      style={{
        marginBottom: '5px',
        display: 'flex',
        alignItems: 'center',
        padding: '5px',
        backgroundColor: selectedTask && selectedTask.id === task.id ? '#ddd' : 'transparent'
      }}
    >
      <input
        type="radio"
        name="taskSelection"
        checked={selectedTask?.id === task.id}
        onChange={() => setSelectedTask(task)}
        style={{ marginRight: '8px' }}
      />
      <span>
        {task.title} - Logged: {task.loggedTime}min / Target: {task.targetTime}min
      </span>
    </li>
  ))}
</ul>


      {/* Control Buttons */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={startTimer}>Start</button>
        <button onClick={stopTimer}>Stop</button>
        <button onClick={resetTimer}>Reset</button>
      </div>
    </div>
  );
};

export default PomodoroPage;
