import { useState, useEffect } from 'react';
import { Family, FamilyMember } from '../types/family';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Plus, Trash2, Save, X, UserCheck, User, RotateCcw, AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Header } from './Header';
import { BackButton } from './BackButton';
import { ReadOnlyWrapper } from './ReadOnlyWrapper';
import { useSettings } from '../contexts/SettingsContext';
import { toast } from 'sonner';
import { Badge } from './ui/badge';
import { TransferMemberDialog } from './TransferMemberDialog';

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
  const [transferDialog, setTransferDialog] = useState<{
    open: boolean;
    memberData: Partial<FamilyMember> | null;
    existingFamily: Family | null;
    memberIndex: number | null;
  }>({ open: false, memberData: null, existingFamily: null, memberIndex: null });
  const { developerMode } = useSettings();

  // Função para verificar se um membro já existe em outra família
  const checkMemberExists = (memberData: {
    nome: string;
    cpf?: string;
    nis?: string;
    dataNascimento: string;
  }): { exists: boolean; family: Family | null; member: FamilyMember | null } => {
    if (!memberData.nome || !memberData.dataNascimento) {
      return { exists: false, family: null, member: null };
    }

    const families = JSON.parse(localStorage.getItem('families') || '[]') as Family[];
    
    for (const fam of families) {
      // Ignorar a família atual
      if (family && fam.id === family.id) continue;
      
      for (const member of fam.membros) {
        // Verificar apenas membros ativos
        if (!member.ativo) continue;

        const nomeMatch = member.nome.toLowerCase().trim() === memberData.nome.toLowerCase().trim();
        const dataNascMatch = member.dataNascimento === memberData.dataNascimento;
        
        // Match por nome + data de nascimento
        if (nomeMatch && dataNascMatch) {
          return { exists: true, family: fam, member };
        }
        
        // Match por CPF se ambos tiverem
        if (memberData.cpf && member.cpf && memberData.cpf === member.cpf) {
          return { exists: true, family: fam, member };
        }
        
        // Match por NIS se ambos tiverem
        if (memberData.nis && member.nis && memberData.nis === member.nis) {
          return { exists: true, family: fam, member };
        }
      }
    }
    
    return { exists: false, family: null, member: null };
  };

  // Função para transferir membro de outra família
  const transferMember = (
    fromFamily: Family,
    memberToTransfer: FamilyMember,
    toMembros: FamilyMember[],
    newMemberIndex: number
  ) => {
    const families = JSON.parse(localStorage.getItem('families') || '[]') as Family[];
    
    // Desativar membro na família antiga
    const updatedFromFamily = {
      ...fromFamily,
      membros: fromFamily.membros.map(m => 
        m.id === memberToTransfer.id ? { ...m, ativo: false } : m
      ),
      updatedAt: new Date().toISOString(),
    };
    
    // Se o membro era responsável, transferir responsabilidade
    if (memberToTransfer.isResponsavel) {
      const activeMembersInOldFamily = updatedFromFamily.membros.filter(m => m.ativo);
      if (activeMembersInOldFamily.length > 0) {
        updatedFromFamily.membros = updatedFromFamily.membros.map((m, index) => {
          if (m.ativo && m.id !== memberToTransfer.id) {
            // Primeiro membro ativo vira responsável
            const isFirst = updatedFromFamily.membros.filter(mem => mem.ativo).findIndex(mem => mem.id === m.id) === 0;
            if (isFirst) {
              return { ...m, isResponsavel: true, vinculoComTitular: 'Responsável' };
            }
          }
          return m;
        });
        toast.info('Responsabilidade transferida na família anterior');
      }
    }
    
    // Atualizar localStorage
    const updatedFamilies = families.map(f => 
      f.id === fromFamily.id ? updatedFromFamily : f
    );
    localStorage.setItem('families', JSON.stringify(updatedFamilies));
    
    // Adicionar membro à família atual com os dados atualizados
    const updatedMembros = [...toMembros];
    updatedMembros[newMemberIndex] = {
      ...updatedMembros[newMemberIndex],
      ...memberToTransfer,
      id: updatedMembros[newMemberIndex].id, // Manter o novo ID
      ativo: true,
      isResponsavel: toMembros.length === 1, // Se é o único, vira responsável
      vinculoComTitular: toMembros.length === 1 ? 'Responsável' : '',
    };
    
    setMembros(updatedMembros);
    toast.success('Membro transferido com sucesso!');
  };

  // Função para reativar membro
  const reactivateMember = (index: number) => {
    const membro = membros[index];
    const { exists, family: otherFamily, member: memberInOtherFamily } = checkMemberExists({
      nome: membro.nome,
      cpf: membro.cpf,
      nis: membro.nis,
      dataNascimento: membro.dataNascimento,
    });
    
    if (exists && otherFamily && memberInOtherFamily) {
      // Desativar na outra família
      const families = JSON.parse(localStorage.getItem('families') || '[]') as Family[];
      const updatedOtherFamily = {
        ...otherFamily,
        membros: otherFamily.membros.map(m => 
          m.id === memberInOtherFamily.id ? { ...m, ativo: false } : m
        ),
        updatedAt: new Date().toISOString(),
      };
      
      // Se era responsável na outra família, transferir responsabilidade
      if (memberInOtherFamily.isResponsavel) {
        const activeMembersInOtherFamily = updatedOtherFamily.membros.filter(m => m.ativo && m.id !== memberInOtherFamily.id);
        if (activeMembersInOtherFamily.length > 0) {
          updatedOtherFamily.membros = updatedOtherFamily.membros.map((m) => {
            const isFirst = updatedOtherFamily.membros.filter(mem => mem.ativo && mem.id !== memberInOtherFamily.id).findIndex(mem => mem.id === m.id) === 0;
            if (isFirst && m.id !== memberInOtherFamily.id) {
              return { ...m, isResponsavel: true, vinculoComTitular: 'Responsável' };
            }
            return m;
          });
        }
      }
      
      const updatedFamilies = families.map(f => 
        f.id === otherFamily.id ? updatedOtherFamily : f
      );
      localStorage.setItem('families', JSON.stringify(updatedFamilies));
      toast.info(`Membro desativado na família ${otherFamily.prontuario}`);
    }
    
    // Reativar na família atual
    const updated = [...membros];
    updated[index] = { ...updated[index], ativo: true };
    setMembros(updated);
    toast.success('Membro reativado com sucesso!');
  };

  const addMember = () => {
    const activeMembros = membros.filter(m => m.ativo);
    const newMember: FamilyMember = {
      id: Date.now().toString(),
      nome: '',
      cpf: '',
      nis: '',
      isResponsavel: activeMembros.length === 0,
      vinculoComTitular: activeMembros.length === 0 ? 'Responsável' : '',
      sexo: '',
      dataNascimento: '',
      estadoCivil: '',
      raca: '',
      grauInstrucao: '',
      profissao: '',
      rendaBruta: 0,
      ativo: true,
    };
    setMembros([...membros, newMember]);
  };

  const updateMember = (index: number, field: keyof FamilyMember, value: any) => {
    const updated = [...membros];
    
    // Se está marcando como responsável, desmarcar os outros
    if (field === 'isResponsavel' && value === true) {
      updated.forEach((member, i) => {
        if (i !== index && member.ativo) {
          member.isResponsavel = false;
          if (member.vinculoComTitular === 'Responsável') {
            member.vinculoComTitular = '';
          }
        }
      });
      updated[index].vinculoComTitular = 'Responsável';
    }
    
    updated[index] = { ...updated[index], [field]: value };
    
    // Verificar se é uma atualização de dados que pode indicar duplicata
    if (['nome', 'cpf', 'nis', 'dataNascimento'].includes(field)) {
      const memberData = updated[index];
      if (memberData.nome && memberData.dataNascimento) {
        const { exists, family: existingFamily } = checkMemberExists({
          nome: memberData.nome,
          cpf: memberData.cpf,
          nis: memberData.nis,
          dataNascimento: memberData.dataNascimento,
        });
        
        if (exists && existingFamily) {
          setTransferDialog({
            open: true,
            memberData: updated[index],
            existingFamily,
            memberIndex: index,
          });
          return; // Não atualizar ainda, esperar confirmação
        }
      }
    }
    
    setMembros(updated);
  };

  const removeMember = (index: number) => {
    const updated = membros.filter((_, i) => i !== index);
    const activeMembros = updated.filter(m => m.ativo);
    
    // Se removeu o responsável e ainda há membros ativos, marcar o primeiro ativo como responsável
    if (membros[index].isResponsavel && activeMembros.length > 0) {
      const firstActiveIndex = updated.findIndex(m => m.ativo);
      if (firstActiveIndex !== -1) {
        updated[firstActiveIndex].isResponsavel = true;
        updated[firstActiveIndex].vinculoComTitular = 'Responsável';
        toast.info('O primeiro membro ativo foi definido como novo responsável');
      }
    }
    
    setMembros(updated);
  };

  const handleTransferConfirm = () => {
    if (transferDialog.existingFamily && transferDialog.memberData && transferDialog.memberIndex !== null) {
      const memberInOtherFamily = transferDialog.existingFamily.membros.find(
        m => m.nome.toLowerCase().trim() === transferDialog.memberData?.nome.toLowerCase().trim() &&
             m.dataNascimento === transferDialog.memberData?.dataNascimento
      );
      
      if (memberInOtherFamily) {
        transferMember(
          transferDialog.existingFamily,
          memberInOtherFamily,
          membros,
          transferDialog.memberIndex
        );
      }
    }
    setTransferDialog({ open: false, memberData: null, existingFamily: null, memberIndex: null });
  };

  const handleTransferCancel = () => {
    setTransferDialog({ open: false, memberData: null, existingFamily: null, memberIndex: null });
  };

  const validate = () => {
    const activeMembros = membros.filter(m => m.ativo);
    
    if (!developerMode) {
      if (!prontuario.trim()) {
        toast.error('Prontuário é obrigatório');
        return false;
      }
      if (activeMembros.length === 0) {
        toast.error('Adicione pelo menos um membro ativo na família');
        return false;
      }
      
      const responsavel = activeMembros.find(m => m.isResponsavel);
      if (!responsavel) {
        toast.error('Defina um responsável familiar');
        return false;
      }
      
      if (!responsavel.nome.trim()) {
        toast.error('Nome do responsável é obrigatório');
        return false;
      }
      
      // Validar campos obrigatórios dos membros ativos
      for (let i = 0; i < membros.length; i++) {
        const membro = membros[i];
        if (membro.ativo && !membro.nome.trim()) {
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

  const activeMembros = membros.filter(m => m.ativo);
  const inactiveMembros = membros.filter(m => !m.ativo);
  const responsavel = activeMembros.find(m => m.isResponsavel);

  const getRendaTotal = () => {
    const total = activeMembros.reduce((sum, membro) => {
      const renda = Number(membro.rendaBruta) || 0;
      return sum + renda;
    }, 0);
    
    return total.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    });
  };

  const renderMemberCard = (membro: FamilyMember, index: number, isInactive: boolean = false) => (
    <Card key={membro.id} className={`${membro.isResponsavel && !isInactive ? 'border-2 border-blue-400 shadow-md' : isInactive ? 'border-gray-300 opacity-70' : 'border-gray-200'}`}>
      <CardHeader className={`${membro.isResponsavel && !isInactive ? 'bg-blue-50' : isInactive ? 'bg-gray-100' : 'bg-gray-50'} pb-3`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm">{isInactive ? 'Inativo' : `Membro ${activeMembros.findIndex(m => m.id === membro.id) + 1}`}</span>
            {membro.isResponsavel && !isInactive && (
              <Badge className="gap-1 bg-blue-600">
                <UserCheck className="w-3 h-3" />
                Responsável
              </Badge>
            )}
            {isInactive && (
              <Badge variant="secondary" className="gap-1 bg-gray-500 text-white">
                <AlertCircle className="w-3 h-3" />
                Desativado
              </Badge>
            )}
          </div>
          {!readOnly && (
            <div className="flex items-center gap-2">
              {isInactive ? (
                <Button
                  onClick={() => reactivateMember(index)}
                  variant="outline"
                  size="sm"
                  className="gap-2 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-300"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reativar
                </Button>
              ) : (
                <>
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
                </>
              )}
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
              disabled={readOnly || isInactive}
              placeholder="Nome completo"
            />
          </div>
          <div>
            <Label>CPF</Label>
            <Input
              value={membro.cpf}
              onChange={(e) => updateMember(index, 'cpf', e.target.value)}
              disabled={readOnly || isInactive}
              placeholder="000.000.000-00"
            />
          </div>
          <div>
            <Label>NIS</Label>
            <Input
              value={membro.nis}
              onChange={(e) => updateMember(index, 'nis', e.target.value)}
              disabled={readOnly || isInactive}
              placeholder="Número do NIS"
            />
          </div>
          <div>
            <Label>Vínculo com Responsável</Label>
            <Select
              value={membro.vinculoComTitular}
              onValueChange={(value) => updateMember(index, 'vinculoComTitular', value)}
              disabled={readOnly || membro.isResponsavel || isInactive}
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
              disabled={readOnly || isInactive}
            />
          </div>
          <div>
            <Label>Sexo</Label>
            <Select
              value={membro.sexo}
              onValueChange={(value) => updateMember(index, 'sexo', value)}
              disabled={readOnly || isInactive}
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
              disabled={readOnly || isInactive}
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
              disabled={readOnly || isInactive}
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
              disabled={readOnly || isInactive}
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
              disabled={readOnly || isInactive}
              placeholder="Profissão"
            />
          </div>
          <div>
            <Label>Renda Bruta (R$)</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={membro.rendaBruta?.toString() || ''}
              onChange={(e) => updateMember(index, 'rendaBruta', parseFloat(e.target.value) || 0)}
              disabled={readOnly || isInactive}
              placeholder="0,00"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <div className="p-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-4">
            <BackButton onClick={onCancel} />
          </div>
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

                  {/* Membros Ativos da Família */}
                  <div>
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-blue-200">
                      <div className="flex items-center gap-3">
                        <h3 className="text-gray-900">
                          Membros Ativos ({activeMembros.length})
                        </h3>
                        {activeMembros.length > 0 && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                            Renda Total: {getRendaTotal()}
                          </Badge>
                        )}
                      </div>
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

                    {activeMembros.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
                        <User className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                        <p className="text-gray-600 mb-4">Nenhum membro ativo cadastrado</p>
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
                        {membros.map((membro, index) => 
                          membro.ativo ? renderMemberCard(membro, index, false) : null
                        )}
                      </div>
                    )}
                  </div>

                  {/* Membros Inativos */}
                  {inactiveMembros.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-300">
                        <AlertCircle className="w-5 h-5 text-gray-500" />
                        <h3 className="text-gray-700">
                          Membros Inativos ({inactiveMembros.length})
                        </h3>
                        <Badge variant="secondary" className="bg-gray-200 text-gray-700">
                          Transferidos para outras famílias
                        </Badge>
                      </div>
                      <div className="space-y-4">
                        {membros.map((membro, index) => 
                          !membro.ativo ? renderMemberCard(membro, index, true) : null
                        )}
                      </div>
                    </div>
                  )}

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

      {/* Dialog de Transferência */}
      <TransferMemberDialog
        open={transferDialog.open}
        memberName={transferDialog.memberData?.nome || ''}
        currentFamily={transferDialog.existingFamily}
        onConfirm={handleTransferConfirm}
        onCancel={handleTransferCancel}
      />
    </div>
  );
}
