const token = sessionStorage.getItem("token");
if (token==null || obterTokenRole(token)!='ADMIN') {
    window.location.href = "../paginas/paginaPrincipal.html";
}

var produtos = []
var clientes = []
var categorias = ['Hortifruti', 'Açougue', 'Frios e Laticínios', 'Congelados', 'Mercearia', 'Limpeza', 'Higiene e Beleza', 'Bebidas', 'Utilidades', 'Padaria', 'Pets']

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
    tab.innerHTML += '<thead><th>Produto</th><th>Categoria</th><th>Figura</th></thead>'
//  if (busca==null||busca=='') {
//      tab.innerHTML = 'filtre os produtos usando a barra de busca'
//      return
//  }
    produtos.sort((a, b) => a.descricao.localeCompare(b.descricao));
    produtos.forEach(produto => {
        // sem busca, mostrar por padrão produtos sem categoria; senão, filtrar por busca
        if (busca==null && produto.categoria.categoria!='') {
            return
        } else if (!filtrar(produto.descricao, busca)) {
            return
        }
        tr = document.createElement('tr')
        tab.appendChild(tr)
        tdDescr = document.createElement('td')
        tdDescr.innerHTML = produto.descricao
        tdCateg = document.createElement('td')
        selCateg = document.createElement('select')
        selCateg.id = 'categ'+produto.id
        id = 1
        categorias.forEach(categoria => {
            var opt = document.createElement('option')
            opt.innerHTML = categoria
            opt.value = `${id}`
            selCateg.appendChild(opt)
            id += 1
        })
        selCateg.value = produto.categoria.id
        tdCateg.appendChild(selCateg)
        tdFigura = document.createElement('td')
        figInput = document.createElement('input')
        figInput.value = produto.figura
        figInput.id = 'fig'+produto.id
        tdFigura.appendChild(figInput)
        tdAlterar = document.createElement('td')
        btAlterar = document.createElement('button')
        btAlterar.innerHTML = 'alterar'
        btAlterar.setAttribute('class', 'botao')
        btAlterar.onclick = () => { alterar(produto) }
        tdAlterar.appendChild(btAlterar)
        tr.appendChild(tdDescr)
        tr.appendChild(tdCateg)
        tr.appendChild(tdFigura)
        tr.appendChild(tdAlterar)
    })
}

function alterar(produto) {
    idProduto = produto.id
    selCateg = document.getElementById('categ'+idProduto)
    figInput = document.getElementById('fig'+idProduto)
    produtoRequest = {}
    produtoRequest.id = produto.id
    produtoRequest.descricao = produto.descricao
    produtoRequest.idCategoria = selCateg.value
    produtoRequest.medida = produto.medida
    produtoRequest.valorMedida = produto.valorMedida
    produtoRequest.precoMin = produto.precoMin
    produtoRequest.precoMax = produto.precoMax
    produtoRequest.figura = figInput.value
    res = alterarProduto(produtoRequest)
//  console.log(idProduto + ' ' + selCateg.value + ' ' + figInput.value)
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

