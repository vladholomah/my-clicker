import React from 'react';
import './Exchange.css';
import ExchangeButton from './ExchangeButton';

interface ExchangeProps {
  onExchangeSelect: (exchange: string) => void;
}

const exchanges = [
  { name: 'Holmah', logo: '/images/holmah.png' },
  { name: 'Binance', logo: '/images/binance-logo.png' },
  { name: 'Bybit', logo: '/images/bybit.png' },
  { name: 'Qmall', logo: '/images/qmall.png' },
  { name: 'WhiteBit', logo: '/images/whitebit.png' }
];

const Exchange: React.FC<ExchangeProps> = ({ onExchangeSelect }) => {
  return (
    <div className="exchange-page">
      <h1>Select Exchange</h1>
      <div className="exchange-grid">
        {exchanges.map((exchange) => (
          <ExchangeButton
            key={exchange.name}
            onClick={() => onExchangeSelect(exchange.name)}
            logo={exchange.logo}
            name={exchange.name}
          />
        ))}
      </div>
    </div>
  );
};

export default Exchange;
