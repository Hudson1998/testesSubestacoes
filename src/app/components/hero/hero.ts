import { Component } from '@angular/core';

interface LeituraDemo {
  rotulo: string;
  valor: string;
  unidade: string;
}

@Component({
  selector: 'app-hero',
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  /** Valores de demonstração do cartão "medição ao vivo". */
  readonly leituras: LeituraDemo[] = [
    { rotulo: 'Resistência de contato', valor: '42.6', unidade: 'µΩ' },
    { rotulo: 'Tempo de abertura', valor: '18.30', unidade: 'ms' },
    { rotulo: 'Tempo de fechamento', valor: '54.1', unidade: 'ms' },
    { rotulo: 'Resistência de isolamento', valor: '5.2', unidade: 'GΩ' },
  ];
}
