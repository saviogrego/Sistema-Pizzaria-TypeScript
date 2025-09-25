"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// ===============================
// Imports
// ===============================
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const readline = __importStar(require("readline"));
const process_1 = require("process");
// ===============================
// Definição dos caminhos
// ===============================
const basePath = process.cwd();
const pastaDados = path.join(basePath, "dados");
const pastaRecibos = path.join(basePath, "recibos");
// arquivos principais
const arquivoClientes = path.join(pastaDados, "clientes.csv");
const arquivoProdutos = path.join(pastaDados, "produtos.csv");
const arquivoPedidos = path.join(pastaDados, "pedidos.csv");
// ===============================
// Função para preparar o ambiente
// ===============================
function prepararAmbiente() {
    if (!fs.existsSync(pastaDados))
        fs.mkdirSync(pastaDados);
    if (!fs.existsSync(pastaRecibos))
        fs.mkdirSync(pastaRecibos);
    if (!fs.existsSync(arquivoClientes)) {
        fs.writeFileSync(arquivoClientes, "id,nome,telefone,email\n");
    }
    if (!fs.existsSync(arquivoProdutos)) {
        fs.writeFileSync(arquivoProdutos, "id,nome,categoria,preco\n");
    }
    if (!fs.existsSync(arquivoPedidos)) {
        fs.writeFileSync(arquivoPedidos, "id,cliente,produtos,total,data\n");
    }
}
// chama logo no início
prepararAmbiente();
// ===============================
// Auxiliar: separa uma linha CSV respeitando aspas
// ===============================
function splitCSVLine(line) {
    const cols = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
            inQuotes = !inQuotes;
            continue;
        }
        if (ch === "," && !inQuotes) {
            cols.push(cur);
            cur = "";
            continue;
        }
        cur += ch;
    }
    cols.push(cur);
    return cols.map(s => s.trim());
}
// ===============================
// Funções de Cliente
// ===============================
function cadastrarCliente(nome, telefone, email) {
    const clientes = fs.readFileSync(arquivoClientes, "utf-8").split(/\r?\n/).filter(l => l.trim() !== "");
    const id = clientes.length; // id simples
    const linha = `${id},${nome},${telefone},${email}\n`;
    fs.appendFileSync(arquivoClientes, linha);
    console.log(`Cliente ${nome} cadastrado com sucesso!`);
}
function listarClientes() {
    const conteudo = fs.readFileSync(arquivoClientes, "utf-8");
    const linhas = conteudo.split(/\r?\n/).filter(l => l.trim() !== "");
    console.log("=== Clientes ===");
    if (linhas.length <= 1) {
        console.log("Nenhum cliente cadastrado.");
        return;
    }
    linhas.slice(1).forEach((linha) => {
        const cols = splitCSVLine(linha);
        const id = cols[0] ?? "";
        const nome = cols[1] ?? "";
        const telefone = cols[2] ?? "";
        const email = cols[3] ?? "";
        console.log(`${id}: ${nome} | ${telefone} | ${email}`);
    });
}
// ===============================
// Editar cliente (agora async) — substitui a versão anterior
// ===============================
async function editarCliente(idCliente) {
    const conteudo = fs.readFileSync(arquivoClientes, "utf-8");
    const linhas = conteudo.split(/\r?\n/).filter(l => l.trim() !== "");
    if (linhas.length <= 1) {
        console.log("Nenhum cliente cadastrado.");
        return;
    }
    const header = linhas[0];
    const dados = linhas.slice(1);
    const idx = dados.findIndex(l => splitCSVLine(l)[0] === String(idCliente));
    if (idx === -1) {
        console.log("Cliente não encontrado.");
        return;
    }
    const cols = splitCSVLine(dados[idx]);
    const atualNome = cols[1] ?? "";
    const atualTelefone = cols[2] ?? "";
    const atualEmail = cols[3] ?? "";
    console.log(`Cliente encontrado: ${cols[0]}: ${atualNome} | ${atualTelefone} | ${atualEmail}`);
    const novoNome = (await perguntar(`Nome [${atualNome}]: `)) || atualNome;
    const novoTelefone = (await perguntar(`Telefone [${atualTelefone}]: `)) || atualTelefone;
    const novoEmail = (await perguntar(`Email [${atualEmail}]: `)) || atualEmail;
    dados[idx] = `${cols[0]},${novoNome},${novoTelefone},${novoEmail}`;
    const novoConteudo = [header, ...dados].join("\n") + "\n";
    fs.writeFileSync(arquivoClientes, novoConteudo);
    console.log("Cliente atualizado com sucesso!");
}
// ===============================
// Excluir cliente (agora async) — substitui a versão anterior
// ===============================
async function excluirCliente(idCliente) {
    const conteudo = fs.readFileSync(arquivoClientes, "utf-8");
    const linhas = conteudo.split(/\r?\n/).filter(l => l.trim() !== "");
    if (linhas.length <= 1) {
        console.log("Nenhum cliente cadastrado.");
        return;
    }
    const header = linhas[0];
    const dados = linhas.slice(1);
    const idx = dados.findIndex(l => splitCSVLine(l)[0] === String(idCliente));
    if (idx === -1) {
        console.log("Cliente não encontrado.");
        return;
    }
    const cols = splitCSVLine(dados[idx]);
    const nome = cols[1] ?? "";
    const pedidosConteudo = fs.readFileSync(arquivoPedidos, "utf-8");
    const pedidosLinhas = pedidosConteudo.split(/\r?\n/).filter(l => l.trim() !== "");
    const temPedidos = pedidosLinhas.slice(1).some(l => {
        const p = splitCSVLine(l);
        return (p[1] ?? "") === nome;
    });
    if (temPedidos) {
        console.log("Atenção: existem pedidos associados a esse cliente. Remover o cliente não apagará pedidos antigos.");
    }
    const confirma = await perguntar(`Confirma exclusão do cliente ${nome}? (s/n): `);
    if (confirma.toLowerCase() !== "s") {
        console.log("Operação cancelada.");
        return;
    }
    dados.splice(idx, 1);
    const novoConteudo = [header, ...dados].join("\n") + "\n";
    fs.writeFileSync(arquivoClientes, novoConteudo);
    console.log("Cliente excluído com sucesso!");
}
// ===============================
// Funções de Produto
// ===============================
function cadastrarProduto(nome, categoria, preco) {
    const produtos = fs.readFileSync(arquivoProdutos, "utf-8").split(/\r?\n/).filter(l => l.trim() !== "");
    const id = produtos.length;
    const linha = `${id},${nome},${categoria},${preco.toFixed(2)}\n`;
    fs.appendFileSync(arquivoProdutos, linha);
    console.log(`Produto ${nome} cadastrado com sucesso!`);
}
function listarProdutos() {
    const conteudo = fs.readFileSync(arquivoProdutos, "utf-8");
    const linhas = conteudo.split(/\r?\n/).filter(l => l.trim() !== "");
    console.log("=== Produtos ===");
    if (linhas.length <= 1) {
        console.log("Nenhum produto cadastrado.");
        return;
    }
    linhas.slice(1).forEach((linha) => {
        const cols = splitCSVLine(linha);
        const id = cols[0] ?? "";
        const nome = cols[1] ?? "";
        const categoria = cols[2] ?? "";
        const preco = cols[3] ?? "";
        console.log(`${id}: ${nome} | ${categoria} | R$${preco}`);
    });
}
// ===============================
// Funções de Pedido
// ===============================
function registrarPedido(idCliente, idsProdutos) {
    const clientes = fs.readFileSync(arquivoClientes, "utf-8").split(/\r?\n/).filter(l => l.trim() !== "");
    const clienteLinha = clientes.find(l => splitCSVLine(l)[0] === String(idCliente));
    if (!clienteLinha) {
        console.log("Cliente não encontrado!");
        return;
    }
    const cliente = splitCSVLine(clienteLinha)[1];
    const produtos = fs.readFileSync(arquivoProdutos, "utf-8").split(/\r?\n/).filter(l => l.trim() !== "");
    let total = 0;
    const nomesProdutos = [];
    const produtosNaoEncontrados = [];
    idsProdutos.forEach((id) => {
        const produtoLinha = produtos.find(p => splitCSVLine(p)[0] === String(id));
        if (produtoLinha) {
            const partes = splitCSVLine(produtoLinha);
            nomesProdutos.push(partes[1]);
            total += parseFloat(partes[3] ?? "0");
        }
        else {
            produtosNaoEncontrados.push(id);
        }
    });
    if (produtosNaoEncontrados.length > 0) {
        console.log(`Atenção: produtos com IDs ${produtosNaoEncontrados.join(", ")} não foram encontrados e foram ignorados.`);
    }
    const pedidos = fs.readFileSync(arquivoPedidos, "utf-8").split(/\r?\n/).filter(l => l.trim() !== "");
    const idPedido = pedidos.length;
    const data = new Date().toISOString();
    const linha = `${idPedido},${cliente},"${nomesProdutos.join(";")}",${total.toFixed(2)},${data}\n`;
    fs.appendFileSync(arquivoPedidos, linha);
    console.log(`Pedido do cliente ${cliente} registrado com sucesso! Total: R$${total.toFixed(2)}`);
}
function listarPedidos() {
    if (!fs.existsSync(arquivoPedidos)) {
        console.log("=== Pedidos ===");
        console.log("Nenhum pedido registrado.");
        return;
    }
    const conteudo = fs.readFileSync(arquivoPedidos, "utf-8");
    const linhas = conteudo.split(/\r?\n/).filter(l => l.trim() !== "");
    if (linhas.length <= 1) {
        console.log("=== Pedidos ===");
        console.log("Nenhum pedido registrado.");
        return;
    }
    console.log("=== Pedidos ===");
    linhas.slice(1).forEach((linha) => {
        const cols = splitCSVLine(linha);
        if (cols.length < 5)
            return;
        const id = cols[0] ?? "";
        const cliente = cols[1] ?? "";
        const produtosRaw = cols[2] ?? "";
        const total = cols[3] ?? "";
        const data = cols[4] ?? "";
        const produtosFormatados = produtosRaw.replace(/^"|"$/g, "").replace(/;/g, ", ");
        console.log(`${id}: ${cliente} | ${produtosFormatados} | R$${total} | ${data}`);
    });
}
// ===============================
// Relatórios: criar/appender para diário e mensal
// ===============================
function appendVendaAoRelatorio(idPedido, cliente, produtosRaw, total, pagamento, dataISO) {
    // nomes de arquivo
    const data = new Date(dataISO);
    const diario = path.join(pastaRecibos, `vendas-diario-${data.toISOString().slice(0, 10)}.csv`); // YYYY-MM-DD
    const mensal = path.join(pastaRecibos, `vendas-mensal-${data.toISOString().slice(0, 7)}.csv`); // YYYY-MM
    const linhaRel = `${idPedido},${cliente},"${produtosRaw.replace(/"/g, "'")}",${total},${pagamento},${dataISO}\n`;
    if (!fs.existsSync(diario)) {
        fs.writeFileSync(diario, "id,cliente,produtos,total,pagamento,data\n");
    }
    fs.appendFileSync(diario, linhaRel);
    if (!fs.existsSync(mensal)) {
        fs.writeFileSync(mensal, "id,cliente,produtos,total,pagamento,data\n");
    }
    fs.appendFileSync(mensal, linhaRel);
}
// Remove um pedido do arquivo pedidos.csv (procura pelo id do pedido na primeira coluna)
function removerPedidoPorId(idPedido) {
    const conteudo = fs.readFileSync(arquivoPedidos, "utf-8");
    const linhas = conteudo.split(/\r?\n/).filter(l => l.trim() !== "");
    const header = linhas[0] ?? "id,cliente,produtos,total,data";
    const dados = linhas.slice(1);
    const novoDados = dados.filter(l => splitCSVLine(l)[0] !== idPedido);
    const novoConteudo = [header, ...novoDados].join("\n") + "\n";
    fs.writeFileSync(arquivoPedidos, novoConteudo);
}
// Confirmação / pagamento do pedido — gera recibo no terminal e move para relatórios
// ===============================
// confirmarPedidoFluxo (agora async)
// ===============================
async function confirmarPedidoFluxo(idPedido) {
    const conteudo = fs.readFileSync(arquivoPedidos, "utf-8");
    const linhas = conteudo.split(/\r?\n/).filter(l => l.trim() !== "");
    if (linhas.length <= 1) {
        console.log("Nenhum pedido registrado.");
        return;
    }
    const linhaPedido = linhas.slice(1).find(l => splitCSVLine(l)[0] === String(idPedido));
    if (!linhaPedido) {
        console.log("Pedido não encontrado.");
        return;
    }
    const cols = splitCSVLine(linhaPedido);
    const id = cols[0];
    const cliente = cols[1];
    const produtosRaw = cols[2].replace(/^"|"$/g, "");
    const total = cols[3];
    const dataISO = cols[4];
    // perguntar forma de pagamento (agora aguardamos corretamente)
    let metodo = await perguntar("Forma de pagamento (debito/credito/pix): ");
    metodo = metodo.toLowerCase().trim();
    if (!["debito", "credito", "pix"].includes(metodo)) {
        console.log("Forma de pagamento inválida. Use 'debito', 'credito' ou 'pix'. Operação cancelada.");
        return;
    }
    // gerar recibo no terminal
    console.log("\n===== RECIBO =====");
    console.log(`Pedido: ${id}`);
    console.log(`Cliente: ${cliente}`);
    console.log(`Produtos: ${produtosRaw.replace(/;/g, ", ")}`);
    console.log(`Valor: R$${parseFloat(total).toFixed(2)}`);
    console.log(`Pagamento: ${metodo.toUpperCase()}`);
    console.log(`Data: ${new Date().toISOString()}`);
    console.log("Pagamento recebido. Obrigado!");
    console.log("==================\n");
    // mover para relatórios (diário e mensal)
    appendVendaAoRelatorio(id, cliente, produtosRaw, total, metodo, new Date().toISOString());
    // remover do arquivo pedidos
    removerPedidoPorId(String(id));
    console.log("Pedido confirmado, pago e movido para os relatórios (diário e mensal).");
}
// ===============================
// Função para perguntar ao usuário
// ===============================
function perguntar(pergunta) {
    const rl = readline.createInterface({ input: process_1.stdin, output: process_1.stdout });
    return new Promise(resolve => {
        rl.question(pergunta, answer => {
            rl.close();
            resolve(answer.trim());
        });
    });
}
// ===============================
// Função Main (menu com novas opções) - atualizado para await nas calls async
// ===============================
async function main() {
    let opcao = "";
    do {
        console.log("\n=== SISTEMA DE PIZZARIA ===");
        console.log("1 - Cadastrar Cliente");
        console.log("2 - Listar Clientes");
        console.log("3 - Cadastrar Produto");
        console.log("4 - Listar Produtos");
        console.log("5 - Registrar Pedido");
        console.log("6 - Listar Pedidos");
        console.log("7 - Confirmar / Pagar Pedido (gera recibo)");
        console.log("8 - Editar Cliente");
        console.log("9 - Excluir Cliente");
        console.log("0 - Sair");
        opcao = await perguntar("Escolha uma opção: ");
        switch (opcao) {
            case "1": {
                const nome = await perguntar("Nome do cliente: ");
                const telefone = await perguntar("Telefone: ");
                const email = await perguntar("Email: ");
                cadastrarCliente(nome, telefone, email);
                break;
            }
            case "2":
                listarClientes();
                break;
            case "3": {
                const nomeProduto = await perguntar("Nome do produto: ");
                const categoria = await perguntar("Categoria (pizza/bebida/sobremesa): ");
                const precoStr = await perguntar("Preço: R$");
                const preco = parseFloat(precoStr);
                if (isNaN(preco)) {
                    console.log("Preço inválido. Operação cancelada.");
                }
                else {
                    cadastrarProduto(nomeProduto, categoria, preco);
                }
                break;
            }
            case "4":
                listarProdutos();
                break;
            case "5": {
                listarClientes();
                const idClienteStr = await perguntar("ID do cliente: ");
                const idCliente = parseInt(idClienteStr);
                if (isNaN(idCliente)) {
                    console.log("ID de cliente inválido.");
                    break;
                }
                listarProdutos();
                const idsStr = await perguntar("IDs dos produtos (separados por vírgula): ");
                const idsProdutos = idsStr.split(",").map(id => parseInt(id.trim())).filter(n => !isNaN(n));
                if (idsProdutos.length === 0) {
                    console.log("Nenhum produto válido informado.");
                    break;
                }
                registrarPedido(idCliente, idsProdutos);
                break;
            }
            case "6":
                listarPedidos();
                break;
            case "7": {
                listarPedidos();
                const idPedidoStr = await perguntar("ID do pedido a confirmar: ");
                const idPedido = parseInt(idPedidoStr);
                if (isNaN(idPedido)) {
                    console.log("ID de pedido inválido.");
                    break;
                }
                await confirmarPedidoFluxo(idPedido); // <--- AQUI: agora aguardamos
                break;
            }
            case "8": {
                listarClientes();
                const idClienteStr = await perguntar("ID do cliente a editar: ");
                const idCliente = parseInt(idClienteStr);
                if (isNaN(idCliente)) {
                    console.log("ID inválido.");
                    break;
                }
                await editarCliente(idCliente); // <--- AQUI: aguardamos a função async
                break;
            }
            case "9": {
                listarClientes();
                const idClienteStr = await perguntar("ID do cliente a excluir: ");
                const idCliente = parseInt(idClienteStr);
                if (isNaN(idCliente)) {
                    console.log("ID inválido.");
                    break;
                }
                await excluirCliente(idCliente); // <--- AQUI: aguardamos a função async
                break;
            }
            case "0":
                console.log("Saindo do sistema...");
                break;
            default:
                console.log("Opção inválida!");
        }
    } while (opcao !== "0");
}
// ===============================
// Chama o Main
// ===============================
main();
