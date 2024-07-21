import React, { useState } from 'react';
import Clicker from './components/Clicker';
import BottomMenu from './components/BottomMenu';
import Exchange from './components/Exchange';
import Settings from './components/Settings';
import Boost from './components/Boost';
import Levels from './components/Levels';
import Card from './components/Card';
import { BoostProvider } from './BoostContext';
import { EnergyProvider, useEnergy } from './EnergyContext';
import './App.css';

function AppContent() {
  const [currentView, setCurrentView] = useState('mine');
  const [selectedExchange, setSelectedExchange] = useState({
    name: 'Holmah',
    logo: '/images/holmah.png'
  });
  const [score, setScore] = useState(0);
  const [multitapLevel, setMultitapLevel] = useState(1);
  const { maxEnergy, setMaxEnergy, refillEnergy } = useEnergy();

  const handleMenuItemClick = (item: string) => {
    setCurrentView(item);
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
      refillEnergy(); // Відновлюємо енергію до нового максимуму
    }
  };

  const handleScoreChange = (increment: number) => {
    setScore(prevScore => prevScore + increment);
  };

  const renderView = () => {
    switch(currentView) {
      case 'levels':
        return <Levels />;
      case 'settings':
        return <Settings />;
      case 'exchange':
        return <Exchange onExchangeSelect={handleExchangeSelect} />;
      case 'friends':
        return <h1>Friends</h1>;
      case 'boost':
        return <Boost
          balance={score}
          setCurrentView={setCurrentView}
          onMultitapUpgrade={handleMultitapUpgrade}
          onEnergyBoostUpgrade={handleEnergyBoostUpgrade}
          currentLevel={multitapLevel}
          currentMaxEnergy={maxEnergy}
        />;
      case 'card':
        return <Card balance={score} />;
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