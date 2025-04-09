// src/NavBar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav style={{ backgroundColor: '#333', padding: '1rem' }}>
      <ul
        style={{
          listStyle: 'none',
          display: 'flex',
          gap: '1rem',
          margin: 0,
          padding: 0,
        }}
      >
        <li>
          <Link style={{ color: '#fff', textDecoration: 'none' }} to="/home">
            Home
          </Link>
        </li>
        <li>
          <Link style={{ color: '#fff', textDecoration: 'none' }} to="/pomodoro">
            Pomodoro
          </Link>
        </li>
        <li>
          <Link style={{ color: '#fff', textDecoration: 'none' }} to="/rewards">
            Rewards
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
