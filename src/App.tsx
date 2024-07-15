import React, { useState } from 'react';
import Clicker from './components/Clicker';
import BottomMenu from './components/BottomMenu';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('mine');

  const handleMenuItemClick = (item: string) => {
    setCurrentView(item);
  };

  const renderView = () => {
    switch(currentView) {
      case 'friends':
        return <h1>Friends</h1>;
      case 'boost':
        return <h1>Boost</h1>;
      case 'earn':
        return <h1>Earn</h1>;
      case 'mine':
      default:
        return <Clicker />;
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