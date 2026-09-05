import { Injectable } from '@angular/core';
import type { jsPDF as JsPdfDoc } from 'jspdf';

import { DadosLaudo, TipoEquipamento } from '../models/laudo.model';

type RGB = [number, number, number];
type Conexao = 'triangulo' | 'estrela' | 'ziguezague';

const AMBER: RGB = [245, 163, 0];
const AMBER_BG: RGB = [252, 244, 224];
const AMBER_INK: RGB = [140, 95, 0];
const INK: RGB = [26, 26, 26];
const MUTE: RGB = [110, 110, 110];
const LIGHT: RGB = [247, 246, 243];
const LINE: RGB = [228, 227, 223];

const FONT = 'LaudoSans';
const M = 14;

/**
 * Geração do laudo em PDF (cliente, via jsPDF + autoTable).
 *
 * Fonte DejaVu Sans embutida (subconjunto) para renderizar Ω, µ, °, → etc.
 * jsPDF, o plugin de tabelas e a fonte são carregados sob demanda.
 */
@Injectable({ providedIn: 'root' })
export class PdfService {
  /** Número do laudo — provisório / ilustrativo. */
  proximoNumero(): string {
    return 'LAUDO-2025-0142';
  }

  async gerar(dados: DadosLaudo): Promise<void> {
    const doc = await this.construir(dados);
    doc.save(`${dados.numero}.pdf`);
  }

  async baixar(dados: DadosLaudo): Promise<void> {
    return this.gerar(dados);
  }

  // --------------------------------------------------------------------------

