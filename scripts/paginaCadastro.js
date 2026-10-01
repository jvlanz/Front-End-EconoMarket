async function cadastrar(evento) {
    evento.preventDefault();


    const email = document.getElementById("email-cadastro")
    const password = document.getElementById("senha-cadastro")
    const nome = document.getElementById("nome-cadastro")
    const telefone = document.getElementById("telefone-cadastro")
    const msgerro = document.getElementById("mensagem-erro")


    if (email.value === "" || password.value === "" || nome.value === "" || telefone.value === "") {
        msgerro.innerText = "Por favor, preencha todos os campos!";
        return;
    }

    const novoCliente = {
        email: email.value,
        password: password.value,
        nome: nome.value,
        telefone: telefone.value
    }
    try {
        const resposta = await fetch("https://api-economarket.onrender.com/auth/cadastro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(novoCliente)
        });
        if (!resposta.ok) {
            throw new Error("Erro ao cadastrar cliente");
        }

        const data = await resposta.json();
        sessionStorage.setItem("token", data.token);
        window.location.href = "../paginas/paginaPrincipal.html";

    } catch (erro) {
        console.error(erro);
        msgerro.innerText = "Erro ao realizar cadastro!";
    }

}

