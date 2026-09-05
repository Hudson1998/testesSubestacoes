import { Component } from '@angular/core';

interface Passo {
  n: string;
  titulo: string;
  texto: string;
}

@Component({
  selector: 'app-processo',
  templateUrl: './processo.html',
  styleUrl: './processo.scss',
})
export class Processo {
  readonly passos: Passo[] = [
    { n: '01', titulo: 'Cliente e subestação', texto: 'Cliente, CNPJ, subestação, endereço e data do ensaio.' },
    { n: '02', titulo: 'Identificação do equipamento', texto: 'Tipo, fabricante, modelo, TAG e número de série.' },
    { n: '03', titulo: 'Registro das medições', texto: 'Valores de cada ensaio conforme o equipamento selecionado.' },
    { n: '04', titulo: 'Geração e envio', texto: 'PDF gerado na hora e enviado por WhatsApp ou e-mail ao cliente.' },
  ];
}
