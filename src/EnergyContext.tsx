import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

interface EnergyContextType {
  energy: number;
  maxEnergy: number;
  energyRefillCount: number;
  energyRefillCooldown: number;
  activateEnergyRefill: () => void;
  decreaseEnergy: (amount?: number) => void;
}

const EnergyContext = createContext<EnergyContextType | undefined>(undefined);

export const EnergyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [energy, setEnergy] = useState(1500);
  const maxEnergy = 1500;
  const [energyRefillCount, setEnergyRefillCount] = useState(3);
  const [energyRefillCooldown, setEnergyRefillCooldown] = useState(0);

  const activateEnergyRefill = useCallback(() => {
    if (energyRefillCount > 0 && energyRefillCooldown === 0) {
      setEnergyRefillCount(prev => prev - 1);
      setEnergy(maxEnergy);
      console.log('Energy refilled');
      if (energyRefillCount === 1) {
        setEnergyRefillCooldown(60);
      }
    }
  }, [energyRefillCount, energyRefillCooldown, maxEnergy]);

const decreaseEnergy = useCallback((amount: number = 1) => {
  setEnergy(prev => Math.max(prev - amount, 0));
}, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (energyRefillCooldown > 0) {
      interval = setInterval(() => {
        setEnergyRefillCooldown(prev => {
          if (prev === 1) {
            setEnergyRefillCount(3);
            console.log('Energy refill cooldown finished, attempts reset to 3');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [energyRefillCooldown]);

  return (
    <EnergyContext.Provider value={{
      energy,
      maxEnergy,
      energyRefillCount,
      energyRefillCooldown,
      activateEnergyRefill,
      decreaseEnergy
    }}>
      {children}
    </EnergyContext.Provider>
  );
};

export const useEnergy = () => {
  const context = useContext(EnergyContext);
  if (context === undefined) {
    throw new Error('useEnergy must be used within an EnergyProvider');
  }
  return context;
};