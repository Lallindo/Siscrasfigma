import { useState, useEffect } from 'react';
import { Family } from '../types/family';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Plus, Eye, Trash2, Users, Search, Lock, UserCheck } from 'lucide-react';
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
import { Header } from './Header';
import { useAuth } from '../contexts/AuthContext';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

interface FamilyListProps {
  onNewFamily: () => void;
  onViewFamily: (family: Family) => void;
  onNavigateToTechnicians: () => void;
}

export function FamilyList({ onNewFamily, onViewFamily, onNavigateToTechnicians }: FamilyListProps) {
  const { user } = useAuth();
  const [families, setFamilies] = useState<Family[]>([]);
  const [filteredFamilies, setFilteredFamilies] = useState<Family[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadFamilies();
  }, [user]);

  useEffect(() => {
    filterFamilies();
  }, [searchTerm, families]);

  const loadFamilies = () => {
    if (!user) return;
    
    const stored = localStorage.getItem('families');
    if (stored) {
      const allFamilies: Family[] = JSON.parse(stored);
      
      // Migrar famílias antigas para incluir o campo 'ativo'
      const migratedFamilies = allFamilies.map(family => ({
        ...family,
        membros: family.membros.map(membro => ({
          ...membro,
          ativo: membro.ativo !== undefined ? membro.ativo : true,
        })),
      }));
      
      // Salvar de volta se houve migração
      if (JSON.stringify(allFamilies) !== JSON.stringify(migratedFamilies)) {
        localStorage.setItem('families', JSON.stringify(migratedFamilies));
      }
      
      setFamilies(migratedFamilies);
      setFilteredFamilies(migratedFamilies);
    }
  };

  const filterFamilies = () => {
    if (!searchTerm.trim()) {
      setFilteredFamilies(families);
      return;
    }

    const term = searchTerm.toLowerCase().trim();
    const filtered = families.filter(family => {
      // Buscar no prontuário
      if (family.prontuario?.toLowerCase().includes(term)) {
        return true;
      }

      // Buscar em todos os membros da família
      return family.membros?.some(membro => {
        return (
          membro.nome?.toLowerCase().includes(term) ||
          membro.cpf?.toLowerCase().includes(term) ||
          membro.nis?.toLowerCase().includes(term)
        );
      });
    });

    setFilteredFamilies(filtered);
  };

  const handleDelete = (id: string) => {
    const familyToDelete = families.find(f => f.id === id);
    
    // Verificar se o técnico pode excluir (apenas do mesmo CRAS)
    if (familyToDelete && user && familyToDelete.crasId !== user.tecnico.cras) {
      toast.error('Você não tem permissão para excluir famílias de outro CRAS');
      setDeleteId(null);
      return;
    }

    const updated = families.filter(f => f.id !== id);
    localStorage.setItem('families', JSON.stringify(updated));
    setFamilies(updated);
    setDeleteId(null);
    toast.success('Família excluída com sucesso');
  };

  const canEdit = (family: Family) => {
    return user && family.crasId === user.tecnico.cras;
  };

  const getResponsavel = (family: Family) => {
    const responsavel = family.membros.find(m => m.isResponsavel);
    return responsavel?.nome || 'Sem responsável definido';
  };

  const getRendaTotal = (family: Family) => {
    const activeMembros = family.membros.filter(m => m.ativo !== false);
    const total = activeMembros.reduce((sum, membro) => {
      const renda = Number(membro.rendaBruta) || 0;
      return sum + renda;
    }, 0);
    
    return total.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header onNavigateToTechnicians={onNavigateToTechnicians} />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-gray-900 mb-2">Cadastro de Famílias</h1>
                <p className="text-sm text-gray-600">
                  Total de {filteredFamilies.length} família(s) {searchTerm ? 'encontrada(s)' : 'cadastrada(s)'}
                </p>
              </div>
              <Button onClick={onNewFamily} className="gap-2 bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4" />
                Nova Família
              </Button>
            </div>
            
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome, CPF, NIS ou prontuário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

        {filteredFamilies.length === 0 ? (
          <Card className="text-center py-12 shadow-lg border-blue-100">
            <CardContent className="pt-6">
              <Users className="w-16 h-16 mx-auto text-blue-400 mb-4" />
              {searchTerm ? (
                <>
                  <h3 className="text-gray-900 mb-2">Nenhuma família encontrada</h3>
                  <p className="text-gray-600 mb-6">Tente buscar por outro termo</p>
                  <Button onClick={() => setSearchTerm('')} variant="outline">
                    Limpar busca
                  </Button>
                </>
              ) : (
                <>
                  <h3 className="text-gray-900 mb-2">Nenhuma família cadastrada</h3>
                  <p className="text-gray-600 mb-6">Comece cadastrando sua primeira família</p>
                  <Button onClick={onNewFamily} className="gap-2 bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4" />
                    Cadastrar Família
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredFamilies.map(family => {
              const isEditable = canEdit(family);
              const responsavel = getResponsavel(family);
              const rendaTotal = getRendaTotal(family);
              return (
                <Card key={family.id} className="hover:shadow-xl transition-all hover:scale-[1.02] border-blue-100">
                  <CardHeader className="bg-gradient-to-br from-blue-50 to-white">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <UserCheck className="w-4 h-4 text-blue-600" />
                          <CardTitle className="text-blue-900">{responsavel}</CardTitle>
                        </div>
                        <CardDescription>
                          Prontuário: {family.prontuario || 'N/A'}
                        </CardDescription>
                      </div>
                      {!isEditable && (
                        <Badge variant="secondary" className="gap-1 bg-amber-100 text-amber-800 border-amber-200">
                          <Lock className="w-3 h-3" />
                          Somente leitura
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">CRAS:</span>
                        <span className="font-medium">{family.crasId}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Membros:</span>
                        <span className="font-medium">{family.membros?.filter(m => m.ativo !== false).length || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Cadastrado em:</span>
                        <span className="font-medium">{new Date(family.createdAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Renda Total:</span>
                        <span className="font-medium">{rendaTotal}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => onViewFamily(family)}
                        className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700"
                      >
                        <Eye className="w-4 h-4" />
                        {isEditable ? 'Editar' : 'Visualizar'}
                      </Button>
                      {isEditable && (
                        <Button
                          onClick={() => setDeleteId(family.id)}
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
        </div>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta família? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}