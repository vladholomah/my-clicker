import React from 'react';
import { useBoost } from '../BoostContext';
import './Boost.css';

interface BoostProps {
  balance: number;
  setCurrentView: (view: string) => void;
}

const Boost: React.FC<BoostProps> = ({ balance, setCurrentView }) => {
  const { turboCount, turboTimer, cooldownTimer, activateTurbo } = useBoost();

  const handleActivateTurbo = () => {
    activateTurbo();
    setCurrentView('mine');
  };

  const getButtonContent = () => {
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

  return (
    <div className="boost">
      <div className="balance">Баланс: {balance}</div>
      <button
        onClick={handleActivateTurbo}
        disabled={turboCount === 0 || turboTimer > 0 || cooldownTimer > 0}
        className={`boost-button ${turboTimer > 0 ? 'active' : ''}`}
      >
        {getButtonContent()}
      </button>
    </div>
  );
};

export default Boost;