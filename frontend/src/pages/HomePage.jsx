// src/page/HomePage.jsx
import React from 'react';

const HomePage = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      {/* Title */}
      <h1 style={{ color: 'var(--dark-blue)' }}>
        Welcome to the Education Planner
      </h1>
      {/* Subtitle */}
      <p style={{ color: 'var(--blue)', fontSize: '1.2rem' }}>
        Manage your study schedule, track time with Pomodoro, and log your tasks seamlessly.
      </p>
    </div>
  );
};

export default HomePage;
