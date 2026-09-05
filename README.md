# Espaço Téc — site de laudos de subestação

One-page em **Angular 20** para uma empresa de manutenção registrar medições de
ensaio em equipamentos de subestação (**disjuntor**, **transformador** e
**chave seccionadora**), gerar o **laudo em PDF** e enviá-lo ao cliente por
**WhatsApp ou e-mail**.

> Estágio atual: **protótipo da interface**. O fluxo do formulário funciona
> (navegação por passos, troca de equipamento muda os campos de medição, tela de
> envio), mas a **geração do PDF** e o **envio** ainda são stubs, e os
> **campos de cada equipamento são provisórios** — serão definidos com o cliente.

## Pré-requisitos

Instale antes de começar:

| Ferramenta | Versão | Observações |
| --- | --- | --- |
| **Node.js** | `^20.19` · `^22.12` · `>=24` | Exigência do Angular 20. Confira com `node -v`. Recomendado instalar via [nvm](https://github.com/nvm-sh/nvm) (Linux/macOS) ou [nvm-windows](https://github.com/coreybutler/nvm-windows). |
| **npm** | `>= 8` (vem com o Node) | Confira com `npm -v`. |
| **Git** | qualquer versão recente | Para clonar o repositório. |
| **Google Chrome / Chromium** | atual | Só é necessário para `npm test` (o Karma abre um Chrome headless). |

> Não é preciso instalar o Angular CLI globalmente — ele já vem como dependência
> do projeto e é acessível via `npm run ng -- <comando>` ou `npx ng <comando>`.
> Se preferir o comando `ng` direto no terminal: `npm install -g @angular/cli@20`.

## Como rodar

```bash
# 1. clonar
git clone <URL-DO-REPOSITÓRIO>
cd testesSubestacoes

# 2. instalar as dependências (usa o package-lock.json — reprodutível)
npm ci          # ou: npm install

# 3. subir o servidor de desenvolvimento
npm start       # http://localhost:4200 — recarrega ao salvar
```

### Outros comandos

```bash
npm run build   # build de produção em dist/tensao-ensaios/
npm run watch   # build de desenvolvimento contínuo
npm test        # testes unitários (Karma + Jasmine); precisa de Chrome/Chromium
npm run ng -- <cmd>   # qualquer comando do Angular CLI, ex.: npm run ng -- generate component foo
```

### Problemas comuns

- **`Node.js version vX is not supported`** — sua versão do Node está fora da
  faixa aceita pelo Angular 20. Instale uma versão suportada (ver tabela acima).
- **`npm ci` falha** — apague `node_modules/` e rode de novo; se persistir, use
  `npm install`.
- **`npm test` não abre o navegador** — instale o Google Chrome ou defina
  `CHROME_BIN` apontando para o binário do Chromium.
- **Porta 4200 ocupada** — rode `npm start -- --port 4300`.

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
Claude Design — `design/Main.dc.html` (site), `design/PDFPreview.dc.html` (modelo
do PDF) e `design/identidade/` (marca "Espaço Téc", logo e favicon).
