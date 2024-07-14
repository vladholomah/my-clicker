import React, { useState, useRef, useEffect } from 'react';

interface ExchangeDisplayProps {
  onClick: () => void;
}

const ExchangeDisplay: React.FC<ExchangeDisplayProps> = ({ onClick }) => {
  const [animations, setAnimations] = useState<{ id: number; x: number; y: number }[]>([]);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

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

    // Calculate tilt based on click position
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = (y - centerY) / centerY * 20;
    const tiltY = (centerX - x) / centerX * 20;
    setTilt({ x: tiltX, y: tiltY });

    // Reset tilt after animation
    setTimeout(() => setTilt({ x: 0, y: 0 }), 300);
  };

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const tiltX = (y - centerY) / centerY * 10;
      const tiltY = (centerX - x) / centerX * 10;
      setTilt({ x: tiltX, y: tiltY });
    };

    const handleMouseLeave = () => {
      setTilt({ x: 0, y: 0 });
    };

    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="exchange-display">
      <button
        ref={buttonRef}
        className="tap-button"
        onClick={handleClick}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 0.1s'
        }}
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