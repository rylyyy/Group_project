// src/NavBar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item">
          <Link className="nav-link" to="/home">Home</Link>
        </li>
        <li className="navbar-item">
          <Link className="nav-link" to="/tasks">Tasks</Link>
        </li>
        <li className="navbar-item">
          <Link className="nav-link" to="/pomodoro">Pomodoro</Link>
        </li>
        <li className="navbar-item">
          <Link className="nav-link" to="/deadline">Deadline Tracker</Link>
        </li>

      </ul>
    </nav>
  );
};

export default NavBar;
