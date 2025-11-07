import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Tecnico } from '../types/auth';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Header } from './Header';
import { BackButton } from './BackButton';
import { UserPlus, Trash2, Users, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Badge } from './ui/badge';

interface TechnicianManagementProps {
  onBack: () => void;
}

export function TechnicianManagement({ onBack }: TechnicianManagementProps) {
  const { user, addTecnico, removeTecnico, getTecnicosByCras } = useAuth();
  const [nome, setNome] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [removeUsername, setRemoveUsername] = useState('');
  const [removePassword, setRemovePassword] = useState('');
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);

  if (!user || !user.tecnico.isAdmin) {
    return null;
  }

  const tecnicos = getTecnicosByCras(user.tecnico.cras);

  const handleAddTecnico = () => {
    // Validações
    if (!nome.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }

    if (!username.trim()) {
      toast.error('Nome de usuário é obrigatório');
      return;
    }

    // Verificar se o username já existe
    const tecnicos = localStorage.getItem('tecnicos');
    if (tecnicos) {
      const tecnicosData = JSON.parse(tecnicos);
      if (tecnicosData[username.trim().toLowerCase()]) {
        toast.error('Este nome de usuário já está em uso');
        return;
      }
    }

    if (!password) {
      toast.error('Senha é obrigatória');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    // Criar novo técnico
    const novoTecnico: Tecnico = {
      id: Date.now().toString(),
      nome: nome.trim(),
      username: username.trim().toLowerCase(),
      password: password,
      cras: user.tecnico.cras,
      isAdmin: false,
    };

    addTecnico(novoTecnico);
    toast.success(`Técnico ${nome} cadastrado com sucesso!`);

    // Limpar formulário
    setNome('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleRemoveTecnico = () => {
    if (!removePassword) {
      toast.error('Digite a senha do técnico para confirmar a remoção');
      return;
    }

    const success = removeTecnico(removeUsername, removePassword);
    
    if (success) {
      toast.success('Técnico removido com sucesso!');
      setShowRemoveDialog(false);
      setRemoveUsername('');
      setRemovePassword('');
    } else {
      toast.error('Senha incorreta. Não foi possível remover o técnico.');
    }
  };

  const openRemoveDialog = (username: string) => {
    setRemoveUsername(username);
    setRemovePassword('');
    setShowRemoveDialog(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center gap-4">
            <BackButton onClick={onBack} />
            <div>
              <h1 className="text-blue-900 mb-2">Gerenciamento de Técnicos</h1>
              <p className="text-gray-600">
                Cadastre e gerencie técnicos do {user.tecnico.cras}
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Cadastro de Novo Técnico */}
            <Card className="shadow-xl border-blue-100">
              <CardHeader className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Cadastrar Novo Técnico
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-900 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      CRAS: <strong>{user.tecnico.cras}</strong>
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input
                      id="nome"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Nome do técnico"
                    />
                  </div>

                  <div>
                    <Label htmlFor="username">Nome de Usuário *</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="usuario.exemplo"
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Senha *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Digite a senha novamente"
                    />
                  </div>

                  <Button
                    onClick={handleAddTecnico}
                    className="w-full gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <UserPlus className="w-4 h-4" />
                    Cadastrar Técnico
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Lista de Técnicos */}
            <Card className="shadow-xl border-blue-100">
              <CardHeader className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Técnicos do {user.tecnico.cras}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {tecnicos.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
                    <Users className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-600">Nenhum técnico cadastrado</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {tecnicos.map((tecnico) => (
                      <div
                        key={tecnico.id}
                        className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-gray-900 mb-1">{tecnico.nome}</h4>
                            <p className="text-sm text-gray-600">@{tecnico.username}</p>
                            <Badge variant="outline" className="mt-2 text-xs">
                              ID: {tecnico.id}
                            </Badge>
                          </div>
                          <Button
                            onClick={() => openRemoveDialog(tecnico.username)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Dialog de Confirmação de Remoção */}
      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Remoção</AlertDialogTitle>
            <AlertDialogDescription>
              Para remover o técnico <strong>@{removeUsername}</strong>, é necessário confirmar com a senha do técnico.
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="removePassword">Senha do Técnico</Label>
            <Input
              id="removePassword"
              type="password"
              value={removePassword}
              onChange={(e) => setRemovePassword(e.target.value)}
              placeholder="Digite a senha do técnico"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setRemoveUsername('');
              setRemovePassword('');
            }}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveTecnico}
              className="bg-red-600 hover:bg-red-700"
            >
              Remover Técnico
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}