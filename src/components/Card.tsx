import React, { useState, useEffect } from 'react';
import './Card.css';

interface CardProps {
  balance: number;
}

const Card: React.FC<CardProps> = ({ balance }) => {
  const [chartData, setChartData] = useState<number[]>([]);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const cardBalance = balance * 0.0004;

  useEffect(() => {
    const generateChartData = () => {
      const data = [];
      for (let i = 0; i < 20; i++) {
        data.push(Math.random() * 10 + 90);
      }
      setChartData(data);
    };

    generateChartData();
  }, []);

  const handlePurchase = () => {
    setShowPurchaseModal(true);
  };

  const confirmPurchase = () => {
    // Логіка обробки покупки
    setShowPurchaseModal(false);
    // Оновлення балансу після покупки
  };

  return (
    <div className="app-container">
      <div className="card-container">
        <div className="card-top">
          <div className="card-header">
            <div className="back-arrow">
              <span>←</span>
            </div>
            <div className="crypto-info">
              <span className="crypto-icon">♦</span>
              <span className="crypto-name">CryptoBall</span>
            </div>
            <span className="more-info">⋮</span>
          </div>
          <h1 className="card-balance">${cardBalance.toFixed(2)}</h1>
          <div className="balance-inform">
            <span className="balance-date">21 січня, 11:42</span>
            <span className="balance-change">↗ 0.00%</span>
          </div>
          <div className="chart-container">
            <svg viewBox="0 0 100 30">
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(99, 125, 234, 0.5)"/>
                  <stop offset="100%" stopColor="rgba(99, 125, 234, 0)"/>
                </linearGradient>
              </defs>
              <path
                d={`M0,30 ${chartData.map((point, index) => `L${index * 5},${30 - point / 4}`).join(' ')} V30 H0`}
                fill="url(#gradient)"
              />
              <polyline
                fill="none"
                stroke="#637DEA"
                strokeWidth="2"
                points={chartData.map((point, index) => `${index * 5},${30 - point / 4}`).join(' ')}
              />
            </svg>
          </div>
          <div className="time-filters">
            <button className="time-filter">1Г</button>
            <button className="time-filter active">1Д</button>
            <button className="time-filter">1Т</button>
            <button className="time-filter">1М</button>
            <button className="time-filter">1Р</button>
          </div>
        </div>
        <div className="card-bottom">
          <div className="offer-card">
            <h3 className="offer-title">Спеціальна пропозиція</h3>
            <p className="offer-description">Інвестуйте в CryptoBall Coin (CRB) зараз!</p>
            <ul className="offer-details">
              <li>💰 $1 = 1 000 000 CRB</li>
              <li>📈 Потенціал росту до 1000%</li>
              <li>🚀 Інноваційна технологія</li>
              <li>⚡ Швидкі транзакції</li>
            </ul>
            <button className="offer-button" onClick={handlePurchase}>Купити зараз</button>
          </div>
        </div>
      </div>
      {showPurchaseModal && (
        <div className="purchase-modal">
          <h3>Підтвердження покупки</h3>
          <p>Ви впевнені, що хочете придбати 1 000 000 CRB за $1?</p>
          <div className="modal-buttons">
            <button onClick={() => setShowPurchaseModal(false)}>Скасувати</button>
            <button onClick={confirmPurchase}>Підтвердити</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;