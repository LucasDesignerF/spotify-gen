let cronometroGeradorInterval;
let cronometroVerificadorInterval;

// Função para iniciar o cronômetro
function iniciarCronometro(elemento) {
    let segundos = 0;
    elemento.textContent = `Tempo decorrido: ${segundos}s`;
    return setInterval(() => {
        segundos++;
        elemento.textContent = `Tempo decorrido: ${segundos}s`;
    }, 1000);
}

// Função para parar o cronômetro
function pararCronometro(intervalId, elemento) {
    clearInterval(intervalId);
    elemento.textContent = "Concluído!";
}

// Função para gerar um código aleatório
function gerarCodigoAleatorio() {
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let codigo = "";
    for (let i = 0; i < 16; i++) {
        codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return codigo;
}

// Função para gerar um link aleatório
function gerarLink() {
    const codigo = gerarCodigoAleatorio();
    return `https://www.spotify.com/br-pt/ppt/microsoft/?code=${codigo}`;
}

// Função para iniciar a geração de contas
function iniciarGeracaoContas() {
    const spinner = document.getElementById("spinnerGerador");
    const progressBar = document.getElementById("progressBarGerador");
    const cronometroElemento = document.getElementById("cronometroGerador");

    // Resetar elementos
    spinner.style.display = "block";
    progressBar.style.width = "0%";
    cronometroElemento.textContent = "Tempo decorrido: 0s";

    // Iniciar cronômetro
    cronometroGeradorInterval = iniciarCronometro(cronometroElemento);

    const link = gerarLink();

    setTimeout(() => {
        document.getElementById("contasGeradas").textContent = link;
        spinner.style.display = "none";
        pararCronometro(cronometroGeradorInterval, cronometroElemento);
        progressBar.style.width = "100%";
    }, 1000); // Simula um pequeno delay para visualização do spinner e progresso
}

// Função para verificar contas (simulação)
async function iniciarVerificacaoContas() {
    const spinner = document.getElementById("spinnerVerificador");
    const progressBar = document.getElementById("progressBarVerificador");
    const cronometroElemento = document.getElementById("cronometroVerificador");

    // Resetar elementos
    spinner.style.display = "block";
    progressBar.style.width = "0%";
    cronometroElemento.textContent = "Tempo decorrido: 0s";

    // Iniciar cronômetro
    cronometroVerificadorInterval = iniciarCronometro(cronometroElemento);

    const contas = document.getElementById("contasGeradas").textContent.split("\n");
    const resultados = [];
    let progressoPorConta = 100 / contas.length;

    for (const [index, conta] of contas.entries()) {
        if (!conta) continue;
        try {
            const inicio = Date.now();
            const resposta = await fetch("https://jsonplaceholder.typicode.com/posts/1", {
                headers: {
                    "Authorization": conta,
                },
            });
            const tempoDecorrido = ((Date.now() - inicio) / 1000).toFixed(2);
            if (resposta.ok) {
                resultados.push(`✅ Conta válida (${tempoDecorrido}s): ${conta}`);
            } else {
                resultados.push(`❌ Conta inválida (${tempoDecorrido}s): ${conta}`);
            }
        } catch (erro) {
            resultados.push(`⚠️ Erro ao verificar conta: ${conta}`);
        }
        // Atualizar barra de progresso
        progressBar.style.width = `${(index + 1) * progressoPorConta}%`;
    }

    setTimeout(() => {
        document.getElementById("resultadoVerificacao").textContent = resultados.join("\n");
        spinner.style.display = "none";
        pararCronometro(cronometroVerificadorInterval, cronometroElemento);
    }, 1000); // Simula um pequeno delay para visualização do spinner e progresso
}

// Função para exportar contas
function exportarContas(idElemento) {
    const texto = document.getElementById(idElemento).textContent;
    if (!texto || texto.includes("Nenhuma conta disponível.") || texto.includes("Gerar")) {
        alert("Nenhuma conta para exportar!");
        return;
    }
    const blob = new Blob([texto], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "conta_spotify.txt";
    a.click();
    URL.revokeObjectURL(url);
}

// Funções para alternar entre seções
function mostrarGerador() {
    toggleSecao("gerador");
}
function mostrarVerificador() {
    toggleSecao("verificador");
}
function mostrarCreditos() {
    toggleSecao("creditos");
}

function toggleSecao(secaoId) {
    document.querySelectorAll(".secao").forEach(secao => {
        secao.classList.remove("active");
        secao.style.display = "none";
    });
    document.getElementById(secaoId).classList.add("active");
    document.getElementById(secaoId).style.display = "block";

    // Atualizar botões da sidebar
    document.querySelectorAll(".sidebar button").forEach(button => button.classList.remove("active"));
    const botaoAtivo = document.querySelector(`.sidebar button[onclick*='${secaoId}']`);
    if (botaoAtivo) botaoAtivo.classList.add("active");
}

// Carregar contas disponíveis ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    // Inicialmente, o gerador está ativo
    mostrarGerador();
});
