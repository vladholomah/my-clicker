import React, { useState, useRef } from 'react';
import './Exchange.css';

interface ExchangeProps {
  onExchangeSelect: (exchange: string) => void;
  selectedExchange: string;
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
    logo: '/images/binance-logo.png',
    profitPerHour: '11.5K',
    description: 'Провідна криптовалютна біржа для торгівлі цифровими активами.',
    registrationLink: 'https://www.binance.com/activity/referral-entry/CPA?ref=CPA_00729U4ZZW'
  },
  {
    name: 'Holmah',
    logo: '/images/holmah.png',
    profitPerHour: '10.2K',
    description: 'Інноваційна біржа з широким спектром торгових інструментів.',
    registrationLink: 'https://www.htx.com/uk-ua?utm_source=UT&utm_medium=prodnews&inviter_id=11350560'
  },
  {
    name: 'Bybit',
    logo: '/images/bybit.png',
    profitPerHour: '9.8K',
    description: 'Професійна платформа для торгівлі криптовалютними деривативами.',
    registrationLink: 'https://www.bybit.com/invite?ref=5QJAAQ4'
  },
  {
    name: 'Qmall',
    logo: '/images/qmall.png',
    profitPerHour: '8.7K',
    description: 'Швидко зростаюча біржа з інтуїтивно зрозумілим інтерфейсом.',
    registrationLink: 'https://qmall.io/ua/sign-in'
  },
  {
    name: 'WhiteBit',
    logo: '/images/whitebit.png',
    profitPerHour: '9.1K',
    description: 'Європейська біржа з високим рівнем безпеки та підтримкою фіатних валют.',
    registrationLink: 'https://whitebit.com/ua'
  }
];

const Exchange: React.FC<ExchangeProps> = ({ onExchangeSelect, selectedExchange }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isSwiping = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    isSwiping.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isSwiping.current) {
      if (touchStart - touchEnd > 50) {
        nextExchange();
      }

      if (touchStart - touchEnd < -50) {
        prevExchange();
      }
    }
    isSwiping.current = false;
  };

  const handleClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    if (!isSwiping.current) {
      action();
    }
  };

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

  const handleExchangeSelect = (exchangeName: string) => {
    onExchangeSelect(exchangeName);
    // Додайте тут логіку для переходу на іншу сторінку
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
        <button className="carousel-button prev" onClick={prevExchange} disabled={isAnimating}>&lt;</button>
        <div className={`exchange-slides ${isAnimating ? 'animating' : ''}`}>
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
              <div className="button-group" onClick={(e) => e.stopPropagation()}>
                <button
                  className="registration-button"
                  onClick={(e) => handleClick(e, () => window.open(exchange.registrationLink, '_blank'))}
                >
                  Реєстрація
                </button>
                <button
                  className="add-button"
                  onClick={(e) => handleClick(e, () => handleExchangeSelect(exchange.name))}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
        <button className="carousel-button next" onClick={nextExchange} disabled={isAnimating}>&gt;</button>
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
  );
};

export default Exchange;