import React, { useState, useRef } from 'react';

interface ExchangeDisplayProps {
  onClick: () => void;
}

interface Animation {
  id: number;
  x: number;
  y: number;
}

const ExchangeDisplay: React.FC<ExchangeDisplayProps> = ({ onClick }) => {
  const [animations, setAnimations] = useState<Animation[]>([]);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleInteraction = (clientX: number, clientY: number) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = (y - centerY) / centerY * 10;
    const tiltY = (centerX - x) / centerX * 10;

    setTilt({ x: tiltX, y: tiltY });

    const newAnimation: Animation = { id: Date.now(), x, y };
    setAnimations(prevAnimations => [...prevAnimations, newAnimation]);

    onClick();

    // Вібрація для мобільних пристроїв
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }

    setTimeout(() => {
      setTilt({ x: 0, y: 0 });
    }, 300);

    setTimeout(() => {
      setAnimations(prevAnimations => prevAnimations.filter(anim => anim.id !== newAnimation.id));
    }, 2000);
  };

  const handleTouch = (event: React.TouchEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const touch = event.touches[0];
    if (touch) {
      handleInteraction(touch.clientX, touch.clientY);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    handleInteraction(event.clientX, event.clientY);
  };

  return (
    <div className="exchange-display">
      <button
        ref={buttonRef}
        className="tap-button"
        onClick={handleClick}
        onTouchStart={handleTouch}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 0.1s'
        }}
      >
        <img src="/images/tap.png" alt="Tap" className="tap-image" />
        {animations.map((animation) => (
          <div
            key={animation.id}
            className="plus-one"
            style={{ left: `${animation.x}px`, top: `${animation.y}px` }}
          >
            +1
          </div>
        ))}
      </button>
    </div>
  );
};

export default ExchangeDisplay;