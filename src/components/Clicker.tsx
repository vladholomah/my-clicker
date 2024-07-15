import React, { useState, useEffect } from 'react';
import EnergyBar from './EnergyBar';
import CoinBalance from './CoinBalance';
import ExchangeDisplay from './ExchangeDisplay';
import ExchangeButton from './ExchangeButton';

interface ClickerProps {
  onBinanceClick: () => void;
  selectedExchange: {
    name: string;
    logo: string;
  };
}

const Clicker: React.FC<ClickerProps> = ({ onBinanceClick, selectedExchange }) => {
  const [score, setScore] = useState(0);
  const [energy, setEnergy] = useState(1500);
  const maxEnergy = 1500;

  useEffect(() => {
    const timer = setInterval(() => {
      setEnergy(prevEnergy => Math.min(prevEnergy + 1, maxEnergy));
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  const handleClick = () => {
    if (energy > 0) {
      setScore(prevScore => prevScore + 1);
      setEnergy(prevEnergy => Math.max(prevEnergy - 1, 0));
    }
  };

   return (
    <div className="clicker">
      <EnergyBar energy={energy} maxEnergy={maxEnergy} />
      <CoinBalance balance={score} />
      <div className="badge">Silver</div>
      <div className="center-content">
        <ExchangeDisplay onClick={handleClick} />
        <div className="exchange-info">
          <div className="exchange-text">Your Exchange:</div>
          <ExchangeButton
            onClick={onBinanceClick}
            logo={selectedExchange.logo}
            name={selectedExchange.name}
            isMainView={true}
          />
        </div>
      </div>
    </div>
  );
};

export default Clicker;