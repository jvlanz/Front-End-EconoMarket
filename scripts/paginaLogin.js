async function entrar(event) {
    event.preventDefault();

    const email = document.getElementById("emailinp")
    const password = document.getElementById("senhainp")
    const msgerro = document.getElementById("mensagem-erro")

    const novoLogin = {
        email: email.value,
        password: password.value
    }
    if (email === "" || password === "") {
        msgerro.innerHTML = "Por favor, preencha todos os campos!";
    }

    try {
        console.log(novoLogin)

        const resposta = await fetch("http://localhost:8080/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(novoLogin)
        });

        if (!resposta.ok) {
            throw new Error("Erro ao logar cliente");
        }

        const data = await resposta.json();
        console.log(data.token)
        sessionStorage.setItem("jwt", data.token);
        window.location.href = "../paginas/paginaPrincipal.html";
    } catch (erro) {
        console.error(erro);

        msgerro.innerText = "Erro ao realizar login!";
    }


    // TODO futura feature de verificação de login

//  window.location.href = "http://localhost:5500/index.html"; //Mudar o location
}

