import React, { useState, useEffect } from 'react';
import './Card.css';
import BottomMenu from './BottomMenu';

interface CardProps {
  balance: number;
  activeMenuItem: string;
  onMenuItemClick: (item: string) => void;
}

interface Item {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  bonus: number;
}

const Card: React.FC<CardProps> = ({ balance, activeMenuItem, onMenuItemClick }) => {
  const [activeTab, setActiveTab] = useState('stocks');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [quantities, setQuantities] = useState<{[key: string]: number}>({});

  const stockItems: Item[] = [
    {
      id: "cryptoball1",
      name: "Hexagram Shares",
      price: 1,
      image: "/images/cryptoball.png",
      description: "Easy investment process.",
      bonus: 100000
    },
    {
      id: "cryptoball2",
      name: "Easy Invest Tokens",
      price: 1,
      image: "/images/cryptoball_2.png",
      description: "Low entry threshold.",
      bonus: 100000
    },
  ];

  const nftItems: Item[] = [
    {
      id: "cryptonft",
      name: "CryptoNFT",
      price: 0,
      image: "/images/crypto-nft.png",
      description: "Exclusive NFT. Coming soon!",
      bonus: 0
    },
  ];

  const [items, setItems] = useState<Item[]>(stockItems);

  useEffect(() => {
    const initialQuantities = items.reduce((acc, item) => {
      acc[item.id] = 1;
      return acc;
    }, {} as {[key: string]: number});
    setQuantities(initialQuantities);
  }, [items]);

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

  const handleConfirmBuy = () => {
    // Purchase logic here
    setShowBuyModal(false);
  };

  const handleCancelBuy = () => {
    setShowBuyModal(false);
  };

  const handleQuantityChange = (itemId: string, change: number) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(1, (prev[itemId] || 1) + change)
    }));
  };

  return (
    <div className="card-container">
      <div className="card-content">
        <div className="fixed-top">
          <div className="card-header">
            <h1>Market</h1>
          </div>

          <div className="market-description">
            <div className="market-description-box">
              <img src="/images/market-description.png" alt="Market Description" className="market-description-image"/>
              <p>Easy investment process without complex procedures.</p>
            </div>
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
        </div>

        <div className="items-section">
          <div className="items-row">
            {items.length > 0 ? (
                items.map((item) => (
                    <div key={item.id} className="item-card">
                      <div className="item-image-container">
                        <img src={item.image} alt={item.name} className="item-image"/>
                  </div>
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <div className="quantity-selector">
                      <button className="quantity-button" onClick={() => handleQuantityChange(item.id, -1)}>
                        <img src="/images/minus.png" alt="-"/>
                      </button>
                      <span className="quantity-display">{quantities[item.id] || 1}</span>
                      <button className="quantity-button" onClick={() => handleQuantityChange(item.id, 1)}>
                        <img src="/images/plus.png" alt="+"/>
                      </button>
                    </div>
                    <div className="usdt-info">
                      <img src="/images/usdt-icon.png" alt="USDT" className="usdt-icon"/>
                      <span>{((item.price * (quantities[item.id] || 1))).toFixed(2)} USDT</span>
                    </div>
                    <div className="bonus-info-container">
                      <p className="bonus-info">You'll receive:</p>
                      <p className="bonus-amount">{item.bonus * (quantities[item.id] || 1)} coins</p>
                    </div>
                    <button
                      className="buy-button"
                      onClick={() => handleBuy(item)}
                      disabled={activeTab === 'nft'}
                    >
                      {activeTab === 'stocks' ? 'Buy' : 'Coming Soon'}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="not-found">No results found</div>
            )}
          </div>
        </div>
      </div>

      <div className="bottom-menu-container">
        <BottomMenu activeItem={activeMenuItem} onMenuItemClick={onMenuItemClick}/>
      </div>

      {showBuyModal && selectedItem && (
        <div className="confirmations-overlay">
          <div className="confirmations-modal">
            <button className="close-button" onClick={handleCancelBuy}>×</button>
            <img src="/images/tap1.png" alt="Tap" className="multitap-image"/>
            <div className="multitap-info">
              Confirm purchase
            </div>
            <div className="price-info">
              <img src="/images/usdt-icon.png" alt="USDT" className="price-icon"/>
              <span>{(selectedItem.price * (quantities[selectedItem.id] || 1)).toFixed(2)} USDT</span>
            </div>
            <div className="stocks-info">
              You'll receive: {selectedItem.bonus * (quantities[selectedItem.id] || 1)} coins
            </div>
            <button
              className="confirms-button stocks-confirm"
              onClick={handleConfirmBuy}
              disabled={balance < selectedItem.price * (quantities[selectedItem.id] || 1)}
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;