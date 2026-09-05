/**
 * Tipos do domínio de laudos de ensaio.
 *
 * A ESTRUTURA DOS CAMPOS AINDA É PROVISÓRIA — os campos reais de identificação
 * e de medição de cada equipamento serão definidos junto com o cliente.
 * Ver `core/data/equipamentos.data.ts`.
 */

export type TipoEquipamento = 'disjuntor' | 'transformador' | 'chave';

/** Um campo de medição registrado no ensaio. */
export interface CampoMedicao {
  /** chave usada no FormGroup e no objeto de dados */
  chave: string;
  /** rótulo exibido no formulário e no PDF */
  rotulo: string;
  /** unidade de medida fixa (µΩ, ms, GΩ, ...) */
  unidade?: string;
  /** escalas selecionáveis; quando presente, mostra um <select> em vez da unidade fixa */
  escalas?: string[];
  /** critério de referência (opcional, entra depois) */
  criterio?: string;
}

/** Bloco de medições agrupadas (usado em equipamentos com muitos ensaios). */
export interface SecaoMedicao {
  titulo: string;
  campos: CampoMedicao[];
}

/** Campo extra de identificação, exibido no passo "Equipamento". */
export interface CampoIdentificacao {
  chave: string;
  rotulo: string;
  placeholder?: string;
  /** unidade fixa exibida junto ao valor (kV, kVA, kg, ...) */
  unidade?: string;
  /** quando presente, renderiza um <select> com estas opções */
  opcoes?: string[];
}

/** Definição de um tipo de equipamento e seus ensaios. */
export interface DefinicaoEquipamento {
  tipo: TipoEquipamento;
  nome: string;
  /** subtítulo curto exibido no seletor */
  descricao: string;
  /** ensaios cobertos, exibidos na seção "Equipamentos" */
  ensaios: string[];
  /** campos extras de placa/identificação para este equipamento */
  camposIdentificacao?: CampoIdentificacao[];
  /** medições em lista única (disjuntor, chave) */
  campos?: CampoMedicao[];
  /** medições agrupadas em seções (transformador) */
  secoes?: SecaoMedicao[];
}

/** Linha rótulo/valor já formatada para exibição e para o PDF. */
export interface LinhaResumo {
  rotulo: string;
  valor: string;
  /** unidade separada do valor (usada na coluna "Unidade" da tabela do PDF) */
  unidade?: string;
}

/** Grupo de linhas de medição (uma seção do ensaio). */
export interface GrupoResumo {
  titulo: string;
  linhas: LinhaResumo[];
}

/** Payload consolidado do laudo (entrada para geração de PDF / envio). */
export interface DadosLaudo {
  numero: string;
  emitidoEm: string;

  tipo: TipoEquipamento;
  equipamento: string;
  /** nome do responsável técnico — usado na assinatura */
  responsavel: string;
  observacoes: string;

  /** valores brutos das medições (chave -> valor) */
  medicoes: Record<string, string>;

  /** blocos já formatados para o documento */
  identificacao: LinhaResumo[];
  equipamentoInfo: LinhaResumo[];
  medicoesGrupos: GrupoResumo[];

  /** ligação do transformador — orienta o desenho do esquema no PDF */
  tipoDeTensao?: string;
  tipoDeFechamento?: string;
}
