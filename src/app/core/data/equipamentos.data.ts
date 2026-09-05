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
      'Resistência de contato das buchas (AT / BT)',
      'Resistência de isolamento (AT, BT, massa)',
      'Condições ambientais registradas',
    ],
    camposIdentificacao: [
      { chave: 'tensaoPrimaria', rotulo: 'Tensão primária — AT', unidade: 'kV', placeholder: 'kV' },
      { chave: 'tensaoSecundaria', rotulo: 'Tensão secundária — BT', unidade: 'V', placeholder: 'V' },
      { chave: 'potencia', rotulo: 'Potência', unidade: 'kVA', placeholder: 'kVA' },
      { chave: 'relacaoTransformacao', rotulo: 'Relação de transformação (placa)', placeholder: 'ex.: 13,8 kV / 380 V' },
      {
        chave: 'tipoDeTensao',
        rotulo: 'Tipo de tensão (AT–BT)',
        opcoes: [
          'Baixa – Baixa',
          'Alta – Baixa',
          'Baixa – Alta',
          'Alta – Alta',
          'Média – Baixa',
          'Alta – Média',
        ],
      },
      {
        chave: 'tipoDeFechamento',
        rotulo: 'Tipo de fechamento (ligação)',
        opcoes: [
          'Triângulo – Estrela',
          'Estrela – Triângulo',
          'Estrela – Estrela',
          'Triângulo – Triângulo',
          'Ziguezague – Estrela',
          'Ziguezague – Triângulo',
          'Triângulo – Ziguezague',
          'Estrela – Ziguezague',
        ],
      },
      { chave: 'peso', rotulo: 'Peso total', unidade: 'kg', placeholder: 'kg' },
      { chave: 'volumeDeOleo', rotulo: 'Volume de óleo', unidade: 'L', placeholder: 'L' },
    ],
    secoes: [
      {
        titulo: 'CONDIÇÕES E RELAÇÃO',
        campos: [
          { chave: 'relacaoTransformacaoMedida', rotulo: 'Relação de transformação medida', unidade: 'ratio' },
          { chave: 'temperaturaAmbiente', rotulo: 'Temperatura ambiente', unidade: '°C' },
          { chave: 'umidadeAmbiente', rotulo: 'Umidade ambiente', unidade: '%' },
        ],
      },
      {
        titulo: 'RESISTÊNCIA DE CONTATO — AT (BUCHAS H)',
        campos: [
          { chave: 'rcH1H2', rotulo: 'H1 – H2', unidade: 'Ω' },
          { chave: 'rcH2H3', rotulo: 'H2 – H3', unidade: 'Ω' },
          { chave: 'rcH1H3', rotulo: 'H1 – H3', unidade: 'Ω' },
        ],
      },
      {
        titulo: 'RESISTÊNCIA DE CONTATO — BT (BUCHAS X)',
        campos: [
          { chave: 'rcX0X1', rotulo: 'X0 – X1', unidade: 'mΩ' },
          { chave: 'rcX0X2', rotulo: 'X0 – X2', unidade: 'mΩ' },
          { chave: 'rcX0X3', rotulo: 'X0 – X3', unidade: 'mΩ' },
        ],
      },
      {
        titulo: 'TTR — RELAÇÃO POR TAPE',
        campos: [
          { chave: 'ttr1', rotulo: 'Medição 1', unidade: 'ratio' },
          { chave: 'ttr2', rotulo: 'Medição 2', unidade: 'ratio' },
          { chave: 'ttr3', rotulo: 'Medição 3', unidade: 'ratio' },
        ],
      },
      {
        titulo: 'RESISTÊNCIA DE ISOLAMENTO',
        campos: [
          {
            chave: 'riAtMassaGuardaBt',
            rotulo: 'AT → massa (guarda BT)',
            escalas: ['GΩ', 'MΩ', 'TΩ'],
          },
          {
            chave: 'riAtBtGuardaMassa',
            rotulo: 'AT → BT (guarda massa)',
            escalas: ['GΩ', 'MΩ', 'TΩ'],
          },
          {
            chave: 'riBtAtGuardaMassa',
            rotulo: 'BT → AT (guarda massa)',
            escalas: ['GΩ', 'MΩ', 'TΩ'],
          },
        ],
      },
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
