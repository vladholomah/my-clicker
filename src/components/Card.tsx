import React from 'react';
import './Card.css';

interface CardProps {
  balance: number;
}
const Card: React.FC<CardProps> = ({ balance }) => {
  return (
    <div className="card-container">
      <div className="header">
        <div className="welcome-text">Hi, welcome Akobundu</div>
        <div className="notifications-icon">🔔</div>
      </div>

      <div className="balance-section">
        <div className="balance-label">My Balance</div>
        <div className="balance-amount">$ {balance.toFixed(2)}</div>
        <select className="currency-dropdown">
          <option>USD</option>
        </select>
      </div>

      <div className="action-buttons">
        <button className="action-button">Transfer</button>
        <button className="action-button">Request</button>
      </div>

      <div className="additional-actions">
        <button className="get-plan-button">
          <span role="img" aria-label="star">⭐</span> Get plan
        </button>
        <div className="recent-transactions">
          <div className="transaction-avatar"></div>
          <div className="transaction-avatar"></div>
          <div className="transaction-avatar"></div>
          <div className="transaction-avatar"></div>
          <div className="transaction-avatar"></div>
        </div>
      </div>

      <div className="transactions-section">
        <h2>Transactions</h2>
        <div className="transaction-item">
          <img src="/path-to-figma-icon.png" alt="Figma" className="transaction-icon" />
          <div className="transaction-details">
            <div className="transaction-name">Figma Subscription</div>
            <div className="transaction-date">20 - 01 2023, 06:00</div>
          </div>
          <div className="transaction-info">
            <div className="transaction-amount">-$1,200.00</div>
            <div className="transaction-status">Completed</div>
          </div>
        </div>
        <div className="transaction-item">
          <img src="/path-to-mcdonald-icon.png" alt="McDonald" className="transaction-icon" />
          <div className="transaction-details">
            <div className="transaction-name">McDonald</div>
            <div className="transaction-date">20 - 01 2023, 06:00</div>
          </div>
          <div className="transaction-info">
            <div className="transaction-amount">+$800.00</div>
            <div className="transaction-status">Completed</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;