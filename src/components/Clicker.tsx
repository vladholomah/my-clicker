import React, { useState, useEffect } from 'react';
import EnergyBar from './EnergyBar';
import CoinBalance from './CoinBalance';
import ExchangeDisplay from './ExchangeDisplay';
import ExchangeButton from './ExchangeButton';
import { useBoost } from '../BoostContext';

interface ClickerProps {
  onBinanceClick: () => void;
  selectedExchange: {
    name: string;
    logo: string;
  };
  onSettingsClick: () => void;
  score: number;
  onScoreChange: (newScore: number) => void;
  onLevelClick: () => void;
}

const getLevelInfo = (score: number) => {
  if (score < 100) return { name: 'Silver', icon: '/images/silver.png' };
  if (score < 200) return { name: 'Gold', icon: '/images/gold.png' };
  if (score < 300) return { name: 'Platinum', icon: '/images/platinum.png' };
  if (score < 400) return { name: 'Diamond', icon: '/images/diamond.png' };
  if (score < 600) return { name: 'Epic', icon: '/images/epic.png' };
  return { name: 'Legendary', icon: '/images/legendary.png' };
};

const Clicker: React.FC<ClickerProps> = ({
  onBinanceClick,
  selectedExchange,
  onSettingsClick,
  score,
  onScoreChange,
  onLevelClick
}) => {
  const { isTurboActive } = useBoost();
  const [energy, setEnergy] = useState(1500);
  const maxEnergy = 1500;
  const levelInfo = getLevelInfo(score);

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
        <button className="level-button" onClick={onLevelClick}>
          <img src={levelInfo.icon} alt={levelInfo.name} className="level-icon"/>
          <span className="level-name">{levelInfo.name}</span>
          <img src="/images/arrow-right.png" alt=">" className="arrow-icon"/>
        </button>
        <div className="center-content">
          <ExchangeDisplay onClick={handleClick} turboActive={isTurboActive}/>
          <div className="exchange-info">
            <div className="exchange-text">Your Exchange</div>
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