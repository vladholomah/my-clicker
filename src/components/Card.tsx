import React, { useState } from 'react';
import './Card.css';

interface CardProps {
  balance: number;
}

const Card: React.FC<CardProps> = ({ balance }) => {
  const [isRaised, setIsRaised] = useState(false);

  const handleCardClick = () => {
    setIsRaised(!isRaised);
  };

  const cardBalance = balance * 0.0004;

  return (
    <div className="card-container">
      <h1 className="card-title"></h1>
      <div className="card-balance">
        <span>{cardBalance.toFixed(2)}$</span>
      </div>
      <div className={`card ${isRaised ? 'raised' : ''}`} onClick={handleCardClick}>
        <img src="/images/bank-card.png" alt="Bank Card" />
      </div>
      <button className="info-button">
        <img src="/images/card-active.png" alt="Card Icon" className="info-icon" />
        <span>Info</span>
      </button>
      <div className="withdraw-button">
        <p className="withdraw-text">Withdrawal</p>
        <p className="withdraw-subtext">Withdrawal will be available after listing.</p>
      </div>
    </div>
  );
};

export default Card;