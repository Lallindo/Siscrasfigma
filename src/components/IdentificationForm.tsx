import { useState } from 'react';
import { IdentificationData, FamilyMember } from '../types/family';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Plus, Trash2, ArrowRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Header } from './Header';
import { ReadOnlyWrapper } from './ReadOnlyWrapper';
import { useSettings } from '../contexts/SettingsContext';
import { toast } from 'sonner';

interface IdentificationFormProps {
  data: IdentificationData;
  onChange: (data: IdentificationData) => void;
  onNext: () => void;
  onCancel: () => void;
  readOnly?: boolean;
}

export function IdentificationForm({ data, onChange, onNext, onCancel, readOnly = false }: IdentificationFormProps) {
  const [localData, setLocalData] = useState<IdentificationData>(data);
  const { developerMode } = useSettings();

  const updateField = (field: keyof IdentificationData, value: any) => {
    const updated = { ...localData, [field]: value };
    setLocalData(updated);
    onChange(updated);
  };

  const addMember = () => {
    const newMember: FamilyMember = {
      id: Date.now().toString(),
      nome: '',
      vinculoComTitular: '',
      sexo: '',
      orientacaoSexual: '',
      dataNascimento: '',
      estadoCivil: '',
      raca: '',
      grauInstrucao: '',
      profissao: '',
      ocupacao: '',
      rendaBruta: '',
      fonteRenda: '',
    };
    updateField('membros', [...(localData.membros || []), newMember]);
  };

  const updateMember = (index: number, field: keyof FamilyMember, value: string) => {
    const updated = [...(localData.membros || [])];
    updated[index] = { ...updated[index], [field]: value };
    updateField('membros', updated);
  };

  const removeMember = (index: number) => {
    const updated = localData.membros.filter((_, i) => i !== index);
    updateField('membros', updated);
  };

  const handleNext = () => {
    if (readOnly) {
      onNext();
      return;
    }

    if (!developerMode) {
      const errors: string[] = [];

      // Validar primeiro membro (responsável)
      if (!localData.membros || localData.membros.length === 0) {
        errors.push('É necessário adicionar o responsável familiar');
      } else {
        const responsavel = localData.membros[0];
        if (!responsavel.nome?.trim()) errors.push('Nome do responsável');
        if (!responsavel.cpf?.trim()) errors.push('CPF do responsável');
        if (!responsavel.nis?.trim()) errors.push('NIS do responsável');
        if (!responsavel.dataNascimento) errors.push('Data de nascimento do responsável');
        if (!responsavel.sexo) errors.push('Sexo do responsável');
      }

      // Validar campos básicos
      if (!localData.centroReferencia) errors.push('Centro de Referência');
      if (!localData.telefone1?.trim()) errors.push('Telefone');
      if (!localData.endereco?.trim()) errors.push('Endereço');
      if (!localData.bairro?.trim()) errors.push('Bairro');

      if (errors.length > 0) {
        toast.error('Campos obrigatórios não preenchidos: ' + errors.join(', '));
        return;
      }
    }

    onNext();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-blue-900 mb-2">I - Identificação</h1>
            {readOnly && (
              <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2 mt-2">
                Este cadastro pertence a outro CRAS. Você pode visualizar mas não pode editar.
              </p>
            )}
            {!readOnly && !developerMode && (
              <p className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded px-3 py-2 mt-2">
                Campos marcados com <span className="text-red-500">*</span> são obrigatórios
              </p>
            )}
          </div>

        <Card className="mb-6 shadow-lg border-blue-100">
          <CardHeader className="bg-gradient-to-br from-blue-50 to-white">
            <CardTitle className="text-blue-900">Centro de Referência e Dados Básicos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ReadOnlyWrapper readOnly={readOnly}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>
                  Centro de Referência {!developerMode && <span className="text-red-500">*</span>}
                </Label>
                <Select
                  value={localData.centroReferencia}
                  onValueChange={(value) => updateField('centroReferencia', value)}
                  disabled={readOnly}
                >
                  <SelectTrigger disabled={readOnly}>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dona Tita">Dona Tita</SelectItem>
                    <SelectItem value="Pedro Ometto">Pedro Ometto</SelectItem>
                    <SelectItem value="Cila Bauab">Cila Bauab</SelectItem>
                    <SelectItem value="Altos da Cidade">Altos da Cidade</SelectItem>
                    <SelectItem value="Central">Central</SelectItem>
                    <SelectItem value="Distrito de Potunduva">Distrito de Potunduva</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Prontuário N°</Label>
                <Input
                  value={localData.prontuario}
                  onChange={(e) => updateField('prontuario', e.target.value)}
                  placeholder="Número do prontuário"
                />
              </div>
              <div>
                <Label>Data de Atualização</Label>
                <Input
                  type="date"
                  value={localData.data}
                  onChange={(e) => updateField('data', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Forma de Acesso</Label>
                <Input
                  value={localData.formaAcesso}
                  onChange={(e) => updateField('formaAcesso', e.target.value)}
                  placeholder="Ex: Busca ativa, demanda espontânea"
                />
              </div>
              <div>
                <Label>NIS</Label>
                <Input
                  value={localData.nis}
                  onChange={(e) => updateField('nis', e.target.value)}
                  placeholder="Número NIS"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>
                    Telefone 1 {!developerMode && <span className="text-red-500">*</span>}
                  </Label>
                  <Input
                    value={localData.telefone1}
                    onChange={(e) => updateField('telefone1', e.target.value)}
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div>
                  <Label>Telefone 2</Label>
                  <Input
                    value={localData.telefone2}
                    onChange={(e) => updateField('telefone2', e.target.value)}
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Responsável Familiar</Label>
                <Input
                  value={localData.responsavelFamiliar}
                  onChange={(e) => updateField('responsavelFamiliar', e.target.value)}
                  placeholder="Nome completo"
                />
              </div>
              <div>
                <Label>Nome Social</Label>
                <Input
                  value={localData.nomeSocial}
                  onChange={(e) => updateField('nomeSocial', e.target.value)}
                  placeholder="Nome social"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label>Data de Nascimento</Label>
                <Input
                  type="date"
                  value={localData.dataNascimento}
                  onChange={(e) => updateField('dataNascimento', e.target.value)}
                />
              </div>
              <div>
                <Label>RG</Label>
                <Input
                  value={localData.rg}
                  onChange={(e) => updateField('rg', e.target.value)}
                  placeholder="RG"
                />
              </div>
              <div>
                <Label>CPF</Label>
                <Input
                  value={localData.cpf}
                  onChange={(e) => updateField('cpf', e.target.value)}
                  placeholder="000.000.000-00"
                />
              </div>
              <div>
                <Label>Local de Nascimento</Label>
                <Input
                  value={localData.localNascimento}
                  onChange={(e) => updateField('localNascimento', e.target.value)}
                  placeholder="Cidade/Estado"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Tempo no Município</Label>
                <Input
                  value={localData.tempoMunicipio}
                  onChange={(e) => updateField('tempoMunicipio', e.target.value)}
                  placeholder="Ex: 5 anos"
                />
              </div>
              <div>
                <Label>Procedência</Label>
                <Input
                  value={localData.procedencia}
                  onChange={(e) => updateField('procedencia', e.target.value)}
                  placeholder="Cidade de origem"
                />
              </div>
              <div>
                <Label>CEP</Label>
                <Input
                  value={localData.cep}
                  onChange={(e) => updateField('cep', e.target.value)}
                  placeholder="00000-000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Label>
                  Endereço {!developerMode && <span className="text-red-500">*</span>}
                </Label>
                <Input
                  value={localData.endereco}
                  onChange={(e) => updateField('endereco', e.target.value)}
                  placeholder="Rua, avenida, etc"
                />
              </div>
              <div>
                <Label>Número</Label>
                <Input
                  value={localData.numero}
                  onChange={(e) => updateField('numero', e.target.value)}
                  placeholder="Nº"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>
                  Bairro {!developerMode && <span className="text-red-500">*</span>}
                </Label>
                <Input
                  value={localData.bairro}
                  onChange={(e) => updateField('bairro', e.target.value)}
                  placeholder="Bairro"
                />
              </div>
              <div>
                <Label>Endereço de Residência (S/N) Observações</Label>
                <Input
                  value={localData.enderecoResidencia}
                  onChange={(e) => updateField('enderecoResidencia', e.target.value)}
                  placeholder="Observações sobre o endereço"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Renda Per Capita R$</Label>
                <Input
                  value={localData.rendaPerCapita}
                  onChange={(e) => updateField('rendaPerCapita', e.target.value)}
                  placeholder="0,00"
                />
              </div>
              <div>
                <Label>Configuração Familiar</Label>
                <Input
                  value={localData.configuracaoFamiliar}
                  onChange={(e) => updateField('configuracaoFamiliar', e.target.value)}
                  placeholder="Ex: Nuclear, monoparental"
                />
              </div>
              <div>
                <Label>Observações</Label>
                <Input
                  value={localData.obs}
                  onChange={(e) => updateField('obs', e.target.value)}
                  placeholder="Observações"
                />
              </div>
            </div>

            <div>
              <Label>Observações Gerais</Label>
              <Textarea
                value={localData.observacoes}
                onChange={(e) => updateField('observacoes', e.target.value)}
                placeholder="Observações gerais sobre a família"
                rows={3}
              />
            </div>
            </ReadOnlyWrapper>
          </CardContent>
        </Card>

        <Card className="mb-6 shadow-lg border-blue-100">
          <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-br from-blue-50 to-white">
            <CardTitle className="text-blue-900">Membros da Família</CardTitle>
            {!readOnly && (
              <Button onClick={addMember} size="sm" className="gap-2 bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4" />
                Adicionar Membro
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {localData.membros && localData.membros.length > 0 ? (
              <div className="space-y-6">
                {localData.membros.map((member, index) => (
                  <div key={member.id} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-medium">
                        {index === 0 ? 'Responsável Familiar' : `Membro ${index + 1}`}
                        {index === 0 && !developerMode && <span className="text-red-500 ml-1">*</span>}
                      </span>
                      {!readOnly && index > 0 && (
                        <Button
                          onClick={() => removeMember(index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <ReadOnlyWrapper readOnly={readOnly}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-3">
                        <Label>
                          Nome {!developerMode && index === 0 && <span className="text-red-500">*</span>}
                        </Label>
                        <Input
                          value={member.nome}
                          onChange={(e) => updateMember(index, 'nome', e.target.value)}
                          placeholder="Nome completo"
                        />
                      </div>
                      <div>
                        <Label>CPF {!developerMode && index === 0 && <span className="text-red-500">*</span>}</Label>
                        <Input
                          value={member.cpf || ''}
                          onChange={(e) => updateMember(index, 'cpf', e.target.value)}
                          placeholder="000.000.000-00"
                        />
                      </div>
                      <div>
                        <Label>NIS {!developerMode && index === 0 && <span className="text-red-500">*</span>}</Label>
                        <Input
                          value={member.nis || ''}
                          onChange={(e) => updateMember(index, 'nis', e.target.value)}
                          placeholder="Número NIS"
                        />
                      </div>
                      <div>
                        <Label>Vínculo com o Titular</Label>
                        <Input
                          value={member.vinculoComTitular}
                          onChange={(e) => updateMember(index, 'vinculoComTitular', e.target.value)}
                          placeholder="Ex: Cônjuge, filho(a)"
                          disabled={index === 0}
                        />
                      </div>
                      <div>
                        <Label>
                          Sexo {!developerMode && index === 0 && <span className="text-red-500">*</span>}
                        </Label>
                        <Select
                          value={member.sexo}
                          onValueChange={(value) => updateMember(index, 'sexo', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="masculino">Masculino</SelectItem>
                            <SelectItem value="feminino">Feminino</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Orientação Sexual</Label>
                        <Input
                          value={member.orientacaoSexual}
                          onChange={(e) => updateMember(index, 'orientacaoSexual', e.target.value)}
                          placeholder="Orientação sexual"
                        />
                      </div>
                      <div>
                        <Label>
                          Data de Nascimento {!developerMode && index === 0 && <span className="text-red-500">*</span>}
                        </Label>
                        <Input
                          type="date"
                          value={member.dataNascimento}
                          onChange={(e) => updateMember(index, 'dataNascimento', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Estado Civil</Label>
                        <Select
                          value={member.estadoCivil}
                          onValueChange={(value) => updateMember(index, 'estadoCivil', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                            <SelectItem value="casado">Casado(a)</SelectItem>
                            <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                            <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                            <SelectItem value="uniao-estavel">União Estável</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Raça</Label>
                        <Select
                          value={member.raca}
                          onValueChange={(value) => updateMember(index, 'raca', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="branca">Branca</SelectItem>
                            <SelectItem value="preta">Preta</SelectItem>
                            <SelectItem value="parda">Parda</SelectItem>
                            <SelectItem value="amarela">Amarela</SelectItem>
                            <SelectItem value="indigena">Indígena</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Grau de Instrução</Label>
                        <Input
                          value={member.grauInstrucao}
                          onChange={(e) => updateMember(index, 'grauInstrucao', e.target.value)}
                          placeholder="Ex: Ensino médio"
                        />
                      </div>
                      <div>
                        <Label>Profissão</Label>
                        <Input
                          value={member.profissao}
                          onChange={(e) => updateMember(index, 'profissao', e.target.value)}
                          placeholder="Profissão"
                        />
                      </div>
                      <div>
                        <Label>Ocupação</Label>
                        <Input
                          value={member.ocupacao}
                          onChange={(e) => updateMember(index, 'ocupacao', e.target.value)}
                          placeholder="Ocupação atual"
                        />
                      </div>
                      <div>
                        <Label>Renda Bruta</Label>
                        <Input
                          value={member.rendaBruta}
                          onChange={(e) => updateMember(index, 'rendaBruta', e.target.value)}
                          placeholder="R$ 0,00"
                        />
                      </div>
                      <div>
                        <Label>Fonte de Renda</Label>
                        <Input
                          value={member.fonteRenda}
                          onChange={(e) => updateMember(index, 'fonteRenda', e.target.value)}
                          placeholder="Ex: Trabalho formal, benefício"
                        />
                      </div>
                    </div>
                    </ReadOnlyWrapper>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {readOnly ? 'Nenhum membro cadastrado.' : 'Nenhum membro cadastrado. Clique em "Adicionar Membro" para começar.'}
              </div>
            )}
          </CardContent>
        </Card>

          <div className="flex justify-between">
            <Button onClick={onCancel} variant="outline" className="border-gray-300">
              {readOnly ? 'Voltar' : 'Cancelar'}
            </Button>
            <Button onClick={handleNext} className="gap-2 bg-blue-600 hover:bg-blue-700">
              Próximo: Saúde e Maternidade
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
