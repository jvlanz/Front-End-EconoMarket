
var cliente
var mercados
var listaPrecos = []

async function obterDadosCarrinho() { // buscas no banco de dados
    const respostaC = await fetch("http://localhost:8080/clientes/1");
    if (!respostaC.ok) {
        console.error("Erro ao buscar cliente");
        return;
    }
    cliente = await respostaC.json();

    const respostaM = await fetch("http://localhost:8080/mercados");
    if (!respostaM.ok) {
        console.error("Erro ao buscar mercados");
        return;
    }
    mercados = await respostaM.json()

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
    }
    ordenarMercados()
    gerarTabelaCarrinho()
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

function gerarTabelaCarrinho() { // insere thead, tbody e tfoot
    tab = document.getElementById('tabelaCarrinho')
    tab.innerHTML = ''
    thead = document.createElement('thead')
    tab.appendChild(thead)
    tr = document.createElement('tr')
    tr.id = 'trHead'
    thead.appendChild(tr)
    tr.innerHTML = '<th>Produto</th><th>Marca</th>'
    tbody = document.createElement('tbody')
    tab.appendChild(tbody)
    tfoot = document.createElement('tfoot')
    tab.appendChild(tfoot)
    tr = document.createElement('tr')
    tr.id = 'trTotal'
    tfoot.appendChild(tr)
    tr = document.createElement('tr')
    tr.id = 'trEconomia'
    tfoot.appendChild(tr)
    preencherTabelaCarrinho()
}

async function preencherTabelaCarrinho() { // preenche tbody com produtos e campos para N mercados
    nMercados = document.getElementById('nMercados').value
    if (nMercados>mercados.length) {
        nMercados = mercados.length
        document.getElementById('nMercados').value = mercados.length
    }
    tr = document.getElementById('trHead')
    for (n=0; n<nMercados; n++) {
        tr.innerHTML += '<th>'+mercados[n].nome+'</th>'
    }
    tr.innerHTML += '<th></th>'    // coluna extra para botão remover
    tbody = document.getElementsByTagName('tbody')[0]
    nItens = cliente.listaCompra.length
    for (n=0; n<nItens; n++) {
        item = cliente.listaCompra[n]
        const precos = listaPrecos[n].precos
        tr = document.createElement('tr')
        tbody.appendChild(tr)
        td = document.createElement('td')
        td.innerHTML = '<img src=../imagens/'+item.produto.figura+' height=50px></img>'+item.produto.descricao
        td.style.backgroundColor = 'white'
        td.style.borderRadius = '10px'
        tr.appendChild(td)
        td = document.createElement('td')
        tr.appendChild(td)
        sel = document.createElement('select')
        sel.onchange = function () { preencherValores(nItens, nMercados) }
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
        for (nm=0; nm<nMercados; nm++) {
            mercado = mercados[nm]
            td = document.createElement('td')
            td.style.textAlign = 'center'
            tr.appendChild(td)
            const mercadoRadio = document.createElement('input')
            mercadoRadio.setAttribute('class', 'checkbox')
            mercadoRadio.type = 'radio'
            mercadoRadio.id = 'rad'+n+mercado.id
            mercadoRadio.name = 'rad'+n
            mercadoRadio.disabled = true
            label = document.createElement('label')
            label.id = 'lab'+n+mercado.id
            label.innerHTML = ''
            td.appendChild(mercadoRadio)
            td.appendChild(label)
        }
        td = document.createElement('td')
        td.innerHTML = '<button id="remover" onclick="removerItem('+item.id+','+n+')">remover</button>'
        tr.appendChild(td)
    }
    preencherValores(nItens, nMercados)
    selecionarMinimos(nItens, nMercados)
    atualizarValores(nItens, nMercados)
}

function preencherValores(nItens, nMercados) { // insere valores dos produtos para cada mercado (se estiverem disponíveis)
    nItens = cliente.listaCompra.length
    for (n=0; n<nItens; n++) {
        item = cliente.listaCompra[n]
        marca = document.getElementById('sel'+item.produto.id).value
        for (nm=0; nm<nMercados; nm++) {
            mercado = mercados[nm]
            lab = document.getElementById('lab'+n+mercado.id)
            rad = document.getElementById('rad'+n+mercado.id)
            lab.innerHTML = ''
            rad.disabled = true
            val = 99999
            for (p=0; p<listaPrecos.length; p++)
                if (listaPrecos[p].id==item.produto.id) {
                    precos = listaPrecos[p].precos
                    break
                }
            precos.forEach(preco => {
                if (item.produto.id==preco.produtoMarca.produto.id && mercado.id==preco.mercado.id) {
                    if (marca!='' && marca!=preco.produtoMarca.marca.marca)
                        return
                    if (preco.preco<val) {
                        val = preco.preco * item.quantidade / preco.produtoMarca.produto.valorMedida
                        lab.innerHTML = 'R$ '+val.toFixed(2)
                        rad.disabled = ''
                        rad.onclick = function() { atualizarValores(nItens, nMercados) }
                    }
                }
            })
        }
    }
}

function selecionarMinimos(nItens, nMercados) { // seleção automática dos radio buttons
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

function atualizarValores(nItens, nMercados) { // altera valores no rodapé da tabela, que mudam conforme a seleção de produtos
    trT = document.getElementById('trTotal')
    trE = document.getElementById('trEconomia')
    trT.innerHTML = '<th>Total/Mercado</th><th></th>'
    trE.innerHTML = '<th>Economia</th><th></th>'
    const total = []
    const economia = []
    for (nm=0; nm<nMercados; nm++) {
        total.push(0)
        economia.push(0)
    }
    for (ni=0; ni<nItens; ni++) {
        precoMedio = 0
        nPrecos = 0
        minVal = 99999
        for (nm=0; nm<nMercados; nm++) {
            val = Number(document.getElementById('lab'+ni+mercados[nm].id).innerHTML.split(' ')[1])
            if (val && val < minVal) {
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

function removerItem(id,n) { // remove item da listaCompra no banco de dados, bem como da listaCompra local (e da lista de preços)
    fetch("http://localhost:8080/listaCompra/"+id, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            console.log('item '+id+' removido')
            gerarTabelaCarrinho()
        } else {
            console.error('erro ao remover produto:', response.status);
        }
    })
    .catch(error => console.error('erro com a operação fetch:', error))
    const qtdCarrinho = document.getElementsByClassName('quantidade-carrinho')[0]
    val = qtdCarrinho.innerHTML
    cliente.listaCompra.splice(n,1)
    listaPrecos.splice(n,1)
    qtdCarrinho.innerHTML = Number(val)-1
}
