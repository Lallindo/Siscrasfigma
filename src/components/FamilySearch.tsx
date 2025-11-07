import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Header } from './Header';
import { BackButton } from './BackButton';
import { Search, ArrowRight, Users, AlertCircle, Edit, ArrowRightLeft, UserCheck } from 'lucide-react';
import { Family } from '../types/family';
import { useAuth } from '../contexts/AuthContext';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { useSettings } from '../contexts/SettingsContext';

interface FamilySearchProps {
  onCreateNew: (searchData: { nome: string; cpf: string; nis: string }) => void;
  onEditExisting: (family: Family) => void;
  onTransferFamily: (family: Family) => void;
  onCancel: () => void;
}

export function FamilySearch({ onCreateNew, onEditExisting, onTransferFamily, onCancel }: FamilySearchProps) {
  const { user } = useAuth();
  const { developerMode } = useSettings();
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [nis, setNis] = useState('');
  const [searchResults, setSearchResults] = useState<Family[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!developerMode && (!nome.trim() || !cpf.trim() || !nis.trim())) {
      toast.error('Preencha todos os campos para buscar');
      return;
    }

    const stored = localStorage.getItem('families');
    if (!stored) {
      setSearchResults([]);
      setHasSearched(true);
      return;
    }

    const allFamilies: Family[] = JSON.parse(stored);
    const results = allFamilies.filter(family => {
      // Buscar em todos os membros da família
      return family.membros?.some(membro => {
        const nomeMatch = nome.trim() && membro.nome?.toLowerCase().includes(nome.toLowerCase());
        const cpfMatch = cpf.trim() && membro.cpf?.replace(/\D/g, '') === cpf.replace(/\D/g, '');
        const nisMatch = nis.trim() && membro.nis === nis.trim();
        
        return nomeMatch || cpfMatch || nisMatch;
      });
    });

    setSearchResults(results);
    setHasSearched(true);
  };

  const handleCreateNew = () => {
    if (!developerMode && (!nome.trim() || !cpf.trim() || !nis.trim())) {
      toast.error('Preencha todos os campos para continuar');
      return;
    }

    onCreateNew({ nome, cpf, nis });
  };

  const canEdit = (family: Family) => {
    return user && family.crasId === user.tecnico.cras;
  };

  const getResponsavel = (family: Family) => {
    const responsavel = family.membros.find(m => m.isResponsavel);
    return responsavel?.nome || 'Sem responsável definido';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center gap-4">
            <BackButton onClick={onCancel} />
            <div>
              <h1 className="text-blue-900 mb-2">Nova Família - Buscar Cadastro</h1>
              <p className="text-gray-600">
                Antes de cadastrar uma nova família, vamos verificar se já existe um cadastro.
              </p>
            </div>
          </div>

          <Card className="mb-6 shadow-lg border-blue-100">
            <CardHeader className="bg-gradient-to-br from-blue-50 to-white">
              <CardTitle className="text-blue-900">Dados do Responsável Familiar</CardTitle>
              <CardDescription>
                Informe os dados do responsável pela família para verificar se já existe cadastro
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div>
                <Label>
                  Nome Completo {!developerMode && <span className="text-red-500">*</span>}
                </Label>
                <Input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Digite o nome completo"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>
                    CPF {!developerMode && <span className="text-red-500">*</span>}
                  </Label>
                  <Input
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    placeholder="000.000.000-00"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <div>
                  <Label>
                    NIS {!developerMode && <span className="text-red-500">*</span>}
                  </Label>
                  <Input
                    value={nis}
                    onChange={(e) => setNis(e.target.value)}
                    placeholder="Digite o NIS"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>

              <Button onClick={handleSearch} className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
                <Search className="w-4 h-4" />
                Buscar Cadastro
              </Button>
            </CardContent>
          </Card>

          {hasSearched && (
            <>
              {searchResults.length === 0 ? (
                <Card className="mb-6 shadow-lg border-green-100 bg-green-50">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Users className="w-12 h-12 mx-auto text-green-600 mb-3" />
                      <h3 className="text-lg font-medium text-green-900 mb-2">
                        Nenhum cadastro encontrado
                      </h3>
                      <p className="text-green-700 mb-4">
                        Você pode prosseguir com o cadastro desta nova família.
                      </p>
                      <Button onClick={handleCreateNew} className="gap-2 bg-green-600 hover:bg-green-700">
                        Criar Nova Família
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <Card className="mb-6 shadow-lg border-amber-100 bg-amber-50">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-amber-900 mb-1">
                            {searchResults.length} cadastro(s) encontrado(s)
                          </h3>
                          <p className="text-sm text-amber-700">
                            Verifique se algum desses cadastros corresponde à família que você deseja cadastrar.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-4 mb-6">
                    {searchResults.map((family) => {
                      const isEditable = canEdit(family);
                      const responsavel = family.membros.find(m => m.isResponsavel);

                      return (
                        <Card key={family.id} className="shadow-lg border-blue-100">
                          <CardHeader className="bg-gradient-to-br from-blue-50 to-white">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <UserCheck className="w-4 h-4 text-blue-600" />
                                  <CardTitle className="text-blue-900">
                                    {responsavel?.nome || 'Sem responsável'}
                                  </CardTitle>
                                </div>
                                <CardDescription>
                                  Prontuário: {family.prontuario || 'N/A'}
                                </CardDescription>
                              </div>
                              <Badge variant={isEditable ? 'default' : 'secondary'}>
                                {family.crasId}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <div className="grid grid-cols-2 gap-3 mb-4">
                              <div>
                                <p className="text-sm text-gray-600">CPF:</p>
                                <p className="font-medium">{responsavel?.cpf || 'N/A'}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">NIS:</p>
                                <p className="font-medium">{responsavel?.nis || 'N/A'}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Membros:</p>
                                <p className="font-medium">{family.membros?.length || 0}</p>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              {isEditable ? (
                                <Button
                                  onClick={() => onEditExisting(family)}
                                  className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700"
                                >
                                  <Edit className="w-4 h-4" />
                                  Atualizar Cadastro
                                </Button>
                              ) : (
                                <Button
                                  onClick={() => onTransferFamily(family)}
                                  className="flex-1 gap-2 bg-amber-600 hover:bg-amber-700"
                                >
                                  <ArrowRightLeft className="w-4 h-4" />
                                  Transferir para {user?.tecnico.cras}
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  <Card className="shadow-lg border-blue-100">
                    <CardContent className="pt-6">
                      <p className="text-center text-gray-600 mb-4">
                        Nenhum dos cadastros acima corresponde? Crie um novo cadastro.
                      </p>
                      <Button onClick={handleCreateNew} variant="outline" className="w-full gap-2">
                        Criar Novo Cadastro Mesmo Assim
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </>
              )}
            </>
          )}

          <div className="mt-6 flex justify-start">
            <Button onClick={onCancel} variant="outline">
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}