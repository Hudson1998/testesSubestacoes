import { DefinicaoEquipamento } from '../models/laudo.model';

/* ============================================================================
   ⚠️  CONFIGURAÇÃO PROVISÓRIA — AJUSTAR AQUI
   ----------------------------------------------------------------------------
   Esta lista define, para cada equipamento:
     - os ensaios mostrados na seção "Equipamentos" do site;
     - os campos de medição do formulário "Novo laudo" (passo "Medições");
     - a unidade de cada campo.

   Os valores abaixo são ILUSTRATIVOS. Quando o cliente definir os campos
   reais de cada tipo de equipamento (e os critérios de referência), basta
   editar este arquivo — o formulário e a revisão se ajustam sozinhos.
   ============================================================================ */

export const EQUIPAMENTOS: DefinicaoEquipamento[] = [
  {
    tipo: 'disjuntor',
    nome: 'Disjuntor',
    descricao: 'Alta / média tensão',
    ensaios: [
      'Resistência de contato',
      'Tempos de abertura e fechamento',
      'Simultaneidade entre polos',
      'Resistência de isolamento',
    ],
    campos: [
      { chave: 'resistenciaContato', rotulo: 'Resistência de contato', unidade: 'µΩ' },
      { chave: 'tempoAbertura', rotulo: 'Tempo de abertura', unidade: 'ms' },
      { chave: 'tempoFechamento', rotulo: 'Tempo de fechamento', unidade: 'ms' },
      { chave: 'simultaneidade', rotulo: 'Simultaneidade entre polos', unidade: 'ms' },
      { chave: 'resistenciaIsolamento', rotulo: 'Resistência de isolamento', unidade: 'GΩ' },
    ],
  },
  {
    tipo: 'transformador',
    nome: 'Transformador',
    descricao: 'Força / distribuição',
    ensaios: [
      'Relação de transformação (TTR)',
      'Resistência ôhmica dos enrolamentos',
      'Fator de potência do isolamento',
      'Corrente de excitação',
    ],
    campos: [
      { chave: 'relacaoTransformacao', rotulo: 'Relação de transformação (TTR)', unidade: 'ratio' },
      { chave: 'resistenciaAt', rotulo: 'Resistência ôhmica — AT', unidade: 'Ω' },
      { chave: 'resistenciaBt', rotulo: 'Resistência ôhmica — BT', unidade: 'mΩ' },
      { chave: 'fatorPotencia', rotulo: 'Fator de potência do isolamento', unidade: '%' },
      { chave: 'correnteExcitacao', rotulo: 'Corrente de excitação', unidade: 'mA' },
      { chave: 'resistenciaIsolamento', rotulo: 'Resistência de isolamento', unidade: 'GΩ' },
    ],
  },
  {
    tipo: 'chave',
    nome: 'Chave seccionadora',
    descricao: 'Lâmina / abertura',
    ensaios: [
      'Resistência de contato',
      'Resistência de isolamento',
      'Torque de acionamento',
      'Alinhamento das lâminas',
    ],
    campos: [
      { chave: 'resistenciaContato', rotulo: 'Resistência de contato', unidade: 'µΩ' },
      { chave: 'resistenciaIsolamento', rotulo: 'Resistência de isolamento', unidade: 'GΩ' },
      { chave: 'torqueAcionamento', rotulo: 'Torque de acionamento', unidade: 'N·m' },
      { chave: 'alinhamentoLaminas', rotulo: 'Alinhamento das lâminas', unidade: 'mm' },
    ],
  },
];
