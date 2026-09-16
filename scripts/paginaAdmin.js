const token = sessionStorage.getItem("token");
if (obterTokenRole(token)!='ADMIN') {
    window.location.href = "../paginas/paginaPrincipal.html";
}

var produtos = []
var clientes = []

async function preencherDadosAdmin() {
    const respostaP = await fetch("http://localhost:8080/produtos");
    if (!respostaP.ok) {
        console.error("Erro ao buscar produtos");
        return;
    }
    produtos = await respostaP.json();
    //console.log(produtos.length)
    const respostaC = await fetch("http://localhost:8080/clientes", {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    });
    if (!respostaC.ok) {
        console.error("Erro ao buscar clientes");
    }
    clientes = await respostaC.json();
    inserirClientes()
    inserirProdutos()
}

function inserirClientes() {
    tab = document.getElementById('tabClientes')
    tab.innerHTML = ''
    tab.innerHTML += '<thead><td>Login</td><td>Nome</td><td>Role</td></thead>'
    clientes.forEach(cliente => {
        tab.innerHTML += '<tr><td>'+cliente.email+'</td><td>'+cliente.nome+'</td><td>'+cliente.role+'</td><td><button>ALTERAR</button></td><td><button>REMOVER</button></td></tr>'
    })
}

function inserirProdutos() {
    tab = document.getElementById('tabProdutos')
    tab.innerHTML = ''
    tab.innerHTML += '<thead><td>Produto</td><td>Categoria</td><td>Figura</td></thead>'
    produtos.forEach(produto => {
        tab.innerHTML += '<tr><td>'+produto.descricao+'</td><td>'+produto.categoria.categoria+'</td><td>'+produto.figura+'</td><td><button>ALTERAR</button></td></tr>'
    })
}
