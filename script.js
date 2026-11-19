document.addEventListener("DOMContentLoaded", () => {

    // FAVORITOS
    const CHAVE_FAVORITOS = "patinhasloveFavoritos";

    function lerFavoritos() {
        try {
            const dados = JSON.parse(localStorage.getItem(CHAVE_FAVORITOS));
            return Array.isArray(dados) ? dados : [];
        } catch {
            return [];
        }
    }

    let favoritos = lerFavoritos();

    function salvarFavoritos() {
        localStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(favoritos));
    }

    const botoesFavoritos = document.querySelectorAll(".favorite-btn");

    function atualizarBotoesFavoritos() {
        botoesFavoritos.forEach(botao => {
            const card = botao.closest(".pet-card");
            if (!card) return;

            const id = card.id;
            const estaFavorito = favoritos.includes(id);

            botao.classList.toggle("is-favorite", estaFavorito);
            botao.textContent = estaFavorito ? "♥" : "♡";
            botao.setAttribute("aria-pressed", String(estaFavorito));
        });
    }

    botoesFavoritos.forEach(botao => {
        botao.addEventListener("click", () => {
            const card = botao.closest(".pet-card");
            if (!card) return;

            const id = card.id;

            if (favoritos.includes(id)) {
                favoritos = favoritos.filter(item => item !== id);
            } else {
                favoritos.push(id);
            }

            salvarFavoritos();
            atualizarBotoesFavoritos();
            aplicarFiltros();
        });
    });

    // PESQUISA E FILTROS DA PÁGINA DE ADOÇÃO
    const busca = document.querySelector("#buscaPet");
    const filtro = document.querySelector("#filtroPet");
    const mostrarFavoritos = document.querySelector("#mostrarFavoritos");
    const contador = document.querySelector("#contadorPets");
    const mensagemVazia = document.querySelector("#nenhumPet");
    const cards = document.querySelectorAll(".pet-card");

    function aplicarFiltros() {
        if (!cards.length) return;

        const texto = busca ? busca.value.toLowerCase().trim() : "";
        const tipo = filtro ? filtro.value : "todos";
        const apenasFavoritos = mostrarFavoritos ? mostrarFavoritos.checked : false;

        let quantidade = 0;

        cards.forEach(card => {
            const nome = card.dataset.nome || "";
            const categoria = card.dataset.tipo || "";

            const combinaNome = nome.includes(texto);
            const combinaTipo = tipo === "todos" || categoria === tipo;
            const combinaFavorito = !apenasFavoritos || favoritos.includes(card.id);

            const mostrar = combinaNome && combinaTipo && combinaFavorito;

            card.hidden = !mostrar;

            if (mostrar) quantidade++;
        });

        if (contador) {
            contador.textContent = `${quantidade} animal(is) encontrado(s) 🐾`;
        }

        if (mensagemVazia) {
            mensagemVazia.hidden = quantidade !== 0;
        }
    }

    if (busca) busca.addEventListener("input", aplicarFiltros);
    if (filtro) filtro.addEventListener("change", aplicarFiltros);
    if (mostrarFavoritos) mostrarFavoritos.addEventListener("change", aplicarFiltros);

    atualizarBotoesFavoritos();
    aplicarFiltros();

    // MATCH PET
    const formularioMatch = document.querySelector("#matchForm");
    const resultadoMatch = document.querySelector("#resultadoMatch");

    if (formularioMatch && resultadoMatch) {
        formularioMatch.addEventListener("submit", evento => {
            evento.preventDefault();

            const respostas = new FormData(formularioMatch);

            const casa = respostas.get("casa");
            const rotina = respostas.get("rotina");
            const companhia = respostas.get("companhia");
            const experiencia = respostas.get("experiencia");

            let pontosCachorro = 0;
            let pontosGato = 0;

            if (casa === "casa") pontosCachorro++;
            if (casa === "apartamento") pontosGato++;

            if (rotina === "tempo") pontosCachorro++;
            if (rotina === "corrida") pontosGato++;

            if (companhia === "ativo") pontosCachorro++;
            if (companhia === "tranquilo") pontosGato++;

            let titulo;
            let descricao;
            let link;

            if (pontosCachorro > pontosGato) {
                titulo = "Seu Match combina com um cachorro! 🐶";
                descricao = "Seu perfil indica que você pode gostar de um companheiro brincalhão e participativo. Conheça os cães disponíveis e veja qual combina com sua rotina.";
                link = "adote.html#thor";

            } else if (pontosGato > pontosCachorro) {
                titulo = "Seu Match combina com um gato! 🐱";
                descricao = "Seu perfil indica que você pode gostar de um companheiro mais independente e tranquilo. Conheça os gatinhos disponíveis para adoção.";
                link = "adote.html#luna";

            } else {
                titulo = "Você pode combinar com vários pets! 💗";
                descricao = "Suas respostas ficaram equilibradas. Conheça os animais disponíveis e escolha aquele com quem você criar uma conexão.";
                link = "adote.html";
            }

            const mensagemExperiencia = experiencia === "nao"
                ? "Não ter experiência não impede uma adoção responsável: é importante aprender sobre os cuidados antes de receber seu novo amigo."
                : "Sua experiência anterior pode ajudar, mas cada animal tem suas próprias necessidades e personalidade.";

            resultadoMatch.innerHTML = `
                <h2>${titulo}</h2>
                <p>${descricao}</p>
                <p>${mensagemExperiencia}</p>
                <a href="${link}" class="btn">Conhecer os animais</a>
            `;

            resultadoMatch.hidden = false;
            resultadoMatch.scrollIntoView({ behavior: "smooth", block: "center" });
        });
    }

});