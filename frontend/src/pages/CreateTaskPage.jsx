import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/tasks';

const CreateTaskPage = () => {
  // State
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Not Started');
  const [targetTime, setTargetTime] = useState(0);
  const [loggedTime, setLoggedTime] = useState(0);
  const navigate = useNavigate();

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newTask = { title, priority, status, targetTime, loggedTime };
      await axios.post(API_URL, newTask);
      navigate('/tasks'); // Return to task dashboard after creation
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Title */}
      <h2>Create Task</h2>
      <form onSubmit={handleSubmit}>
        {/* Title Field */}
        <div style={{ marginBottom: '0.5rem' }}>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{ marginLeft: '0.5rem' }}
          />
        </div>
        {/* Priority Field */}
        <div style={{ marginBottom: '0.5rem' }}>
          <label>Priority:</label>
          <select
            value={priority}
            onChange={e => setPriority(e.target.value)}
            style={{ marginLeft: '0.5rem' }}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
        {/* Status Field */}
        <div style={{ marginBottom: '0.5rem' }}>
          <label>Status:</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            style={{ marginLeft: '0.5rem' }}
          >
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Complete</option>
          </select>
        </div>
        {/* Target Time Field */}
        <div style={{ marginBottom: '0.5rem' }}>
          <label>Target Time (min):</label>
          <input
            type="number"
            value={targetTime}
            onChange={e => setTargetTime(parseInt(e.target.value, 10))}
            style={{ marginLeft: '0.5rem' }}
          />
        </div>
        {/* Logged Time Field */}
        <div style={{ marginBottom: '0.5rem' }}>
          <label>Logged Time (min):</label>
          <input
            type="number"
            value={loggedTime}
            onChange={e => setLoggedTime(parseInt(e.target.value, 10))}
            style={{ marginLeft: '0.5rem' }}
          />
        </div>
        <button
          type="submit"
          style={{
            marginTop: '1rem',
            backgroundColor: 'var(--orange)',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            color: '#fff',
            border: 'none'
          }}
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateTaskPage;
