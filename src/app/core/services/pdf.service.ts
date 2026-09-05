import { Injectable } from '@angular/core';
import { DadosLaudo } from '../models/laudo.model';

/**
 * Geração do laudo em PDF.
 *
 * IMPLEMENTAÇÃO PENDENTE — o layout de referência está em
 * `design/PDFPreview.dc.html`. Quando os campos definitivos forem
 * definidos, aqui entra a montagem do documento (ex.: pdfmake / jsPDF
 * ou renderização no backend).
 */
@Injectable({ providedIn: 'root' })
export class PdfService {
  /** Número do laudo — provisório / ilustrativo. */
  proximoNumero(): string {
    return 'LAUDO-2025-0142';
  }

  async gerar(dados: DadosLaudo): Promise<void> {
    console.info('[PdfService] gerar() — implementação pendente', dados);
  }

  async baixar(dados: DadosLaudo): Promise<void> {
    console.info('[PdfService] baixar() — implementação pendente', dados);
  }
}
