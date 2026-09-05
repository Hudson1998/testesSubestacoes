import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('deve ser criado', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('deve renderizar o cabeçalho e a seção do formulário', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('app-site-header')).toBeTruthy();
    expect(el.querySelector('#laudo')).toBeTruthy();
  });
});
