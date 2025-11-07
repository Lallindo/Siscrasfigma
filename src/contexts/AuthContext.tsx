import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser, Tecnico, CrasName } from '../types/auth';

interface AuthContextType {
  user: AuthUser | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isLoading: boolean;
  addTecnico: (tecnico: Tecnico) => void;
  removeTecnico: (username: string, password: string) => boolean;
  getTecnicosByCras: (cras: CrasName) => Tecnico[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Técnicos e administradores pré-cadastrados (em produção, isso viria de um banco de dados)
const initialTecnicos: Record<string, { password: string; tecnico: Tecnico }> = {
  'admin.donatita': {
    password: 'admin123',
    tecnico: {
      id: 'admin-1',
      nome: 'Admin Dona Tita',
      username: 'admin.donatita',
      password: 'admin123',
      cras: 'Dona Tita',
      isAdmin: true,
    },
  },
  'admin.pedroometto': {
    password: 'admin123',
    tecnico: {
      id: 'admin-2',
      nome: 'Admin Pedro Ometto',
      username: 'admin.pedroometto',
      password: 'admin123',
      cras: 'Pedro Ometto',
      isAdmin: true,
    },
  },
  'admin.cilabauab': {
    password: 'admin123',
    tecnico: {
      id: 'admin-3',
      nome: 'Admin Cila Bauab',
      username: 'admin.cilabauab',
      password: 'admin123',
      cras: 'Cila Bauab',
      isAdmin: true,
    },
  },
  'admin.altos': {
    password: 'admin123',
    tecnico: {
      id: 'admin-4',
      nome: 'Admin Altos da Cidade',
      username: 'admin.altos',
      password: 'admin123',
      cras: 'Altos da Cidade',
      isAdmin: true,
    },
  },
  'admin.central': {
    password: 'admin123',
    tecnico: {
      id: 'admin-5',
      nome: 'Admin Central',
      username: 'admin.central',
      password: 'admin123',
      cras: 'Central',
      isAdmin: true,
    },
  },
  'admin.potunduva': {
    password: 'admin123',
    tecnico: {
      id: 'admin-6',
      nome: 'Admin Distrito de Potunduva',
      username: 'admin.potunduva',
      password: 'admin123',
      cras: 'Distrito de Potunduva',
      isAdmin: true,
    },
  },
  'tecnico.donatita': {
    password: '123456',
    tecnico: {
      id: '1',
      nome: 'Técnico Dona Tita',
      username: 'tecnico.donatita',
      password: '123456',
      cras: 'Dona Tita',
      isAdmin: false,
    },
  },
  'tecnico.pedroometto': {
    password: '123456',
    tecnico: {
      id: '2',
      nome: 'Técnico Pedro Ometto',
      username: 'tecnico.pedroometto',
      password: '123456',
      cras: 'Pedro Ometto',
      isAdmin: false,
    },
  },
  'tecnico.cilabauab': {
    password: '123456',
    tecnico: {
      id: '3',
      nome: 'Técnico Cila Bauab',
      username: 'tecnico.cilabauab',
      password: '123456',
      cras: 'Cila Bauab',
      isAdmin: false,
    },
  },
  'tecnico.altos': {
    password: '123456',
    tecnico: {
      id: '4',
      nome: 'Técnico Altos da Cidade',
      username: 'tecnico.altos',
      password: '123456',
      cras: 'Altos da Cidade',
      isAdmin: false,
    },
  },
  'tecnico.central': {
    password: '123456',
    tecnico: {
      id: '5',
      nome: 'Técnico Central',
      username: 'tecnico.central',
      password: '123456',
      cras: 'Central',
      isAdmin: false,
    },
  },
  'tecnico.potunduva': {
    password: '123456',
    tecnico: {
      id: '6',
      nome: 'Técnico Distrito de Potunduva',
      username: 'tecnico.potunduva',
      password: '123456',
      cras: 'Distrito de Potunduva',
      isAdmin: false,
    },
  },
};

// Carregar técnicos do localStorage ou usar os iniciais
const loadTecnicos = (): Record<string, { password: string; tecnico: Tecnico }> => {
  const saved = localStorage.getItem('tecnicos');
  if (saved) {
    return JSON.parse(saved);
  }
  return initialTecnicos;
};

// Salvar técnicos no localStorage
const saveTecnicos = (tecnicosData: Record<string, { password: string; tecnico: Tecnico }>) => {
  localStorage.setItem('tecnicos', JSON.stringify(tecnicosData));
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tecnicos, setTecnicos] = useState<Record<string, { password: string; tecnico: Tecnico }>>(loadTecnicos());

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

  const addTecnico = (tecnico: Tecnico) => {
    const newTecnicos = {
      ...tecnicos,
      [tecnico.username]: {
        password: tecnico.password,
        tecnico: tecnico,
      },
    };
    setTecnicos(newTecnicos);
    saveTecnicos(newTecnicos);
  };

  const removeTecnico = (username: string, password: string): boolean => {
    const tecnicoData = tecnicos[username];
    
    // Verificar se o técnico existe e a senha está correta
    if (tecnicoData && tecnicoData.password === password) {
      const newTecnicos = { ...tecnicos };
      delete newTecnicos[username];
      setTecnicos(newTecnicos);
      saveTecnicos(newTecnicos);
      return true;
    }
    
    return false;
  };

  const getTecnicosByCras = (cras: CrasName): Tecnico[] => {
    return Object.values(tecnicos)
      .map(t => t.tecnico)
      .filter(t => t.cras === cras && !t.isAdmin);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isLoading, 
      addTecnico, 
      removeTecnico, 
      getTecnicosByCras 
    }}>
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
