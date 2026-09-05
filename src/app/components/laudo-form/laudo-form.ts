import { Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
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

  private readonly topoWizard = viewChild<ElementRef<HTMLElement>>('topoWizard');

  /** rola a viewport de volta ao topo do assistente ao mudar de passo / gerar o laudo */
  private irAoTopo(): void {
    const el = this.topoWizard()?.nativeElement;
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // --- formulários ---
  /** dados do cliente / subestação / responsável — compartilhados por todos os equipamentos */
  readonly clienteForm = this.fb.nonNullable.group({
    clienteNome: '',
    clienteEndereco: '',
    clienteTelefone: '',
    clienteEmail: '',
    seNome: '',
    seLocalizacao: '',
    seCapacidade: '',
    seTensao: '',
    respNome: '',
    respRegistro: '',
    respTelefone: '',
    respEmail: '',
    dataInspecao: '',
  });

  /** dados do equipamento — isolados por tipo (ver estadoPorTipo) */
  readonly equipForm = this.fb.nonNullable.group(LaudoForm.equipPadrao());

  readonly obs = this.fb.nonNullable.control('');

  medicaoForm: FormGroup = this.fb.group({});

  /** guarda equipamento + medições + observações de cada tipo, para os campos não se misturarem */
  private readonly estadoPorTipo = new Map<
    TipoEquipamento,
    { equip: Record<string, string>; medicao: Record<string, string>; obs: string }
  >();

  private static equipPadrao() {
    return {
      // genéricos
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
      // dados de placa do disjuntor
      tipoDisjuntor: 'Ar (ACB)',
      numeroDePoloPorFase: '1',
      tensaoNominal: '',
      correnteNominal: '',
      capacidadeDeInterrupcao: '',
      dataFabricacao: '',
      nivelDeOleo: 'Baixo',
    };
  }

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
  selecionarTipo(novo: TipoEquipamento): void {
    const atual = this.tipo();
    if (novo === atual) return;

    // salva o estado do tipo que está saindo
    this.estadoPorTipo.set(atual, {
      equip: this.equipForm.getRawValue(),
      medicao: this.medicaoForm.getRawValue() as Record<string, string>,
      obs: this.obs.value,
    });

    this.tipo.set(novo);
    this.reconstruirMedicao();

    // restaura (ou zera) o estado do novo tipo — os campos não se comunicam entre si
    const salvo = this.estadoPorTipo.get(novo);
    this.equipForm.reset({ ...LaudoForm.equipPadrao(), ...(salvo?.equip ?? {}) });
    if (salvo?.medicao) {
      this.medicaoForm.patchValue(salvo.medicao);
    }
    this.obs.setValue(salvo?.obs ?? '');
  }

  irPara(indice: number): void {
    this.passo.set(indice);
    this.irAoTopo();
  }

  voltar(): void {
    this.passo.update((p) => Math.max(0, p - 1));
    this.irAoTopo();
  }

  get rotuloPrimario(): string {
    return this.passo() < 3 ? 'Próximo →' : 'Gerar laudo em PDF';
  }

  acaoPrimaria(): void {
    if (this.passo() < 3) {
      this.passo.update((p) => Math.min(3, p + 1));
      this.irAoTopo();
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
    const eq = this.equipForm.getRawValue() as Record<string, string>;
    return {
      numero: this.numeroLaudo,
      emitidoEm: new Date().toLocaleString('pt-BR'),
      tipo: this.tipo(),
      equipamento: this.definicao().nome,
      responsavel: this.clienteForm.getRawValue().respNome,
      observacoes: this.obs.value,
      medicoes: this.medicaoForm.getRawValue() as Record<string, string>,
      identificacao: this.blocoIdentificacao(),
      equipamentoInfo: this.blocoEquipamento(),
      medicoesGrupos: this.blocoMedicoes(),
      tipoDeTensao: this.tipo() === 'transformador' ? eq['tipoDeTensao'] : undefined,
      tipoDeFechamento: this.tipo() === 'transformador' ? eq['tipoDeFechamento'] : undefined,
    };
  }

  async gerar(): Promise<void> {
    await this.pdf.gerar(this.montarDados());
    this.canal.set(null);
    this.gerado.set(true);
    this.irAoTopo();
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
    this.irAoTopo();
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
    const f = this.clienteForm.getRawValue();
    const t = LaudoForm.TRACO;
    const juntar = (a: string, b: string) => (a || b ? `${a || t} · ${b || t}` : t);
    return [
      { rotulo: 'Cliente', valor: f.clienteNome || t },
      { rotulo: 'Endereço', valor: f.clienteEndereco || t },
      { rotulo: 'Telefone / e-mail', valor: juntar(f.clienteTelefone, f.clienteEmail) },
      { rotulo: 'Subestação', valor: f.seNome || t },
      { rotulo: 'Localização', valor: f.seLocalizacao || t },
      { rotulo: 'Capacidade / tensão', valor: juntar(f.seCapacidade, f.seTensao) },
      { rotulo: 'Responsável técnico', valor: f.respNome || t },
      { rotulo: 'Registro (CREA / ART)', valor: f.respRegistro || t },
      { rotulo: 'Contato do responsável', valor: juntar(f.respTelefone, f.respEmail) },
      { rotulo: 'Data da inspeção', valor: f.dataInspecao || t },
    ];
  }

  blocoEquipamento(): LinhaResumo[] {
    const f = this.equipForm.getRawValue() as Record<string, string>;
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
