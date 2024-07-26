import React, { useState, useRef, useEffect } from 'react';
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
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSwipingUp, setIsSwipingUp] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const swipeThreshold = 50; // Поріг для спрацьовування свайпу

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });

    const deltaY = touchStart.y - e.targetTouches[0].clientY;
    if (deltaY > 0) {
      setIsSwipingUp(true);
    } else {
      setIsSwipingUp(false);
    }
  };

  const handleTouchEnd = () => {
    const deltaX = touchStart.x - touchEnd.x;
    const deltaY = touchStart.y - touchEnd.y;

    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      // Вертикальний свайп
      if (deltaY > swipeThreshold && isSwipingUp) {
        onExchangeSelect(exchanges[currentIndex].name);
      }
    } else {
      // Горизонтальний свайп
      if (deltaX > swipeThreshold) {
        nextExchange();
      } else if (deltaX < -swipeThreshold) {
        prevExchange();
      }
    }

    setIsSwipingUp(false);
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

  const handleRegistration = () => {
    const currentExchange = exchanges[currentIndex];
    window.open(currentExchange.registrationLink, '_blank');
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
      <button
        className="carousel-button prev"
        onClick={prevExchange}
        disabled={isAnimating}
      >
        <img src="/images/swipe-l.png" alt="Previous" />
      </button>
        <div className={`exchange-slides ${isAnimating ? 'animating' : ''}`}>
          {exchanges.map((exchange, index) => (
              <div
                  key={exchange.name}
                  className={`exchange-slide ${getSlideClass(index)} ${isSwipingUp && index === currentIndex ? 'swiping-up' : ''}`}
              >
                <h2>{exchange.name}</h2>
                <div className="profit-info">
                  <img src={exchange.logo} alt={exchange.name}/>
                  <span>Прибуток за годину</span>
                  <span>{exchange.profitPerHour}</span>
                </div>
                <p>{exchange.description}</p>
                <div className={`swipe-indicator ${isSwipingUp ? 'swiping' : ''}`}>
                  <img src="/images/swipe-up.png" alt="Swipe up"/>
                </div>
              </div>
          ))}
        </div>
      <button
          className="carousel-button next"
          onClick={nextExchange}
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
       <div className="registration-section">
         <p className="registration-instruction">Для реєстрації на біржі вибери потрібну біржу в каруселі та натисни
           кнопку реєстрація</p>
         <button className="registration-button" onClick={handleRegistration}>
           Реєстрація
         </button>
       </div>
     </div>
 );
};

export default Exchange;