import React from 'react';
import './ExchangeButton.css';

interface ExchangeButtonProps {
  onClick: () => void;
  logo: string;
  name: string;
  isMainView?: boolean;
}

const ExchangeButton: React.FC<ExchangeButtonProps> = ({ onClick, logo, name, isMainView = false }) => {
  return (
    <div className={`exchange-button-container ${isMainView ? 'main-view' : ''}`}>
      <button className="exchange-button" onClick={onClick}>
        <img src={logo} alt={name} />
        {!isMainView && <span>{name}</span>}
      </button>
    </div>
  );
};

export default ExchangeButton;