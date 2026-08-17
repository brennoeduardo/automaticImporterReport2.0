# Automatic Importer Report 2.0

Automação desenvolvida em TypeScript para leitura e processamento de relatórios ACOM075, transformando dados financeiros em uma estrutura organizada para utilização nas rotinas de Contas a Pagar.

O projeto foi criado para reduzir tarefas manuais e repetitivas no tratamento de relatórios, padronizando a extração, filtragem e preparação dos dados.

## Funcionalidades

* Leitura de arquivos ACOM075 em XML.
* Identificação automática dos cabeçalhos do relatório.
* Extração das principais informações financeiras:

  * Nota
  * Valor
  * Data de Emissão
  * CNPJ
  * Razão Social
  * Natureza
* Filtragem e tratamento dos registros.
* Formatação dos dados para utilização em Excel.
* Preparação das colunas `RESP` e `OBSERVAÇÃO` para preenchimento manual.
* Organização automática dos arquivos utilizados durante o processo.
* Integração com rotinas do Protheus.

## Tecnologias

* TypeScript
* Node.js
* fast-xml-parser
* ExcelJS
* Playwright

## Estrutura do projeto

```text
src/
├── browser/
│   └── protheus.ts
├── config/
│   └── config.ts
├── excel/
│   ├── formatar.ts
│   └── lerAcom075.ts
├── importador/
│   ├── exportacao.ts
│   └── filtros.ts
├── utils/
│   ├── arquivos.ts
│   └── datas.ts
└── index.ts
```

## Fluxo da automação

```text
ACOM075
   ↓
Leitura do XML
   ↓
Identificação das colunas
   ↓
Extração dos dados
   ↓
Filtragem e tratamento
   ↓
Formatação
   ↓
Exportação para Excel
```

## Dados processados

A estrutura principal utilizada pelo projeto contempla:

| Campo        | Tipo     |
| ------------ | -------- |
| Nota         | `string` |
| Valor        | `number` |
| Dt.Emissao   | `Date`   |
| CNPJ         | `string` |
| Razao Social | `string` |
| Natureza     | `string` |
| RESP         | `string` |
| OBSERVAÇÃO   | `string` |

`RESP` e `OBSERVAÇÃO` não fazem parte do relatório ACOM075 original. Essas colunas são adicionadas pela automação para complementar o processo operacional.

## Instalação

Clone o repositório:

```bash
git clone https://github.com/brennoeduardo/automaticImporterReport2.0.git
```

Entre na pasta:

```bash
cd automaticImporterReport2.0
```

Instale as dependências:

```bash
npm install
```

## Execução

Execute o projeto em ambiente de desenvolvimento:

```bash
npm run dev
```

Ou utilize o comando definido no `package.json` para a execução da aplicação.

## Objetivo

O Automatic Importer Report 2.0 foi desenvolvido como uma solução prática para automatizar uma rotina operacional do setor financeiro, reduzindo trabalho manual, padronizando o tratamento das informações e tornando o processo mais rápido e confiável.

Além da aplicação prática, o projeto representa um estudo de desenvolvimento de automações utilizando TypeScript, Node.js, manipulação de XML, processamento de dados e integração com sistemas corporativos.

## Status

Em desenvolvimento.
