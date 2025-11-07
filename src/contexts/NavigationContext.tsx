import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type Page = 'list' | 'search' | 'form' | 'technicians';

interface NavigationContextType {
  history: Page[];
  currentPage: Page;
  navigateTo: (page: Page) => void;
  goBack: () => Page | null;
  canGoBack: boolean;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<Page[]>(['list']);
  const currentPage = history[history.length - 1];

  const navigateTo = useCallback((page: Page) => {
    setHistory(prev => [...prev, page]);
  }, []);

  const goBack = useCallback(() => {
    if (history.length <= 1) return null;
    
    const newHistory = history.slice(0, -1);
    setHistory(newHistory);
    return newHistory[newHistory.length - 1];
  }, [history]);

  const canGoBack = history.length > 1;

  return (
    <NavigationContext.Provider value={{ history, currentPage, navigateTo, goBack, canGoBack }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
