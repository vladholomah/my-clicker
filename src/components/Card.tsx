import React, { useState } from 'react';
import './Card.css';

interface CardProps {
  balance: number;
}

const Card: React.FC<CardProps> = ({ balance }) => {
  const [quantity, setQuantity] = useState(1);
  const pricePerShare = 1;

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => quantity > 1 && setQuantity(quantity - 1);

  return (
      <div className="card-container">
        <div className="header">
          <h1 className="title">CryptBall Black Sharks</h1>
        </div>

        <div className="stock-image">
          <img src="/images/path-to-cryptball-image.png" alt="CryptBall"/>
          <div className="investment-tag">Гаряча інвестиція</div>
        </div>

        <div className="info-section">
          <p className="description">
            Революційна Play-to-Earn платформа. Інвестуйте зараз - отримайте 1 000 000 монет миттєво!
          </p>

          <div className="benefits">
            <div className="benefit-item">
              <span className="benefit-icon">🚀</span>
              <span className="benefit-text">Ранній доступ</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">💰</span>
              <span className="benefit-text">Великий потенціал</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">🌐</span>
              <span className="benefit-text">Глобальна спільнота</span>
            </div>
          </div>

          <div className="stock-purchase">
            <div className="quantity-selector">
              <button className="quantity-button" onClick={decreaseQuantity}>-</button>
              <span className="quantity">{quantity}</span>
              <button className="quantity-button" onClick={increaseQuantity}>+</button>
            </div>
            <div className="price">
              Ціна: <span className="highlight">${(quantity * pricePerShare).toFixed(2)}</span>
            </div>
          </div>

          <button className="buy-button">Інвестувати зараз</button>

          <div className="reward-inform">
            <span className="reward-icon">🎁</span>
            <span>Ви отримаєте: {quantity * 1000000} монет</span>
          </div>
        </div>

        <div className="progress-bar">
          <div className="progress" style={{width: '75%'}}></div>
          <span className="progress-text">75% цілі досягнуто</span>
        </div>
      </div>
  );
};

export default Card;