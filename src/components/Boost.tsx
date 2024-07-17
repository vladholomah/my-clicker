import React from 'react';
import { useBoost } from '../BoostContext';
import { useEnergy } from '../EnergyContext';
import MultitapButton from './MultitapButton';
import './Boost.css';

interface BoostProps {
  balance: number;
  setCurrentView: (view: string) => void;
  onMultitapUpgrade: (level: number, cost: number) => void;
  currentLevel: number; // Додайте це
}

const Boost: React.FC<BoostProps> = ({ balance, setCurrentView, onMultitapUpgrade, currentLevel }) => {
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

  const getTurboButtonContent = () => {
    return (
      <>
        <div className="turbo-image-container">
          <img src="/images/x5.png" alt="Turbo" className="turbo-image" />
          <div className="rocket-animation"></div>
        </div>
        <div className="turbo-text-container">
          <span className="turbo-text">Turbo</span>
          <span className="turbo-timer">
            {turboTimer > 0 ? `${turboTimer}s` :
             cooldownTimer > 0 ? `Cooldown: ${cooldownTimer}s` :
             ` ${turboCount}/3`}
          </span>
        </div>
      </>
    );
  };

  const getEnergyButtonContent = () => {
    return (
      <>
        <div className="energy-image-container">
          <img src="/images/fullenergy.png" alt="Energy" className="energy-image" />
        </div>
        <div className="energy-text-container">
          <span className="energy-text">Energy</span>
          <span className="energy-timer">
            {energyRefillCooldown > 0 ? `Cooldown: ${energyRefillCooldown}s` : ` ${energyRefillCount}/3`}
          </span>
        </div>
      </>
    );
  };

  return (
    <div className="boost">
      <h1 className="boost-title">Boost</h1>
      <h2 className="balance-title">Your Balance</h2>
      <div className="balance">
        <img src="/images/balance.png" alt="Balance" className="balance-icon" />
        <span>{balance}</span>
      </div>
      <div className="boost-buttons-container">
        <button
          onClick={handleActivateTurbo}
          disabled={turboCount === 0 || turboTimer > 0 || cooldownTimer > 0}
          className={`boost-button ${turboTimer > 0 ? 'active' : ''}`}
        >
          {getTurboButtonContent()}
        </button>
        <button
          onClick={handleActivateEnergyRefill}
          disabled={energyRefillCount === 0 || energyRefillCooldown > 0}
          className="boost-button energy-button"
        >
          {getEnergyButtonContent()}
        </button>
      </div>
      <MultitapButton
  balance={balance}
  onMultitapUpgrade={onMultitapUpgrade}
  currentLevel={currentLevel} // Додайте це
/>
    </div>
  );
};
export default Boost;