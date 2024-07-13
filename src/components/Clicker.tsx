import React, { useState, useEffect } from 'react';
import ClickButton from './ClickButton';
import Score from './Score';
import WebApp from '@twa-dev/sdk';

const Clicker: React.FC = () => {
  const [score, setScore] = useState(0);

  useEffect(() => {
    WebApp.ready();
  }, []);

  const handleClick = () => {
    setScore(prevScore => prevScore + 1);
  };

  return (
    <div className="clicker">
      <Score score={score} />
      <ClickButton onClick={handleClick} />
    </div>
  );
};

export default Clicker;