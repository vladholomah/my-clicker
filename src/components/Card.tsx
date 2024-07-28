import React, { useEffect, useState } from 'react';
import './Card.css';

declare global {
  interface Window {
    Telegram: any;
  }
}

interface CardProps {
  balance: number;
}

interface TelegramUser {
  name: string;
  photoUrl: string;
}

const Card: React.FC<CardProps> = ({ balance }) => {
  const [user, setUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    if (tg.initDataUnsafe?.user) {
      setUser({
        name: tg.initDataUnsafe.user.first_name,
        photoUrl: tg.initDataUnsafe.user.photo_url || '/default-avatar.png'
      });
    }
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="card-container">
      <div className="header">
        <div className="user-info">
          <img src={user.photoUrl} alt={user.name} className="user-photo" />
          <div>
            <p>Hi, welcome</p>
            <h2>{user.name}</h2>
          </div>
        </div>
        <button className="notification-btn">🔔</button>
      </div>

      <div className="balance-section">
        <div>
          <p>My Balance</p>
          <h1>${balance.toFixed(2)}</h1>
        </div>
        <button className="statistics-btn">Statistics</button>
      </div>

      <div className="currency-selector">
        <span>USD</span>
        <span>▼</span>
      </div>

      <div className="action-buttons">
        <button className="transfer-btn">↑ Transfer</button>
        <button className="request-btn">↓ Request</button>
      </div>

      <div className="quick-actions">
        <button className="get-plan-btn">😃 Get plan</button>
        <div className="recent-transactions">
          <p>Recent Transaction</p>
          <div className="transaction-avatars">
            {/* Placeholder for recent transactions */}
            <div className="avatar-placeholder"></div>
            <div className="avatar-placeholder"></div>
            <div className="avatar-placeholder"></div>
          </div>
        </div>
      </div>

      <div className="transactions-list">
        <h3>Transactions</h3>
        <div className="transaction-item">
          <div className="transaction-logo">F</div>
          <div className="transaction-details">
            <p>Figma Subscription</p>
            <span>20 - 01 2023, 06:00</span>
          </div>
          <p className="transaction-amount negative">-$1,200.00</p>
        </div>
        <div className="transaction-item">
          <div className="transaction-logo">M</div>
          <div className="transaction-details">
            <p>McDonald</p>
            <span>20 - 01 2023, 06:00</span>
          </div>
          <p className="transaction-amount positive">+$800.00</p>
        </div>
      </div>
    </div>
  );
};

export default Card;