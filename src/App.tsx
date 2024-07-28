import React, { useState, useEffect } from 'react';
import Clicker from './components/Clicker';
import BottomMenu from './components/BottomMenu';
import Exchange from './components/Exchange';
import Settings from './components/Settings';
import Boost from './components/Boost';
import Levels from './components/Levels';
import Card, { Stock } from './components/Card';
import StockList from './components/StockList';
import { BoostProvider } from './BoostContext';
import { EnergyProvider, useEnergy } from './EnergyContext';
import Earn from './components/Earn';
import './App.css';

function AppContent() {
  const [currentView, setCurrentView] = useState('mine');
  const [selectedExchange, setSelectedExchange] = useState({
    name: 'Holmah',
    logo: '/images/holmah.png'
  });
  const [score, setScore] = useState(0);
  const [multitapLevel, setMultitapLevel] = useState(1);
  const [energyRecoveryRate, setLocalEnergyRecoveryRate] = useState(5);
  const { maxEnergy, setMaxEnergy, refillEnergy, setEnergyRecoveryRate } = useEnergy();
  const [rewardsReceived, setRewardsReceived] = useState(false);
  const [lastRewardLevel, setLastRewardLevel] = useState('');
  const [selectedStockId, setSelectedStockId] = useState<string | null>(null);

const stocks: Stock[] = [
  { id: '1', name: 'CryptBall Black Sharks', shortDescription: 'Invest in the future of crypto gaming', price: 1, image: '/images/path-to-cryptball-image.png' },
  // Додайте інші акції тут
];

  const handleMenuItemClick = (item: string) => {
    setCurrentView(item);
    setSelectedStockId(null);
  };

  const handleBinanceClick = () => {
    setCurrentView('exchange');
  };

  const handleExchangeSelect = (exchangeName: string) => {
    const newExchange = {
      name: exchangeName,
      logo: exchangeName === 'Holmah'
        ? '/images/holmah.png'
        : `/images/${exchangeName.toLowerCase()}${exchangeName === 'Binance' ? '-logo' : ''}.png`
    };
    setSelectedExchange(newExchange);
    setCurrentView('mine');
  };

  const handleSettingsClick = () => {
    setCurrentView('settings');
  };

  const handleMultitapUpgrade = (level: number, cost: number) => {
    if (score >= cost) {
      setScore(score - cost);
      setMultitapLevel(level);
    }
  };

  const handleEnergyBoostUpgrade = (newMaxEnergy: number, cost: number) => {
    if (score >= cost) {
      setScore(score - cost);
      setMaxEnergy(newMaxEnergy);
      refillEnergy();
    }
  };

  const handleEnergyRecoveryUpgrade = (newRate: number, cost: number) => {
    if (score >= cost) {
      setScore(prevScore => prevScore - cost);
      setLocalEnergyRecoveryRate(newRate);
      setEnergyRecoveryRate(newRate);
    }
  };

  const handleScoreChange = (increment: number) => {
    setScore(prevScore => prevScore + increment);
  };

  const getLevelInfo = (score: number) => {
    if (score < 5000) return { name: 'Silver', reward: 1000 };
    if (score < 25000) return { name: 'Gold', reward: 10000 };
    if (score < 100000) return { name: 'Platinum', reward: 15000 };
    if (score < 1000000) return { name: 'Diamond', reward: 30000 };
    if (score < 2000000) return { name: 'Epic', reward: 50000 };
    return { name: 'Legendary', reward: 5000000 };
  };

  const handleRewardsClick = () => {
    const currentLevel = getLevelInfo(score);
    if (currentLevel.name !== lastRewardLevel && !rewardsReceived) {
      setScore(prevScore => prevScore + currentLevel.reward);
      setRewardsReceived(true);
      setLastRewardLevel(currentLevel.name);
    }
  };

  const handleSelectStock = (stockId: string) => {
    setSelectedStockId(stockId);
  };

  const handleBackToList = () => {
    setSelectedStockId(null);
  };

  useEffect(() => {
    const currentLevel = getLevelInfo(score);
    if (currentLevel.name !== lastRewardLevel) {
      setRewardsReceived(false);
    }
  }, [score, lastRewardLevel]);

  const renderView = () => {
    switch(currentView) {
      case 'levels':
        return <Levels />;
      case 'settings':
        return <Settings />;
      case 'exchange':
        return <Exchange
          onExchangeSelect={handleExchangeSelect}
          selectedExchange={selectedExchange.name}
          onScoreChange={handleScoreChange}
        />;
      case 'friends':
        return <h1>Friends</h1>;
      case 'boost':
        return <Boost
          balance={score}
          setCurrentView={setCurrentView}
          onMultitapUpgrade={handleMultitapUpgrade}
          onEnergyBoostUpgrade={handleEnergyBoostUpgrade}
          onEnergyRecoveryUpgrade={handleEnergyRecoveryUpgrade}
          currentLevel={multitapLevel}
          currentMaxEnergy={maxEnergy}
          currentEnergyRecoveryRate={energyRecoveryRate}
          onRewardsClick={handleRewardsClick}
          rewardsReceived={rewardsReceived}
        />;
      case 'earn':
        return <Earn />;
      case 'card':
        return selectedStockId ? (
          <Card
            stock={stocks.find(stock => stock.id === selectedStockId)!}
            onBack={handleBackToList}
          />
        ) : (
          <StockList stocks={stocks} onSelectStock={handleSelectStock} />
        );
      case 'mine':
      default:
        return <Clicker
          onBinanceClick={handleBinanceClick}
          selectedExchange={selectedExchange}
          onSettingsClick={handleSettingsClick}
          score={score}
          onScoreChange={handleScoreChange}
          onLevelClick={() => setCurrentView('levels')}
          multitapLevel={multitapLevel}
        />;
    }
  };

  return (
    <div className="App">
      <div className="game-interface">
        {renderView()}
        <BottomMenu activeItem={currentView} onMenuItemClick={handleMenuItemClick} />
      </div>
    </div>
  );
}

function App() {
  return (
    <BoostProvider>
      <EnergyProvider>
        <AppContent />
      </EnergyProvider>
    </BoostProvider>
  );
}

export default App;