import React, { useState, useEffect } from 'react';
import './Card.css';
import BottomMenu from './BottomMenu';

interface CardProps {
  balance: number;
  activeMenuItem: string;
  onMenuItemClick: (item: string) => void;
}

interface StockItem {
  name: string;
  price: string;
  image: string;
  description: string;
}

const Card: React.FC<CardProps> = ({ balance, activeMenuItem, onMenuItemClick }) => {
  const [activeTab, setActiveTab] = useState('stocks');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedStock, setSelectedStock] = useState<StockItem | null>(null);

  const stockItems: StockItem[] = [
    {
      name: "CryptoBall",
      price: "$1",
      image: "/images/cryptoball.png",
      description: "Our native token. Buy and get 1,000,000 coins as a bonus!"
    },
  ];

  const [filteredItems, setFilteredItems] = useState(stockItems);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchQuery('');
    setFilteredItems(tab === 'stocks' ? stockItems : []);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (activeTab === 'stocks') {
      const filtered = stockItems.filter(item =>
        item.name.toLowerCase().includes(query)
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems([]);
    }
  };

  const handleBuy = (stock: StockItem) => {
    setSelectedStock(stock);
    setShowBuyModal(true);
  };

  const confirmBuy = () => {
    if (selectedStock) {
      console.log(`Purchase confirmed: ${selectedStock.name}`);
      if (selectedStock.name === "CryptoBall") {
        console.log("Added 1,000,000 coins to balance");
        // Here you would update the user's balance
      }
    }
    setShowBuyModal(false);
  };

  return (
    <div className={`card-container ${isVisible ? 'visible' : ''}`}>
      <div className="card-header">
        <button className="back-buttons" onClick={() => onMenuItemClick('mine')}>
          <span className="back-icon">&#8592;</span>
        </button>
        <h1>Market</h1>
      </div>

      <div className="card-content">
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
          {activeTab === 'stocks' ? (
            filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <div key={index} className="item-card">
                  <img src={item.image} alt={item.name} className="item-image" />
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <div className="price-buy">
                      <span className="price">{item.price}</span>
                      <button onClick={() => handleBuy(item)}>Buy</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="not-found">No results found</div>
            )
          ) : (
            <div className="nft-unavailable">
              <p>NFTs are currently unavailable</p>
            </div>
          )}
        </div>
      </div>

      {showBuyModal && selectedStock && (
        <div className="modal-overlay">
          <div className="buy-modal">
            <h2>Confirm Purchase</h2>
            <p>Are you sure you want to buy {selectedStock.name} for {selectedStock.price}?</p>
            {selectedStock.name === "CryptoBall" && (
              <p>You will receive 1,000,000 coins as a bonus!</p>
            )}
            <div className="modal-buttons">
              <button onClick={() => setShowBuyModal(false)}>Cancel</button>
              <button onClick={confirmBuy}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      <BottomMenu activeItem={activeMenuItem} onMenuItemClick={onMenuItemClick} />
    </div>
  );
};

export default Card;