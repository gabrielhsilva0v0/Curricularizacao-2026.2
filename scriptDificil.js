
const desafios = [
    { cor1: "azul", cor2: "amarelo", resposta: "verde" },
    { cor1: "vermelho", cor2: "azul", resposta: "roxo" },
    { cor1: "vermelho", cor2: "amarelo", resposta: "laranja" },
    { cor1: "azul", cor2: "vermelho", resposta: "roxo" },
    { cor1: "amarelo", cor2: "vermelho", resposta: "laranja" },
    { cor1: "amarelo", cor2: "azul", resposta: "verde" }
];

const nomes = {
    azul: "AZUL",
    amarelo: "AMARELO",
    vermelho: "VERMELHO",
    verde: "VERDE",
    roxo: "ROXO",
    laranja: "LARANJA"
};

const areaJogo = document.getElementById("areaJogo");
const textoCor1 = document.getElementById("cor1");
const textoCor2 = document.getElementById("cor2");
const mensagem = document.getElementById("mensagem");
const textoPontos = document.getElementById("pontos");
const progresso = document.getElementById("progresso");

let rodada = 0;
let pontos = 15;
let intervaloBolhas;
let bloqueado = false;
let jogoFinalizado = false;

const todasCores = [
    "verde",
    "roxo",
    "laranja",
    "azul",
    "amarelo",
    "vermelho"
];

function mostrarDesafio() {
    if (rodada >= desafios.length) {
        finalizarJogo();
        return;
    }

    bloqueado = false;

    const desafio = desafios[rodada];

    textoCor1.textContent = nomes[desafio.cor1];
    textoCor2.textContent = nomes[desafio.cor2];

    textoCor1.style.color = corHex(desafio.cor1);
    textoCor2.style.color = corHex(desafio.cor2);

    mensagem.textContent = "Clique na bolha da cor correta!";
    mensagem.style.color = "#493018";

    progresso.textContent =
        `Desafio ${rodada + 1} de ${desafios.length}`;

    limparBolhas();
    iniciarBolhas();
}

function corHex(cor) {
    const cores = {
        azul: "#1676d2",
        amarelo: "#dca900",
        vermelho: "#df3535",
        verde: "#258e29",
        roxo: "#843cba",
        laranja: "#ed7a08"
    };

    return cores[cor];
}

function criarBolha() {
    if (bloqueado || jogoFinalizado) return;

    const desafio = desafios[rodada];

    const bolha = document.createElement("button");
    bolha.className = "bolha";
    bolha.type = "button";

    // A resposta correta aparece com mais frequência.
    const cor = Math.random() < 0.38
        ? desafio.resposta
        : todasCores[
            Math.floor(Math.random() * todasCores.length)
        ];

    bolha.classList.add(cor);
    bolha.setAttribute("aria-label", `Bolha ${nomes[cor]}`);
    bolha.title = nomes[cor];

    const largura = areaJogo.clientWidth;
    const tamanho = Math.min(95, Math.max(65, largura * 0.09));

    const posicao = Math.random() * Math.max(0, largura - tamanho);

    bolha.style.left = `${posicao}px`;
    bolha.style.width = `${tamanho}px`;
    bolha.style.setProperty(
        "--duracao",
        `${5 + Math.random() * 3}s`
    );

    bolha.addEventListener("click", () => {
        if (bloqueado || jogoFinalizado) return;

        if (cor === desafios[rodada].resposta) {
            acertarResposta(bolha);
        } else {
            bolha.classList.add("estourada");
            bolha.disabled = true;

            mensagem.textContent =
                "Quase! Procure a cor certa!";
            mensagem.style.color = "#b34a24";

            setTimeout(() => bolha.remove(), 200);
        }
    });

    areaJogo.appendChild(bolha);

    bolha.addEventListener("animationend", () => {
        bolha.remove();
    });
}

function acertarResposta(bolha) {
    bloqueado = true;

    pontos += 5;
    textoPontos.textContent = pontos;

    mensagem.textContent = "Muito bem! Você acertou!";
    mensagem.style.color = "#24852b";

    bolha.classList.add("estourada");

    clearInterval(intervaloBolhas);

    setTimeout(() => {
        rodada++;
        mostrarDesafio();
    }, 850);
}

function iniciarBolhas() {
    clearInterval(intervaloBolhas);

    criarBolha();

    intervaloBolhas = setInterval(() => {
        criarBolha();
    }, 650);
}

function limparBolhas() {
    areaJogo.querySelectorAll(".bolha").forEach(bolha => {
        bolha.remove();
    });
}

function finalizarJogo() {
    jogoFinalizado = true;
    bloqueado = true;

    clearInterval(intervaloBolhas);
    limparBolhas();

    const pontosGanhos = pontos - 15;
    localStorage.setItem("jogo_pontos", pontosGanhos);
    localStorage.setItem("jogo_maximo", desafios.length * 5);
    localStorage.setItem("jogo_dificuldade", "dificil");
    window.location.href = "telaDeResultado.html";
}

function reiniciarJogo() {
    rodada = 0;
    pontos = 15;
    bloqueado = false;
    jogoFinalizado = false;

    textoPontos.textContent = pontos;

    mostrarDesafio();
}

document.getElementById("voltar").addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "menu.html";
});

mostrarDesafio();
