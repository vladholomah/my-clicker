import React from 'react';

interface EnergyBarProps {
  energy: number;
  maxEnergy: number;
}

const EnergyBar: React.FC<EnergyBarProps> = ({ energy, maxEnergy }) => {
  const percentage = (energy / maxEnergy) * 100;

  return (
    <div className="energy-bar">
      <span className="energy-icon">⚡</span>
      <span>{energy}/{maxEnergy}</span>
      <div className="energy-fill-container">
        <div className="energy-fill" style={{ width: `${percentage}%` }}></div>
      </div>
      <button className="settings-button">⚙️</button>
    </div>
  );
};

export default EnergyBar;