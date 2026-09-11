function preencherDados() {
    const token = sessionStorage.getItem("token");

    if (!token) {
        window.location.href = "paginaLogin.html";
        return;
    }

    const payload = JSON.parse(atob(token.split(".")[1]));

    document.getElementById("nome-cadastro").value = payload.nome;
    document.getElementById("email-cadastro").value = payload.sub;
}