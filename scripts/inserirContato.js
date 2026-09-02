function inserirContato() {
    return fetch('contato.html')
        .then(r => r.ok ? r.text() : Promise.reject(r.status))
        .then(content => {
            document.body.insertAdjacentHTML('beforeend', content);
            const formulario = document.getElementById("formulario");
            formulario.addEventListener("submit", (evento) => { enviarMensagem(evento) })
        })
        .catch(e => console.error('Include failed:', e));
}

function enviarMensagem(evento) {
    evento.preventDefault();
    console.log('falta enviar mensagem a email')
}
