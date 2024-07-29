import React, { useState, useEffect } from 'react';
import './Card.css';

interface CardProps {
  balance: number;
}

const Card: React.FC<CardProps> = ({ balance }) => {
  const [chartData, setChartData] = useState<number[]>([]);

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
          <div className="balance-info">
            <span className="balance-date">on Jan 21, 11:42</span>
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
            <button className="time-filter">1H</button>
            <button className="time-filter active">1D</button>
            <button className="time-filter">1W</button>
            <button className="time-filter">1M</button>
            <button className="time-filter">1Y</button>
          </div>
        </div>
        <div className="card-bottom">
          <h2 className="portfolio-title">Your portfolio</h2>
          <div className="portfolio-item">
            <span className="coin-icon">₿</span>
            <span className="coin-name">CryptoBall Coin</span>
            <div className="coin-details">
              <span className="coin-amount">{(cardBalance / 3908.25).toFixed(4)} CRB</span>
              <span className="coin-value">${cardBalance.toFixed(2)}</span>
              <span className="coin-change positive">▲ 4.51%</span>
            </div>
          </div>
          <div className="action-buttons">
            <button className="action-button buy">Buy CRB</button>
            <button className="action-button sell">Sell CRB</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;