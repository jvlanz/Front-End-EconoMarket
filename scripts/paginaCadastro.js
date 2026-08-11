function cadastrar() {


    const email = document.getElementById("email-cadastro")
    const senha = document.getElementById("senha-cadastro")
    const nome = document.getElementById("nome-cadastro")
    const telefone = document.getElementById("telefone-cadastro")
    const msgerro = document.getElementById("mensagem-erro")


    if (email.value === "") {
        email.focus
        msgerro.inner = "Por favor, Preencha todos os campos!"
    }

    const novoCliente = {
        email: email.value,
        senha: senha.value,
        nome: nome.value,
        telefone: telefone.value
    }
    localStorage.setItem("novoCliente", JSON.stringify(novoCliente))

    //futura feature de verificação de login

    //window.location.href = "";
}