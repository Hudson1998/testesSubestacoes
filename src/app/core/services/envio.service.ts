import { Injectable } from '@angular/core';
import { DadosLaudo } from '../models/laudo.model';

/**
 * Envio do laudo ao cliente.
 *
 * IMPLEMENTAÇÃO PENDENTE — definir o canal:
 *  - WhatsApp: link wa.me com mensagem, ou WhatsApp Business API (com anexo);
 *  - E-mail: envio via backend (SMTP / provedor) com o PDF anexado.
 */
@Injectable({ providedIn: 'root' })
export class EnvioService {
  whatsapp(dados: DadosLaudo): void {
    console.info('[EnvioService] whatsapp() — implementação pendente', dados);
  }

  email(dados: DadosLaudo): void {
    console.info('[EnvioService] email() — implementação pendente', dados);
  }
}
