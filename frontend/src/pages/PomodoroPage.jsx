import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const PomodoroPage = () => {
  const DEFAULT_POMODORO = 25 * 60;
  const DEFAULT_SHORT_BREAK = 5 * 60;
  const DEFAULT_LONG_BREAK = 15 * 60;

  const [sessionType, setSessionType] = useState('pomodoro');
  const [currentTime, setCurrentTime] = useState(DEFAULT_POMODORO);
  const [isRunning, setIsRunning] = useState(false);
  const [isStudySession, setIsStudySession] = useState(true);
  const [customMinutes, setCustomMinutes] = useState('');
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [plannedDuration, setPlannedDuration] = useState(DEFAULT_POMODORO);
  const [accumulatedLoggedSeconds, setAccumulatedLoggedSeconds] = useState(0);
  const [sessionStart, setSessionStart] = useState(null);
  const [hasLogged, setHasLogged] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/tasks')
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => console.error("Error fetching tasks:", error));
  }, []);

  useEffect(() => {
    stopTimer();
    setHasLogged(false);
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
      const customSec = customMinutes ? parseInt(customMinutes, 10) * 60 : 0;
      setPlannedDuration(customSec);
      setCurrentTime(customSec);
      setIsStudySession(true);
    }
    setAccumulatedLoggedSeconds(0);
    setSessionStart(null);
  }, [sessionType]);

  // Timer effect now only depends on isRunning to avoid recreating intervals based on sessionStart updates.
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setCurrentTime(prevTime => {
          if (prevTime > 0) {
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
  }, [isRunning]);

  const logElapsedTime = () => {
    if (!sessionStart) return;
    let totalMinutesElapsed;
    if (sessionType === 'custom' && currentTime === 0) {
      totalMinutesElapsed = Math.floor(plannedDuration / 60);
    } else {
      const secondsElapsed = Math.floor((Date.now() - sessionStart) / 1000);
      totalMinutesElapsed = Math.floor(secondsElapsed / 60);
      if (currentTime === 0 && secondsElapsed > 0 && totalMinutesElapsed === 0) {
        totalMinutesElapsed = 1;
      }
    }
    const alreadyLoggedMinutes = Math.floor(accumulatedLoggedSeconds / 60);
    const deltaMinutes = totalMinutesElapsed - alreadyLoggedMinutes;
    if (selectedTaskId && deltaMinutes > 0) {
      logTaskTime(selectedTaskId, deltaMinutes);
      setAccumulatedLoggedSeconds(prev => prev + deltaMinutes * 60);
    }
  };

  const handleNaturalFinish = () => {
    if (hasLogged) return;
    setHasLogged(true);
    logElapsedTime();
    alert(isStudySession ? 'Session complete! Great job!' : 'Break is over!');
    stopTimer();
    setSessionStart(null);
  };

  const handleManualStop = () => {
    logElapsedTime();
    stopTimer();
    setSessionStart(null);
  };

  const logTaskTime = (taskId, minutes) => {
    axios
      .post(`http://localhost:8080/api/tasks/log/${taskId}`, { minutes })
      .then(response => {
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId ? response.data : task
          )
        );
      })
      .catch(error => console.error("Error logging time:", error));
  };

  // Start timer and set sessionStart here to avoid the timer effect being restarted unnecessarily.
  const startTimer = () => {
    if (!isRunning && currentTime > 0) {
      setSessionStart(Date.now());
      setIsRunning(true);
    }
  };

  const stopTimer = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
  };

  const resetTimer = () => {
    stopTimer();
    setHasLogged(false);
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
      setCurrentTime(plannedDuration);
    }
    setAccumulatedLoggedSeconds(0);
    setSessionStart(null);
  };

  const handleSetCustomMinutes = () => {
    const minutes = parseInt(customMinutes, 10);
    if (!isNaN(minutes) && minutes > 0) {
      const customSeconds = minutes * 60;
      setPlannedDuration(customSeconds);
      setCurrentTime(customSeconds);
    }
  };

  const formatTime = (seconds) => {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${minutes}:${secs}`;
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
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={() => setSessionType('pomodoro')}>Pomodoro</button>
        <button onClick={() => setSessionType('short-break')}>Short Break</button>
        <button onClick={() => setSessionType('long-break')}>Long Break</button>
        <button onClick={() => setSessionType('custom')}>Custom</button>
      </div>
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
      <div style={{ marginBottom: '20px', width: '100%', maxWidth: '300px', textAlign: 'left' }}>
        <h3>Tasks</h3>
        {tasks.length > 0 ? (
          <ul style={{ padding: 0, listStyle: 'none' }}>
            {tasks.map(task => (
              <li key={task.id} style={{ marginBottom: '5px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="taskSelection"
                    style={{ marginRight: '8px' }}
                    checked={String(selectedTaskId) === String(task.id)}
                    onChange={() => setSelectedTaskId(task.id)}
                  />
                  <span>
                    {task.title} - Logged: {task.loggedTime}min / Target: {task.targetTime}min
                  </span>
                </label>
              </li>
            ))}
          </ul>
        ) : (
          <p>No tasks available</p>
        )}
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={startTimer}>Start</button>
        <button onClick={handleManualStop}>Stop</button>
        <button onClick={resetTimer}>Reset</button>
      </div>
    </div>
  );
};

export default PomodoroPage;
