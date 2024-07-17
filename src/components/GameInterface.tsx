import React, { useState } from 'react';
import EnergyBar from './EnergyBar';
import CoinBalance from './CoinBalance';
import ExchangeDisplay from './ExchangeDisplay';
import BottomMenu from './BottomMenu';

const GameInterface: React.FC = () => {
  const [score, setScore] = useState(0);
  const [energy, setEnergy] = useState(1500);
  const maxEnergy = 1500;
  const [currentView, setCurrentView] = useState('mine');
  const [turboActive, setTurboActive] = useState(false);
  const [multitapLevel, setMultitapLevel] = useState(1); // Додайте це

  const handleClick = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    if (energy > 0) {
      const increment = turboActive ? multitapLevel * 5 : multitapLevel;
      setScore(prevScore => prevScore + increment);
      setEnergy(prevEnergy => Math.max(prevEnergy - multitapLevel, 0));
    }
  };

  const handleMenuItemClick = (item: string) => {
    setCurrentView(item);
  };

  const handleSettingsClick = () => {
    console.log('Settings clicked');
  };

  return (
    <div className="game-interface">
      <EnergyBar
        energy={energy}
        maxEnergy={maxEnergy}
        onSettingsClick={handleSettingsClick}
      />
      <CoinBalance balance={score} />
      <div className="badge">Silver</div>
      <div className="center-content">
        <ExchangeDisplay
          onClick={handleClick}
          turboActive={turboActive}
          multitapLevel={multitapLevel}
        />
        <div className="exchange-text">Your Exchange</div>
      </div>
      <BottomMenu
        activeItem={currentView}
        onMenuItemClick={handleMenuItemClick}
      />
    </div>
  );
};

export default GameInterface;