import React, { useState, useCallback } from 'react';

interface ClickButtonProps {
  onClick: () => void;
}

const ClickButton: React.FC<ClickButtonProps> = ({ onClick }) => {
  const [clickPosition, setClickPosition] = useState<{ x: number, y: number } | null>(null);

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setClickPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    onClick();
    setTimeout(() => setClickPosition(null), 500);
  }, [onClick]);

  return (
    <div className="click-button-container">
      <button onClick={handleClick} className="click-button">
        <img src="/images/tap.png" alt="Tap" className="tap-image" />
      </button>
      {clickPosition && (
        <span
          className="plus-one"
          style={{ left: clickPosition.x, top: clickPosition.y }}
        >
          +1
        </span>
      )}
    </div>
  );
};

export default ClickButton;