import { Component } from '@angular/core';

@Component({
  selector: 'app-documento-preview',
  templateUrl: './documento-preview.html',
  styleUrl: './documento-preview.scss',
})
export class DocumentoPreview {
  readonly itens = [
    'Cabeçalho com cliente, subestação e nº do laudo',
    'Dados de identificação e placa do equipamento',
    'Tabela de ensaios: valor medido, unidade, critério e situação',
    'Parecer técnico e campo de assinaturas',
    'Envio direto por WhatsApp ou e-mail',
  ];

  readonly linhasDemo = [
    { rotulo: 'Resist. de contato', valor: '42,6 µΩ ✓' },
    { rotulo: 'Tempo de abertura', valor: '18,3 ms ✓' },
    { rotulo: 'Tempo de fechamento', valor: '54,1 ms ✓' },
    { rotulo: 'Resist. de isolamento', valor: '5,2 GΩ ✓' },
  ];
}
