
var cliente
var mercados
var promocoes
var listaPrecos = []
const total = []
const economia = []
todosMercados = []

async function obterDadosCarrinho() { // buscas no banco de dados
    const token = sessionStorage.getItem("token");
    if (token!=null) {
        const respostaC = await fetch("http://localhost:8080/auth/cliente", {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!respostaC.ok) {
            console.error("Erro ao buscar cliente");
            return;
        }
        cliente = await respostaC.json();
    } else { // recriar lista de compras a partir de dados salvos em sessionStorage
        cliente = {listaCompra:[]}
//      cliente.listaCompra = JSON.parse(sessionStorage.getItem("listaCompra")) || []
        lista = JSON.parse(sessionStorage.getItem("listaCompra")) || []
        lista.forEach(item => {
            item.produto = {}
            item.produto.id = item.id
            cliente.listaCompra.push(item)
        })
    }

    const respostaM = await fetch("http://localhost:8080/mercados");
    if (!respostaM.ok) {
        console.error("Erro ao buscar mercados");
        return;
    }
    mercados = await respostaM.json()
    for (nm=0; nm<mercados.length; nm++) {
        total.push(0)
        economia.push(0)
    }
    const respostaP = await fetch("http://localhost:8080/promocoes");
    if (!respostaP.ok) {
        console.error("Erro ao buscar promoções");
        return;
    }
    promocoes = await respostaP.json();

    nItens = cliente.listaCompra.length
    for (n=0; n<nItens; n++) {
        item = cliente.listaCompra[n]
        const respostaP = await fetch("http://localhost:8080/precos/"+item.produto.id);
        if (!respostaP.ok) {
            console.error("Erro ao buscar preços");
            return;
        }
        const precos = await respostaP.json();
        listaPrecos.push( {id:item.produto.id, precos:precos} )
        if (token==null && precos.length>0) {
            cliente.listaCompra[n].produto.descricao = precos[0].produtoMarca.produto.descricao
            cliente.listaCompra[n].produto.medida = precos[0].produtoMarca.produto.medida
            cliente.listaCompra[n].produto.figura = precos[0].produtoMarca.produto.figura
        }
    }
//    ordenarMercados()
//    gerarTabelaCarrinho()
    preencherCarrinho()
}

function preencherCarrinho() {
    const divProdutos = document.getElementsByClassName('produtos')[0]
    ni = 0
    cliente.listaCompra.forEach(item => {
        const divProduto = document.createElement('div')
        divProduto.setAttribute('class', 'produto')
        divProdutos.appendChild(divProduto)
        const divDescricao = document.createElement('div')
        divDescricao.setAttribute('class', 'descricao-produto')
        divProduto.appendChild(divDescricao)
        const imagem = document.createElement('img')
        imagem.src='../imagens/'+item.produto.figura
        divDescricao.appendChild(imagem)
        const divNomeCategoria = document.createElement('div')
        divNomeCategoria.setAttribute('class', 'nome-categoria-produto')
        divDescricao.appendChild(divNomeCategoria)
        const pNome = document.createElement('p')
        pNome.setAttribute('class', 'nome-produto')
        pNome.innerHTML = item.produto.descricao
        divNomeCategoria.appendChild(pNome)
//      const pCategoria = document.createElement('p')
//      pCategoria.setAttribute('class', 'categoria-produto')
//      pCategoria.innerHTML = item.produto.categoria.categoria
//      divNomeCategoria.appendChild(pCategoria)
//
        selMarca = document.createElement('select')
        selMarca.id = 'selMarca'+item.produto.id
        divNomeCategoria.appendChild(selMarca)
        selMercado = document.createElement('select')
        selMercado.id = 'selMercado'+item.produto.id
        divNomeCategoria.appendChild(selMercado)
        preencherDadosItem(ni)
        ni += 1
//
//
        const divQuantidadeLixo = document.createElement('div')
        divQuantidadeLixo.setAttribute('class', 'quantidade-lixo')
        divProduto.appendChild(divQuantidadeLixo)
        const divQuantidade = document.createElement('div')
        divQuantidade.setAttribute('class', 'quantidade-div')
        divQuantidadeLixo.appendChild(divQuantidade)
        const btRem = document.createElement('button')
        btRem.setAttribute('class', 'botaoPequeno')
        btRem.innerHTML = '–'
        divQuantidade.appendChild(btRem)
        const qtd = document.createElement('span')
        qtd.id = 'qtd'
        qtd.innerHTML = item.quantidade+' '+item.produto.medida
        divQuantidade.appendChild(qtd)
        const btAdd = document.createElement('button')
        btAdd.setAttribute('class', 'botaoPequeno')
        btAdd.innerHTML = '+'
        divQuantidade.appendChild(btAdd)
        const divLixo = document.createElement('div')
        divLixo.setAttribute('class', 'imagem-lixo')
        divQuantidadeLixo.appendChild(divLixo)
    })
}

function preencherDadosItem(ni) {
    const item = cliente.listaCompra[ni]
    const precos = listaPrecos[ni].precos
    const selMarca = document.getElementById('selMarca'+item.produto.id)
    const selMercado = document.getElementById('selMercado'+item.produto.id)
//  sel.onchange = function () { preencherValores() }
    optMarca = document.createElement('option')
    optMarca.value = ''
    selMarca.appendChild(optMarca)
    const marcas = []
    optMercado = document.createElement('option')
    optMercado.value = ''
    selMercado.appendChild(optMercado)
    mercados = []
    divMercados = document.getElementById('todos-mercados')
    divPrecos = document.getElementById('mercados-preco')
    precos.forEach(preco => {
        if (preco.produtoMarca.marca.marca!='' && marcas.indexOf(preco.produtoMarca.marca.id)==-1) { // há produtos sem marca, mas já adicionamos marca='' como 1a opção em selMarcas
            marcas.push(preco.produtoMarca.marca.id)
            var optMarca = document.createElement('option')
            optMarca.value = preco.produtoMarca.marca.marca
            optMarca.innerHTML = preco.produtoMarca.marca.marca
            selMarca.appendChild(optMarca)
        }
        if (mercados.indexOf(preco.mercado.id)==-1) {
            mercados.push(preco.mercado.id)
            var optMercado = document.createElement('option')
            optMercado.value = preco.mercado.nome
            optMercado.innerHTML = preco.mercado.nome
            selMercado.appendChild(optMercado)
        }
        if (todosMercados.indexOf(preco.mercado.id)==-1) {
            divMercados.innerHTML += '<input type="checkbox" id="check'+preco.mercado.id+'" class="mercado-checkbox" checked=on>'
            divMercados.innerHTML += '<label for="check'+preco.mercado.id+'" class="mercado">'+preco.mercado.nome+'</label>'
            todosMercados.push(preco.mercado.id)
            divMercado = document.createElement('div')
            divMercado.setAttribute('class', 'mercado-preco')
            divPrecos.appendChild(divMercado)
            divMercado.innerHTML += '<p>'+preco.mercado.nome+'</p>'
            divMercado.innerHTML += '<p id=precoMercado'+preco.mercado.id+'> R$ 220,00</p>'
        }
    })
}

function ordenarMercados() { // coloca lista de mercados em ordem decrescente de 'economia'...
    let economia = []
    for (nm=0; nm<mercados.length; nm++)
        economia.push(0)
    nItens = listaPrecos.length
    for (ni=0; ni<nItens; ni++) {
        precoMedio = 0
        nPrecos = 0
        precos = listaPrecos[ni].precos
        for (np=0; np<precos.length; np++) {
            precoMedio = (precoMedio*nPrecos + precos[np].preco) / (nPrecos+1)
            nPrecos += 1
        }
        for (nm=0; nm<mercados.length; nm++) {
            for (np=0; np<precos.length; np++) {
                if (precos[np].mercado.id==mercados[nm].id) {
                    economia[nm] += (precoMedio - precos[np].preco)
                    break
                }
            }
        }
    }
    fmercados = []
    minVal = Math.min(...economia)
    while (fmercados.length<mercados.length) {
        maxVal = Math.max(...economia)
        fmercados.push(mercados[economia.indexOf(maxVal)])
        economia[economia.indexOf(maxVal)] = minVal-1
    }
    mercados = fmercados
}

async function preencherTabelaCarrinho() { // preenche tbody com produtos e campos para N mercados
    nMercados = document.getElementById('nMercados').value
    if (nMercados>mercados.length) {
        nMercados = mercados.length
        document.getElementById('nMercados').value = mercados.length
    }
    tr = document.getElementById('trHead')
    for (nm=0; nm<nMercados; nm++) {
        tr.innerHTML += '<th>'+mercados[nm].nome+'</th>'
    }
    tr.innerHTML += '<th></th>'    // coluna extra para botão remover
    tbody = document.getElementsByTagName('tbody')[0]
    nItens = cliente.listaCompra.length
    for (ni=0; ni<nItens; ni++) {
        item = cliente.listaCompra[ni]
        const precos = listaPrecos[ni].precos
        tr = document.createElement('tr')
        tbody.appendChild(tr)
        td = document.createElement('td')
        td.innerHTML = '<img src=../imagens/'+item.produto.figura+' height=50px></img>'+item.produto.descricao
        td.style.backgroundColor = 'white'
        td.style.borderRadius = '10px'
        tr.appendChild(td)
        td = document.createElement('td')   // marca
        tr.appendChild(td)
        sel = document.createElement('select')
        sel.onchange = function () { preencherValores() }
        sel.id = 'sel'+item.produto.id
        td.appendChild(sel)
        opt = document.createElement('option')
        opt.value = ''
        sel.appendChild(opt)
        const marcas = []
        precos.forEach(preco => {
            if (marcas.indexOf(preco.produtoMarca.marca.id)==-1) {
                marcas.push(preco.produtoMarca.marca.id)
                var opt = document.createElement('option')
                opt.value = preco.produtoMarca.marca.marca
                opt.innerHTML = preco.produtoMarca.marca.marca
                sel.appendChild(opt)
            }
        })
        td = document.createElement('td')   // quantidade
        td.style.textAlign = 'center'
        tr.appendChild(td)
        qtd = document.createElement('span')
        qtd.id = 'qtd'+ni
        td.appendChild(qtd)
        for (nm=0; nm<mercados.length; nm++) {
            mercado = mercados[nm]
            td = document.createElement('td')
            td.style.textAlign = 'center'
            tr.appendChild(td)
            promocoes.forEach(promocao => {
                if (promocao.preco.produtoMarca.produto.id==item.produto.id && promocao.preco.mercado.id==mercado.id) {
                    td.setAttribute("class", "fundoDestaque")
                }
            })
            const rad = document.createElement('input')
            rad.setAttribute('class', 'checkbox')
            rad.type = 'radio'
            rad.id = 'rad'+ni+mercado.id
            rad.name = 'rad'+ni
            rad.disabled = true
            label = document.createElement('label')
            label.id = 'lab'+ni+mercado.id
            label.innerHTML = ''
            td.appendChild(rad)
            td.appendChild(label)
            if (nm>=nMercados) { td.style.display='none' }
        }
        td = document.createElement('td')
        td.innerHTML = '<button class="remover" onclick="remover('+item.id+','+ni+')">remover</button>'
        tr.appendChild(td)
    }
    preencherValores()
    selecionarMinimos()
    atualizarValores()
}

function preencherValores() { // insere valores dos produtos para cada mercado (se estiverem disponíveis)
    nMercados = document.getElementById('nMercados').value
    nItens = cliente.listaCompra.length
    for (ni=0; ni<nItens; ni++) {
        qtd = document.getElementById('qtd'+ni)
        item = cliente.listaCompra[ni]
        qtd.innerHTML = item.quantidade + item.produto.medida
        marca = document.getElementById('sel'+item.produto.id).value
        for (nm=0; nm<mercados.length; nm++) {
            mercado = mercados[nm]
            lab = document.getElementById('lab'+ni+mercado.id)
            rad = document.getElementById('rad'+ni+mercado.id)
            lab.innerHTML = ''
            rad.disabled = true
            val = 99999
            for (np=0; np<listaPrecos.length; np++)
                if (listaPrecos[np].id==item.produto.id) {
                    precos = listaPrecos[np].precos
                    break
                }
            precos.forEach(preco => {
                if (preco.produtoMarca.produto.id==item.produto.id && preco.mercado.id==mercado.id) {
                    if (marca!='' && marca!=preco.produtoMarca.marca.marca)
                        return
                    if (preco.preco<val) {
                        val = preco.preco * item.quantidade / preco.produtoMarca.produto.valorMedida
                        lab.innerHTML = 'R$ '+val.toFixed(2)
                        rad.disabled = ''
                        rad.value = preco.id
                        rad.onclick = function() { atualizarValores() }
                    }
                }
            })
        }
    }
}

function selecionarMinimos() { // seleção automática dos radio buttons
    nMercados = document.getElementById('nMercados').value
    nItens = cliente.listaCompra.length
    for (ni=0; ni<nItens; ni++) {
        minVal = 99999
        minRad = 0
        for (nm=0; nm<nMercados; nm++) {
            rad = document.getElementById('rad'+ni+mercados[nm].id).checked
            val = Number(document.getElementById('lab'+ni+mercados[nm].id).innerHTML.split(' ')[1])
            if (val && val < minVal) {
                minVal = val
                minRad = mercados[nm].id
            }
        }
        if (minRad>0)
            document.getElementById('rad'+ni+minRad).checked = true
    }
}

function atualizarValores() { // altera valores no rodapé da tabela, que mudam conforme a seleção de produtos
    trT = document.getElementById('trTotal')
    trE = document.getElementById('trEconomia')
    trT.innerHTML = '<th>Total/Mercado</th><th></th><th></th>'
    trE.innerHTML = '<th>Economia</th><th></th><th></th>'
    nMercados = document.getElementById('nMercados').value
    nItens = cliente.listaCompra.length
    for (nm=0; nm<nMercados; nm++) {
        total[nm] = 0
        economia[nm] = 0
    }
    for (ni=0; ni<nItens; ni++) {
        precoMedio = 0
        nPrecos = 0
        for (nm=0; nm<mercados.length; nm++) {
            val = Number(document.getElementById('lab'+ni+mercados[nm].id).innerHTML.split(' ')[1])
            if (val) {
                precoMedio = (precoMedio*nPrecos + val) / (nPrecos+1)
                nPrecos += 1
            }
        }
        for (nm=0; nm<nMercados; nm++) {
            rad = document.getElementById('rad'+ni+mercados[nm].id).checked
            if (rad) {
                val = Number(document.getElementById('lab'+ni+mercados[nm].id).innerHTML.split(' ')[1])
                total[nm] += val
                economia[nm] += (precoMedio - val)
            }
        }
    }
    for (nm=0; nm<nMercados; nm++) {
        trT.innerHTML += `<th>R$ ${total[nm].toFixed(2)}</th>`
        trE.innerHTML += `<th>R$ ${economia[nm].toFixed(2)}</th>`
    }
}

function remover(id,n) { // remove item da listaCompra no banco de dados, bem como da listaCompra local (e da lista de preços)
    removerItem(id)
    const qtdCarrinho = document.getElementsByClassName('quantidade-carrinho')[0]
    val = qtdCarrinho.innerHTML
    cliente.listaCompra.splice(n,1)
    listaPrecos.splice(n,1)
    qtdCarrinho.innerHTML = Number(val)-1
    gerarTabelaCarrinho()
}

function gerarLista() {
    listas = []
    for (ni=0; ni<cliente.listaCompra.length; ni++) {
        selRad = document.querySelector('input[name=rad'+ni+']:checked')
        if (selRad==null)
            continue
        idPreco = selRad.value
        for (np=0; np<listaPrecos[ni].precos.length; np++) {
            if (listaPrecos[ni].precos[np].id==idPreco) {
                textoItem  = listaPrecos[ni].precos[np].produtoMarca.produto.descricao + ' '
                textoItem += listaPrecos[ni].precos[np].produtoMarca.marca.marca + ', '
//              textoItem += listaPrecos[ni].precos[np].mercado.nome + ' '
                textoItem += cliente.listaCompra[ni].quantidade
                textoItem += listaPrecos[ni].precos[np].produtoMarca.produto.medida + ' por '
                textoItem += 'R$ ' + (listaPrecos[ni].precos[np].preco * cliente.listaCompra[ni].quantidade / listaPrecos[ni].precos[np].produtoMarca.produto.valorMedida).toFixed(2) + ' '
                textoItem += '(R$ ' + listaPrecos[ni].precos[np].preco
                textoItem += '/' + listaPrecos[ni].precos[np].produtoMarca.produto.valorMedida
                textoItem += listaPrecos[ni].precos[np].produtoMarca.produto.medida + ')'
                if (listas[listaPrecos[ni].precos[np].mercado.id]==null) {
                    listas[listaPrecos[ni].precos[np].mercado.id] = []
                }
                listas[listaPrecos[ni].precos[np].mercado.id].push(textoItem)
                break
            }
        }
    }
    return listas
}

function mostrarLista() {
    listas = gerarLista()
    nMercados = document.getElementById('nMercados').value
    div = document.getElementById('listaCompra')
    div.innerHTML = ''
    for (nm=0; nm<nMercados; nm++) {
        if (listas[mercados[nm].id]==null)
            continue
        div.innerHTML += '<h3>'+mercados[nm].nome+' (R$ '+total[nm].toFixed(2)+')</h3>'
        ul = document.createElement('ul')
        div.appendChild(ul)
        for (np=0; np<listas[mercados[nm].id].length; np++)
            ul.innerHTML += '<li>' + listas[mercados[nm].id][np]+'</li>'
    }
    window.location.href = "paginaCarrinho.html#lista"
}

function copiarLista() {
    listas = gerarLista()
    texto = ''
    for (nm=0; nm<nMercados; nm++) {
        if (listas[mercados[nm].id]==null)
            continue
        texto += '\n'+mercados[nm].nome+'\n'
        for (np=0; np<listas[mercados[nm].id].length; np++)
            texto += '- ' + listas[mercados[nm].id][np]+'\n'
    }
    navigator.clipboard.writeText(texto)
    window.alert('lista copiada para o clipboard')
}
