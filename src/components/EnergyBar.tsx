import React from 'react';
import './EnergyBar.css'; // Переконайтеся, що ви імпортуєте CSS файл

interface EnergyBarProps {
  energy: number;
  maxEnergy: number;
  onSettingsClick: () => void;
}

const EnergyBar: React.FC<EnergyBarProps> = ({ energy, maxEnergy, onSettingsClick }) => {
  const percentage = (energy / maxEnergy) * 100;

  return (
    <div className="energy-bar">
      <span className="energy-icon">⚡</span>
      <span>{energy}/{maxEnergy}</span>
      <div className="energy-fill-container">
        <div className="energy-fill" style={{ width: `${percentage}%` }}></div>
      </div>
      <button className="settings-button" onClick={onSettingsClick}>
        <img src="/images/setting.png" alt="Settings" className="settings-icon" />
      </button>
    </div>
  );
};

export default EnergyBar;