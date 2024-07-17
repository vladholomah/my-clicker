import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

interface BoostContextType {
  turboCount: number;
  turboTimer: number;
  cooldownTimer: number;
  isTurboActive: boolean;
  activateTurbo: () => void;
}

const BoostContext = createContext<BoostContextType | undefined>(undefined);

export const BoostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [turboCount, setTurboCount] = useState(3);
  const [turboTimer, setTurboTimer] = useState(0);
  const [cooldownTimer, setCooldownTimer] = useState(0);
  const [isTurboActive, setIsTurboActive] = useState(false);

  const activateTurbo = useCallback(() => {
    if (turboCount > 0 && turboTimer === 0 && cooldownTimer === 0) {
      setTurboCount(prev => prev - 1);
      setTurboTimer(20);
      setIsTurboActive(true);
      console.log('Turbo activated');
    }
  }, [turboCount, turboTimer, cooldownTimer]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (turboTimer > 0) {
      interval = setInterval(() => {
        setTurboTimer(prev => {
          if (prev === 1) {
            setIsTurboActive(false);
            console.log('Turbo deactivated');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (cooldownTimer > 0) {
      interval = setInterval(() => {
        setCooldownTimer(prev => {
          if (prev === 1) {
            setTurboCount(3);
            console.log('Cooldown finished, attempts reset to 3');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [turboTimer, cooldownTimer]);

  useEffect(() => {
    if (turboCount === 0 && turboTimer === 0 && cooldownTimer === 0) {
      setCooldownTimer(60);
      console.log('Starting cooldown');
    }
  }, [turboCount, turboTimer, cooldownTimer]);

  return (
    <BoostContext.Provider value={{ turboCount, turboTimer, cooldownTimer, isTurboActive, activateTurbo }}>
      {children}
    </BoostContext.Provider>
  );
};

export const useBoost = () => {
  const context = useContext(BoostContext);
  if (context === undefined) {
    throw new Error('useBoost must be used within a BoostProvider');
  }
  return context;
};