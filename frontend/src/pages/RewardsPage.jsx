// src/pages/RewardsPage.jsx
import React, { useState, useEffect } from 'react';

const RewardsPage = () => {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [badges, setBadges] = useState([]);
  const [quote, setQuote] = useState('');

  // Simulate fetching data from a backend API
  useEffect(() => {
    // Replace these static values with a fetch call when your backend API is ready.
    setCurrentStreak(5);
    setBadges(['Consistency Badge', 'Focus Champion']);
    setQuote('“The secret of getting ahead is getting started.” - Mark Twain');
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Rewards Dashboard</h1>
      <div style={{ margin: '1rem 0' }}>
        <h2>Current Streak: {currentStreak} Sessions</h2>
      </div>
      <div>
        <h3>Badges Earned:</h3>
        <ul>
          {badges.map((badge, index) => (
            <li key={index}>{badge}</li>
          ))}
        </ul>
      </div>
      <div style={{ marginTop: '2rem', fontStyle: 'italic' }}>
        <p>{quote}</p>
      </div>
    </div>
  );
};

export default RewardsPage;
