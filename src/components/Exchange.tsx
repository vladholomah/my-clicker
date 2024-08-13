import React, { useState, useRef, useEffect } from 'react';
import './Exchange.css';

interface ExchangeProps {
  onExchangeSelect: (exchange: string) => void;
  selectedExchange: string;
  onScoreChange: (increment: number) => void;
  balance: number;
}

interface ExchangeInfo {
  name: string;
  logo: string;
  profitPerHour: string;
  description: string;
  registrationLink: string;
}

const exchanges: ExchangeInfo[] = [
  {
    name: 'Binance',
    logo: '/images/binance-logo1.png',
    profitPerHour: '11.5K',
    description: 'The reward can only be claimed after registering on the selected exchange.',
    registrationLink: 'https://www.binance.com/activity/referral-entry/CPA?ref=CPA_00729U4ZZW'
  },
  {
    name: 'HTX',
    logo: '/images/htx1.png',
    profitPerHour: '10.2K',
    description: 'The reward can only be claimed after registering on the selected exchange.',
    registrationLink: 'https://www.htx.com/uk-ua?utm_source=UT&utm_medium=prodnews&inviter_id=11350560'
  },
  {
    name: 'Bybit',
    logo: '/images/bybit1.png',
    profitPerHour: '9.8K',
    description: 'The reward can only be claimed after registering on the selected exchange.',
    registrationLink: 'https://www.bybit.com/invite?ref=5QJAAQ4'
  },
  {
    name: 'Qmall',
    logo: '/images/qmall1.png',
    profitPerHour: '8.7K',
    description: 'The reward can only be claimed after registering on the selected exchange.',
    registrationLink: 'https://qmall.io/ua/sign-in'
  },
  {
    name: 'WhiteBit',
    logo: '/images/whitebit1.png',
    profitPerHour: '9.1K',
    description: 'The reward can only be claimed after registering on the selected exchange.',
    registrationLink: 'https://whitebit.com/ua'
  }
];

const Exchange: React.FC<ExchangeProps> = ({ onExchangeSelect, selectedExchange, onScoreChange, balance }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSwipingUp, setIsSwipingUp] = useState(false);
  const [registrationBonus, setRegistrationBonus] = useState(() => {
    const savedBonus = localStorage.getItem('registrationBonus');
    return savedBonus ? JSON.parse(savedBonus) : false;
  });
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
  };

  const handleTouchEnd = () => {
    const deltaX = touchStart.x - touchEnd.x;
    const deltaY = touchStart.y - touchEnd.y;

    if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY > 50) {
      setIsSwipingUp(true);
      setTimeout(() => {
        onExchangeSelect(exchanges[currentIndex].name);
      }, 300);
    } else if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        nextExchange();
      } else {
        prevExchange();
      }
    }
  };

  useEffect(() => {
    if (isSwipingUp) {
      const timer = setTimeout(() => {
        setIsSwipingUp(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isSwipingUp]);

  const nextExchange = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % exchanges.length);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const prevExchange = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + exchanges.length) % exchanges.length);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const getSlideClass = (index: number) => {
    const totalSlides = exchanges.length;
    const diff = (index - currentIndex + totalSlides) % totalSlides;
    if (diff === 0) return 'active';
    if (diff === 1) return 'next';
    if (diff === totalSlides - 1) return 'prev';
    if (diff === 2) return 'far-next';
    if (diff === totalSlides - 2) return 'far-prev';
    return '';
  };

  const isExchangeSelected = (exchangeName: string) => {
    return selectedExchange === exchangeName;
  };

  const handleRegistration = () => {
    const currentExchange = exchanges[currentIndex];
    window.open(currentExchange.registrationLink, '_blank');

    if (!registrationBonus) {
      onScoreChange(100000);
      setRegistrationBonus(true);
      localStorage.setItem('registrationBonus', JSON.stringify(true));
    }

    onExchangeSelect(currentExchange.name);
  };

  useEffect(() => {
    if (selectedExchange) {
      const selectedIndex = exchanges.findIndex(exchange => exchange.name === selectedExchange);
      if (selectedIndex !== -1) {
        setCurrentIndex(selectedIndex);
      }
    }
  }, [selectedExchange]);

  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    action();
  };

  return (
    <div className="exchange-page">
      <div className="balance-displays">
        <h2 className="balance-titles">Your Balance</h2>
        <div className="balances">
          <img src="/images/balance.png" alt="Balance" className="balance-iconse"/>
          <span>{balance}</span>
        </div>
      </div>
      <div className="exchange-content">
        <div className="exchange-carousel-wrapper">
          <button
            className="carousel-button prev"
            onClick={(e) => handleButtonClick(e, prevExchange)}
            disabled={isAnimating}
          >
            <img src="/images/swipe-l.png" alt="Previous"/>
          </button>
          <div
            className="exchange-carousel"
            ref={carouselRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className={`exchange-slides ${isAnimating ? 'animating' : ''}`}>
              {exchanges.map((exchange, index) => (
                <div
                  key={exchange.name}
                  className={`exchange-slide ${getSlideClass(index)} ${isSwipingUp && index === currentIndex ? 'swiping-up' : ''}`}
                >
                  <h2>
                    {exchange.name}
                    {isExchangeSelected(exchange.name) && (
                      <img src="/images/done.png" alt="Selected" className="selected-icon"/>
                    )}
                  </h2>
                  <div className="profit-info">
                    <img src={exchange.logo} alt={exchange.name}/>
                    <div className="reward-info">
                      <span>Registration reward:</span>
                      <div className="balance-info">
                        <img src="/images/balance.png" alt="Balance" className="coin-icon"/>
                        <span>{exchange.profitPerHour}</span>
                      </div>
                    </div>
                  </div>
                  <p>{exchange.description}</p>
                  <div className="swipe-indicator">
                    <img src="/images/swipe-up.png" alt="Swipe up"/>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            className="carousel-button next"
            onClick={(e) => handleButtonClick(e, nextExchange)}
            disabled={isAnimating}
          >
            <img src="/images/swipe.png" alt="Next"/>
          </button>
        </div>
        <div className="carousel-indicators">
          {exchanges.map((_, index) => (
            <span
              key={index}
              className={`indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => {
                if (!isAnimating) {
                  setIsAnimating(true);
                  setCurrentIndex(index);
                  setTimeout(() => setIsAnimating(false), 300);
                }
              }}
            />
          ))}
        </div>
      </div>
      <div className="registration-section">
        <p className="registration-instruction">To register on the exchange, select the desired exchange above and
          click the registration button.</p>
        <button className="registration-button" onClick={handleRegistration}>
          Registration
        </button>
      </div>
    </div>
  );
};

export default Exchange;