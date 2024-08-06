import React, { useState, useEffect } from 'react';
import Clicker from './components/Clicker';
import BottomMenu from './components/BottomMenu';
import Exchange from './components/Exchange';
import Settings from './components/Settings';
import Boost from './components/Boost';
import Levels from './components/Levels';
import Card from './components/Card';
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
  const [score, setScore] = useState(() => {
    const savedScore = localStorage.getItem('userScore');
    return savedScore ? parseInt(savedScore, 10) : 0;
  });
  const [multitapLevel, setMultitapLevel] = useState(() => {
    const savedLevel = localStorage.getItem('multitapLevel');
    return savedLevel ? parseInt(savedLevel, 10) : 1;
  });
  const [energyRecoveryRate, setLocalEnergyRecoveryRate] = useState(() => {
    const savedRate = localStorage.getItem('energyRecoveryRate');
    return savedRate ? parseInt(savedRate, 10) : 5;
  });
  const { maxEnergy, setMaxEnergy, refillEnergy, setEnergyRecoveryRate } = useEnergy();
  const [rewardsReceived, setRewardsReceived] = useState(false);
  const [lastRewardLevel, setLastRewardLevel] = useState(() => {
    return localStorage.getItem('lastRewardLevel') || '';
  });

  useEffect(() => {
    const initTelegramWebApp = () => {
      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();

        tg.setHeaderColor('#000000');
        tg.setBackgroundColor('#000000');
        tg.setThemeParams({
          bg_color: '#000000',
          text_color: '#ffffff',
          hint_color: '#999999',
          link_color: '#00aaff',
          button_color: '#00aaff',
          button_text_color: '#ffffff'
        });

        if (tg.MainButton) {
          tg.MainButton.setParams({
            text_color: '#ffffff',
            color: '#000000'
          });
        }

        console.log('Telegram WebApp initialized and theme set');
      } else {
        console.log('Telegram WebApp is not available');
      }
    };

    initTelegramWebApp();
  }, []);

  const handleMenuItemClick = (item: string) => setCurrentView(item);
  const handleBinanceClick = () => setCurrentView('exchange');
  const handleSettingsClick = () => setCurrentView('settings');

  const handleExchangeSelect = (exchangeName: string) => {
    setSelectedExchange({
      name: exchangeName,
      logo: exchangeName === 'Holmah'
        ? '/images/holmah.png'
        : `/images/${exchangeName.toLowerCase()}${exchangeName === 'Binance' ? '-logo' : ''}.png`
    });
    setCurrentView('mine');
  };

  const handleScoreChange = (increment: number) => {
    setScore(prevScore => {
      const newScore = prevScore + increment;
      localStorage.setItem('userScore', newScore.toString());
      return newScore;
    });
  };

  const handleUpgrade = (upgradeType: string, newValue: number, cost: number) => {
    if (score >= cost) {
      setScore(prevScore => {
        const newScore = prevScore - cost;
        localStorage.setItem('userScore', newScore.toString());
        return newScore;
      });

      switch (upgradeType) {
        case 'multitap':
          setMultitapLevel(newValue);
          localStorage.setItem('multitapLevel', newValue.toString());
          break;
        case 'energyBoost':
          setMaxEnergy(newValue);
          localStorage.setItem('maxEnergy', newValue.toString());
          refillEnergy();
          break;
        case 'energyRecovery':
          setLocalEnergyRecoveryRate(newValue);
          setEnergyRecoveryRate(newValue);
          localStorage.setItem('energyRecoveryRate', newValue.toString());
          break;
      }
    }
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
      handleScoreChange(currentLevel.reward);
      setRewardsReceived(true);
      setLastRewardLevel(currentLevel.name);
      localStorage.setItem('lastRewardLevel', currentLevel.name);
    }
  };

  useEffect(() => {
    const currentLevel = getLevelInfo(score);
    if (currentLevel.name !== lastRewardLevel) {
      setRewardsReceived(false);
    }
  }, [score, lastRewardLevel]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userScore') {
        setScore(parseInt(e.newValue || '0', 10));
      } else if (e.key === 'multitapLevel') {
        setMultitapLevel(parseInt(e.newValue || '1', 10));
      } else if (e.key === 'energyRecoveryRate') {
        setLocalEnergyRecoveryRate(parseInt(e.newValue || '5', 10));
      } else if (e.key === 'lastRewardLevel') {
        setLastRewardLevel(e.newValue || '');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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
          balance={score}
        />;
      case 'friends':
        return <h1>Friends</h1>;
      case 'boost':
        return <Boost
          balance={score}
          setCurrentView={setCurrentView}
          onMultitapUpgrade={(level, cost) => handleUpgrade('multitap', level, cost)}
          onEnergyBoostUpgrade={(newMaxEnergy, cost) => handleUpgrade('energyBoost', newMaxEnergy, cost)}
          onEnergyRecoveryUpgrade={(newRate, cost) => handleUpgrade('energyRecovery', newRate, cost)}
          currentLevel={multitapLevel}
          currentMaxEnergy={maxEnergy}
          currentEnergyRecoveryRate={energyRecoveryRate}
          onRewardsClick={handleRewardsClick}
          rewardsReceived={rewardsReceived}
        />;
      case 'earn':
        return <Earn />;
      case 'card':
        return <Card
          balance={score}
          activeMenuItem={currentView}
          onMenuItemClick={handleMenuItemClick}
        />;
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
        {currentView !== 'card' && (
          <BottomMenu activeItem={currentView} onMenuItemClick={handleMenuItemClick} />
        )}
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