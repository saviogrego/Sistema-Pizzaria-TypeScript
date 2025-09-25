# Pizzaria — CLI em TypeScript + Node.js
Feito por:
- Sávio Gabriel Grego Pereira - RA: 2510472
- Gabriel de Oliveira - RA: 2507887

Projeto CLI (terminal) simples para gerenciar **clientes**, **produtos**, **pedidos**, **confirmação/pagamento** e **relatórios**. Os dados são persistidos em CSV em `dados/` e os relatórios/recibos em `recibos/`. 

---

## Recursos principais

* Cadastrar / listar **clientes** (`dados/clientes.csv`).
* Cadastrar / listar **produtos** (`dados/produtos.csv`).
* Registrar **pedidos** (guarda em `dados/pedidos.csv`).
* **Listar pedidos** pendentes.
* **Confirmar / pagar pedido**: pergunta forma de pagamento (débito/crédito/PIX), imprime recibo no terminal, remove pedido de `dados/pedidos.csv` e adiciona entrada nos relatórios diário e mensal (em `recibos/`).
* **Editar / excluir clientes**.
* Criação automática das pastas/arquivos na primeira execução.

---

## Estrutura de diretórios

```
pizzaria/
├─ dados/
│  ├─ clientes.csv
│  ├─ produtos.csv
│  └─ pedidos.csv
├─ recibos/
│  ├─ vendas-diario-YYYY-MM-DD.csv
│  └─ vendas-mensal-YYYY-MM.csv
├─ dist/
│  └─ index.js        # build JS gerado pelo tsc
├─ node_modules/
├─ src/
│  └─ index.ts        # código-fonte
├─ package.json
└─ tsconfig.json
```

---

## Formato dos CSVs (exemplos)

* `dados/clientes.csv` → `id,nome,telefone,email`
  Ex.: `1,João,11999999999,joao@email.com`

* `dados/produtos.csv` → `id,nome,categoria,preco`
  Ex.: `1,pizza de frango,pizza,100.00`

* `dados/pedidos.csv` → `id,cliente,produtos,total,data`
  Ex.: `1,João,"Margherita;Coca",112.00,2025-09-25T08:25:52.625Z`

* `recibos/vendas-diario-YYYY-MM-DD.csv` e `recibos/vendas-mensal-YYYY-MM.csv` → `id,cliente,produtos,total,pagamento,data`


## Pré-requisitos

* Node.js 14+ (recomendado 16/18/20)
* npm

---

## Instalação e execução

1. Na raiz do projeto (onde está `package.json`):

```bash
# instalar dependências de desenvolvimento (se ainda não tiver)
npm install --save-dev typescript ts-node @types/node
```

2. Scripts recomendados no `package.json`:

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts"
  }
}
```

3. Rodar em desenvolvimento (executa TypeScript direto):

```bash
npm run dev
```

4. Ou compilar e rodar o JS gerado:

```bash
npm run build
node dist/index.js
# ou
npm run build && npm start
```

> Execute os comandos **a partir da raiz do projeto** (onde está `tsconfig.json`) para `process.cwd()` e caminhos funcionarem corretamente.

---

## `tsconfig.json` sugerido

{
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",
    "target": "ES2020",
    "module": "commonjs",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "types": ["node"]
  }
}
```


##  Uso (menu do programa)

Ao executar, o menu apresenta opções:

1. Cadastrar Cliente
2. Listar Clientes
3. Cadastrar Produto
4. Listar Produtos
5. Registrar Pedido
6. Listar Pedidos
7. Confirmar / Pagar Pedido (gera recibo; pergunta forma: `debito` / `credito` / `pix`)
8. Editar Cliente
9. Excluir Cliente
10. Sair

Fluxos comuns:

* Registrar pedido: escolha `5`, informe `ID do cliente` (conforme `Listar Clientes`) e informe IDs dos produtos separados por vírgula.
* Confirmar pedido: escolha `7`, informe o `ID do pedido` (conforme `Listar Pedidos`), depois informe forma de pagamento. O recibo é impresso no terminal e o pedido é movido para `recibos/` (diário e mensal).

---

## Recibo & relatórios

* Recibo: impresso no terminal (informações básicas: pedido, cliente, produtos, valor, pagamento, data).
* Relatórios: duas cópias em CSV são gravadas em `recibos/`:

  * Diário: `vendas-diario-YYYY-MM-DD.csv`
  * Mensal: `vendas-mensal-YYYY-MM.csv`


## Reset / limpar dados

Para reiniciar os dados (apague os CSVs — serão recriados com cabeçalho na próxima execução):

```bash
rm -rf dados/*.csv
rm -rf recibos/*.csv
```

(Windows: apague pela interface do Explorer ou PowerShell `Remove-Item`.)



