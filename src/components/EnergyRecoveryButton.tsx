import React, { useState } from 'react';
import './MultitapButton.css'; // Припустимо, що ми використовуємо ті ж стилі

interface EnergyRecoveryButtonProps {
  balance: number;
  currentEnergyRecoveryRate: number;
  onEnergyRecoveryUpgrade: (newRecoveryRate: number, cost: number) => void;
}

const EnergyRecoveryButton: React.FC<EnergyRecoveryButtonProps> = ({
  balance,
  currentEnergyRecoveryRate,
  onEnergyRecoveryUpgrade
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const getNextLevelInfo = () => {
    const levels = [4000, 3000, 2000, 1000];
    const costs = [200, 300, 400, 500];
    const currentIndex = levels.indexOf(currentEnergyRecoveryRate);
    if (currentIndex < levels.length - 1) {
      return {
        rate: levels[currentIndex + 1],
        cost: costs[currentIndex + 1]
      };
    }
    return null;
  };

  const nextLevelInfo = getNextLevelInfo();

  const handleClick = () => {
    if (nextLevelInfo) {
      setShowConfirmation(true);
    }
  };

  const handleConfirm = () => {
    if (nextLevelInfo) {
      onEnergyRecoveryUpgrade(nextLevelInfo.rate, nextLevelInfo.cost);
    }
    setShowConfirmation(false);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <button
          className="multitap-button recharging-speed-specific"
          onClick={handleClick}
          disabled={!nextLevelInfo || balance < (nextLevelInfo?.cost || 0)}
      >
        <div className="multitap-button-content">
          <div className="multitap-content">
            <img src="/images/Energyrecovery.png" alt="Energy Recovery" className="multitap-icon"/>
            <div className="multitap-text">
              <span className="multitap-title">Recharging Speed</span>
              <span className="multitap-levels">
                {nextLevelInfo
                    ? `1:${currentEnergyRecoveryRate} to 1:${nextLevelInfo.rate}`
                    : `Max level (1:${currentEnergyRecoveryRate})`
                }
              </span>
            </div>
          </div>
          <div className="multitap-cost">
            {nextLevelInfo && (
                <>
                  <img src="/images/balance.png" alt="Balance" className="balance-batton"/>
                  <span>{nextLevelInfo.cost}</span>
                  <img src="/images/arrow-right.png" alt="Arrow" className="arrow-icon"/>
                </>
            )}
          </div>
        </div>
      </button>

      {showConfirmation && nextLevelInfo && (
          <div className="confirmation-overlay">
            <div className="confirmation-modal recharging-speed-modal">
              <button className="close-button" onClick={handleCancel}>×</button>
              <img src="/images/Energyrecovery.png" alt="Energy Recovery" className="multitap-image"/>
              <div className="multitap-info">
                Відновлює енергію швидше
              </div>
              <div className="price-info">
                <img src="/images/balance.png" alt="Balance" className="price-icon"/>
                <span>{nextLevelInfo.cost}</span>
              </div>
              <button
                  className="confirm-button recharging-speed-confirm"
                  onClick={handleConfirm}
                  disabled={balance < nextLevelInfo.cost}
              >
                Підтвердити
              </button>
            </div>
          </div>
      )}
    </>
  );
};

export default EnergyRecoveryButton;