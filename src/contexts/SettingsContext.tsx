import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SettingsContextType {
  developerMode: boolean;
  toggleDeveloperMode: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [developerMode, setDeveloperMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('developerMode');
    if (stored) {
      setDeveloperMode(JSON.parse(stored));
    }
  }, []);

  const toggleDeveloperMode = () => {
    const newValue = !developerMode;
    setDeveloperMode(newValue);
    localStorage.setItem('developerMode', JSON.stringify(newValue));
  };

  return (
    <SettingsContext.Provider value={{ developerMode, toggleDeveloperMode }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
