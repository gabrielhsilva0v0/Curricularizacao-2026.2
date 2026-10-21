
const perguntas = [
    {
        pergunta: "Qual desses animais é o MAIOR?",
        animais: [
            { nome: "Elefante", emoji: "🐘", tamanho: 3 },
            { nome: "Borboleta", emoji: "🦋", tamanho: 1 },
            { nome: "Sapo", emoji: "🐸", tamanho: 2 }
        ]
    },
    {
        pergunta: "Qual desses animais é o MENOR?",
        animais: [
            { nome: "Girafa", emoji: "🦒", tamanho: 3 },
            { nome: "Formiga", emoji: "🐜", tamanho: 1 },
            { nome: "Cachorro", emoji: "🐶", tamanho: 2 }
        ]
    },
    {
        pergunta: "Qual desses animais é o MAIOR?",
        animais: [
            { nome: "Coelho", emoji: "🐰", tamanho: 1 },
            { nome: "Leão", emoji: "🦁", tamanho: 3 },
            { nome: "Gato", emoji: "🐱", tamanho: 2 }
        ]
    },
    {
        pergunta: "Qual desses animais é o MENOR?",
        animais: [
            { nome: "Baleia", emoji: "🐳", tamanho: 3 },
            { nome: "Macaco", emoji: "🐵", tamanho: 2 },
            { nome: "Joaninha", emoji: "🐞", tamanho: 1 }
        ]
    },
    {
        pergunta: "Qual desses animais é o MAIOR?",
        animais: [
            { nome: "Cavalo", emoji: "🐴", tamanho: 2 },
            { nome: "Rato", emoji: "🐭", tamanho: 1 },
            { nome: "Elefante", emoji: "🐘", tamanho: 3 }
        ]
    },
    {
        pergunta: "Qual desses animais é o MENOR?",
        animais: [
            { nome: "Tubarão", emoji: "🦈", tamanho: 3 },
            { nome: "Borboleta", emoji: "🦋", tamanho: 1 },
            { nome: "Urso", emoji: "🐻", tamanho: 2 }
        ]
    }
];

let indicePergunta = 0;
let pontos = 0;
let respondida = false;

const textoPergunta = document.getElementById("textoPergunta");
const mensagem = document.getElementById("mensagem");
const areaAnimais = document.getElementById("animais");
const textoPontos = document.getElementById("pontos");
const textoRodada = document.getElementById("rodada");
const btnProximo = document.getElementById("btnProximo");
const btnVoltar = document.getElementById("btnVoltar");

function mostrarPergunta() {
    const atual = perguntas[indicePergunta];

    textoPergunta.textContent = atual.pergunta;
    mensagem.textContent = "";
    textoRodada.textContent =
        `Pergunta ${indicePergunta + 1} de ${perguntas.length}`;

    areaAnimais.innerHTML = "";
    respondida = false;
    btnProximo.hidden = true;

    atual.animais.forEach((animal, indice) => {
        const cartao = document.createElement("button");

        cartao.className = "cartao";
        cartao.style.setProperty(
            "--borda",
            ["#78bd30", "#9460dc", "#28a9e8"][indice]
        );

        cartao.setAttribute(
            "aria-label",
            animal.nome
        );

        cartao.innerHTML = `
            <span class="figura" aria-hidden="true">
                ${animal.emoji}
            </span>
            <span class="nome">${animal.nome}</span>
        `;

        cartao.addEventListener("click", () => {
            verificarResposta(animal, cartao);
        });

        areaAnimais.appendChild(cartao);
    });
}

function verificarResposta(animalEscolhido, cartaoEscolhido) {
    if (respondida) return;

    respondida = true;

    const atual = perguntas[indicePergunta];

    const tamanhoCorreto = atual.pergunta.includes("MAIOR")
        ? Math.max(...atual.animais.map(a => a.tamanho))
        : Math.min(...atual.animais.map(a => a.tamanho));

    const acertou = animalEscolhido.tamanho === tamanhoCorreto;

    if (acertou) {
        pontos += 5;
        textoPontos.textContent = pontos;

        mensagem.textContent = "Muito bem! Você acertou!";
        mensagem.style.color = "#24852b";

        cartaoEscolhido.classList.add("correto");
    } else {
        mensagem.textContent = "Quase! Vamos aprender juntos!";
        mensagem.style.color = "#b34a24";

        cartaoEscolhido.classList.add("errado");
    }

    const cartoes = areaAnimais.querySelectorAll(".cartao");

    cartoes.forEach(cartao => {
        cartao.disabled = true;
    });

    if (indicePergunta === perguntas.length - 1) {
        btnProximo.textContent = "Ver resultado";
    } else {
        btnProximo.textContent = "Próxima →";
    }

    btnProximo.hidden = false;
}

function proximaPergunta() {
    if (!respondida) return;

    indicePergunta++;

    if (indicePergunta < perguntas.length) {
        mostrarPergunta();
    } else {
        mostrarResultado();
    }
}

function mostrarResultado() {
    localStorage.setItem("jogo_pontos", pontos);
    localStorage.setItem("jogo_maximo", perguntas.length * 5);
    localStorage.setItem("jogo_dificuldade", "facil");
    window.location.href = "telaDeResultado.html";
}

function reiniciarJogo() {
    indicePergunta = 0;
    pontos = 0;
    textoPontos.textContent = pontos;

    btnProximo.onclick = proximaPergunta;
    mostrarPergunta();
}

btnProximo.addEventListener("click", proximaPergunta);

btnVoltar.addEventListener("click", () => {
    if (indicePergunta > 0) {
        indicePergunta--;
        mostrarPergunta();
    } else {
        mensagem.textContent = "Você está na primeira pergunta!";
    }
});

mostrarPergunta();
