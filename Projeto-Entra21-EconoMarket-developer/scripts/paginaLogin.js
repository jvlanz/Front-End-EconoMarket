function entrar(event) {

    const email = document.getElementById("emailinp")
    const senha = document.getElementById("senhainp")
    const msgerro = document.getElementById("mensagem-erro")

    const novoLogin = {
        email: email.value,
        senha: senha.value
    }
    if (email == "" || senha == ""){
        msgerro.innerHTML = "Por favor, preencha todos os campos!";
    }

    


    //futura feature de verificação de login

    window.location.href = "http://localhost:5500/index.html"; //Mudar o location
}

