let anuncios = [];

// 🔥 CARREGAR DO FIREBASE
window.onload = function () {
    const lista = document.getElementById("lista");

    database.ref("anuncios").on("value", snapshot => {
        lista.innerHTML = "";
        anuncios = [];

        snapshot.forEach(child => {
            const anuncio = child.val();
            anuncios.unshift(anuncio); // mais novos em cima
        });

        anuncios.forEach(anuncio => criarCard(anuncio));
    });
};

function adicionarAnuncio() {

    const titulo = document.getElementById("titulo").value.trim();
    const subtitulo = document.getElementById("subtitulo").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const email = document.getElementById("email").value.trim();
    const imagemInput = document.getElementById("imagem");

    if (titulo === "" || subtitulo === "" || descricao === "") {
        alert("Preencha os campos principais!");
        return;
    }

    if (telefone === "" && email === "") {
        alert("Informe WhatsApp ou Email (pelo menos um).");
        return;
    }

    const reader = new FileReader();

    reader.onload = function () {

        const novoAnuncio = {
            titulo,
            subtitulo,
            descricao,
            telefone,
            email,
            imagem: reader.result || null,
            data: Date.now()
        };

        // 🔥 SALVAR NO FIREBASE
        database.ref("anuncios").push(novoAnuncio);

        limparCampos();
        toggleFormulario();
    };

    if (imagemInput.files[0]) {
        reader.readAsDataURL(imagemInput.files[0]);
    } else {
        reader.onload();
    }
}

function criarCard(dados) {

    const lista = document.getElementById("lista");

    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
        <h3>${dados.titulo}</h3>
        <div class="subtitulo">${dados.subtitulo}</div>

        <div class="detalhes" style="display:none;">
            <p>${dados.descricao}</p>
            ${dados.imagem ? `<img src="${dados.imagem}" style="max-width:100%; margin-top:10px;">` : ""}
            <div class="botoes">
                ${dados.telefone ? 
                    `<a class="whatsapp" target="_blank" href="https://wa.me/55${dados.telefone}?text=Olá, vi seu anúncio no Conecta Local.">WhatsApp</a>` 
                    : ""}

                ${dados.email ? 
                    `<a class="email" href="mailto:${dados.email}?subject=Interesse no anúncio do Conecta Local">Email</a>` 
                    : ""}
            </div>
        </div>
    `;

    card.addEventListener("click", function () {
        const detalhes = card.querySelector(".detalhes");
        detalhes.style.display = detalhes.style.display === "block" ? "none" : "block";
    });

    lista.appendChild(card);
}

function toggleFormulario() {
    const form = document.getElementById("formulario");
    form.classList.toggle("oculto");
}

function limparCampos() {
    document.getElementById("titulo").value = "";
    document.getElementById("subtitulo").value = "";
    document.getElementById("descricao").value = "";
    document.getElementById("telefone").value = "";
    document.getElementById("email").value = "";
    document.getElementById("imagem").value = "";
}