import React, { useState, useRef, useCallback, useEffect } from 'react';

interface ExchangeDisplayProps {
  onClick: () => void;
}

interface Animation {
  id: number;
  x: number;
  y: number;
  createdAt: number;
}

const ExchangeDisplay: React.FC<ExchangeDisplayProps> = ({ onClick }) => {
  const [animations, setAnimations] = useState<Animation[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const lastClickTime = useRef<{[key: number]: number}>({});

  const handleInteraction = useCallback((x: number, y: number, identifier: number) => {
    const now = Date.now();
    if (now - (lastClickTime.current[identifier] || 0) < 50) return; // Зменшуємо затримку
    lastClickTime.current[identifier] = now;

    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const newAnimation: Animation = {
      id: now + Math.random(),
      x: x - rect.left,
      y: y - rect.top,
      createdAt: now
    };

    setAnimations(prevAnimations => [...prevAnimations, newAnimation]);
    onClick();
  }, [onClick]);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleInteraction(e.clientX, e.clientY, e.pointerId);
  }, [handleInteraction]);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    Array.from(e.touches).forEach(touch => {
      handleInteraction(touch.clientX, touch.clientY, touch.identifier);
    });
  }, [handleInteraction]);

  useEffect(() => {
    const animationTimer = setInterval(() => {
      const now = Date.now();
      setAnimations(prevAnimations =>
        prevAnimations.filter(anim => now - anim.createdAt < 1000)
      );
    }, 100);

    return () => clearInterval(animationTimer);
  }, []);

  return (
    <div className="exchange-display">
      <button
        ref={buttonRef}
        className="tap-button"
        onPointerDown={handlePointerDown}
        onTouchStart={handleTouchStart}
        style={{
          WebkitTapHighlightColor: 'transparent',
          outline: 'none',
          userSelect: 'none',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          border: 'none',
          background: 'transparent',
          position: 'relative',
          overflow: 'visible'
        }}
      >
        <img src="/images/tap.png" alt="Tap" className="tap-image" style={{width: '100%', height: '100%', borderRadius: '50%'}} />
        {animations.map((anim) => (
          <div
            key={anim.id}
            className="plus-one"
            style={{
              position: 'absolute',
              left: anim.x,
              top: anim.y,
              pointerEvents: 'none',
              animation: `floatUp 1s forwards`,
              opacity: 1 - (Date.now() - anim.createdAt) / 1000
            }}
          >
            +1
          </div>
        ))}
      </button>
    </div>
  );
};

export default ExchangeDisplay;