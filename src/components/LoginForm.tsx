import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';
import { Lock, User } from 'lucide-react';
import brasaoJau from 'figma:asset/f200eb0c5925a5f95157d477f13fb3a94ee777aa.png';

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const success = login(username, password);
      
      if (success) {
        toast.success('Login realizado com sucesso!');
      } else {
        toast.error('Usuário ou senha incorretos');
      }
      
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center p-2 shadow-lg border-2 border-blue-100">
              <img
                src={brasaoJau}
                alt="Brasão de Jaú"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl">SisCras</CardTitle>
            <CardDescription className="mt-2">
              Sistema de Cadastro de Famílias
              <br />
              Jaú/SP
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Digite seu usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t">
            <div className="text-xs text-gray-600 space-y-1">
              <p className="font-medium mb-2">Usuários de teste:</p>
              <p>• tecnico.donatita / 123456</p>
              <p>• tecnico.pedroometto / 123456</p>
              <p>• tecnico.cilabauab / 123456</p>
              <p>• tecnico.altos / 123456</p>
              <p>• tecnico.central / 123456</p>
              <p>• tecnico.potunduva / 123456</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
