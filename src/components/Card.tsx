import React from 'react';
import './Card.css';

export interface Stock {
  id: string;
  name: string;
  shortDescription: string;
  price: number;
  image: string;
}

interface CardProps {
  stock: Stock;
  onBack: () => void;
}

const Card: React.FC<CardProps> = ({ stock, onBack }) => {
  const [quantity, setQuantity] = React.useState(1);

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => quantity > 1 && setQuantity(quantity - 1);

  return (
    <div className="card-container">
      <button className="back-button" onClick={onBack}>Back</button>
      <div className="content">
        <h1 className="title">{stock.name}</h1>
        <p className="subtitle">{stock.shortDescription}</p>

        <div className="coin-image">
          <img src={stock.image} alt={stock.name} />
        </div>

        <div className="quantity-selector">
          <button className="quantity-button" onClick={decreaseQuantity}>-</button>
          <span className="quantity">{quantity}</span>
          <button className="quantity-button" onClick={increaseQuantity}>+</button>
        </div>

        <div className="price">
          Price: <span className="highlight">${(quantity * stock.price).toFixed(2)}</span>
        </div>

        <button className="buy-button">Buy Now</button>

        <button className="info-button">Learn More</button>
      </div>
    </div>
  );
};

export default Card;