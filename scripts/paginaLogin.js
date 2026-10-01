async function entrar(event) {
    event.preventDefault();

    const email = document.getElementById("emailinp")
    const password = document.getElementById("senhainp")
    const msgerro = document.getElementById("msg-erro-login")

    const novoLogin = {
        email: email.value,
        password: password.value
    }
    if (email.value === "" || password.value === "") {
        msgerro.innerHTML = "Por favor, preencha todos os campos!";
    }

    try {
        const resposta = await fetch("https://api-economarket.onrender.com/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(novoLogin)
        });

        if (!resposta.ok) {
            msgerro.innerHTML("Erro ao fazer login");
        }
        
        const data = await resposta.json();
        console.log(data.token)
        sessionStorage.setItem("token", data.token);
        const payload = JSON.parse(atob(data.token.split(".")[1]));
        if (payload.role=='ADMIN')
            window.location.href = "../paginas/paginaAdmin.html";
        else
            window.location.href = "../paginas/paginaPrincipal.html";
    } catch (erro) {
        console.error(erro);

        msgerro.innerText = "Email ou senha inválidos!";
    }


//  window.location.href = "http://localhost:5500/index.html"; //Mudar o location
}

