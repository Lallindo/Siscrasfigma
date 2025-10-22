import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Settings } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

export function SettingsDialog() {
  const { developerMode, toggleDeveloperMode } = useSettings();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 text-white hover:bg-blue-600">
          <Settings className="w-4 h-4" />
          <span className="hidden sm:inline">Configurações</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configurações do Sistema</DialogTitle>
          <DialogDescription>
            Ajuste as configurações do SisCras conforme necessário.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="developer-mode">Modo Desenvolvedor</Label>
              <p className="text-sm text-gray-500">
                Desativa validações obrigatórias para facilitar testes
              </p>
            </div>
            <Switch
              id="developer-mode"
              checked={developerMode}
              onCheckedChange={toggleDeveloperMode}
            />
          </div>
          {developerMode && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-800">
                ⚠️ Modo desenvolvedor ativo. As validações estão desabilitadas.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
