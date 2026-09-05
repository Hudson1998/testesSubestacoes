import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { EQUIPAMENTOS } from '../../core/data/equipamentos.data';
import { DadosLaudo, TipoEquipamento } from '../../core/models/laudo.model';
import { PdfService } from '../../core/services/pdf.service';
import { EnvioService } from '../../core/services/envio.service';

type CanalEnvio = 'whatsapp' | 'email' | 'download';

interface LinhaResumo {
  rotulo: string;
  valor: string;
}

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
  });

  readonly obs = this.fb.nonNullable.control('');

  medicaoForm: FormGroup = this.fb.group({});

  constructor() {
    this.reconstruirMedicao();
  }

  private reconstruirMedicao(): void {
    const grupo: Record<string, unknown> = {};
    for (const campo of this.definicao().campos) {
      grupo[campo.chave] = '';
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
      tipo: this.tipo(),
      equipamento: this.definicao().nome,
      observacoes: this.obs.value,
      medicoes: this.medicaoForm.getRawValue() as Record<string, string>,
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

  // --- resumo (passo Revisão) ---
  resumoIdentificacao(): LinhaResumo[] {
    const f = this.identForm.getRawValue();
    const traco = '—';
    return [
      { rotulo: 'Cliente', valor: f.cliente || traco },
      { rotulo: 'Subestação', valor: f.subestacao || traco },
      { rotulo: 'Data do ensaio', valor: f.data || traco },
      { rotulo: 'Responsável técnico', valor: f.responsavel || traco },
      { rotulo: 'Equipamento', valor: this.definicao().nome },
      { rotulo: 'Fabricante / modelo', valor: `${f.fabricante || traco}  /  ${f.modelo || traco}` },
      { rotulo: 'TAG / nº de série', valor: `${f.tag || traco}  /  ${f.serie || traco}` },
    ];
  }

  resumoMedicoes(): LinhaResumo[] {
    const valores = this.medicaoForm.getRawValue() as Record<string, string>;
    return this.definicao().campos.map((campo) => {
      const v = valores[campo.chave];
      return {
        rotulo: campo.rotulo,
        valor: v ? `${v} ${campo.unidade}` : '—',
      };
    });
  }
}
