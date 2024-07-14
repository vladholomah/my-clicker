import React, { useState, useRef } from 'react';

interface ExchangeDisplayProps {
  onClick: () => void;
}

const ExchangeDisplay: React.FC<ExchangeDisplayProps> = ({ onClick }) => {
  const [animations, setAnimations] = useState<{ id: number; x: number; y: number }[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleTouch = (event: React.TouchEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const touches = event.touches;
    const rect = event.currentTarget.getBoundingClientRect();

    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      onClick();

      const newAnimation = { id: Date.now() + i, x, y };
      setAnimations(prev => [...prev, newAnimation]);

      setTimeout(() => {
        setAnimations(prev => prev.filter(anim => anim.id !== newAnimation.id));
      }, 1000);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    onClick();

    const newAnimation = { id: Date.now(), x, y };
    setAnimations(prev => [...prev, newAnimation]);

    setTimeout(() => {
      setAnimations(prev => prev.filter(anim => anim.id !== newAnimation.id));
    }, 1000);
  };

  return (
    <div className="exchange-display">
      <button
        ref={buttonRef}
        className="tap-button"
        onClick={handleClick}
        onTouchStart={handleTouch}
      >
        <img src="/images/tap.png" alt="Tap" className="tap-image" />
        {animations.map(anim => (
          <div
            key={anim.id}
            className="plus-one"
            style={{ left: anim.x, top: anim.y }}
          >
            +1
          </div>
        ))}
      </button>
    </div>
  );
};

export default ExchangeDisplay;