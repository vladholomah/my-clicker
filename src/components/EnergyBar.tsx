import React, { useEffect, useRef } from 'react';
import './EnergyBar.css';
import energyIcon from '../images/energy.png';

interface EnergyBarProps {
  energy: number;
  maxEnergy: number;
  onSettingsClick: () => void;
}

const EnergyBar: React.FC<EnergyBarProps> = ({ energy, maxEnergy, onSettingsClick }) => {
  const percentage = (energy / maxEnergy) * 100;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const createSparkle = () => {
      if (containerRef.current) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = `${Math.random() * 100}%`;
        sparkle.style.top = `${Math.random() * 100}%`;
        sparkle.style.animationDuration = `${Math.random() * 1 + 0.5}s`;
        containerRef.current.appendChild(sparkle);

        sparkle.addEventListener('animationend', () => {
          sparkle.remove();
        });
      }
    };

    const interval = setInterval(createSparkle, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="energy-bar" ref={containerRef}>
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