import { useState } from 'react';
import { ServicesData } from '../types/family';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Header } from './Header';
import { ReadOnlyWrapper } from './ReadOnlyWrapper';

interface ServicesFormProps {
  data: ServicesData;
  onChange: (data: ServicesData) => void;
  onNext: () => void;
  onBack: () => void;
  readOnly?: boolean;
}

export function ServicesForm({ data, onChange, onNext, onBack, readOnly = false }: ServicesFormProps) {
  const [localData, setLocalData] = useState<ServicesData>(data);

  const updateField = (field: keyof ServicesData, value: any) => {
    const updated = { ...localData, [field]: value };
    setLocalData(updated);
    onChange(updated);
  };

  const updateNestedField = (parent: keyof ServicesData, field: string, value: any) => {
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
            <h1 className="text-blue-900 mb-2">Continuação - Condições de Moradia e Serviços</h1>
          </div>

          <Card className="mb-6 shadow-lg border-blue-100">
            <CardHeader className="bg-gradient-to-br from-blue-50 to-white">
              <CardTitle className="text-blue-900">Infraestrutura e Condições</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <ReadOnlyWrapper readOnly={readOnly}>
              <div>
                <Label className="mb-3 block">Tipo de Iluminação:</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={localData.tipoIluminacao.relogioProprio}
                      onCheckedChange={(checked) => updateNestedField('tipoIluminacao', 'relogioProprio', checked)}
                    />
                    <Label>Relógio Próprio</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={localData.tipoIluminacao.relogioComunitario}
                      onCheckedChange={(checked) => updateNestedField('tipoIluminacao', 'relogioComunitario', checked)}
                    />
                    <Label>Relógio Comunitário</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={localData.tipoIluminacao.irregular}
                      onCheckedChange={(checked) => updateNestedField('tipoIluminacao', 'irregular', checked)}
                    />
                    <Label>Irregular</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={localData.tipoIluminacao.suspenso}
                      onCheckedChange={(checked) => updateNestedField('tipoIluminacao', 'suspenso', checked)}
                    />
                    <Label>Suspenso</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={localData.tipoIluminacao.vela}
                      onCheckedChange={(checked) => updateNestedField('tipoIluminacao', 'vela', checked)}
                    />
                    <Label>Vela</Label>
                  </div>
                  <div className="flex items-center gap-2 md:col-span-2">
                    <Checkbox
                      checked={localData.tipoIluminacao.outros}
                      onCheckedChange={(checked) => updateNestedField('tipoIluminacao', 'outros', checked)}
                    />
                    <Label>Outros:</Label>
                    <Input
                      value={localData.tipoIluminacao.outrosEspecificar}
                      onChange={(e) => updateNestedField('tipoIluminacao', 'outrosEspecificar', e.target.value)}
                      placeholder="Especifique"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label className="mb-3 block">Destino do lixo:</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.destinoLixo.coletado}
                        onCheckedChange={(checked) => updateNestedField('destinoLixo', 'coletado', checked)}
                      />
                      <Label>Coletado</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.destinoLixo.queimado}
                        onCheckedChange={(checked) => updateNestedField('destinoLixo', 'queimado', checked)}
                      />
                      <Label>Queimado</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.destinoLixo.enterrado}
                        onCheckedChange={(checked) => updateNestedField('destinoLixo', 'enterrado', checked)}
                      />
                      <Label>Enterrado</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.destinoLixo.ceuAberto}
                        onCheckedChange={(checked) => updateNestedField('destinoLixo', 'ceuAberto', checked)}
                      />
                      <Label>Céu Aberto</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.destinoLixo.comunitario}
                        onCheckedChange={(checked) => updateNestedField('destinoLixo', 'comunitario', checked)}
                      />
                      <Label>Comunitário</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.destinoLixo.vala}
                        onCheckedChange={(checked) => updateNestedField('destinoLixo', 'vala', checked)}
                      />
                      <Label>Vala</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">Condições de moradia (avaliar in loco):</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.condicoesMoradia.boa}
                        onCheckedChange={(checked) => updateNestedField('condicoesMoradia', 'boa', checked)}
                      />
                      <Label>Boa</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.condicoesMoradia.precaria}
                        onCheckedChange={(checked) => updateNestedField('condicoesMoradia', 'precaria', checked)}
                      />
                      <Label>Precária</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.condicoesMoradia.insalubre}
                        onCheckedChange={(checked) => updateNestedField('condicoesMoradia', 'insalubre', checked)}
                      />
                      <Label>Insalubre</Label>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label className="mb-3 block">Acessibilidade:</Label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={localData.acessibilidade.total}
                          onCheckedChange={(checked) => updateNestedField('acessibilidade', 'total', checked)}
                        />
                        <Label>Total</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={localData.acessibilidade.parcial}
                          onCheckedChange={(checked) => updateNestedField('acessibilidade', 'parcial', checked)}
                        />
                        <Label>Parcial</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={localData.acessibilidade.naoHa}
                          onCheckedChange={(checked) => updateNestedField('acessibilidade', 'naoHa', checked)}
                        />
                        <Label>Não há</Label>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div>
                    <Label>Tipo de construção:</Label>
                    <Input
                      value={localData.tipoConstrucao}
                      onChange={(e) => updateField('tipoConstrucao', e.target.value)}
                      placeholder="Especifique"
                    />
                  </div>

                  <div className="mt-4">
                    <Label className="mb-3 block">Localidade:</Label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={localData.localidade.urbana}
                          onCheckedChange={(checked) => updateNestedField('localidade', 'urbana', checked)}
                        />
                        <Label>Urbana</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={localData.localidade.rural}
                          onCheckedChange={(checked) => updateNestedField('localidade', 'rural', checked)}
                        />
                        <Label>Rural</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={localData.localidade.tijolo}
                          onCheckedChange={(checked) => updateNestedField('localidade', 'tijolo', checked)}
                        />
                        <Label>Tijolo</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={localData.localidade.madeira}
                          onCheckedChange={(checked) => updateNestedField('localidade', 'madeira', checked)}
                        />
                        <Label>Madeira</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={localData.localidade.outros}
                          onCheckedChange={(checked) => updateNestedField('localidade', 'outros', checked)}
                        />
                        <Label>Outros</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </ReadOnlyWrapper>
            </CardContent>
          </Card>

          <Card className="mb-6 shadow-lg border-blue-100">
            <CardHeader className="bg-gradient-to-br from-blue-50 to-white">
              <CardTitle className="text-blue-900">VI- INCLUSÃO EM SERVIÇOS, PROGRAMAS, BENEFÍCIOS E PROJETOS SOCIOASSISTENCIAIS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <ReadOnlyWrapper readOnly={readOnly}>
              <div>
                <Label className="mb-3 block">Programas e benefícios:</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={localData.programasBeneficios.irc}
                      onCheckedChange={(checked) => updateNestedField('programasBeneficios', 'irc', checked)}
                    />
                    <Label>IRC</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={localData.programasBeneficios.aj}
                      onCheckedChange={(checked) => updateNestedField('programasBeneficios', 'aj', checked)}
                    />
                    <Label>AJ</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={localData.programasBeneficios.vivaLeite}
                      onCheckedChange={(checked) => updateNestedField('programasBeneficios', 'vivaLeite', checked)}
                    />
                    <Label>Viva Leite</Label>
                  </div>
                  <div className="flex items-center gap-2 md:col-span-2">
                    <Label>BF Valor R$:</Label>
                    <Input
                      value={localData.programasBeneficios.bfValorRS}
                      onChange={(e) => updateNestedField('programasBeneficios', 'bfValorRS', e.target.value)}
                      placeholder="Valor"
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={localData.programasBeneficios.bpcPcd}
                      onCheckedChange={(checked) => updateNestedField('programasBeneficios', 'bpcPcd', checked)}
                    />
                    <Label>BPC - PCD</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={localData.programasBeneficios.bpcIdoso}
                      onCheckedChange={(checked) => updateNestedField('programasBeneficios', 'bpcIdoso', checked)}
                    />
                    <Label>BPC - Idoso</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={localData.programasBeneficios.passeLivre}
                      onCheckedChange={(checked) => updateNestedField('programasBeneficios', 'passeLivre', checked)}
                    />
                    <Label>Passe Livre</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={localData.programasBeneficios.nenhum}
                      onCheckedChange={(checked) => updateNestedField('programasBeneficios', 'nenhum', checked)}
                    />
                    <Label>Nenhum</Label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label className="mb-3 block">SCFV – criança, adolescente e pessoa idosa:</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.scfv.cci}
                        onCheckedChange={(checked) => updateNestedField('scfv', 'cci', checked)}
                      />
                      <Label>CCI</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.scfv.scfvDireta}
                        onCheckedChange={(checked) => updateNestedField('scfv', 'scfvDireta', checked)}
                      />
                      <Label>SCFV- direta</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.scfv.fac}
                        onCheckedChange={(checked) => updateNestedField('scfv', 'fac', checked)}
                      />
                      <Label>FAC</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.scfv.legiaoMirim}
                        onCheckedChange={(checked) => updateNestedField('scfv', 'legiaoMirim', checked)}
                      />
                      <Label>Legião Mirim</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.scfv.casaCrianca}
                        onCheckedChange={(checked) => updateNestedField('scfv', 'casaCrianca', checked)}
                      />
                      <Label>Casa da Criança</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.scfv.colmeia}
                        onCheckedChange={(checked) => updateNestedField('scfv', 'colmeia', checked)}
                      />
                      <Label>Colméia</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.scfv.proMeninas}
                        onCheckedChange={(checked) => updateNestedField('scfv', 'proMeninas', checked)}
                      />
                      <Label>Pró - Meninas</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.scfv.outra}
                        onCheckedChange={(checked) => updateNestedField('scfv', 'outra', checked)}
                      />
                      <Label>Outra</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">Serviços – Média complexidade:</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.servicosMediaComplexidade.apae}
                        onCheckedChange={(checked) => updateNestedField('servicosMediaComplexidade', 'apae', checked)}
                      />
                      <Label>A.P.A.E</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.servicosMediaComplexidade.escolaAutista}
                        onCheckedChange={(checked) => updateNestedField('servicosMediaComplexidade', 'escolaAutista', checked)}
                      />
                      <Label>Escola do Autista</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.servicosMediaComplexidade.centroDiaIdoso}
                        onCheckedChange={(checked) => updateNestedField('servicosMediaComplexidade', 'centroDiaIdoso', checked)}
                      />
                      <Label>Centro Dia do Idoso</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.servicosMediaComplexidade.centroPop}
                        onCheckedChange={(checked) => updateNestedField('servicosMediaComplexidade', 'centroPop', checked)}
                      />
                      <Label>Centro Pop</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.servicosMediaComplexidade.outro}
                        onCheckedChange={(checked) => updateNestedField('servicosMediaComplexidade', 'outro', checked)}
                      />
                      <Label>Outro</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">Serviços – Alta complexidade:</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.servicosAltaComplexidade.vilaSaoVicentePaula}
                        onCheckedChange={(checked) => updateNestedField('servicosAltaComplexidade', 'vilaSaoVicentePaula', checked)}
                      />
                      <Label>Vila São Vicente de Paula</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.servicosAltaComplexidade.saoLourenco}
                        onCheckedChange={(checked) => updateNestedField('servicosAltaComplexidade', 'saoLourenco', checked)}
                      />
                      <Label>São Lourenço</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.servicosAltaComplexidade.vilaDignidade}
                        onCheckedChange={(checked) => updateNestedField('servicosAltaComplexidade', 'vilaDignidade', checked)}
                      />
                      <Label>Vila Dignidade</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.servicosAltaComplexidade.nossoLarI}
                        onCheckedChange={(checked) => updateNestedField('servicosAltaComplexidade', 'nossoLarI', checked)}
                      />
                      <Label>Nosso Lar I</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.servicosAltaComplexidade.nossoLarII}
                        onCheckedChange={(checked) => updateNestedField('servicosAltaComplexidade', 'nossoLarII', checked)}
                      />
                      <Label>Nosso Lar II</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.servicosAltaComplexidade.acolhimentoAdultos}
                        onCheckedChange={(checked) => updateNestedField('servicosAltaComplexidade', 'acolhimentoAdultos', checked)}
                      />
                      <Label>Acolhimento para adultos</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.servicosAltaComplexidade.republicaJovensFeminino}
                        onCheckedChange={(checked) => updateNestedField('servicosAltaComplexidade', 'republicaJovensFeminino', checked)}
                      />
                      <Label>República para jovens</Label>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label className="mb-3 block">Descontos Tarifários:</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={localData.descontosTarifarios.tarifaSocialEnergia}
                      onCheckedChange={(checked) => updateNestedField('descontosTarifarios', 'tarifaSocialEnergia', checked)}
                    />
                    <Label>Tarifa Social energia</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={localData.descontosTarifarios.tarifaSocialAgua}
                      onCheckedChange={(checked) => updateNestedField('descontosTarifarios', 'tarifaSocialAgua', checked)}
                    />
                    <Label>Tarifa Social água</Label>
                  </div>
                </div>
              </div>
              </ReadOnlyWrapper>
            </CardContent>
          </Card>

          <Card className="mb-6 shadow-lg border-blue-100">
            <CardHeader className="bg-gradient-to-br from-blue-50 to-white">
              <CardTitle className="text-blue-900">VII- ACESSO A SERVIÇOS, PROGRAMAS E PROJETOS EDUCACIONAIS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <ReadOnlyWrapper readOnly={readOnly}>
              <div>
                <Label className="mb-3 block">Educação Regular:</Label>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={localData.educacaoRegular.criancasAdolescentesEscola}
                      onCheckedChange={(checked) => updateNestedField('educacaoRegular', 'criancasAdolescentesEscola', checked)}
                    />
                    <Label>Crianças e adolescentes com idade escolar estão inseridas na escola</Label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.educacaoRegular.publica}
                        onCheckedChange={(checked) => updateNestedField('educacaoRegular', 'publica', checked)}
                      />
                      <Label>Pública</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.educacaoRegular.particular}
                        onCheckedChange={(checked) => updateNestedField('educacaoRegular', 'particular', checked)}
                      />
                      <Label>Particular</Label>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.educacaoRegular.evasaoEscolarCrianca}
                        onCheckedChange={(checked) => updateNestedField('educacaoRegular', 'evasaoEscolarCrianca', checked)}
                      />
                      <Label>Há evasão escolar de criança</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={localData.educacaoRegular.evasaoEscolarAdolescente}
                        onCheckedChange={(checked) => updateNestedField('educacaoRegular', 'evasaoEscolarAdolescente', checked)}
                      />
                      <Label>Há evasão escolar de adolescente</Label>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label className="mb-3 block">Outras ações:</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={localData.outrasAcoesEducacao.escola}
                      onCheckedChange={(checked) => updateNestedField('outrasAcoesEducacao', 'escola', checked)}
                    />
                    <Label>Escola</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={localData.outrasAcoesEducacao.nao}
                      onCheckedChange={(checked) => updateNestedField('outrasAcoesEducacao', 'nao', checked)}
                    />
                    <Label>Não</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={localData.outrasAcoesEducacao.regular}
                      onCheckedChange={(checked) => updateNestedField('outrasAcoesEducacao', 'regular', checked)}
                    />
                    <Label>Regular</Label>
                  </div>
                  <div className="flex items-center gap-2 md:col-span-2">
                    <Checkbox
                      checked={localData.outrasAcoesEducacao.outrosProjetosEducacao}
                      onCheckedChange={(checked) => updateNestedField('outrasAcoesEducacao', 'outrosProjetosEducacao', checked)}
                    />
                    <Label>Outros projetos, serviços e programas da área da educação</Label>
                  </div>
                  <div className="flex items-center gap-2 md:col-span-3">
                    <Checkbox
                      checked={localData.outrasAcoesEducacao.outraSituacao}
                      onCheckedChange={(checked) => updateNestedField('outrasAcoesEducacao', 'outraSituacao', checked)}
                    />
                    <Label>Outra situação. Especificar:</Label>
                    <Input
                      value={localData.outrasAcoesEducacao.outraSituacaoEspecificar}
                      onChange={(e) => updateNestedField('outrasAcoesEducacao', 'outraSituacaoEspecificar', e.target.value)}
                      placeholder="Especifique"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              </ReadOnlyWrapper>
            </CardContent>
          </Card>

          <Card className="mb-6 shadow-lg border-blue-100">
            <CardHeader className="bg-gradient-to-br from-blue-50 to-white">
              <CardTitle className="text-blue-900">VIII - ACESSO A SERVIÇOS, DA ÁREA DA SAÚDE</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <ReadOnlyWrapper readOnly={readOnly}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.acessoSaude.capsAdII}
                    onCheckedChange={(checked) => updateNestedField('acessoSaude', 'capsAdII', checked)}
                  />
                  <Label>CAPS AD II</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.acessoSaude.casaRosa}
                    onCheckedChange={(checked) => updateNestedField('acessoSaude', 'casaRosa', checked)}
                  />
                  <Label>Casa Rosa</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.acessoSaude.sus}
                    onCheckedChange={(checked) => updateNestedField('acessoSaude', 'sus', checked)}
                  />
                  <Label>SUS</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.acessoSaude.secretariaSaude}
                    onCheckedChange={(checked) => updateNestedField('acessoSaude', 'secretariaSaude', checked)}
                  />
                  <Label>Secretaria da Saúde</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.acessoSaude.ceo}
                    onCheckedChange={(checked) => updateNestedField('acessoSaude', 'ceo', checked)}
                  />
                  <Label>CEO</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.acessoSaude.prontoSocorro}
                    onCheckedChange={(checked) => updateNestedField('acessoSaude', 'prontoSocorro', checked)}
                  />
                  <Label>Pronto Socorro</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.acessoSaude.bancoLeite}
                    onCheckedChange={(checked) => updateNestedField('acessoSaude', 'bancoLeite', checked)}
                  />
                  <Label>Banco de Leite</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.acessoSaude.outros}
                    onCheckedChange={(checked) => updateNestedField('acessoSaude', 'outros', checked)}
                  />
                  <Label>Outros</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.acessoSaude.policlinica}
                    onCheckedChange={(checked) => updateNestedField('acessoSaude', 'policlinica', checked)}
                  />
                  <Label>Policlínica</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.acessoSaude.pasubs}
                    onCheckedChange={(checked) => updateNestedField('acessoSaude', 'pasubs', checked)}
                  />
                  <Label>P.A.S.U.B.S</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.acessoSaude.nga}
                    onCheckedChange={(checked) => updateNestedField('acessoSaude', 'nga', checked)}
                  />
                  <Label>N.G.A</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.acessoSaude.hospitalAmaralCarvalho}
                    onCheckedChange={(checked) => updateNestedField('acessoSaude', 'hospitalAmaralCarvalho', checked)}
                  />
                  <Label>Hospital Amaral Carvalho</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.acessoSaude.hospitalTerezaPerletti}
                    onCheckedChange={(checked) => updateNestedField('acessoSaude', 'hospitalTerezaPerletti', checked)}
                  />
                  <Label>Hospital Tereza Perletti</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.acessoSaude.santaCasaJahu}
                    onCheckedChange={(checked) => updateNestedField('acessoSaude', 'santaCasaJahu', checked)}
                  />
                  <Label>Santa Casa de Jahu</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.acessoSaude.comunidadeTerapeutica}
                    onCheckedChange={(checked) => updateNestedField('acessoSaude', 'comunidadeTerapeutica', checked)}
                  />
                  <Label>Comunidade Terapêutica</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.acessoSaude.unimed}
                    onCheckedChange={(checked) => updateNestedField('acessoSaude', 'unimed', checked)}
                  />
                  <Label>UNIMED</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={localData.acessoSaude.redePrivada}
                    onCheckedChange={(checked) => updateNestedField('acessoSaude', 'redePrivada', checked)}
                  />
                  <Label>Rede Privada</Label>
                </div>
              </div>

              <div>
                <Label>Serviços de saúde de outros municípios. Especificar:</Label>
                <Textarea
                  value={localData.servicosSaudeOutrosMunicipios}
                  onChange={(e) => updateField('servicosSaudeOutrosMunicipios', e.target.value)}
                  placeholder="Especifique os serviços de outros municípios"
                  rows={2}
                />
              </div>
              </ReadOnlyWrapper>
            </CardContent>
          </Card>

          <Card className="mb-6 shadow-lg border-blue-100">
            <CardHeader className="bg-gradient-to-br from-blue-50 to-white">
              <CardTitle className="text-blue-900">IX- SERVIÇOS NO ÂMBITO DA SEGURANÇA PÚBLICA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <ReadOnlyWrapper readOnly={readOnly}>
              <div>
                <Label className="mb-3 block">Unidades prisionais – penitenciárias:</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={localData.segurancaPublica.regimeAberto}
                      onCheckedChange={(checked) => updateNestedField('segurancaPublica', 'regimeAberto', checked)}
                    />
                    <Label>Regime aberto</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={localData.segurancaPublica.regimeFechado}
                      onCheckedChange={(checked) => updateNestedField('segurancaPublica', 'regimeFechado', checked)}
                    />
                    <Label>Regime fechado</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={localData.segurancaPublica.cdp}
                      onCheckedChange={(checked) => updateNestedField('segurancaPublica', 'cdp', checked)}
                    />
                    <Label>Centro de Detenção Penitenciária (CDP)</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={localData.segurancaPublica.cpp}
                      onCheckedChange={(checked) => updateNestedField('segurancaPublica', 'cpp', checked)}
                    />
                    <Label>Centro de Progressão Penitenciária (CPP)</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={localData.segurancaPublica.fundacaoCasa}
                      onCheckedChange={(checked) => updateNestedField('segurancaPublica', 'fundacaoCasa', checked)}
                    />
                    <Label>Fundação Casa</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={localData.segurancaPublica.unidadeSemiliberdade}
                      onCheckedChange={(checked) => updateNestedField('segurancaPublica', 'unidadeSemiliberdade', checked)}
                    />
                    <Label>Unidade de Semiliberdade -adolescente</Label>
                  </div>
                  <div className="flex items-center gap-2 md:col-span-3">
                    <Checkbox
                      checked={localData.segurancaPublica.outrosSeguranca}
                      onCheckedChange={(checked) => updateNestedField('segurancaPublica', 'outrosSeguranca', checked)}
                    />
                    <Label>Outros:</Label>
                    <Input
                      value={localData.segurancaPublica.outrosSegurancaEspecificar}
                      onChange={(e) => updateNestedField('segurancaPublica', 'outrosSegurancaEspecificar', e.target.value)}
                      placeholder="Especifique"
                      className="flex-1"
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
            <Button onClick={onNext} className="gap-2 bg-blue-600 hover:bg-blue-700">
              Próximo: Realidade Socioeconômica
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
