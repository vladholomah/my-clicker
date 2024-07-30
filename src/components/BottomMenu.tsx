import React from 'react';
import './BottomMenu.css';

interface BottomMenuProps {
  activeItem: string;
  onMenuItemClick: (item: string) => void;
}

const BottomMenu: React.FC<BottomMenuProps> = ({ activeItem, onMenuItemClick }) => {
  return (
    <div className="bottom-menu">
      <button
        className={`menu-button ${activeItem === 'friends' ? 'active' : ''}`}
        onClick={() => onMenuItemClick('friends')}
      >
        <img
          src={activeItem === 'friends' ? "/images/friends-active.png" : "/images/friends-icon.png"}
          alt="Friends"
        />
        Friends
      </button>
      <button
        className={`menu-button ${activeItem === 'mine' ? 'active' : ''}`}
        onClick={() => onMenuItemClick('mine')}
      >
        <img
          src={activeItem === 'mine' ? "/images/mine-active.png" : "/images/mine-icon.png"}
          alt="Mine"
        />
        Mine
      </button>
      <button
        className={`menu-button ${activeItem === 'boost' ? 'active' : ''}`}
        onClick={() => onMenuItemClick('boost')}
      >
        <img
          src={activeItem === 'boost' ? "/images/boosts-active.png" : "/images/boost-icon.png"}
          alt="Boost"
        />
        Boosts
      </button>
      <button
        className={`menu-button ${activeItem === 'earn' ? 'active' : ''}`}
        onClick={() => onMenuItemClick('earn')}
      >
        <img
          src={activeItem === 'earn' ? "/images/earn-active.png" : "/images/earn-icon.png"}
          alt="Earn"
        />
        Earn
      </button>
      <button
        className={`menu-button ${activeItem === 'card' ? 'active' : ''}`}
        onClick={() => onMenuItemClick('card')}
      >
        <img
          src={activeItem === 'card' ? "/images/card-active.png" : "/images/card-icon.png"}
          alt="Card"
        />
        Market
      </button>
    </div>
  );
};

export default BottomMenu;