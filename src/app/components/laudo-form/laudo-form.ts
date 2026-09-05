import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { EQUIPAMENTOS } from '../../core/data/equipamentos.data';
import {
  CampoMedicao,
  DadosLaudo,
  GrupoResumo,
  LinhaResumo,
  TipoEquipamento,
} from '../../core/models/laudo.model';
import { PdfService } from '../../core/services/pdf.service';
import { EnvioService } from '../../core/services/envio.service';

type CanalEnvio = 'whatsapp' | 'email' | 'download';

@Component({
  selector: 'app-laudo-form',
  imports: [ReactiveFormsModule],
  templateUrl: './laudo-form.html',
  styleUrl: './laudo-form.scss',
})
export class LaudoForm {
  private readonly fb = inject(FormBuilder);
  private readonly pdf = inject(PdfService);
  private readonly envio = inject(EnvioService);

  readonly equipamentos = EQUIPAMENTOS;
  readonly passos = ['Cliente & Subestação', 'Equipamento', 'Medições', 'Revisão & Envio'];

  // --- estado do assistente ---
  readonly passo = signal(0);
  readonly tipo = signal<TipoEquipamento>('disjuntor');
  readonly gerado = signal(false);
  readonly canal = signal<CanalEnvio | null>(null);

  readonly definicao = computed(
    () => this.equipamentos.find((e) => e.tipo === this.tipo()) ?? this.equipamentos[0],
  );

  /** lista achatada dos campos de medição do equipamento atual (seções ou lista única) */
  readonly camposMedicao = computed<CampoMedicao[]>(() => {
    const def = this.definicao();
    return def.secoes ? def.secoes.flatMap((s) => s.campos) : (def.campos ?? []);
  });

  readonly camposIdentificacaoExtra = computed(() => this.definicao().camposIdentificacao ?? []);

  // --- formulários ---
  readonly identForm = this.fb.nonNullable.group({
    cliente: '',
    cnpj: '',
    subestacao: '',
    local: '',
    data: '',
    responsavel: '',
    fabricante: '',
    modelo: '',
    tag: '',
    serie: '',
    tensao: '',
    // dados de placa do transformador
    tensaoPrimaria: '',
    tensaoSecundaria: '',
    potencia: '',
    peso: '',
    volumeDeOleo: '',
    relacaoTransformacao: '',
    tipoDeTensao: 'Alta – Baixa',
    tipoDeFechamento: 'Triângulo – Estrela',
  });

  readonly obs = this.fb.nonNullable.control('');

  medicaoForm: FormGroup = this.fb.group({});

  constructor() {
    this.reconstruirMedicao();
  }

  private reconstruirMedicao(): void {
    const grupo: Record<string, unknown> = {};
    for (const campo of this.camposMedicao()) {
      grupo[campo.chave] = '';
      if (campo.escalas?.length) {
        grupo[`${campo.chave}__escala`] = campo.escalas[0];
      }
    }
    this.medicaoForm = this.fb.nonNullable.group(grupo);
  }

  // --- navegação ---
  selecionarTipo(tipo: TipoEquipamento): void {
    if (tipo === this.tipo()) return;
    this.tipo.set(tipo);
    this.reconstruirMedicao();
  }

  irPara(indice: number): void {
    this.passo.set(indice);
  }

  voltar(): void {
    this.passo.update((p) => Math.max(0, p - 1));
  }

  get rotuloPrimario(): string {
    return this.passo() < 3 ? 'Próximo →' : 'Gerar laudo em PDF';
  }

  acaoPrimaria(): void {
    if (this.passo() < 3) {
      this.passo.update((p) => Math.min(3, p + 1));
      return;
    }
    void this.gerar();
  }

  passoAtivo(indice: number): boolean {
    return this.passo() === indice;
  }

  passoConcluido(indice: number): boolean {
    return this.passo() > indice;
  }

  // --- geração / envio ---
  private montarDados(): DadosLaudo {
    const ident = this.identForm.getRawValue();
    return {
      ...ident,
      numero: this.numeroLaudo,
      emitidoEm: new Date().toLocaleString('pt-BR'),
      tipo: this.tipo(),
      equipamento: this.definicao().nome,
      observacoes: this.obs.value,
      medicoes: this.medicaoForm.getRawValue() as Record<string, string>,
      identificacao: this.blocoIdentificacao(),
      equipamentoInfo: this.blocoEquipamento(),
      medicoesGrupos: this.blocoMedicoes(),
    };
  }

