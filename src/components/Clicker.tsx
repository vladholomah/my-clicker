import React from 'react';
import EnergyBar from './EnergyBar';
import CoinBalance from './CoinBalance';
import ExchangeDisplay from './ExchangeDisplay';
import ExchangeButton from './ExchangeButton';
import { useBoost } from '../BoostContext';
import { useEnergy } from '../EnergyContext';

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
  multitapLevel: number;
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
  onLevelClick,
  multitapLevel,
}) => {
  const { isTurboActive } = useBoost();
  const { energy, maxEnergy, decreaseEnergy } = useEnergy();
  const levelInfo = getLevelInfo(score);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (energy > 0) {
      const baseIncrement = multitapLevel;
      onScoreChange(baseIncrement);
      decreaseEnergy(baseIncrement);

      // Логіка для анімації
      const animationCount = isTurboActive ? 5 : 1;
      for (let i = 0; i < animationCount; i++) {
        // Тут викликаємо функцію для створення анімації "+1"
        // Наприклад: createPlusOneAnimation();
      }
    }
  };

  return (
    <div className="game-interface">
      <EnergyBar energy={energy} maxEnergy={maxEnergy} onSettingsClick={onSettingsClick} />
      <CoinBalance balance={score} />
      <button className="level-button" onClick={onLevelClick}>
        <img src={levelInfo.icon} alt={levelInfo.name} className="level-icon" />
        <span className="level-name">{levelInfo.name}</span>
        <img src="/images/arrow-right.png" alt=">" className="arrow-icon" />
      </button>
      <div className="center-content">
        <ExchangeDisplay
          onClick={handleClick}
          turboActive={isTurboActive}
          multitapLevel={multitapLevel}
        />
        <div className="exchange-text">Your Exchange</div>
        <ExchangeButton
          onClick={onBinanceClick}
          logo={selectedExchange.logo}
          name={selectedExchange.name}
          isMainView={true}
        />
      </div>
      {isTurboActive && <div className="turbo-active">Turbo Active!</div>}
    </div>
  );
};

export default Clicker;