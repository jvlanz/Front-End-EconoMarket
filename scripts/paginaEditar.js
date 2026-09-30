function preencherDados() {
    const token = sessionStorage.getItem("token");

    if (!token) {
        window.location.href = "paginaLogin.html";
        return;
    }

    const payload = JSON.parse(atob(token.split(".")[1]));


    document.getElementById("nome-editar").value = payload.nome;
    document.getElementById("email-editar").value = payload.sub;
}

async function editarCadastro(evento) {
    evento.preventDefault();
    const token = sessionStorage.getItem("token");

    if (!token) {
        window.location.href = "paginaLogin.html";
        return;
    }

    const payload = JSON.parse(atob(token.split(".")[1]));
    const id = payload.id;

    const nome = document.getElementById("nome-editar").value;
    const email = document.getElementById("email-editar").value;
    const senha = document.getElementById("senha-editar").value;
    const senhaAtual = document.getElementById("senha-atual").value;
    const msgerro = document.getElementById("msg-erro-editar");

    const cliente = {
        id: id,
        nome: nome,
        email: email,
        password: senha,
        senhaAtual: senhaAtual
    };

    try {
        const resposta = await fetch(`http://localhost:8080/auth/editar`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(cliente)
        });

        if (!resposta.ok) {
            msgerro.innerHTML = "Erro ao editar o cadastro";
            return;
        }

        //atualiza o token no sessionStorage
        const dados = await resposta.json();
        sessionStorage.setItem("token", dados.token);


        window.location.href = "paginaPrincipal.html";

    } catch (erro) {
        msgerro.innerHTML = "Erro ao editar o cadastro";
    }
}

function logout() {
    sessionStorage.removeItem("token");
    window.location.href = "paginaLogin.html";
}