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

async function editarCadastro(){
    const token = sessionStorage.getItem("token");

    if (!token) {
        window.location.href = "paginaLogin.html";
        return;
    }

    const payload = JSON.parse(atob(token.split(".")[1]));

    const id = payload.id;

    const nome = document.getElementById("nome-cadastro").value;
    const email = document.getElementById("email-cadastro").value;
    
    const cliente{
        nome: nome,
        email: 
    }
}