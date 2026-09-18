function inserirContato() {

    const token = sessionStorage.getItem("token");
    if (!token) {
        window.location.href = "paginaLogin.html";
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

function enviarMensagem(evento) {
    evento.preventDefault();
    console.log('falta enviar mensagem a email')
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