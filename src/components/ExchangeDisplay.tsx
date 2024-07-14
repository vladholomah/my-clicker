import React, { useState, useRef, useCallback } from 'react';

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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const lastClickTime = useRef<{[key: number]: number}>({});

  const handleInteraction = useCallback((x: number, y: number, identifier: number) => {
    const now = Date.now();
    if (now - (lastClickTime.current[identifier] || 0) < 100) return; // Запобігаємо подвійним кликам
    lastClickTime.current[identifier] = now;

    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const newAnimation: Animation = {
      id: now + Math.random(), // Унікальний ідентифікатор для кожної анімації
      x: x - rect.left,
      y: y - rect.top
    };

    setAnimations(prevAnimations => [...prevAnimations, newAnimation]);
    onClick();

    setTimeout(() => {
      setAnimations(prevAnimations => prevAnimations.filter(anim => anim.id !== newAnimation.id));
    }, 1000);
  }, [onClick]);

  const handleTouch = useCallback((event: React.TouchEvent<HTMLButtonElement>) => {
    event.preventDefault();
    Array.from(event.touches).forEach(touch => {
      handleInteraction(touch.clientX, touch.clientY, touch.identifier);
    });
  }, [handleInteraction]);

  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    handleInteraction(event.clientX, event.clientY, 0);
  }, [handleInteraction]);

  return (
    <div className="exchange-display">
      <button
        ref={buttonRef}
        className="tap-button"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouch}
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
              pointerEvents: 'none'
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