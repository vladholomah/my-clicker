import React from 'react';

interface ClickButtonProps {
  onClick: () => void;
}

const ClickButton: React.FC<ClickButtonProps> = ({ onClick }) => {
  return (
    <button onClick={onClick} className="click-button">
      Click me!
    </button>
  );
};

export default ClickButton;
