import React from 'react';

interface CoinBalanceProps {
  balance: number;
}

const CoinBalance: React.FC<CoinBalanceProps> = ({ balance }) => {
  return (
    <div className="coin-balance">
      <img src="/images/balance.png" alt="Balance" className="balance-icon" />
      <span>{balance}</span>
    </div>
  );
};

export default CoinBalance;