# TENSÃO+ Ensaios — site de laudos de subestação

One-page em **Angular 20** para uma empresa de manutenção registrar medições de
ensaio em equipamentos de subestação (**disjuntor**, **transformador** e
**chave seccionadora**), gerar o **laudo em PDF** e enviá-lo ao cliente por
**WhatsApp ou e-mail**.

> Estágio atual: **protótipo da interface**. O fluxo do formulário funciona
> (navegação por passos, troca de equipamento muda os campos de medição, tela de
> envio), mas a **geração do PDF** e o **envio** ainda são stubs, e os
> **campos de cada equipamento são provisórios** — serão definidos com o cliente.

## Como rodar

```bash
npm install
npm start          # dev server em http://localhost:4200
npm run build      # build de produção em dist/
npm test           # testes unitários (Karma/Jasmine)
```

## Estrutura

```
src/app/
  app.*                         casca da one-page (compõe as seções)
  core/
    models/laudo.model.ts       tipos do domínio
    data/equipamentos.data.ts   ⚠️ campos/ensaios por equipamento — AJUSTAR AQUI
    services/pdf.service.ts     geração de PDF (stub)
    services/envio.service.ts   envio WhatsApp / e-mail (stub)
  components/
    site-header/                navegação fixa
    hero/                        chamada principal
    processo/                    "como funciona" em 4 passos
    equipamentos/               equipamentos e ensaios cobertos
    laudo-form/                  assistente "Novo laudo" (passos + medições + envio)
    documento-preview/          facsímile do PDF entregue ao cliente
    site-footer/                rodapé
```

## Próximos passos

1. Definir os **campos reais** de identificação e de medição de cada equipamento
   (`core/data/equipamentos.data.ts`) e os critérios de referência.
2. Implementar a **geração do PDF** (layout de referência em `design/PDFPreview.dc.html`).
3. Implementar o **envio** por WhatsApp e e-mail (`core/services/envio.service.ts`).

## Design

O design aprovado (direção "Técnico industrial") está em `design/` como canvas do
Claude Design — `design/Main.dc.html` (site) e `design/PDFPreview.dc.html` (modelo do PDF).
