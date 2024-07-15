import React, { useState } from 'react';
import Clicker from './components/Clicker';
import BottomMenu from './components/BottomMenu';
import Exchange from './components/Exchange';
import Settings from './components/Settings'; // You'll need to create this component
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('mine');
  const [selectedExchange, setSelectedExchange] = useState({
    name: 'Holmah',
    logo: '/images/holmah.png'
  });

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

  const renderView = () => {
    switch(currentView) {
      case 'friends':
        return <h1>Friends</h1>;
      case 'boost':
        return <h1>Boost</h1>;
      case 'earn':
        return <h1>Earn</h1>;
      case 'exchange':
        return <Exchange onExchangeSelect={handleExchangeSelect} />;
      case 'settings':
        return <Settings />; // You'll need to create this component
      case 'mine':
      default:
        return <Clicker
          onBinanceClick={handleBinanceClick}
          selectedExchange={selectedExchange}
          onSettingsClick={handleSettingsClick}
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

export default App;