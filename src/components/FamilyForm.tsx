import { useState } from 'react';
import { Family, FamilyMember } from '../types/family';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Plus, Trash2, Save, X, UserCheck, User } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Header } from './Header';
import { ReadOnlyWrapper } from './ReadOnlyWrapper';
import { useSettings } from '../contexts/SettingsContext';
import { toast } from 'sonner';
import { Badge } from './ui/badge';

interface FamilyFormProps {
  family: Family | null;
  onSave: (family: Omit<Family, 'id' | 'crasId' | 'createdBy' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  readOnly?: boolean;
}

export function FamilyForm({ family, onSave, onCancel, readOnly = false }: FamilyFormProps) {
  const [prontuario, setProntuario] = useState(family?.prontuario || '');
  const [observacoes, setObservacoes] = useState(family?.observacoes || '');
  const [membros, setMembros] = useState<FamilyMember[]>(family?.membros || []);
  const { developerMode } = useSettings();

  const addMember = () => {
    const newMember: FamilyMember = {
      id: Date.now().toString(),
      nome: '',
      cpf: '',
      nis: '',
      isResponsavel: membros.length === 0, // Primeiro membro é automaticamente responsável
      vinculoComTitular: membros.length === 0 ? 'Responsável' : '',
      sexo: '',
      dataNascimento: '',
      estadoCivil: '',
      raca: '',
      grauInstrucao: '',
      profissao: '',
    };
    setMembros([...membros, newMember]);
  };

  const updateMember = (index: number, field: keyof FamilyMember, value: any) => {
    const updated = [...membros];
    
    // Se está marcando como responsável, desmarcar os outros
    if (field === 'isResponsavel' && value === true) {
      updated.forEach((member, i) => {
        if (i !== index) {
          member.isResponsavel = false;
          if (member.vinculoComTitular === 'Responsável') {
            member.vinculoComTitular = '';
          }
        }
      });
      updated[index].vinculoComTitular = 'Responsável';
    }
    
    updated[index] = { ...updated[index], [field]: value };
    setMembros(updated);
  };

  const removeMember = (index: number) => {
    const updated = membros.filter((_, i) => i !== index);
    
    // Se removeu o responsável e ainda há membros, marcar o primeiro como responsável
    if (membros[index].isResponsavel && updated.length > 0) {
      updated[0].isResponsavel = true;
      updated[0].vinculoComTitular = 'Responsável';
      toast.info('O primeiro membro foi definido como novo responsável');
    }
    
    setMembros(updated);
  };

  const validate = () => {
    if (!developerMode) {
      if (!prontuario.trim()) {
        toast.error('Prontuário é obrigatório');
        return false;
      }
      if (membros.length === 0) {
        toast.error('Adicione pelo menos um membro da família');
        return false;
      }
      
      const responsavel = membros.find(m => m.isResponsavel);
      if (!responsavel) {
        toast.error('Defina um responsável familiar');
        return false;
      }
      
      if (!responsavel.nome.trim()) {
        toast.error('Nome do responsável é obrigatório');
        return false;
      }
      
      // Validar campos obrigatórios dos membros
      for (let i = 0; i < membros.length; i++) {
        const membro = membros[i];
        if (!membro.nome.trim()) {
          toast.error(`Nome do membro ${i + 1} é obrigatório`);
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSave({
      prontuario,
      membros,
      observacoes,
    });
  };

  const responsavel = membros.find(m => m.isResponsavel);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <div className="p-6">
        <div className="max-w-5xl mx-auto">
          <Card className="shadow-xl border-blue-100">
            <CardHeader className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
              <CardTitle className="flex items-center justify-between">
                <span>{family ? 'Editar Família' : 'Nova Família'}</span>
                {readOnly && (
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    Somente Leitura
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ReadOnlyWrapper readOnly={readOnly}>
                <div className="space-y-8">
                  {/* Informações Básicas */}
                  <div>
                    <h3 className="text-gray-900 mb-4 pb-2 border-b border-blue-200">
                      Informações da Família
                    </h3>
                    <div>
                      <Label htmlFor="prontuario">Prontuário *</Label>
                      <Input
                        id="prontuario"
                        value={prontuario}
                        onChange={(e) => setProntuario(e.target.value)}
                        disabled={readOnly}
                        placeholder="Número do prontuário"
                      />
                    </div>
                  </div>

                  {/* Membros da Família */}
                  <div>
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-blue-200">
                      <h3 className="text-gray-900">
                        Membros da Família ({membros.length})
                      </h3>
                      {!readOnly && (
                        <Button
                          onClick={addMember}
                          variant="outline"
                          size="sm"
                          className="gap-2 border-blue-300 text-blue-700 hover:bg-blue-50"
                        >
                          <Plus className="w-4 h-4" />
                          Adicionar Membro
                        </Button>
                      )}
                    </div>

                    {membros.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
                        <User className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                        <p className="text-gray-600 mb-4">Nenhum membro cadastrado</p>
                        {!readOnly && (
                          <Button
                            onClick={addMember}
                            variant="outline"
                            className="gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Adicionar Primeiro Membro
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {membros.map((membro, index) => (
                          <Card key={membro.id} className={`${membro.isResponsavel ? 'border-2 border-blue-400 shadow-md' : 'border-gray-200'}`}>
                            <CardHeader className={`${membro.isResponsavel ? 'bg-blue-50' : 'bg-gray-50'} pb-3`}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm">Membro {index + 1}</span>
                                  {membro.isResponsavel && (
                                    <Badge className="gap-1 bg-blue-600">
                                      <UserCheck className="w-3 h-3" />
                                      Responsável
                                    </Badge>
                                  )}
                                </div>
                                {!readOnly && (
                                  <div className="flex items-center gap-2">
                                    {!membro.isResponsavel && (
                                      <Button
                                        onClick={() => updateMember(index, 'isResponsavel', true)}
                                        variant="ghost"
                                        size="sm"
                                        className="text-xs h-7"
                                      >
                                        Definir como Responsável
                                      </Button>
                                    )}
                                    <Button
                                      onClick={() => removeMember(index)}
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                              <div className="grid gap-4 md:grid-cols-2">
                                <div className="md:col-span-2">
                                  <Label>Nome Completo *</Label>
                                  <Input
                                    value={membro.nome}
                                    onChange={(e) => updateMember(index, 'nome', e.target.value)}
                                    disabled={readOnly}
                                    placeholder="Nome completo"
                                  />
                                </div>
                                <div>
                                  <Label>CPF</Label>
                                  <Input
                                    value={membro.cpf}
                                    onChange={(e) => updateMember(index, 'cpf', e.target.value)}
                                    disabled={readOnly}
                                    placeholder="000.000.000-00"
                                  />
                                </div>
                                <div>
                                  <Label>NIS</Label>
                                  <Input
                                    value={membro.nis}
                                    onChange={(e) => updateMember(index, 'nis', e.target.value)}
                                    disabled={readOnly}
                                    placeholder="Número do NIS"
                                  />
                                </div>
                                <div>
                                  <Label>Vínculo com Responsável</Label>
                                  <Select
                                    value={membro.vinculoComTitular}
                                    onValueChange={(value) => updateMember(index, 'vinculoComTitular', value)}
                                    disabled={readOnly || membro.isResponsavel}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Responsável">Responsável</SelectItem>
                                      <SelectItem value="Cônjuge/Companheiro(a)">Cônjuge/Companheiro(a)</SelectItem>
                                      <SelectItem value="Filho(a)">Filho(a)</SelectItem>
                                      <SelectItem value="Enteado(a)">Enteado(a)</SelectItem>
                                      <SelectItem value="Neto(a)">Neto(a)</SelectItem>
                                      <SelectItem value="Pai/Mãe">Pai/Mãe</SelectItem>
                                      <SelectItem value="Sogro(a)">Sogro(a)</SelectItem>
                                      <SelectItem value="Irmão(ã)">Irmão(ã)</SelectItem>
                                      <SelectItem value="Genro/Nora">Genro/Nora</SelectItem>
                                      <SelectItem value="Outro Parente">Outro Parente</SelectItem>
                                      <SelectItem value="Não Parente">Não Parente</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Data de Nascimento</Label>
                                  <Input
                                    type="date"
                                    value={membro.dataNascimento}
                                    onChange={(e) => updateMember(index, 'dataNascimento', e.target.value)}
                                    disabled={readOnly}
                                  />
                                </div>
                                <div>
                                  <Label>Sexo</Label>
                                  <Select
                                    value={membro.sexo}
                                    onValueChange={(value) => updateMember(index, 'sexo', value)}
                                    disabled={readOnly}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Masculino">Masculino</SelectItem>
                                      <SelectItem value="Feminino">Feminino</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Estado Civil</Label>
                                  <Select
                                    value={membro.estadoCivil}
                                    onValueChange={(value) => updateMember(index, 'estadoCivil', value)}
                                    disabled={readOnly}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Solteiro(a)">Solteiro(a)</SelectItem>
                                      <SelectItem value="Casado(a)">Casado(a)</SelectItem>
                                      <SelectItem value="Divorciado(a)">Divorciado(a)</SelectItem>
                                      <SelectItem value="Viúvo(a)">Viúvo(a)</SelectItem>
                                      <SelectItem value="União Estável">União Estável</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Raça/Cor</Label>
                                  <Select
                                    value={membro.raca}
                                    onValueChange={(value) => updateMember(index, 'raca', value)}
                                    disabled={readOnly}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Branca">Branca</SelectItem>
                                      <SelectItem value="Preta">Preta</SelectItem>
                                      <SelectItem value="Parda">Parda</SelectItem>
                                      <SelectItem value="Amarela">Amarela</SelectItem>
                                      <SelectItem value="Indígena">Indígena</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Grau de Instrução</Label>
                                  <Select
                                    value={membro.grauInstrucao}
                                    onValueChange={(value) => updateMember(index, 'grauInstrucao', value)}
                                    disabled={readOnly}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Analfabeto">Analfabeto</SelectItem>
                                      <SelectItem value="Fundamental Incompleto">Fundamental Incompleto</SelectItem>
                                      <SelectItem value="Fundamental Completo">Fundamental Completo</SelectItem>
                                      <SelectItem value="Médio Incompleto">Médio Incompleto</SelectItem>
                                      <SelectItem value="Médio Completo">Médio Completo</SelectItem>
                                      <SelectItem value="Superior Incompleto">Superior Incompleto</SelectItem>
                                      <SelectItem value="Superior Completo">Superior Completo</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Profissão</Label>
                                  <Input
                                    value={membro.profissao}
                                    onChange={(e) => updateMember(index, 'profissao', e.target.value)}
                                    disabled={readOnly}
                                    placeholder="Profissão"
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Observações */}
                  <div>
                    <Label htmlFor="observacoes">Observações</Label>
                    <Textarea
                      id="observacoes"
                      value={observacoes}
                      onChange={(e) => setObservacoes(e.target.value)}
                      disabled={readOnly}
                      placeholder="Informações adicionais sobre a família..."
                      rows={4}
                    />
                  </div>

                  {/* Botões */}
                  <div className="flex gap-3 justify-end pt-4 border-t">
                    <Button
                      onClick={onCancel}
                      variant="outline"
                      className="gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancelar
                    </Button>
                    {!readOnly && (
                      <Button
                        onClick={handleSubmit}
                        className="gap-2 bg-blue-600 hover:bg-blue-700"
                      >
                        <Save className="w-4 h-4" />
                        Salvar Família
                      </Button>
                    )}
                  </div>

                  {developerMode && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                      ⚠️ Modo Desenvolvedor: Validações desabilitadas
                    </div>
                  )}
                </div>
              </ReadOnlyWrapper>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
