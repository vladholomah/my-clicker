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
  onRewardsClick: () => void;
  rewardsReceived: boolean;
}

const Boost: React.FC<BoostProps> = ({
  balance,
  setCurrentView,
  onMultitapUpgrade,
  onEnergyBoostUpgrade,
  onEnergyRecoveryUpgrade,
  currentEnergyRecoveryRate,
  currentLevel,
  currentMaxEnergy,
  onRewardsClick,
  rewardsReceived
}) => {
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(0);
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
    const images = ['/images/x5.png', '/images/fullenergy.png', '/images/level-b.png', '/images/balance.png', '/images/done.png', '/images/donefree.png'];
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

  const handleRewardsClick = () => {
    if (!rewardsReceived) {
      const reward = calculateReward(balance);
      setRewardAmount(reward);
      setShowRewardModal(true);
      onRewardsClick();
    }
  };

  const calculateReward = (balance: number) => {
    if (balance < 5000) return 1000;
    if (balance < 25000) return 10000;
    if (balance < 100000) return 15000;
    if (balance < 1000000) return 30000;
    if (balance < 2000000) return 50000;
    return 5000000;
  };

  const getButtonContent = (image: string, text: string, timer: React.ReactNode) => {
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
          <img src="/images/balance.png" alt="Balance" className="balance-icon"/>
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
                onClick={handleRewardsClick}
                className={`boost-button rewards-button ${!rewardsReceived ? 'active' : ''}`}
                disabled={rewardsReceived}
            >
              {getButtonContent(
                  "/images/level-b.png",
                  "Rewards",
                  rewardsReceived ? (
                      <img src="/images/done.png" alt="Done" className="done-icon boost-timer"/>
                  ) : (
                      <>
                        <span className="rewards-notification"></span>
                        "Get"
                      </>
                  )
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
        {showRewardModal && (
            <div className="reward-modal">
              <div className="reward-content">
                <div className="congrats-image-container">
                  <img src="/images/donefree.png" alt="Вітаємо" className="congrats-image"/>
                  <div className="flying-circle"></div>
                  <div className="flying-circle"></div>
                  <div className="flying-circle"></div>
                  <div className="flying-circle"></div>
                  <div className="flying-circle"></div>
                </div>
                <h2 className="congrats-text">Congrats!</h2>
                <p className="reward-text">You have received a reward</p>
                <div className="reward-amount">
                  <img src="/images/balance.png" alt="Balance" className="balance-icons"/>
                  <span>{rewardAmount}</span>
                </div>
                <button className="back-button" onClick={() => setShowRewardModal(false)}>Back</button>
              </div>
            </div>
        )}
      </div>
  );
};

export default Boost;