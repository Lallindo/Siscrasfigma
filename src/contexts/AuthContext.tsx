import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser, Tecnico, CrasName } from '../types/auth';

interface AuthContextType {
  user: AuthUser | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Técnicos pré-cadastrados (em produção, isso viria de um banco de dados)
const tecnicos: Record<string, { password: string; tecnico: Tecnico }> = {
  'tecnico.donatita': {
    password: '123456',
    tecnico: {
      id: '1',
      nome: 'Técnico Dona Tita',
      username: 'tecnico.donatita',
      cras: 'Dona Tita',
    },
  },
  'tecnico.pedroometto': {
    password: '123456',
    tecnico: {
      id: '2',
      nome: 'Técnico Pedro Ometto',
      username: 'tecnico.pedroometto',
      cras: 'Pedro Ometto',
    },
  },
  'tecnico.cilabauab': {
    password: '123456',
    tecnico: {
      id: '3',
      nome: 'Técnico Cila Bauab',
      username: 'tecnico.cilabauab',
      cras: 'Cila Bauab',
    },
  },
  'tecnico.altos': {
    password: '123456',
    tecnico: {
      id: '4',
      nome: 'Técnico Altos da Cidade',
      username: 'tecnico.altos',
      cras: 'Altos da Cidade',
    },
  },
  'tecnico.central': {
    password: '123456',
    tecnico: {
      id: '5',
      nome: 'Técnico Central',
      username: 'tecnico.central',
      cras: 'Central',
    },
  },
  'tecnico.potunduva': {
    password: '123456',
    tecnico: {
      id: '6',
      nome: 'Técnico Distrito de Potunduva',
      username: 'tecnico.potunduva',
      cras: 'Distrito de Potunduva',
    },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há um usuário salvo no localStorage
    const savedUser = localStorage.getItem('authUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (username: string, password: string): boolean => {
    const tecnicoData = tecnicos[username];
    
    if (tecnicoData && tecnicoData.password === password) {
      const authUser: AuthUser = {
        tecnico: tecnicoData.tecnico,
        loginTime: new Date().toISOString(),
      };
      setUser(authUser);
      localStorage.setItem('authUser', JSON.stringify(authUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
