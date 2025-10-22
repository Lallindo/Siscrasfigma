import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { LogOut, User } from 'lucide-react';
import brasaoJau from 'figma:asset/f200eb0c5925a5f95157d477f13fb3a94ee777aa.png';
import { SettingsDialog } from './SettingsDialog';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center p-1 shadow-md">
              <img
                src={brasaoJau}
                alt="Brasão de Jaú"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl tracking-wide">SisCras</h1>
              <p className="text-xs text-blue-100">
                {user ? `CRAS ${user.tecnico.cras}` : 'Centro de Referência da Assistência Social'} - Jaú/SP
              </p>
            </div>
          </div>

          {user && (
            <div className="flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4" />
                  <span>{user.tecnico.nome}</span>
                </div>
                <p className="text-xs text-blue-100">{user.tecnico.cras}</p>
              </div>
              <SettingsDialog />
              <Button
                onClick={logout}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-blue-600 gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
