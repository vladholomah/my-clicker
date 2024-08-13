import React, { useState, useRef, useCallback, useEffect } from 'react';
import TurboVideo from './TurboVideo';
import './ExchangeDisplay.css';

interface ExchangeDisplayProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => void;
  turboActive: boolean;
  multitapLevel: number;
}

interface Animation {
  id: number;
  x: number;
  y: number;
  createdAt: number;
}

const ExchangeDisplay: React.FC<ExchangeDisplayProps> = ({ onClick, turboActive, multitapLevel }) => {
  const [animations, setAnimations] = useState<Animation[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const lastClickTime = useRef<{[key: number]: number}>({});

  const handleInteraction = useCallback((x: number, y: number, identifier: number, event: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    const now = Date.now();
    if (now - (lastClickTime.current[identifier] || 0) < 50) return;
    lastClickTime.current[identifier] = now;

    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const touchX = x - rect.left;
    const touchY = y - rect.top;

    const angleX = (centerY - touchY) / centerY * 20;
    const angleY = (touchX - centerX) / centerX * 20;

    buttonRef.current.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale(0.95)`;

    const newAnimation: Animation = {
      id: now + Math.random(),
      x: touchX,
      y: touchY,
      createdAt: now
    };

    setAnimations(prevAnimations => [...prevAnimations, newAnimation]);
    onClick(event);

    setTimeout(() => {
      if (buttonRef.current) {
        buttonRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
      }
    }, 150);
  }, [onClick]);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleInteraction(e.clientX, e.clientY, e.pointerId, e);
  }, [handleInteraction]);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    Array.from(e.touches).forEach(touch => {
      handleInteraction(touch.clientX, touch.clientY, touch.identifier, e);
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
      <div className="tap-button-container">
        <TurboVideo isActive={turboActive} />
        <button
          ref={buttonRef}
          className="tap-button"
          onPointerDown={handlePointerDown}
          onTouchStart={handleTouchStart}
        >
          <img src="/images/tap.png" alt="Tap" className="tap-image" />
          {animations.map((anim) => (
            <div
              key={anim.id}
              className="plus-one"
              style={{
                left: anim.x,
                top: anim.y,
                opacity: 1 - (Date.now() - anim.createdAt) / 1000
              }}
            >
              +{turboActive ? multitapLevel * 5 : multitapLevel}
            </div>
          ))}
        </button>
      </div>
    </div>
  );
};

export default ExchangeDisplay;