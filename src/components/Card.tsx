import React, { useState } from 'react';
import './Card.css';

const Card: React.FC = () => {
  const [isRaised, setIsRaised] = useState(false);

  const handleCardClick = () => {
    setIsRaised(!isRaised);
  };

  return (
    <div className="card-container">
      <h1 className="card-title">Card</h1>
      <div className={`card ${isRaised ? 'raised' : ''}`} onClick={handleCardClick}>
        <img src="/images/bank-card.png" alt="Bank Card" />
      </div>
      <div className="card-info">
        <img src="/images/card-info.png" alt="Card Info" className="card-info-image" />
        <p className="card-info-text"><strong>Information about the listing will appear here.</strong></p>
        <p className="card-info-subtext">It's the perfect time to mine with us!
Attention! The balance on your screen is just an approximate value, various factors influence the price.</p>
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