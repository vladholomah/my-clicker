import React from 'react';

const BottomMenu: React.FC = () => {
  return (
    <div className="bottom-menu">
      <button className="menu-button">
        <img src="/images/friends-icon.png" alt="Friends" />
        Friends
      </button>
      <button className="menu-button">
        <img src="/images/mine-icon.png" alt="Mine" />
        Mine
      </button>
      <button className="menu-button">
        <img src="/images/boost-icon.png" alt="Boost" />
        Boosts
      </button>
      <button className="menu-button">
        <img src="/images/earn-icon.png" alt="Earn" />
        Earn
      </button>
    </div>
  );
};

export default BottomMenu;