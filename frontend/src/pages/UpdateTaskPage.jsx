import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/tasks';

const UpdateTaskPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);

  // Fetch Task
  useEffect(() => {
    axios
      .get(`${API_URL}/${id}`)
      .then(response => setTask(response.data))
      .catch(error => console.error('Error fetching task:', error));
  }, [id]);

  // Submit Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/${id}`, task);
      navigate('/tasks');
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  if (!task) return <p>Loading...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Update Task</h2>
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div style={{ marginBottom: '0.5rem' }}>
          <label>Title:</label>
          <input
            type="text"
            value={task.title}
            onChange={e => setTask({ ...task, title: e.target.value })}
            style={{ marginLeft: '0.5rem' }}
          />
        </div>
        {/* Priority */}
        <div style={{ marginBottom: '0.5rem' }}>
          <label>Priority:</label>
          <select
            value={task.priority}
            onChange={e => setTask({ ...task, priority: e.target.value })}
            style={{ marginLeft: '0.5rem' }}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        {/* Status */}
        <div style={{ marginBottom: '0.5rem' }}>
          <label>Status:</label>
          <select
            value={task.status}
            onChange={e => setTask({ ...task, status: e.target.value })}
            style={{ marginLeft: '0.5rem' }}
          >
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Complete">Complete</option>
          </select>
        </div>
        {/* Target Time */}
        <div style={{ marginBottom: '0.5rem' }}>
          <label>Target Time (min):</label>
          <input
            type="number"
            value={task.targetTime}
            onChange={e => setTask({ ...task, targetTime: parseInt(e.target.value, 10) })}
            style={{ marginLeft: '0.5rem' }}
          />
        </div>
        {/* Logged Time */}
        <div style={{ marginBottom: '0.5rem' }}>
          <label>Logged Time (min):</label>
          <input
            type="number"
            value={task.loggedTime}
            onChange={e => setTask({ ...task, loggedTime: parseInt(e.target.value, 10) })}
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
          Update
        </button>
      </form>
    </div>
  );
};

export default UpdateTaskPage;
