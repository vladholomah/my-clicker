import React from 'react';

interface CoinBalanceProps {
  balance: number;
}

const CoinBalance: React.FC<CoinBalanceProps> = ({ balance }) => {
  return (
    <div className="coin-balance">
      <span>{balance} Coins</span>
    </div>
  );
};

export default CoinBalance;