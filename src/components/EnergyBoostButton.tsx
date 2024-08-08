import React, { useState } from 'react';
import './MultitapButton.css';

interface EnergyBoostButtonProps {
  balance: number;
  currentMaxEnergy: number;
  onEnergyBoostUpgrade: (newMaxEnergy: number, cost: number) => void;
}

const EnergyBoostButton: React.FC<EnergyBoostButtonProps> = ({ balance, currentMaxEnergy, onEnergyBoostUpgrade }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const getNextLevelInfo = () => {
    const currentLevel = (currentMaxEnergy - 1500) / 500;
    const nextLevel = currentLevel + 1;
    let cost;
    if (nextLevel <= 7) {
      cost = (nextLevel - 1) * 100 + 200;
    } else {
      cost = 200;
    }
    return { cost, newMaxEnergy: currentMaxEnergy + 500 };
  };

  const { cost: upgradeCost, newMaxEnergy } = getNextLevelInfo();

  const handleClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    onEnergyBoostUpgrade(newMaxEnergy, upgradeCost);
    setShowConfirmation(false);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <button
        className="multitap-button energy-boost-specific"
        onClick={handleClick}
        disabled={balance < upgradeCost || currentMaxEnergy >= 100000}
      >
        <div className="multitap-button-content">
          <div className="multitap-content">
            <img src="/images/energy.png" alt="Energy Boost" className="multitap-icon"/>
            <div className="multitap-text">
              <span className="multitap-title">Energy boost</span>
              <span className="multitap-levels">{currentMaxEnergy} to {newMaxEnergy}</span>
            </div>
          </div>
          <div className="multitap-cost">
            <img src="/images/balance.png" alt="Balance" className="balance-batton"/>
            <span>{upgradeCost}</span>
            <img src="/images/arrow-right.png" alt="Arrow" className="arrow-icon"/>
          </div>
        </div>
      </button>

      {showConfirmation && (
        <div className="confirmation-overlay">
          <div className="confirmation-modal energy-boost-modal">
            <button className="close-button" onClick={handleCancel}>×</button>
            <img src="/images/energy.png" alt="Energy Boost" className="multitap-image"/>
            <div className="multitap-info">
              Energy boost збільшить вашу максимальну енергію до {newMaxEnergy}
            </div>
            <div className="price-info">
              <img src="/images/balance.png" alt="Balance" className="price-icon"/>
              <span>{upgradeCost}</span>
            </div>
            <button
              className="confirm-button energy-boost-confirm"
              onClick={handleConfirm}
              disabled={balance < upgradeCost}
            >
              Підтвердити
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EnergyBoostButton;