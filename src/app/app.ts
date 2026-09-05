import { Component } from '@angular/core';

import { SiteHeader } from './components/site-header/site-header';
import { Hero } from './components/hero/hero';
import { Processo } from './components/processo/processo';
import { Equipamentos } from './components/equipamentos/equipamentos';
import { LaudoForm } from './components/laudo-form/laudo-form';
import { DocumentoPreview } from './components/documento-preview/documento-preview';
import { SiteFooter } from './components/site-footer/site-footer';

@Component({
  selector: 'app-root',
  imports: [SiteHeader, Hero, Processo, Equipamentos, LaudoForm, DocumentoPreview, SiteFooter],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
