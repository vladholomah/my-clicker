import React, { useState, useEffect } from 'react';
import EnergyBar from './EnergyBar';
import CoinBalance from './CoinBalance';
import ExchangeDisplay from './ExchangeDisplay';
import ExchangeButton from './ExchangeButton';
import { useBoost } from '../BoostContext'; // Зверніть увагу на шлях імпорту

interface ClickerProps {
  onBinanceClick: () => void;
  selectedExchange: {
    name: string;
    logo: string;
  };
  onSettingsClick: () => void;
  score: number;
  onScoreChange: (newScore: number) => void;
}

const Clicker: React.FC<ClickerProps> = ({
  onBinanceClick,
  selectedExchange,
  onSettingsClick,
  score,
  onScoreChange
}) => {
  const { isTurboActive } = useBoost();
  const [energy, setEnergy] = useState(1500);
  const maxEnergy = 1500;

  useEffect(() => {
    const timer = setInterval(() => {
      setEnergy(prevEnergy => Math.min(prevEnergy + 1, maxEnergy));
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    if (energy > 0) {
      const increment = isTurboActive ? 5 : 1;
      onScoreChange(score + increment);
      setEnergy(prevEnergy => Math.max(prevEnergy - 1, 0));
    }
  };

  return (
    <div className="clicker">
      <EnergyBar energy={energy} maxEnergy={maxEnergy} onSettingsClick={onSettingsClick}/>
      <CoinBalance balance={score}/>
      <div className="badge">Silver</div>
      <div className="center-content">
        <ExchangeDisplay onClick={handleClick} turboActive={isTurboActive}/>
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
      {isTurboActive && <div className="turbo-active">Turbo Active!</div>}
    </div>
  );
};

export default Clicker;