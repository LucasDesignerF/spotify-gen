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

// Função para iniciar a geração de contas
async function iniciarGeracaoContas() {
    const spinner = document.getElementById("spinnerGerador");
    const progressBar = document.getElementById("progressBarGerador");
    const cronometroElemento = document.getElementById("cronometroGerador");

    // Resetar elementos
    spinner.style.display = "block";
    progressBar.style.width = "0%";
    cronometroElemento.textContent = "Tempo decorrido: 0s";

    // Iniciar cronômetro
    cronometroGeradorInterval = iniciarCronometro(cronometroElemento);

    try {
        const response = await fetch('https://gen-spotify.ofc-rede.workers.dev/gerar-conta', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao gerar conta');
        }

        const data = await response.json();
        document.getElementById("contasGeradas").textContent = data.link;
        spinner.style.display = "none";
        pararCronometro(cronometroGeradorInterval, cronometroElemento);
        progressBar.style.width = "100%";
    } catch (error) {
        console.error(error);
        alert('Erro ao gerar conta.');
        spinner.style.display = "none";
        pararCronometro(cronometroGeradorInterval, cronometroElemento);
    }
}

// Função para iniciar a verificação de contas
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

    const contas = document.getElementById("contasGeradas").textContent.trim();
    if (!contas) {
        alert('Nenhuma conta para verificar!');
        spinner.style.display = "none";
        pararCronometro(cronometroVerificadorInterval, cronometroElemento);
        return;
    }

    try {
        const response = await fetch('https://gen-spotify.ofc-rede.workers.dev/verificar-conta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ conta: contas })
        });

        if (!response.ok) {
            throw new Error('Erro ao verificar conta');
        }

        const data = await response.json();
        const resultados = [];
        if (data.status === 'valido') {
            resultados.push(`✅ Conta válida (${data.tempo}s): ${contas}`);
        } else if (data.status === 'invalido') {
            resultados.push(`❌ Conta inválida (${data.tempo}s): ${contas}`);
        } else if (data.status === 'erro') {
            resultados.push(`⚠️ Erro ao verificar conta: ${contas}`);
        }

        document.getElementById("resultadoVerificacao").textContent = resultados.join("\n");
        spinner.style.display = "none";
        pararCronometro(cronometroVerificadorInterval, cronometroElemento);
        progressBar.style.width = "100%";
    } catch (error) {
        console.error(error);
        alert('Erro ao verificar conta.');
        spinner.style.display = "none";
        pararCronometro(cronometroVerificadorInterval, cronometroElemento);
    }
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
