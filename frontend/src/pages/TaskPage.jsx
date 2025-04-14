// src/page/TaskPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:8080/api/tasks';

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);

  const getTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      getTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const renderTasks = () => {
    return tasks.map(task => (
      <li key={task.id} style={{ marginBottom: '1rem', padding: '0.5rem', border: '1px solid var(--blue)', borderRadius: '4px' }}>
        <div>{task.id} - {task.title} - {task.priority} - {task.status}</div>
        <div>Target: {task.targetTime} min, Logged: {task.loggedTime} min</div>
        <div style={{ marginTop: '0.5rem' }}>
          <Link to={`/tasks/update/${task.id}`} style={{
            marginRight: '1rem',
            backgroundColor: 'var(--orange)',
            padding: '0.3rem 0.6rem',
            borderRadius: '4px',
            textDecoration: 'none',
            color: '#fff'
          }}>
            Update
          </Link>
          <button onClick={() => handleDelete(task.id)} style={{
            backgroundColor: 'var(--blue)',
            padding: '0.3rem 0.6rem',
            borderRadius: '4px',
            border: 'none',
            color: '#fff',
            cursor: 'pointer'
          }}>
            Delete
          </button>
        </div>
      </li>
    ));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Task Dashboard</h1>
      <div style={{ marginBottom: '20px' }}>
        <Link to="/tasks/create" style={{
          textDecoration: 'none',
          backgroundColor: 'var(--yellow)',
          color: 'var(--dark-blue)',
          padding: '0.5rem 1rem',
          borderRadius: '4px'
        }}>
          Create Task
        </Link>
      </div>
      <div>
        {tasks.length === 0 ? <p>No tasks available.</p> : <ul style={{ listStyle: 'none', paddingLeft: 0 }}>{renderTasks()}</ul>}
      </div>
    </div>
  );
};

export default TaskPage;