  private async construir(dados: DadosLaudo): Promise<JsPdfDoc> {
    const [{ jsPDF }, { default: autoTable }, fonte] = await Promise.all([
      import('jspdf'),
      import('jspdf-autotable'),
      import('./pdf-font'),
    ]);

    const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
    doc.addFileToVFS('LaudoSans-Regular.ttf', fonte.LAUDO_FONT_REGULAR);
    doc.addFont('LaudoSans-Regular.ttf', FONT, 'normal');
    doc.addFileToVFS('LaudoSans-Bold.ttf', fonte.LAUDO_FONT_BOLD);
    doc.addFont('LaudoSans-Bold.ttf', FONT, 'bold');
    doc.setFont(FONT, 'normal');

    const pw = doc.internal.pageSize.getWidth();
    const ph = doc.internal.pageSize.getHeight();
    const cw = pw - M * 2;
    const norm = (s: string) => (s ?? '').replace(/⟶/g, '→');
    const setDraw = (c: RGB) => doc.setDrawColor(c[0], c[1], c[2]);
    const setText = (c: RGB) => doc.setTextColor(c[0], c[1], c[2]);

    let y = M;

    // ---------- cabeçalho ----------
    doc.setFont(FONT, 'bold');
    doc.setFontSize(15);
    setText(INK);
    doc.text('ESPAÇO TÉC', M, y + 5);
    doc.setFont(FONT, 'normal');
    doc.setFontSize(7.5);
    setText(MUTE);
    doc.text('ENSAIOS ELÉTRICOS EM SUBESTAÇÃO', M, y + 10);

    doc.setFontSize(8.5);
    setText(MUTE);
    doc.text(`LAUDO Nº ${dados.numero}`, pw - M, y + 3, { align: 'right' });
    doc.text('REV. 00 · FL. 1/1', pw - M, y + 7.5, { align: 'right' });
    doc.text(`Emitido em ${dados.emitidoEm}`, pw - M, y + 12, { align: 'right' });

    y += 16;
    setDraw(AMBER);
    doc.setLineWidth(1);
    doc.line(M, y, M + 24, y);
    setDraw(INK);
    doc.setLineWidth(0.3);
    doc.line(M + 26, y, pw - M, y);
    y += 8;

    doc.setFont(FONT, 'bold');
    doc.setFontSize(13);
    setText(INK);
    doc.text(norm(`LAUDO DE ENSAIO — ${dados.equipamento.toUpperCase()}`), M, y);
    y += 5;

    // ---------- esquema ilustrativo ----------
    y = this.desenharEsquema(doc, dados.tipo, dados.equipamento, M, y + 2, cw, {
      tensao: dados.tipoDeTensao,
      fechamento: dados.tipoDeFechamento,
    });
    y += 6;

    // ---------- tabelas ----------
    const tituloSecao = (t: string) => {
      if (y > ph - 40) {
        doc.addPage();
        y = M + 4;
      }
      doc.setFont(FONT, 'bold');
      doc.setFontSize(9.5);
      setText(INK);
      doc.text(norm(t.toUpperCase()), M, y);
      y += 2;
    };

    const estiloBase = {
      margin: { left: M, right: M, top: M + 4, bottom: 18 },
      styles: {
        font: FONT,
        fontSize: 8.5,
        cellPadding: 2.4,
        textColor: INK,
        lineColor: LINE,
        lineWidth: 0.1,
        overflow: 'linebreak' as const,
      },
      headStyles: {
        fillColor: INK,
        textColor: [255, 255, 255] as RGB,
        fontStyle: 'bold' as const,
        fontSize: 8,
      },
      alternateRowStyles: { fillColor: LIGHT },
    };

    const finalY = () => (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;

    // 1. Identificação
    tituloSecao('1. Identificação');
    autoTable(doc, {
      ...estiloBase,
      startY: y + 1,
      head: [['Campo', 'Informação']],
      columnStyles: { 0: { cellWidth: 52, textColor: MUTE } },
      body: dados.identificacao.map((l) => [norm(l.rotulo), norm(l.valor)]),
    });
    y = finalY() + 7;

    // 2. Equipamento ensaiado
    tituloSecao('2. Equipamento ensaiado');
    autoTable(doc, {
      ...estiloBase,
      startY: y + 1,
      head: [['Campo', 'Informação']],
      columnStyles: { 0: { cellWidth: 52, textColor: MUTE } },
      body: dados.equipamentoInfo.map((l) => [norm(l.rotulo), norm(l.valor)]),
    });
    y = finalY() + 7;

    // 3. Resultados dos ensaios
    tituloSecao('3. Resultados dos ensaios');
    const agrupar = dados.medicoesGrupos.length > 1;
    const corpo: unknown[] = [];
    for (const grupo of dados.medicoesGrupos) {
      if (agrupar) {
        corpo.push([
          {
            content: norm(grupo.titulo),
            colSpan: 3,
            styles: { fillColor: AMBER_BG, textColor: AMBER_INK, fontStyle: 'bold', fontSize: 7.5 },
          },
        ]);
      }
      for (const l of grupo.linhas) {
        corpo.push([norm(l.rotulo), norm(l.valor), norm(l.unidade ?? '')]);
      }
    }
    autoTable(doc, {
      ...estiloBase,
      startY: y + 1,
      head: [['Ensaio', 'Leitura', 'Unidade']],
      columnStyles: {
        1: { halign: 'right', cellWidth: 32, fontStyle: 'bold' },
        2: { cellWidth: 24, textColor: MUTE },
      },
      body: corpo as [],
    });
    y = finalY() + 7;

    // 4. Observações
    if (dados.observacoes.trim()) {
      tituloSecao('4. Observações');
      autoTable(doc, {
        ...estiloBase,
        startY: y + 1,
        theme: 'plain',
        styles: { ...estiloBase.styles, fillColor: LIGHT, cellPadding: 3.4 },
        body: [[norm(dados.observacoes.trim())]],
      });
      y = finalY() + 7;
    }

    // ---------- assinatura ----------
    if (y > ph - 34) {
      doc.addPage();
      y = M + 12;
    } else {
      y += 8;
    }
    setDraw(INK);
    doc.setLineWidth(0.3);
    doc.line(M, y, M + 74, y);
    doc.setFont(FONT, 'normal');
    doc.setFontSize(8.5);
    setText(INK);
    doc.text(norm(dados.responsavel || 'Responsável técnico'), M, y + 5);
    doc.setFontSize(7.5);
    setText(MUTE);
    doc.text('Responsável técnico · CREA / ART', M, y + 9.5);

    // ---------- rodapé em todas as páginas ----------
    const total = doc.getNumberOfPages();
    for (let p = 1; p <= total; p++) {
      doc.setPage(p);
      setDraw(AMBER);
      doc.setLineWidth(0.9);
      doc.line(M, ph - 12, M + 16, ph - 12);
      doc.setFont(FONT, 'normal');
      doc.setFontSize(7);
      setText(MUTE);
      doc.text('PROTÓTIPO · DADOS FICTÍCIOS · MARCA E CONTATOS SÃO PLACEHOLDERS', M, ph - 8);
      doc.text(`${p} / ${total}`, pw - M, ph - 8, { align: 'right' });
    }

    return doc;
  }

  // --------------------------------------------------------------------------

  /** Desenha um esquema elétrico ilustrativo do equipamento. Retorna o novo Y. */
  private desenharEsquema(
    doc: JsPdfDoc,
    tipo: TipoEquipamento,
    nome: string,
    x: number,
    y: number,
    w: number,
    tr?: { tensao?: string; fechamento?: string },
  ): number {
    const H = 48;
    const setFill = (c: RGB) => doc.setFillColor(c[0], c[1], c[2]);
    const setDraw = (c: RGB) => doc.setDrawColor(c[0], c[1], c[2]);
    const setText = (c: RGB) => doc.setTextColor(c[0], c[1], c[2]);

    setFill([251, 250, 247]);
    setDraw(LINE);
    doc.setLineWidth(0.2);
    doc.roundedRect(x, y, w, H, 2, 2, 'FD');

    doc.setFont(FONT, 'bold');
    doc.setFontSize(6.5);
    setText(MUTE);
    doc.text('REPRESENTAÇÃO ESQUEMÁTICA', x + 4, y + 6);

    const midY = y + H / 2 + 3;

    if (tipo === 'transformador') {
      const lig = this.parseLigacao(tr?.fechamento);
      const niveis = this.parseNiveis(tr?.tensao);
      const leftCx = x + w * 0.26;
      const rightCx = x + w * 0.74;
      const coreX = x + w / 2;
      const R = 9;

      // acoplamento AT ── núcleo ── BT
      setDraw(LINE);
      doc.setLineWidth(0.4);
      doc.line(leftCx + R + 2, midY, coreX - 3.5, midY);
      doc.line(coreX + 3.5, midY, rightCx - R - 2, midY);
      setDraw(MUTE);
      doc.setLineWidth(0.5);
      doc.line(coreX - 1.4, midY - 13, coreX - 1.4, midY + 13);
      doc.line(coreX + 1.4, midY - 13, coreX + 1.4, midY + 13);
      // enrolamentos sobre o núcleo
      doc.setLineWidth(0.35);
      doc.circle(coreX - 4.5, midY, 3.4, 'S');
      doc.circle(coreX + 4.5, midY, 3.4, 'S');

      // símbolos de ligação de cada lado
      this.desenhaConexao(doc, lig.at, leftCx, midY, R);
      this.desenhaConexao(doc, lig.bt, rightCx, midY, R);

      // rótulos dos lados
      doc.setFont(FONT, 'bold');
      doc.setFontSize(7);
      setText(AMBER_INK);
      doc.text(`${niveis.at} · ${this.nomeConexao(lig.at)}`, leftCx, y + 12, { align: 'center' });
      doc.text(`${niveis.bt} · ${this.nomeConexao(lig.bt)}`, rightCx, y + 12, { align: 'center' });
    } else if (tipo === 'disjuntor') {
      const cx = x + w / 2;
      setDraw(AMBER);
      doc.setLineWidth(0.6);
      setText(INK);
      doc.circle(cx - 22, midY, 1.4, 'FD');
      doc.circle(cx + 22, midY, 1.4, 'FD');
      doc.line(cx - 22, midY, cx - 6, midY);
      doc.line(cx + 6, midY, cx + 22, midY);
      doc.line(cx - 6, midY, cx + 5, midY - 9);
      setDraw(MUTE);
      doc.setLineWidth(0.4);
      doc.rect(cx - 3, midY + 4, 6, 8, 'S');
    } else {
      const cx = x + w / 2;
      setDraw(AMBER);
      doc.setLineWidth(0.6);
      doc.circle(cx - 20, midY, 1.4, 'FD');
      doc.circle(cx + 20, midY, 1.4, 'FD');
      doc.line(cx - 20, midY, cx + 18, midY - 12);
      doc.line(cx + 16, midY, cx + 20, midY);
    }

    doc.setFont(FONT, 'normal');
    doc.setFontSize(6);
    setText(MUTE);
    const legenda =
      tipo === 'transformador'
        ? `Ligação ${tr?.fechamento || '—'} · classe de tensão ${tr?.tensao || '—'}. Diagrama ilustrativo — não substitui o esquema do fabricante.`
        : `Diagrama ilustrativo de ${nome.toLowerCase()} — não substitui o esquema do fabricante.`;
    doc.text(legenda, x + 4, y + H - 4);

    return y + H;
  }

  private parseLigacao(s: string | undefined): { at: Conexao; bt: Conexao } {
    const t = (s ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    const partes = t.split(/[-–—/]|\s+/).filter(Boolean);
    const mapa = (p: string): Conexao => {
      if (p.startsWith('tri')) return 'triangulo';
      if (p.startsWith('zig')) return 'ziguezague';
      return 'estrela';
    };
    return { at: mapa(partes[0] ?? 'triangulo'), bt: mapa(partes[1] ?? 'estrela') };
  }

  private parseNiveis(s: string | undefined): { at: string; bt: string } {
    const t = (s ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    const partes = t.split(/[-–—/]|\s+/).filter(Boolean);
    const sigla = (p: string, fallback: string): string => {
      if (p?.startsWith('alt')) return 'AT';
      if (p?.startsWith('med')) return 'MT';
      if (p?.startsWith('bai')) return 'BT';
      return fallback;
    };
    return { at: sigla(partes[0] ?? '', 'AT'), bt: sigla(partes[1] ?? '', 'BT') };
  }

  private nomeConexao(c: Conexao): string {
    if (c === 'triangulo') return 'Triângulo (Δ)';
    if (c === 'ziguezague') return 'Ziguezague (Z)';
    return 'Estrela (Y)';
  }

  /** Desenha o símbolo da ligação (Δ, Y ou Z) centrado em (cx, cy). */
  private desenhaConexao(doc: JsPdfDoc, tipo: Conexao, cx: number, cy: number, R: number): void {
    doc.setDrawColor(AMBER[0], AMBER[1], AMBER[2]);
    doc.setLineWidth(0.6);
    doc.setFillColor(255, 255, 255);

    const ponta = (angGraus: number): [number, number] => {
      const a = (angGraus * Math.PI) / 180;
      return [cx + R * Math.cos(a), cy + R * Math.sin(a)];
    };

    if (tipo === 'triangulo') {
      const v = [ponta(-90), ponta(30), ponta(150)];
      doc.line(v[0][0], v[0][1], v[1][0], v[1][1]);
      doc.line(v[1][0], v[1][1], v[2][0], v[2][1]);
      doc.line(v[2][0], v[2][1], v[0][0], v[0][1]);
      v.forEach((p) => doc.circle(p[0], p[1], 1.1, 'FD'));
      return;
    }

    // estrela / ziguezague: três braços a partir do centro + neutro
    const bracos = [-90, 30, 150];
    if (tipo === 'ziguezague') {
      bracos.forEach((ang) => {
        const meio = ((ang * Math.PI) / 180);
        const mx = cx + R * 0.5 * Math.cos(meio);
        const my = cy + R * 0.5 * Math.sin(meio);
        const desvio = meio + 0.7;
        const kx = mx + R * 0.3 * Math.cos(desvio);
        const ky = my + R * 0.3 * Math.sin(desvio);
        const [ex, ey] = ponta(ang);
        doc.line(cx, cy, mx, my);
        doc.line(mx, my, kx, ky);
        doc.line(kx, ky, ex, ey);
        doc.circle(ex, ey, 1.1, 'FD');
      });
    } else {
      bracos.forEach((ang) => {
        const [ex, ey] = ponta(ang);
        doc.line(cx, cy, ex, ey);
        doc.circle(ex, ey, 1.1, 'FD');
      });
    }
    // neutro
    doc.setDrawColor(MUTE[0], MUTE[1], MUTE[2]);
    doc.setLineWidth(0.4);
    doc.line(cx, cy, cx, cy + R + 3);
    doc.circle(cx, cy + R + 3, 1.1, 'FD');
  }
}
