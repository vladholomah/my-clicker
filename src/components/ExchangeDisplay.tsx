import React, { useState } from 'react';

interface ExchangeDisplayProps {
  onClick: (x: number, y: number) => void;
}

const ExchangeDisplay: React.FC<ExchangeDisplayProps> = ({ onClick }) => {
  const [animations, setAnimations] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    onClick(x, y);

    const newAnimation = { id: Date.now(), x, y };
    setAnimations(prev => [...prev, newAnimation]);

    setTimeout(() => {
      setAnimations(prev => prev.filter(anim => anim.id !== newAnimation.id));
    }, 1000);
  };

  return (
    <div className="exchange-display" onClick={handleClick}>
      <div className="bear-image">
        <img src="/images/bear.png" alt="Bear in hoodie" />
      </div>
      <p>Your Exchange</p>
      {animations.map(anim => (
        <div
          key={anim.id}
          className="plus-one"
          style={{ left: anim.x, top: anim.y }}
        >
          +1
        </div>
      ))}
    </div>
  );
};

export default ExchangeDisplay;