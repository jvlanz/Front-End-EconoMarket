const token = sessionStorage.getItem("token");
if (token==null || obterTokenRole(token)!='ADMIN') {
    window.location.href = "../paginas/paginaPrincipal.html";
}

var produtos = []
var clientes = []

async function preencherDadosAdmin(busca=null) {
    const resposta = await fetch("http://localhost:8080/produtos");
    if (!resposta.ok) {
        console.error("Erro ao buscar produtos");
        return;
    }
    produtos = await resposta.json();
    inserirProdutos(busca)
}

function inserirProdutos(busca) {
    tab = document.getElementById('tabProdutos')
    tab.innerHTML = ''
    tab.innerHTML += '<thead><td>Produto</td><td>Categoria</td><td>Figura</td></thead>'
    if (busca==null||busca=='') {
        tab.innerHTML = 'filtre os produtos usando a barra de busca'
        return
    }
    produtos.forEach(produto => {
        // filtrar por busca
        if (!filtrar(produto.descricao, busca)) {
             return
        }
        tab.innerHTML += '<tr><td>'+produto.descricao+'</td><td>'+produto.categoria.categoria+'</td><td>'+produto.figura+'</td><td><button>ALTERAR</button></td></tr>'
    })
}

function buscar(input) {
    if (event.key==="Enter") {
        window.open('paginaAdmin.html?busca='+input.value, '_self')
    }
}

function filtrar(nomeProduto, filtros) {
    res = true
    filtros.split(' ').forEach(filtro => {
        if (!nomeProduto.toLowerCase().includes(filtro.toLowerCase()))
            res = false
        return
    })
    return res
}

