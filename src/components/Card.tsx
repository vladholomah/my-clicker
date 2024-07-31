import React, { useState, useEffect } from 'react';
import './Card.css';
import BottomMenu from './BottomMenu';

interface CardProps {
  balance: number;
  activeMenuItem: string;
  onMenuItemClick: (item: string) => void;
}

interface Item {
  name: string;
  price: string;
  image: string;
  description: string;
}

const Card: React.FC<CardProps> = ({ balance, activeMenuItem, onMenuItemClick }) => {
  const [activeTab, setActiveTab] = useState('stocks');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const stockItems: Item[] = [
    {
      name: "CryptoBall",
      price: "$1",
      image: "/images/cryptoball.png",
      description: "Our native token. Buy and get 1,000,000 coins as a bonus!"
    },
  ];

  const nftItems: Item[] = [
    {
      name: "CryptoNFT",
      price: "Coming Soon",
      image: "/images/crypto-nft.png",
      description: "Exclusive NFT. Will be available soon!"
    },
  ];

  const [items, setItems] = useState<Item[]>(stockItems);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchQuery('');
    setItems(tab === 'stocks' ? stockItems : nftItems);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filteredItems = (activeTab === 'stocks' ? stockItems : nftItems).filter(
      item => item.name.toLowerCase().includes(query)
    );
    setItems(filteredItems);
  };

  const handleBuy = (item: Item) => {
    setSelectedItem(item);
    setShowBuyModal(true);
  };

  return (
    <div className="card-container">
      <div className="card-content">
        <div className="card-header">
          <button className="back-button" onClick={() => onMenuItemClick('mine')}>
            <span className="back-icon">&#8592;</span>
          </button>
          <h1>Market</h1>
        </div>

        <div className="tab-selector">
          <button
            className={activeTab === 'stocks' ? 'active' : ''}
            onClick={() => handleTabChange('stocks')}
          >
            Stocks
          </button>
          <button
            className={activeTab === 'nft' ? 'active' : ''}
            onClick={() => handleTabChange('nft')}
          >
            NFT
          </button>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search stocks or NFTs"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        <div className="items-section">
          {items.length > 0 ? (
            items.map((item, index) => (
              <div key={index} className="item-card">
                <img src={item.image} alt={item.name} className="item-image" />
                <div className="item-info">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <div className="price-buy">
                    <span className="price">{item.price}</span>
                    <button
                      onClick={() => handleBuy(item)}
                      disabled={activeTab === 'nft'}
                    >
                      {activeTab === 'stocks' ? 'Buy' : 'Coming Soon'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="not-found">No results found</div>
          )}
        </div>
      </div>

      <div className="bottom-menu-container">
        <BottomMenu activeItem={activeMenuItem} onMenuItemClick={onMenuItemClick} />
      </div>
    </div>
  );
};

export default Card;