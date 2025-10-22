import { useState } from 'react';
import { EconomicData } from '../types/family';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { ArrowLeft, Save } from 'lucide-react';
import { Header } from './Header';
import { ReadOnlyWrapper } from './ReadOnlyWrapper';

interface EconomicFormProps {
  data: EconomicData;
  onChange: (data: EconomicData) => void;
  onSave: () => void;
  onBack: () => void;
  readOnly?: boolean;
}

export function EconomicForm({ data, onChange, onSave, onBack, readOnly = false }: EconomicFormProps) {
  const [localData, setLocalData] = useState<EconomicData>(data);

  const updateField = (field: keyof EconomicData, value: any) => {
    const updated = { ...localData, [field]: value };
    setLocalData(updated);
    onChange(updated);
  };

  const updateNestedField = (parent: keyof EconomicData, field: string, value: any) => {
    const updated = {
      ...localData,
      [parent]: {
        ...(localData[parent] as any),
        [field]: value,
      },
    };
    setLocalData(updated);
    onChange(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-blue-900 mb-2">Outras Políticas e Realidade Socioeconômica</h1>
          </div>

          <Card className="mb-6 shadow-lg border-blue-100">
            <CardHeader className="bg-gradient-to-br from-blue-50 to-white">
              <CardTitle className="text-blue-900">X- OUTRAS POLÍTICAS SETORIAIS: AGRICULTURA, LAZER, CULTURA, EMPREGO E RENDA. DEFESA DE DIREITOS DAS MULHERES</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <ReadOnlyWrapper readOnly={readOnly}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.outrasPolíticas.acessoProdutosHortas}
                    onCheckedChange={(checked) => updateNestedField('outrasPolíticas', 'acessoProdutosHortas', checked)}
                  />
                  <Label>Acesso a produtos das hortas municipais</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.outrasPolíticas.timeEmprego}
                    onCheckedChange={(checked) => updateNestedField('outrasPolíticas', 'timeEmprego', checked)}
                  />
                  <Label>Time do Emprego</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.outrasPolíticas.projetoGuri}
                    onCheckedChange={(checked) => updateNestedField('outrasPolíticas', 'projetoGuri', checked)}
                  />
                  <Label>Projeto Guri</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.outrasPolíticas.outrosPolíticas}
                    onCheckedChange={(checked) => updateNestedField('outrasPolíticas', 'outrosPolíticas', checked)}
                  />
                  <Label>Outros:</Label>
                  <Input
                    value={localData.outrasPolíticas.outrosPolíticasEspecificar}
                    onChange={(e) => updateNestedField('outrasPolíticas', 'outrosPolíticasEspecificar', e.target.value)}
                    placeholder="Especifique"
                    className="flex-1"
                  />
                </div>
              </div>
              </ReadOnlyWrapper>
            </CardContent>
          </Card>

          <Card className="mb-6 shadow-lg border-blue-100">
            <CardHeader className="bg-gradient-to-br from-blue-50 to-white">
              <CardTitle className="text-blue-900">XI- REALIDADE SOCIOECONÔMICA DA FAMÍLIA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <ReadOnlyWrapper readOnly={readOnly}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-blue-900">RECEITAS</h3>
                  <div>
                    <Label>Número de pessoas que sobrevivem com essa renda:</Label>
                    <Input
                      type="number"
                      value={localData.receitas.numeroPessoasRenda}
                      onChange={(e) => updateNestedField('receitas', 'numeroPessoasRenda', e.target.value)}
                      placeholder="Número de pessoas"
                    />
                  </div>
                  <div>
                    <Label>Per Capita SEM programas sociais: R$</Label>
                    <Input
                      value={localData.receitas.perCapitaSemProgramas}
                      onChange={(e) => updateNestedField('receitas', 'perCapitaSemProgramas', e.target.value)}
                      placeholder="0,00"
                    />
                  </div>
                  <div>
                    <Label>Per Capita COM programas sociais: R$</Label>
                    <Input
                      value={localData.receitas.perCapitaComProgramas}
                      onChange={(e) => updateNestedField('receitas', 'perCapitaComProgramas', e.target.value)}
                      placeholder="0,00"
                    />
                  </div>
                  <div>
                    <Label>Renda total subtraindo os gastos: R$</Label>
                    <Input
                      value={localData.receitas.rendaTotalSubtraindoGastos}
                      onChange={(e) => updateNestedField('receitas', 'rendaTotalSubtraindoGastos', e.target.value)}
                      placeholder="0,00"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-blue-900">DESPESAS</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Medic.: R$</Label>
                      <Input
                        value={localData.despesas.medicamentos}
                        onChange={(e) => updateNestedField('despesas', 'medicamentos', e.target.value)}
                        placeholder="0,00"
                      />
                    </div>
                    <div>
                      <Label>Alimentação: R$</Label>
                      <Input
                        value={localData.despesas.alimentacao}
                        onChange={(e) => updateNestedField('despesas', 'alimentacao', e.target.value)}
                        placeholder="0,00"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Empréstimos: R$</Label>
                      <Input
                        value={localData.despesas.emprestimos}
                        onChange={(e) => updateNestedField('despesas', 'emprestimos', e.target.value)}
                        placeholder="0,00"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label>IPTU: R$</Label>
                      <Input
                        value={localData.despesas.iptu}
                        onChange={(e) => updateNestedField('despesas', 'iptu', e.target.value)}
                        placeholder="0,00"
                      />
                    </div>
                    <div>
                      <Label>Transp. Coletivo: R$</Label>
                      <Input
                        value={localData.despesas.transporteColetivo}
                        onChange={(e) => updateNestedField('despesas', 'transporteColetivo', e.target.value)}
                        placeholder="0,00"
                      />
                    </div>
                    <div>
                      <Label>Próprio: R$</Label>
                      <Input
                        value={localData.despesas.transporteProprio}
                        onChange={(e) => updateNestedField('despesas', 'transporteProprio', e.target.value)}
                        placeholder="0,00"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <Label>Água: R$</Label>
                      <Input
                        value={localData.despesas.agua}
                        onChange={(e) => updateNestedField('despesas', 'agua', e.target.value)}
                        placeholder="0,00"
                      />
                    </div>
                    <div>
                      <Label>Energia: R$</Label>
                      <Input
                        value={localData.despesas.energia}
                        onChange={(e) => updateNestedField('despesas', 'energia', e.target.value)}
                        placeholder="0,00"
                      />
                    </div>
                    <div>
                      <Label>Gás: R$</Label>
                      <Input
                        value={localData.despesas.gas}
                        onChange={(e) => updateNestedField('despesas', 'gas', e.target.value)}
                        placeholder="0,00"
                      />
                    </div>
                    <div>
                      <Label>Aluguel: R$</Label>
                      <Input
                        value={localData.despesas.aluguel}
                        onChange={(e) => updateNestedField('despesas', 'aluguel', e.target.value)}
                        placeholder="0,00"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Financiamento: R$</Label>
                    <Input
                      value={localData.despesas.financiamento}
                      onChange={(e) => updateNestedField('despesas', 'financiamento', e.target.value)}
                      placeholder="0,00"
                    />
                  </div>
                  <div>
                    <Label>Outras despesas:</Label>
                    <Input
                      value={localData.despesas.outrasDespesas}
                      onChange={(e) => updateNestedField('despesas', 'outrasDespesas', e.target.value)}
                      placeholder="Especifique"
                    />
                  </div>
                  <div>
                    <Label>Quais delas estão em atraso: R$</Label>
                    <Input
                      value={localData.despesas.quaisEmAtraso}
                      onChange={(e) => updateNestedField('despesas', 'quaisEmAtraso', e.target.value)}
                      placeholder="Especifique"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="space-y-4">
                  <div>
                    <Label className="mb-3 block">Renda suficiente para atendimento das necessidades básicas:</Label>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={localData.rendaSuficiente === true}
                          onCheckedChange={() => updateField('rendaSuficiente', true)}
                        />
                        <Label>Sim</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={localData.rendaSuficiente === false}
                          onCheckedChange={() => updateField('rendaSuficiente', false)}
                        />
                        <Label>Não</Label>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Técnico responsável pela realização do cadastro:</Label>
                      <Input
                        value={localData.tecnicoResponsavel}
                        onChange={(e) => updateField('tecnicoResponsavel', e.target.value)}
                        placeholder="Nome do técnico"
                      />
                    </div>
                    <div>
                      <Label>CRESS/CRP:</Label>
                      <Input
                        value={localData.cressCrp}
                        onChange={(e) => updateField('cressCrp', e.target.value)}
                        placeholder="Número do registro"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="mb-3 block">Família será incluída em acompanhamento:</Label>
                    <div className="flex gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={localData.familiaSeriaIncluidaAcompanhamento === true}
                          onCheckedChange={() => updateField('familiaSeriaIncluidaAcompanhamento', true)}
                        />
                        <Label>Sim</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={localData.familiaSeriaIncluidaAcompanhamento === false}
                          onCheckedChange={() => updateField('familiaSeriaIncluidaAcompanhamento', false)}
                        />
                        <Label>Não</Label>
                      </div>
                      {localData.familiaSeriaIncluidaAcompanhamento && (
                        <div className="flex items-center gap-2">
                          <Label>Data:</Label>
                          <Input
                            type="date"
                            value={localData.dataInclusaoAcompanhamento}
                            onChange={(e) => updateField('dataInclusaoAcompanhamento', e.target.value)}
                            className="w-auto"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label>Motivo da inclusão no acompanhamento:</Label>
                    <Textarea
                      value={localData.motivoInclusaoAcompanhamento}
                      onChange={(e) => updateField('motivoInclusaoAcompanhamento', e.target.value)}
                      placeholder="Descreva o motivo da inclusão"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
              </ReadOnlyWrapper>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button onClick={onBack} variant="outline" className="gap-2 border-gray-300">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            {!readOnly && (
              <Button onClick={onSave} className="gap-2 bg-green-600 hover:bg-green-700 shadow-lg">
                <Save className="w-4 h-4" />
                Salvar Cadastro Completo
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
