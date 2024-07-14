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
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const lastClickTime = useRef(0);

  const handleInteraction = useCallback((x: number, y: number) => {
    const now = Date.now();
    if (now - lastClickTime.current < 50) return; // Запобігаємо подвійним кликам
    lastClickTime.current = now;

    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = (y - centerY) / centerY * 10;
    const tiltY = (centerX - x) / centerX * 10;

    setTilt({ x: tiltX, y: tiltY });

    const newAnimation: Animation = { id: now, x, y };
    setAnimations(prevAnimations => [...prevAnimations, newAnimation]);

    onClick();

    setTimeout(() => {
      setTilt({ x: 0, y: 0 });
      setAnimations(prevAnimations => prevAnimations.filter(anim => anim.id !== newAnimation.id));
    }, 1000);
  }, [onClick]);

  const handleTouch = useCallback((event: React.TouchEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const touch = event.touches[0];
    if (touch && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      handleInteraction(touch.clientX - rect.left, touch.clientY - rect.top);
    }
  }, [handleInteraction]);

  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      handleInteraction(event.clientX - rect.left, event.clientY - rect.top);
    }
  }, [handleInteraction]);

  return (
    <div className="exchange-display">
      <button
        ref={buttonRef}
        className="tap-button"
        onMouseDown={handleClick}
        onTouchStart={handleTouch}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 0.1s',
          WebkitTapHighlightColor: 'transparent',  // Прибираємо підсвітку на мобільних пристроях
          outline: 'none'  // Прибираємо фокус
        }}
      >
        <img src="/images/tap.png" alt="Tap" className="tap-image" />
        {animations.map((anim) => (
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