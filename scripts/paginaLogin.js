function entrar(event) {


    const email = document.getElementById("emailinp")
    const senha = document.getElementById("senhainp")

    const novoCliente = {
        email: email.value,
        senha: senha.value
    }


    //futura feature de verificação de login

    window.location.href = "http://localhost:5500/index.html"; //Mudar o location
}

function abrirCadastro() {
    window.location.href = "../paginaCadastro/paginaCadastro.html";
}