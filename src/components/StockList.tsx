import React from 'react';
import './StockList.css';
import { Stock } from './Card';

interface StockListProps {
  stocks: Stock[];
  onSelectStock: (stockId: string) => void;
}

const StockList: React.FC<StockListProps> = ({ stocks, onSelectStock }) => {
  return (
    <div className="stock-list-container">
      <h1 className="stock-list-title">Available Stocks</h1>
      <div className="stock-list">
        {stocks.map((stock) => (
          <div key={stock.id} className="stock-item" onClick={() => onSelectStock(stock.id)}>
            <img src={stock.image} alt={stock.name} className="stock-image" />
            <div className="stock-info">
              <h2 className="stock-name">{stock.name}</h2>
              <p className="stock-description">{stock.shortDescription}</p>
              <p className="stock-price">${stock.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockList;