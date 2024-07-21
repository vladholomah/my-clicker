import React from 'react';
import { useBoost } from '../BoostContext';
import { useEnergy } from '../EnergyContext';
import MultitapButton from './MultitapButton';
import EnergyBoostButton from './EnergyBoostButton';
import './Boost.css';

interface BoostProps {
  balance: number;
  setCurrentView: (view: string) => void;
  onMultitapUpgrade: (level: number, cost: number) => void;
  onEnergyBoostUpgrade: (newMaxEnergy: number, cost: number) => void;
  currentLevel: number;
  currentMaxEnergy: number;
}

const Boost: React.FC<BoostProps> = ({
  balance,
  setCurrentView,
  onMultitapUpgrade,
  onEnergyBoostUpgrade,
  currentLevel,
  currentMaxEnergy
}) => {
  const {
    turboCount,
    turboTimer,
    cooldownTimer,
    activateTurbo
  } = useBoost();

  const {
    energyRefillCount,
    energyRefillCooldown,
    activateEnergyRefill
  } = useEnergy();

  const handleActivateTurbo = () => {
    activateTurbo();
    setCurrentView('mine');
  };

  const handleActivateEnergyRefill = () => {
    activateEnergyRefill();
    setCurrentView('mine');
  };

  const getButtonContent = (image: string, text: string, timer: string) => {
    return (
      <>
        <div className="boost-image-container">
          <img src={image} alt={text} className="boost-image" />
        </div>
        <div className="boost-text-container">
          <span className="boost-text">{text}</span>
          <span className="boost-timer">{timer}</span>
        </div>
      </>
    );
  };

  return (
    <div className="boost">
      <h1 className="boost-title"></h1>
      <h2 className="balance-title">Your Balance</h2>
      <div className="balance">
        <img src="/images/balance.png" alt="Balance" className="balance-icon" />
        <span>{balance}</span>
      </div>
      <div className="boost-section">
        <h3 className="boost-section-title">Free Daily Boosters</h3>
        <div className="boost-buttons-container">
          <button
            onClick={handleActivateTurbo}
            disabled={turboCount === 0 || turboTimer > 0 || cooldownTimer > 0}
            className={`boost-button ${turboTimer > 0 ? 'active' : ''}`}
          >
            {getButtonContent(
              "/images/x5.png",
              "Turbo",
              turboTimer > 0 ? `${turboTimer}s` :
              cooldownTimer > 0 ? `Cooldown: ${cooldownTimer}s` :
              `${turboCount}/3`
            )}
          </button>
          <button
            onClick={handleActivateEnergyRefill}
            disabled={energyRefillCount === 0 || energyRefillCooldown > 0}
            className="boost-button energy-button"
          >
            {getButtonContent(
              "/images/fullenergy.png",
              "Energy",
              energyRefillCooldown > 0 ? `Cooldown: ${energyRefillCooldown}s` : `${energyRefillCount}/3`
            )}
          </button>
          <button
            className="boost-button"
            // Тут можна додати обробник кліку, коли ви будете готові додати функціональність
          >
            {getButtonContent(
              "/images/level-b.png",
              "Rewards",
              "get" // Можна змінити на актуальний текст або таймер, коли додасте функціональність
            )}
          </button>
        </div>
      </div>
      <div className="boost-section">
        <h3 className="boost-section-title">Boosters</h3>
        <MultitapButton
          balance={balance}
          onMultitapUpgrade={onMultitapUpgrade}
          currentLevel={currentLevel}
        />
        <EnergyBoostButton
          balance={balance}
          onEnergyBoostUpgrade={onEnergyBoostUpgrade}
          currentMaxEnergy={currentMaxEnergy}
        />
      </div>
    </div>
  );
};

export default Boost;