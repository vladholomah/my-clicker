import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

interface EnergyContextType {
  energy: number;
  maxEnergy: number;
  energyRefillCount: number;
  energyRefillCooldown: number;
  energyRecoveryRate: number;
  activateEnergyRefill: () => void;
  decreaseEnergy: (amount?: number) => void;
  setMaxEnergy: (newMaxEnergy: number) => void;
  refillEnergy: () => void;
  setEnergyRecoveryRate: (newRate: number) => void;
  setEnergyRefillCount: React.Dispatch<React.SetStateAction<number>>;
}

const EnergyContext = createContext<EnergyContextType | undefined>(undefined);

const EnergyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [energy, setEnergy] = useState(() => {
    const savedEnergy = localStorage.getItem('energy');
    return savedEnergy ? parseInt(savedEnergy, 10) : 1500;
  });
  const [maxEnergy, setMaxEnergy] = useState(() => {
    const savedMaxEnergy = localStorage.getItem('maxEnergy');
    return savedMaxEnergy ? parseInt(savedMaxEnergy, 10) : 1500;
  });
  const [energyRefillCount, setEnergyRefillCount] = useState(() => {
    const savedEnergyRefillCount = localStorage.getItem('energyRefillCount');
    const lastActivation = localStorage.getItem('energyLastActivation');
    if (lastActivation) {
      const timePassed = (Date.now() - parseInt(lastActivation, 10)) / 1000;
      if (timePassed >= 60) {
        localStorage.removeItem('energyLastActivation');
        return 3;
      }
    }
    return savedEnergyRefillCount ? parseInt(savedEnergyRefillCount, 10) : 3;
  });
  const [energyRefillCooldown, setEnergyRefillCooldown] = useState(() => {
    const lastActivation = localStorage.getItem('energyLastActivation');
    if (lastActivation) {
      const timePassed = (Date.now() - parseInt(lastActivation, 10)) / 1000;
      if (timePassed < 60) {
        return Math.max(60 - Math.floor(timePassed), 0);
      }
    }
    return 0;
  });
  const [energyRecoveryRate, setEnergyRecoveryRate] = useState(() => {
    const savedEnergyRecoveryRate = localStorage.getItem('energyRecoveryRate');
    return savedEnergyRecoveryRate ? parseInt(savedEnergyRecoveryRate, 10) : 5000;
  });

  useEffect(() => {
    localStorage.setItem('energy', energy.toString());
  }, [energy]);

  useEffect(() => {
    localStorage.setItem('maxEnergy', maxEnergy.toString());
  }, [maxEnergy]);

  useEffect(() => {
    localStorage.setItem('energyRefillCount', energyRefillCount.toString());
  }, [energyRefillCount]);

  useEffect(() => {
    localStorage.setItem('energyRecoveryRate', energyRecoveryRate.toString());
  }, [energyRecoveryRate]);

  const activateEnergyRefill = useCallback(() => {
    if (energyRefillCount > 0 && energyRefillCooldown === 0) {
      setEnergyRefillCount(prev => prev - 1);
      setEnergy(maxEnergy);
      console.log('Energy refilled');
      if (energyRefillCount === 1) {
        setEnergyRefillCooldown(60);
        localStorage.setItem('energyLastActivation', Date.now().toString());
      }
    }
  }, [energyRefillCount, energyRefillCooldown, maxEnergy]);

  const decreaseEnergy = useCallback((amount: number = 1) => {
    setEnergy(prev => Math.max(prev - amount, 0));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy(prev => Math.min(prev + 1, maxEnergy));
    }, energyRecoveryRate);

    return () => clearInterval(interval);
  }, [maxEnergy, energyRecoveryRate]);

  const refillEnergy = useCallback(() => {
    setEnergy(maxEnergy);
  }, [maxEnergy]);

  const updateMaxEnergy = useCallback((newMaxEnergy: number) => {
    setMaxEnergy(newMaxEnergy);
    setEnergy(newMaxEnergy);
  }, []);

  const updateEnergyRecoveryRate = useCallback((newRate: number) => {
    setEnergyRecoveryRate(newRate);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (energyRefillCooldown > 0) {
      interval = setInterval(() => {
        setEnergyRefillCooldown(prev => {
          if (prev === 1) {
            setEnergyRefillCount(3);
            localStorage.removeItem('energyLastActivation');
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
      energyRecoveryRate,
      activateEnergyRefill,
      decreaseEnergy,
      setMaxEnergy: updateMaxEnergy,
      refillEnergy,
      setEnergyRecoveryRate: updateEnergyRecoveryRate,
      setEnergyRefillCount
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

export { EnergyProvider };