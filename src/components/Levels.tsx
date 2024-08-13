import React, { useState } from 'react';
import './Levels.css'; // Переконайтеся, що ви створили цей файл

interface Level {
  name: string;
  icon: string;
  minCoins: number;
  maxCoins: number;
}

const levels: Level[] = [
  { name: 'Silver', icon: '/images/silver.png', minCoins: 0, maxCoins: 4999 },
  { name: 'Gold', icon: '/images/gold.png', minCoins: 5000, maxCoins: 24999 },
  { name: 'Platinum', icon: '/images/platinum.png', minCoins: 25000, maxCoins: 99999 },
  { name: 'Diamond', icon: '/images/diamond.png', minCoins: 100000, maxCoins: 999999 },
  { name: 'Epic', icon: '/images/epic.png', minCoins: 1000000, maxCoins: 1999999 },
  { name: 'Legendary', icon: '/images/legendary.png', minCoins: 2000000, maxCoins: 500000 },
];

const Levels: React.FC = () => {
 const [currentLevelIndex, setCurrentLevelIndex] = useState(0);

  const goToPreviousLevel = () => {
    setCurrentLevelIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : levels.length - 1));
  };

  const goToNextLevel = () => {
    setCurrentLevelIndex((prevIndex) => (prevIndex < levels.length - 1 ? prevIndex + 1 : 0));
  };

  const currentLevel = levels[currentLevelIndex];

  return (
    <div className="levels-container">
      <h2 className="levels-title">Рівні</h2>
      <div className="levels-content">
        <div className="level-carousel">
          <button onClick={goToPreviousLevel}>&lt;</button>
          <div className="level-info">
            <img src={currentLevel.icon} alt={currentLevel.name} />
            <h3>{currentLevel.name}</h3>
            <p>{currentLevel.minCoins} - {currentLevel.maxCoins} монет</p>
          </div>
          <button onClick={goToNextLevel}>&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default Levels;