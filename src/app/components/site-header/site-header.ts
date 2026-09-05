import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-site-header',
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
})
export class SiteHeader {
  readonly menuAberto = signal(false);

  alternarMenu(): void {
    this.menuAberto.update((v) => !v);
  }

  fecharMenu(): void {
    this.menuAberto.set(false);
  }
}
