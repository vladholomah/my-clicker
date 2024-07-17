import React from 'react';
import './EnergyBar.css';
import energyIcon from '../images/energy.png'; // Оновлений шля

interface EnergyBarProps {
  energy: number;
  maxEnergy: number;
  onSettingsClick: () => void;
}

const EnergyBar: React.FC<EnergyBarProps> = ({ energy, maxEnergy, onSettingsClick }) => {
  const percentage = (energy / maxEnergy) * 100;

  return (
    <div className="energy-bar">
      <div className="energy-content">
        <img src={energyIcon} alt="Energy" className="energy-icon" />
        <span className="energy-balance">{energy}/{maxEnergy}</span>
        <div className="energy-fill-container">
          <div className="energy-fill" style={{ width: `${percentage}%` }}></div>
        </div>
      </div>
      <button className="settings-button" onClick={onSettingsClick}>
        <img src="/images/setting.png" alt="Settings" className="settings-icon" />
      </button>
    </div>
  );
};

export default EnergyBar;