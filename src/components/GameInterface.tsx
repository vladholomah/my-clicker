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

  const handleClick = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    if (energy > 0) {
      setScore(prevScore => prevScore + (turboActive ? 5 : 1));
      setEnergy(prevEnergy => Math.max(prevEnergy - 1, 0));
    }
  };

  const handleMenuItemClick = (item: string) => {
    setCurrentView(item);
  };

  const handleSettingsClick = () => {
    // Handle settings click, for example:
    console.log('Settings clicked');
    // You might want to set a new view or open a modal here
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
        <ExchangeDisplay onClick={handleClick} turboActive={turboActive} />
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