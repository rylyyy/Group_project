// src/page/HomePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/tasks');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
        minHeight: '80vh',
        background: 'linear-gradient(135deg, var(--baby-blue), var(--dark-blue))',
        borderRadius: '8px',
        margin: '20px',
      }}
    >
      <h1
        style={{
          fontSize: '3.5rem',
          marginBottom: '20px',
          color: 'var(--light-blue)',
        }}
      >
        Welcome to the Education Planner
      </h1>
      <p
        style={{
          fontSize: '1.2rem',
          marginBottom: '30px',
          maxWidth: '600px',
          textAlign: 'center',
        }}
      >
        Manage your study schedule, track your Pomodoro sessions, and log your progress seamlessly.
        Stay organized and motivated every step of the way.
      </p>
      <button
        onClick={handleGetStarted}
        style={{
          backgroundColor: 'var(--orange)',
          color: '#fff',
          padding: '0.8rem 1.6rem',
          fontSize: '1.1rem',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease',
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = 'var(--yellow)')}
        onMouseOut={(e) => (e.target.style.backgroundColor = 'var(--orange)')}
      >
        Get Started
      </button>
    </div>
  );
};

export default HomePage;
