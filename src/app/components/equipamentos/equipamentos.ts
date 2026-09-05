import { Component } from '@angular/core';
import { EQUIPAMENTOS } from '../../core/data/equipamentos.data';
import { TipoEquipamento } from '../../core/models/laudo.model';

@Component({
  selector: 'app-equipamentos',
  templateUrl: './equipamentos.html',
  styleUrl: './equipamentos.scss',
})
export class Equipamentos {
  readonly equipamentos = EQUIPAMENTOS;

  icone(tipo: TipoEquipamento): string {
    return tipo;
  }
}
