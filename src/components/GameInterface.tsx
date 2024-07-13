import React, { useState, useEffect } from 'react';
import EnergyBar from './EnergyBar';
import CoinBalance from './CoinBalance';
import ExchangeDisplay from './ExchangeDisplay';
import BottomMenu from './BottomMenu';

const GameInterface: React.FC = () => {
  const [score, setScore] = useState(0);
  const [energy, setEnergy] = useState(1500);
  const maxEnergy = 1500;

  useEffect(() => {
    const timer = setInterval(() => {
      setEnergy(prevEnergy => Math.min(prevEnergy + 1, maxEnergy));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClick = (x: number, y: number) => {
    if (energy > 0) {
      setScore(prevScore => prevScore + 1);
      setEnergy(prevEnergy => Math.max(prevEnergy - 1, 0));
    }
  };

  return (
    <div className="game-interface">
      <EnergyBar energy={energy} maxEnergy={maxEnergy} />
      <CoinBalance balance={score} />
      <div className="badge">Silver</div>
      <ExchangeDisplay onClick={handleClick} />
      <button className="binance-button">
        <img src="/images/binance-logo.png" alt="Binance" />
        BINANCE
      </button>
      <BottomMenu />
    </div>
  );
};

export default GameInterface;