  async gerar(): Promise<void> {
    await this.pdf.gerar(this.montarDados());
    this.canal.set(null);
    this.gerado.set(true);
  }

  enviarWhatsApp(): void {
    this.envio.whatsapp(this.montarDados());
    this.canal.set('whatsapp');
  }

  enviarEmail(): void {
    this.envio.email(this.montarDados());
    this.canal.set('email');
  }

  baixar(): void {
    void this.pdf.baixar(this.montarDados());
    this.canal.set('download');
  }

  reiniciar(): void {
    this.gerado.set(false);
    this.canal.set(null);
    this.passo.set(0);
  }

  // --- número / mensagens ---
  readonly numeroLaudo = this.pdf.proximoNumero();

  readonly mensagemEnvio = computed(() => {
    switch (this.canal()) {
      case 'whatsapp':
        return `Abrindo o WhatsApp do cliente com ${this.numeroLaudo}.pdf anexado…`;
      case 'email':
        return `Enviando ${this.numeroLaudo}.pdf para o e-mail cadastrado do cliente…`;
      case 'download':
        return `Baixando ${this.numeroLaudo}.pdf…`;
      default:
        return '';
    }
  });

  // --- resumo (passo Revisão + payload do PDF) ---
  private static readonly TRACO = '—';

  private valorComUnidade(valor: string | undefined, unidade?: string): string {
    const v = (valor ?? '').trim();
    if (!v) return LaudoForm.TRACO;
    return unidade ? `${v} ${unidade}` : v;
  }

  blocoIdentificacao(): LinhaResumo[] {
    const f = this.identForm.getRawValue();
    const t = LaudoForm.TRACO;
    return [
      { rotulo: 'Cliente', valor: f.cliente || t },
      { rotulo: 'CNPJ', valor: f.cnpj || t },
      { rotulo: 'Subestação', valor: f.subestacao || t },
      { rotulo: 'Endereço / local', valor: f.local || t },
      { rotulo: 'Data do ensaio', valor: f.data || t },
      { rotulo: 'Responsável técnico', valor: f.responsavel || t },
    ];
  }

  blocoEquipamento(): LinhaResumo[] {
    const f = this.identForm.getRawValue() as Record<string, string>;
    const t = LaudoForm.TRACO;
    const linhas: LinhaResumo[] = [
      { rotulo: 'Equipamento', valor: this.definicao().nome },
      { rotulo: 'Fabricante', valor: f['fabricante'] || t },
      { rotulo: 'Modelo', valor: f['modelo'] || t },
      { rotulo: 'TAG', valor: f['tag'] || t },
      { rotulo: 'Nº de série', valor: f['serie'] || t },
    ];

    const extras = this.camposIdentificacaoExtra();
    if (extras.length) {
      for (const c of extras) {
        linhas.push({ rotulo: c.rotulo, valor: this.valorComUnidade(f[c.chave], c.unidade) });
      }
    } else {
      linhas.push({ rotulo: 'Tensão nominal', valor: this.valorComUnidade(f['tensao'], 'kV') });
    }
    return linhas;
  }

  blocoMedicoes(): GrupoResumo[] {
    const valores = this.medicaoForm.getRawValue() as Record<string, string>;
    const fmt = (campo: CampoMedicao): LinhaResumo => {
      const unidade = campo.escalas ? valores[`${campo.chave}__escala`] : campo.unidade;
      const v = (valores[campo.chave] ?? '').trim();
      return {
        rotulo: campo.rotulo,
        valor: v || LaudoForm.TRACO,
        unidade: v ? unidade || '' : '',
      };
    };

    const def = this.definicao();
    if (def.secoes) {
      return def.secoes.map((s) => ({ titulo: s.titulo, linhas: s.campos.map(fmt) }));
    }
    return [{ titulo: 'Ensaios', linhas: (def.campos ?? []).map(fmt) }];
  }

  /** lista plana usada na coluna "Medições" da tela de revisão (valor + unidade juntos) */
  resumoMedicoes(): LinhaResumo[] {
    return this.blocoMedicoes()
      .flatMap((g) => g.linhas)
      .map((l) => ({ rotulo: l.rotulo, valor: l.unidade ? `${l.valor} ${l.unidade}` : l.valor }));
  }

  /** lista combinada usada na coluna "Identificação" da tela de revisão */
  resumoIdentificacao(): LinhaResumo[] {
    return [...this.blocoIdentificacao(), ...this.blocoEquipamento()];
  }
}
