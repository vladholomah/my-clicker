import React, { useEffect, useState } from 'react';
import { useBoost } from '../BoostContext';
import { useEnergy } from '../EnergyContext';
import MultitapButton from './MultitapButton';
import EnergyBoostButton from './EnergyBoostButton';
import EnergyRecoveryButton from './EnergyRecoveryButton';
import './Boost.css';

interface BoostProps {
  balance: number;
  setCurrentView: (view: string) => void;
  onMultitapUpgrade: (level: number, cost: number) => void;
  onEnergyBoostUpgrade: (newMaxEnergy: number, cost: number) => void;
  onEnergyRecoveryUpgrade: (newRate: number, cost: number) => void;
  currentLevel: number;
  currentMaxEnergy: number;
  currentEnergyRecoveryRate: number;
}

const Boost: React.FC<BoostProps> = ({
  balance,
  setCurrentView,
  onMultitapUpgrade,
  onEnergyBoostUpgrade,
  onEnergyRecoveryUpgrade,
  currentEnergyRecoveryRate,
  currentLevel,
  currentMaxEnergy
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const images = ['/images/x5.png', '/images/fullenergy.png', '/images/level-b.png', '/images/balance.png'];
    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

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
    <div className={`boost ${isLoaded ? 'loaded' : ''}`}>
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
          >
            {getButtonContent(
              "/images/level-b.png",
              "Rewards",
              "get"
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
        <EnergyRecoveryButton
  balance={balance}
  onEnergyRecoveryUpgrade={onEnergyRecoveryUpgrade}
  currentEnergyRecoveryRate={currentEnergyRecoveryRate}
/>
      </div>
    </div>
  );
};

export default Boost;