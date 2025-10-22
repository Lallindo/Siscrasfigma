import { useState } from 'react';
import { HealthData } from '../types/family';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Header } from './Header';
import { ReadOnlyWrapper } from './ReadOnlyWrapper';

interface HealthFormProps {
  data: HealthData;
  onChange: (data: HealthData) => void;
  onNext: () => void;
  onBack: () => void;
  readOnly?: boolean;
}

export function HealthForm({ data, onChange, onNext, onBack, readOnly = false }: HealthFormProps) {
  const [localData, setLocalData] = useState<HealthData>(data);

  const updateField = (field: keyof HealthData, value: any) => {
    const updated = { ...localData, [field]: value };
    setLocalData(updated);
    onChange(updated);
  };

  const updateNestedField = (parent: keyof HealthData, field: string, value: any) => {
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
            <h1 className="text-blue-900 mb-2">II - Aspectos Referentes à Saúde</h1>
          </div>

        <Card className="mb-6 shadow-lg border-blue-100">
          <CardHeader className="bg-gradient-to-br from-blue-50 to-white">
            <CardTitle className="text-blue-900">Pessoa com Deficiência (PCD)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ReadOnlyWrapper readOnly={readOnly}>
            <div className="flex items-center gap-4">
              <Label>Há na família P.C.D:</Label>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.temPCD === false}
                    onCheckedChange={() => updateField('temPCD', false)}
                  />
                  <Label>Não</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.temPCD === true}
                    onCheckedChange={() => updateField('temPCD', true)}
                  />
                  <Label>Sim</Label>
                </div>
              </div>
              {localData.temPCD && (
                <div>
                  <Label>Nº de pessoas:</Label>
                  <Input
                    type="number"
                    value={localData.numeroPessoas}
                    onChange={(e) => updateField('numeroPessoas', e.target.value)}
                    className="w-24"
                  />
                </div>
              )}
            </div>

            {localData.temPCD && (
              <>
                <div>
                  <Label className="mb-3 block">Tipo de Deficiência:</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.tipoDeficiencia.fisica}
                        onCheckedChange={(checked) => updateNestedField('tipoDeficiencia', 'fisica', checked)}
                      />
                      <Label>Física</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.tipoDeficiencia.multipla}
                        onCheckedChange={(checked) => updateNestedField('tipoDeficiencia', 'multipla', checked)}
                      />
                      <Label>Múltipla</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.tipoDeficiencia.visual}
                        onCheckedChange={(checked) => updateNestedField('tipoDeficiencia', 'visual', checked)}
                      />
                      <Label>Visual</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.tipoDeficiencia.mental}
                        onCheckedChange={(checked) => updateNestedField('tipoDeficiencia', 'mental', checked)}
                      />
                      <Label>Mental</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.tipoDeficiencia.baixaVisao}
                        onCheckedChange={(checked) => updateNestedField('tipoDeficiencia', 'baixaVisao', checked)}
                      />
                      <Label>Baixa Visão</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.tipoDeficiencia.transtornoEspectroAutista}
                        onCheckedChange={(checked) => updateNestedField('tipoDeficiencia', 'transtornoEspectroAutista', checked)}
                      />
                      <Label>Transtorno do Espectro Autista</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.tipoDeficiencia.auditiva}
                        onCheckedChange={(checked) => updateNestedField('tipoDeficiencia', 'auditiva', checked)}
                      />
                      <Label>Auditiva</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.tipoDeficiencia.emDecorrenciaDoencasCronicas}
                        onCheckedChange={(checked) => updateNestedField('tipoDeficiencia', 'emDecorrenciaDoencasCronicas', checked)}
                      />
                      <Label>Em decorrência de doenças crônicas/degenerativas</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.tipoDeficiencia.intelectual}
                        onCheckedChange={(checked) => updateNestedField('tipoDeficiencia', 'intelectual', checked)}
                      />
                      <Label>Intelectual</Label>
                    </div>
                    <div className="flex items-center gap-2 md:col-span-2">
                      <Checkbox
                        checked={localData.tipoDeficiencia.outras}
                        onCheckedChange={(checked) => updateNestedField('tipoDeficiencia', 'outras', checked)}
                      />
                      <Label>Outras. Especificar:</Label>
                      <Input
                        value={localData.tipoDeficiencia.outrasEspecificar}
                        onChange={(e) => updateNestedField('tipoDeficiencia', 'outrasEspecificar', e.target.value)}
                        placeholder="Especifique"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">Recebe Benefício:</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.recebeBeneficio.nao}
                        onCheckedChange={(checked) => updateNestedField('recebeBeneficio', 'nao', checked)}
                      />
                      <Label>Não</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.recebeBeneficio.sim}
                        onCheckedChange={(checked) => updateNestedField('recebeBeneficio', 'sim', checked)}
                      />
                      <Label>Sim. Qual:</Label>
                      <Input
                        value={localData.recebeBeneficio.simQual}
                        onChange={(e) => updateNestedField('recebeBeneficio', 'simQual', e.target.value)}
                        placeholder="Especifique"
                        className="flex-1"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.recebeBeneficio.emProcesso}
                        onCheckedChange={(checked) => updateNestedField('recebeBeneficio', 'emProcesso', checked)}
                      />
                      <Label>Em processo</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.recebeBeneficio.indeferido}
                        onCheckedChange={(checked) => updateNestedField('recebeBeneficio', 'indeferido', checked)}
                      />
                      <Label>Indeferido. Motivo:</Label>
                      <Input
                        value={localData.recebeBeneficio.indeferidoMotivo}
                        onChange={(e) => updateNestedField('recebeBeneficio', 'indeferidoMotivo', e.target.value)}
                        placeholder="Motivo"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Observações:</Label>
                  <Textarea
                    value={localData.observacoesPCD}
                    onChange={(e) => updateField('observacoesPCD', e.target.value)}
                    placeholder="Observações sobre PCD"
                    rows={3}
                  />
                </div>
              </>
            )}
            </ReadOnlyWrapper>
          </CardContent>
        </Card>

        <Card className="mb-6 shadow-lg border-blue-100">
          <CardHeader className="bg-gradient-to-br from-blue-50 to-white">
            <CardTitle className="text-blue-900">Pessoa com Alguma Doença</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ReadOnlyWrapper readOnly={readOnly}>
            <div className="flex items-center gap-4">
              <Label>Pessoa com alguma doença:</Label>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.pessoaComDoenca === false}
                    onCheckedChange={() => updateField('pessoaComDoenca', false)}
                  />
                  <Label>Não</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.pessoaComDoenca === true}
                    onCheckedChange={() => updateField('pessoaComDoenca', true)}
                  />
                  <Label>Sim</Label>
                </div>
              </div>
            </div>

            {localData.pessoaComDoenca && (
              <>
                <div>
                  <Label>Especifique a(s) doença(s) diagnosticada(s):</Label>
                  <Textarea
                    value={localData.especifiqueDoencas}
                    onChange={(e) => updateField('especifiqueDoencas', e.target.value)}
                    placeholder="Liste as doenças diagnosticadas"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="mb-3 block">Realiza Tratamento:</Label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={localData.realizaTratamento.sus}
                          onCheckedChange={(checked) => updateNestedField('realizaTratamento', 'sus', checked)}
                        />
                        <Label>SUS</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={localData.realizaTratamento.redePrivada}
                          onCheckedChange={(checked) => updateNestedField('realizaTratamento', 'redePrivada', checked)}
                        />
                        <Label>Rede Privada</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={localData.realizaTratamento.ambos}
                          onCheckedChange={(checked) => updateNestedField('realizaTratamento', 'ambos', checked)}
                        />
                        <Label>Ambos</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={localData.realizaTratamento.naoRealiza}
                          onCheckedChange={(checked) => updateNestedField('realizaTratamento', 'naoRealiza', checked)}
                        />
                        <Label>Não realiza</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="mb-3 block">Acessa Médico:</Label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={localData.acessaMedico.sus}
                          onCheckedChange={(checked) => updateNestedField('acessaMedico', 'sus', checked)}
                        />
                        <Label>SUS</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={localData.acessaMedico.redePrivada}
                          onCheckedChange={(checked) => updateNestedField('acessaMedico', 'redePrivada', checked)}
                        />
                        <Label>Rede Privada</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={localData.acessaMedico.naoAcessa}
                          onCheckedChange={(checked) => updateNestedField('acessaMedico', 'naoAcessa', checked)}
                        />
                        <Label>Não acessa</Label>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">Aux. doença/invalidez/BPC:</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.auxilioDoencaInvalidez.sim}
                        onCheckedChange={(checked) => updateNestedField('auxilioDoencaInvalidez', 'sim', checked)}
                      />
                      <Label>Sim</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.auxilioDoencaInvalidez.nao}
                        onCheckedChange={(checked) => updateNestedField('auxilioDoencaInvalidez', 'nao', checked)}
                      />
                      <Label>Não</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.auxilioDoencaInvalidez.emProcesso}
                        onCheckedChange={(checked) => updateNestedField('auxilioDoencaInvalidez', 'emProcesso', checked)}
                      />
                      <Label>Em processo</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.auxilioDoencaInvalidez.indeferido}
                        onCheckedChange={(checked) => updateNestedField('auxilioDoencaInvalidez', 'indeferido', checked)}
                      />
                      <Label>Indeferido</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Observações:</Label>
                  <Textarea
                    value={localData.observacoesDoenca}
                    onChange={(e) => updateField('observacoesDoenca', e.target.value)}
                    placeholder="Observações sobre doenças"
                    rows={3}
                  />
                </div>
              </>
            )}
            </ReadOnlyWrapper>
          </CardContent>
        </Card>

        <Card className="mb-6 shadow-lg border-blue-100">
          <CardHeader className="bg-gradient-to-br from-blue-50 to-white">
            <CardTitle className="text-blue-900">III - Aspectos Referentes à Maternidade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ReadOnlyWrapper readOnly={readOnly}>
            <div className="flex items-center gap-4">
              <Label>Gestante na família:</Label>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.gestanteNaFamilia === false}
                    onCheckedChange={() => updateField('gestanteNaFamilia', false)}
                  />
                  <Label>Não</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.gestanteNaFamilia === true}
                    onCheckedChange={() => updateField('gestanteNaFamilia', true)}
                  />
                  <Label>Sim. Meses:</Label>
                  <Input
                    type="text"
                    placeholder="Meses"
                    className="w-24"
                  />
                </div>
              </div>
            </div>

            {localData.gestanteNaFamilia && (
              <>
                <div>
                  <Label className="mb-3 block">Especificidades:</Label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.gestacaoRisco}
                        onCheckedChange={(checked) => updateField('gestacaoRisco', !!checked)}
                      />
                      <Label>Gestação de risco</Label>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={localData.realizaPreNatal}
                          onCheckedChange={(checked) => updateField('realizaPreNatal', !!checked)}
                        />
                        <Label>Realiza pré-natal</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={!localData.realizaPreNatal}
                          onCheckedChange={(checked) => updateField('realizaPreNatal', !checked)}
                        />
                        <Label>Não realiza pré-natal. Motivo:</Label>
                        <Input
                          value={localData.naoRealizaPreNatalMotivo}
                          onChange={(e) => updateField('naoRealizaPreNatalMotivo', e.target.value)}
                          placeholder="Motivo"
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Data do registro:</Label>
                  <Input
                    type="date"
                    value={localData.dataRegistro}
                    onChange={(e) => updateField('dataRegistro', e.target.value)}
                    className="max-w-xs"
                  />
                </div>

                <div>
                  <Label>Demais informações relevantes:</Label>
                  <Textarea
                    value={localData.demaisInformacoesRelevantes}
                    onChange={(e) => updateField('demaisInformacoesRelevantes', e.target.value)}
                    placeholder="Informações adicionais sobre maternidade"
                    rows={3}
                  />
                </div>
              </>
            )}
            </ReadOnlyWrapper>
          </CardContent>
        </Card>

          <div className="flex justify-between">
            <Button onClick={onBack} variant="outline" className="gap-2 border-gray-300">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            <Button onClick={onNext} className="gap-2 bg-blue-600 hover:bg-blue-700">
              Próximo: Desproteções Sociais
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
