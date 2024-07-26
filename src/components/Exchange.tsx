import React, { useState, useRef } from 'react';
import './Exchange.css';

interface ExchangeProps {
  onExchangeSelect: (exchange: string) => void;
}

interface ExchangeInfo {
  name: string;
  logo: string;
  profitPerHour: string;
  description: string;
}

const exchanges: ExchangeInfo[] = [
  {
    name: 'Binance',
    logo: '/images/binance-logo.png',
    profitPerHour: '11.5K',
    description: 'Провідна криптовалютна біржа для торгівлі цифровими активами.'
  },
  {
    name: 'Holmah',
    logo: '/images/holmah.png',
    profitPerHour: '10.2K',
    description: 'Інноваційна біржа з широким спектром торгових інструментів.'
  },
  {
    name: 'Bybit',
    logo: '/images/bybit.png',
    profitPerHour: '9.8K',
    description: 'Професійна платформа для торгівлі криптовалютними деривативами.'
  },
  {
    name: 'Qmall',
    logo: '/images/qmall.png',
    profitPerHour: '8.7K',
    description: 'Швидко зростаюча біржа з інтуїтивно зрозумілим інтерфейсом.'
  },
  {
    name: 'WhiteBit',
    logo: '/images/whitebit.png',
    profitPerHour: '9.1K',
    description: 'Європейська біржа з високим рівнем безпеки та підтримкою фіатних валют.'
  }
];

const Exchange: React.FC<ExchangeProps> = ({ onExchangeSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      nextExchange();
    }

    if (touchStart - touchEnd < -75) {
      prevExchange();
    }
  };

  const nextExchange = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % exchanges.length);
  };

  const prevExchange = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + exchanges.length) % exchanges.length);
  };

  const getSlideClass = (index: number) => {
    const totalSlides = exchanges.length;
    const diff = (index - currentIndex + totalSlides) % totalSlides;
    if (diff === 0) return 'active';
    if (diff === 1) return 'next';
    if (diff === totalSlides - 1) return 'prev';
    if (diff === 2 || diff === 3) return 'far-next';
    return 'far-prev';
  };

  return (
    <div className="exchange-page">
      <h1>Оберіть біржу</h1>
      <div
        className="exchange-carousel"
        ref={carouselRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <button className="carousel-button prev" onClick={prevExchange}>&lt;</button>
        <div className="exchange-slides">
          {exchanges.map((exchange, index) => (
            <div
              key={exchange.name}
              className={`exchange-slide ${getSlideClass(index)}`}
            >
              <h2>{exchange.name}</h2>
              <div className="profit-info">
                <img src={exchange.logo} alt={exchange.name} />
                <span>Прибуток за годину</span>
                <span>{exchange.profitPerHour}</span>
              </div>
              <p>{exchange.description}</p>
              <div className="button-group">
                <button className="registration-button">
                  Реєстрація
                </button>
                <button className="add-button" onClick={() => onExchangeSelect(exchange.name)}>+</button>
              </div>
            </div>
          ))}
        </div>
        <button className="carousel-button next" onClick={nextExchange}>&gt;</button>
      </div>
      <div className="carousel-indicators">
        {exchanges.map((_, index) => (
          <span
            key={index}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Exchange;