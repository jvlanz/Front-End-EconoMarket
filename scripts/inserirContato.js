function inserirContato() {

    const token = sessionStorage.getItem("token");
    if (!token) {
//      window.location.href = "paginaLogin.html";
        return;
    }


    return fetch('contato.html')
        .then(r => r.ok ? r.text() : Promise.reject(r.status))
        .then(content => {
            document.body.insertAdjacentHTML('beforeend', content);
            const formulario = document.getElementById("formulario");
            formulario.addEventListener("submit", (evento) => { enviarMensagem(evento) })
            preencherDados();
        })
        .catch(e => console.error('Include failed:', e));
}

async function enviarMensagem(evento) {

    evento.preventDefault();

    const nome = document.getElementById("nome-contato").value;
    const email = document.getElementById("email-contato").value;
    const titulo = document.getElementById("titulo-contato").value;
    const mensagem = document.getElementById("mensagem-contato").value;

    const dados = {
        nome: nome,
        email: email,
        titulo: titulo,
        mensagem: mensagem
    };

    try {

        const resposta = await fetchFallback("/contato", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(dados)
        });

        if (!resposta.ok) {
            throw new Error("Erro ao enviar mensagem");
        }

        document.getElementById("formulario").reset();
        preencherDados();

        window.location.href = "#";

    } catch (erro) {

        console.error("Erro:", erro);
    }
}


async function preencherDados() {
    const token = sessionStorage.getItem("token");

    if (!token) {
        window.location.href = "paginaLogin.html";
        return;
    }

    const payload = JSON.parse(atob(token.split(".")[1]));


    document.getElementById("nome-contato").value = payload.nome;
    document.getElementById("email-contato").value = payload.sub;
}