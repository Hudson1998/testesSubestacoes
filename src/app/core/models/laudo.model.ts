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
  /** unidade de medida (µΩ, ms, GΩ, ...) */
  unidade: string;
  /** critério de referência (opcional, entra depois) */
  criterio?: string;
}

/** Definição de um tipo de equipamento e seus ensaios. */
export interface DefinicaoEquipamento {
  tipo: TipoEquipamento;
  nome: string;
  /** subtítulo curto exibido no seletor */
  descricao: string;
  /** ensaios cobertos, exibidos na seção "Equipamentos" */
  ensaios: string[];
  /** campos de medição do formulário */
  campos: CampoMedicao[];
}

/** Payload consolidado do laudo (entrada para geração de PDF / envio). */
export interface DadosLaudo {
  cliente: string;
  cnpj: string;
  subestacao: string;
  local: string;
  data: string;
  responsavel: string;

  tipo: TipoEquipamento;
  equipamento: string;
  fabricante: string;
  modelo: string;
  tag: string;
  serie: string;
  tensao: string;

  observacoes: string;
  medicoes: Record<string, string>;
}
