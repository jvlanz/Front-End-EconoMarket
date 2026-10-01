
var cliente = {id:null} // se logar, irá sobrescrever esse valor
var mercados
var promocoes
var listaPrecos = []
var totalMercado = []
var nMercados = 1

async function obterDadosCarrinho() { // buscas no banco de dados
    const token = sessionStorage.getItem("token");
    if (token!=null) {
        const respostaC = await fetch("https://api-economarket.onrender.com/auth/cliente", {
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
        cliente.listaCompra = JSON.parse(sessionStorage.getItem("listaCompra")) || []
    }

    const respostaM = await fetch("https://api-economarket.onrender.com/mercados");
    if (!respostaM.ok) {
        console.error("Erro ao buscar mercados");
        return;
    }
    mercados = await respostaM.json()
    const respostaP = await fetch("https://api-economarket.onrender.com/promocoes");
    if (!respostaP.ok) {
        console.error("Erro ao buscar promoções");
        return;
    }
    promocoes = await respostaP.json();

    nItens = cliente.listaCompra.length
    for (n=0; n<nItens; n++) {
        item = cliente.listaCompra[n]
        const respostaP = await fetch("https://api-economarket.onrender.com/precos/"+item.produto.id);
        if (!respostaP.ok) {
            console.error("Erro ao buscar preços");
            return;
        }
        const precos = await respostaP.json();
        listaPrecos.push( {id:item.id, precos:precos} ) // OBS era id:item.precos.id
        if (token==null && precos.length>0) {
            cliente.listaCompra[n].produto.descricao = precos[0].produtoMarca.produto.descricao
            cliente.listaCompra[n].produto.medida = precos[0].produtoMarca.produto.medida
            cliente.listaCompra[n].produto.figura = precos[0].produtoMarca.produto.figura
        }
    }
    preencherCarrinho()
    inserirMercados()
    ordenarMercados()
    ativarMercados(1)
//  selecionarMinimos()
}

function ativarMercados(n) {
    nMercados = n
//  nMercados = document.getElementById('nMercados').value
    for (nm=0; nm<mercados.length; nm++) {
        checkMercado = document.getElementById('check'+mercados[nm].id)
        checkMercado.checked = ''
        if (nm < nMercados)
            checkMercado.checked = 'on'
    }
    ativarBotoes()
}

function toggleCheckMercados() {
//  document.getElementById('nMercados').value =
    nMercados = document.querySelectorAll('input[class="mercado-checkbox"]:checked').length
    ativarBotoes()
}

function ativarBotoes() {
    for (nm=1; nm<=mercados.length; nm++) {
        btNMercados = document.getElementById('nMercados'+nm)
        if (nm<nMercados)
            btNMercados.setAttribute('class', 'btMercados-pre')
        else if (nm==nMercados)
            btNMercados.setAttribute('class', 'btMercados')
        else
            btNMercados.setAttribute('class', 'btMercados-pos')
    }
}

function preencherCarrinho() {
    const divProdutos = document.getElementsByClassName('produtos')[0]
    ni = 0
    cliente.listaCompra.forEach(item => {
        const divProduto = document.createElement('div')
        divProduto.setAttribute('class', 'produto')
        divProdutos.appendChild(divProduto)
    
        const divDescricao = document.createElement('a')
        divDescricao.setAttribute('class', 'descricao-produto')
        divDescricao.href = 'paginaProduto.html?produto='+item.produto.id
        divProduto.appendChild(divDescricao)
        const divImagem = document.createElement('div')
        divImagem.setAttribute('class', 'imagem-produto')
        divDescricao.appendChild(divImagem)
        const imagem = document.createElement('img')
        imagem.src='../imagens/'+item.produto.figura
        divImagem.appendChild(imagem)
        const divNomeCategoria = document.createElement('div')
        divNomeCategoria.setAttribute('class', 'nome-categoria-produto')
        divDescricao.appendChild(divNomeCategoria)

        const divNomeProduto = document.createElement('div')
        divNomeProduto.setAttribute('class', 'nome-produto')
        divNomeCategoria.appendChild(divNomeProduto)
        const divCategoriaProduto = document.createElement('div')
        divCategoriaProduto.setAttribute('class', 'categoria-produto')
        divNomeCategoria.appendChild(divCategoriaProduto)
        const pNome = document.createElement('p')
        pNome.setAttribute('class', 'nome-produto')
        pNome.innerHTML = item.produto.descricao
        divNomeCategoria.appendChild(pNome)
//      const pCategoria = document.createElement('p')
//      pCategoria.setAttribute('class', 'categoria-produto')
//      pCategoria.innerHTML = item.produto.categoria.categoria
//      divNomeCategoria.appendChild(pCategoria)

        const divMarcaMercado = document.createElement('div')
        divMarcaMercado.setAttribute('class', 'divs')
        divProduto.appendChild(divMarcaMercado)
        divProduto.id = 'produto'+item.produto.id

        selMarca = document.createElement('select')
        selMarca.setAttribute('class', 'selecionar-marca')
        selMarca.id = 'selMarca'+item.produto.id
        selMarca.onchange = () => { ordenarMercados() }
        divMarcaMercado.appendChild(selMarca)
        selMercado = document.createElement('select')
        selMercado.setAttribute('class', 'selecionar-mercado')
        selMercado.id = 'selMercado'+item.produto.id
        selMercado.style.display = 'none'
        divMarcaMercado.appendChild(selMercado)
        preencherDadosItem(ni)

        const divQuantidadeLixo = document.createElement('div')
        divQuantidadeLixo.setAttribute('class', 'quantidade-lixo')
        divProduto.appendChild(divQuantidadeLixo)
        const divQuantidade = document.createElement('div')
        divQuantidade.setAttribute('class', 'quantidade-div')
        divQuantidadeLixo.appendChild(divQuantidade)
        const btRem = document.createElement('button')
        btRem.setAttribute('class', 'botaoPequeno')
        btRem.innerHTML = '–'
        btRem.id = 'rem'+item.produto.id
        divQuantidade.appendChild(btRem)
        const qtd = document.createElement('span')
        qtd.id = 'quantidade'+item.produto.id
        if (item.quantidade % 1 > 0)
            qtd.innerHTML = item.quantidade.toFixed(2).replace('.',',')+' '+item.produto.medida
        else
            qtd.innerHTML = item.quantidade+' '+item.produto.medida
        divQuantidade.appendChild(qtd)
        const btAdd = document.createElement('button')
        btAdd.setAttribute('class', 'botaoPequeno')
        btAdd.innerHTML = '+'
        btAdd.id = 'add'+item.produto.id
        divQuantidade.appendChild(btAdd)

        const medida = listaPrecos[ni].precos[0].produtoMarca.produto.medida
        let quantidade = listaPrecos[ni].precos[0].produtoMarca.produto.valorMedida
        if (medida=='kg' && quantidade==1) quantidade = 0.1 // adicionar quantidades fracionadas
        btRem.onclick = async () => { qtd.innerHTML = await removerQuantidadePagina(cliente.id, item.produto.id, quantidade, medida) }
        btAdd.onclick = async () => { qtd.innerHTML = await adicionarQuantidadePagina(cliente.id, item.produto.id, quantidade, medida) }
 
        const divRemover = document.createElement('div')
        divRemover.setAttribute('class', 'remover')
        divQuantidadeLixo.appendChild(divRemover)
        iconeLixo = document.createElement('span')
        iconeLixo.setAttribute('class', 'material-symbols-outlined')
        iconeLixo.innerHTML = 'delete'
        iconeLixo.onclick = async () => { qtd.innerHTML = await removerQuantidadePagina(cliente.id, item.produto.id, 99999, medida) }
        divRemover.appendChild(iconeLixo)
        ni += 1
    })
}

async function removerQuantidadePagina(idCliente, idProduto, quantidade, medida) {
    quantidadeCarrinho = Number(document.getElementById('quantidade'+idProduto).innerHTML.split(' ')[0].replace(',','.'))
    if (quantidadeCarrinho==quantidade) // manter quantidade mínima do produto
        return document.getElementById('quantidade'+idProduto).innerHTML
    const qtd = await removerQuantidade(idCliente, idProduto, quantidade, medida)
    if (qtd<=0) {
        document.getElementById('produto'+idProduto).style.display='none'
        for (np=0; np<listaPrecos.length; np++) {
            if (listaPrecos[np].precos[0].produtoMarca.produto.id==idProduto)
                listaPrecos.splice(np,1)
        }
    }
    ordenarMercados()
    return qtd
}
async function adicionarQuantidadePagina(idCliente, idProduto, quantidade, medida) {
    const qtd = await adicionarQuantidade(idCliente, idProduto, quantidade, medida)
    ordenarMercados()
    return qtd
}

function preencherDadosItem(ni) {
    const item = cliente.listaCompra[ni]
    const precos = listaPrecos[ni].precos
    const selMarca = document.getElementById('selMarca'+item.produto.id)
    const selMercado = document.getElementById('selMercado'+item.produto.id)
    optMarca = document.createElement('option')
    optMarca.value = ''
    selMarca.appendChild(optMarca)
    const marcas = []
    optMercado = document.createElement('option')
    optMercado.value = ''
    selMercado.appendChild(optMercado)
    idMercados = []
    precos.forEach(preco => {
        if (preco.produtoMarca.marca.marca!='' && marcas.indexOf(preco.produtoMarca.marca.id)==-1) { // há produtos sem marca, mas já adicionamos marca='' como 1a opção em selMarcas
            marcas.push(preco.produtoMarca.marca.id)
            var optMarca = document.createElement('option')
            optMarca.value = preco.produtoMarca.marca.marca
            optMarca.innerHTML = preco.produtoMarca.marca.marca
            selMarca.appendChild(optMarca)
        }
        if (idMercados.indexOf(preco.mercado.id)==-1) {
            idMercados.push(preco.mercado.id)
            var optMercado = document.createElement('option')
            optMercado.value = preco.mercado.nome
            optMercado.innerHTML = preco.mercado.nome
            selMercado.appendChild(optMercado)
        }
    })
}

function inserirMercados() { // coloca lista de mercados em ordem decrescente de 'economia'...
    mercados.forEach( mercado => {
        divMercados = document.getElementById('todos-mercados')
        divPrecos = document.getElementById('mercados-preco')
        divMercados.innerHTML += '<input type="checkbox" id="check'+mercado.id+'" class="mercado-checkbox" checked=on onchange="toggleCheckMercados()">'
        divMercados.innerHTML += '<label for="check'+mercado.id+'" class="mercado">'+mercado.nome+'</label>'
        divMercado = document.createElement('div')
        divMercado.setAttribute('class', 'mercado-preco')
        divPrecos.appendChild(divMercado)
        divMercado.innerHTML += '<p>'+mercado.nome+'</p>'
        divMercado.innerHTML += '<p id=precoMercado'+mercado.id+'></p>'
        totalMercado.push(0)
    })
}

function ordenarMercados() { // coloca lista de mercados em ordem decrescente de 'economia'...
    nItens = listaPrecos.length
//  totalMercado = []
    economiaMercado = []
    for (nm=0; nm<mercados.length; nm++) {
        totalMercado[nm] = 0
        economiaMercado.push(0)
    }
    for (ni=0; ni<nItens; ni++) {
        precoMedio = 0
        nPrecos = 0
        precos = listaPrecos[ni].precos
        for (np=0; np<precos.length; np++) {
            precoMedio = (precoMedio*nPrecos + precos[np].preco) / (nPrecos+1)
            nPrecos += 1
        }
        selMarca = document.getElementById('selMarca'+precos[0].produtoMarca.produto.id)
        for (nm=0; nm<mercados.length; nm++) {
            valor = -1
            for (np=0; np<precos.length; np++) {
                if ((selMarca.value=='' || selMarca.value==precos[np].produtoMarca.marca.marca) && precos[np].mercado.id==mercados[nm].id) { // FIXME conferir se há marca selecionada
                    economiaMercado[nm] += (precoMedio - precos[np].preco) * (cliente.listaCompra[ni].quantidade/precos[0].produtoMarca.produto.valorMedida)
                    valor = precos[np].preco
                    break
                }
            }
            if (valor==-1) {
                divMercado = document.getElementById('precoMercado'+mercados[nm].id)
                divMercado.innerHTML = '--'
            } else {
                totalMercado[nm] += valor * (cliente.listaCompra[ni].quantidade/precos[0].produtoMarca.produto.valorMedida)
            }
        }
    }
    totaisValidos = []
    totalMercado.forEach( valor => { if(valor>0) totaisValidos.push(valor) }) // ignorar valores nulos que ocorrem quando mercado não tem um produto
    minVal = Math.min(...totaisValidos)
    for (nm=0; nm<mercados.length; nm++) {
        divMercado = document.getElementById('precoMercado'+mercados[nm].id)
        parentDiv = divMercado.parentElement
        parentDiv.setAttribute('class', 'mercado-preco')
        if (divMercado.innerHTML != '--') {
            if (totalMercado[nm]==minVal) {
                parentDiv.classList.add('mercado-preco-menor')
            }
            divMercado.innerHTML = 'R$ '+totalMercado[nm].toFixed(2).replaceAll('.',',')
        }
    }
    fmercados = []
    fprecos = []
    minVal = Math.min(...economiaMercado)
    while (fmercados.length<mercados.length) {
        maxVal = Math.max(...economiaMercado)
        fmercados.push(mercados[economiaMercado.indexOf(maxVal)])
        fprecos.push(totalMercado[economiaMercado.indexOf(maxVal)])
        economiaMercado[economiaMercado.indexOf(maxVal)] = minVal-1 // remover maior valor
    }
    mercados = fmercados
    totalMercado = fprecos
}

function selecionarMinimos() { // seleciona select marcas e mercados com menores valores
    nItens = cliente.listaCompra.length
    for (ni=0; ni<nItens; ni++) {
        item = cliente.listaCompra[ni]
        selMarca = document.getElementById('selMarca'+item.produto.id)
        selMercado = document.getElementById('selMercado'+item.produto.id)
        val = 99999
        for (np=0; np<listaPrecos[ni].precos.length; np++) {
            preco = listaPrecos[ni].precos[np]
            if (!document.getElementById('check'+preco.mercado.id).checked) continue // considera somente checkbox mercados
            if (selMarca.value!='' && selMarca.value!=preco.produtoMarca.marca.marca) continue // preserva valor atual do select marca
            if (preco.preco<val) {
                selMarca.value = preco.produtoMarca.marca.marca
                selMercado.value = preco.mercado.nome
                val = preco.preco
            }
        }
    }
    mostrarLista()
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
    listas[0] = 0 // valorTotal
    for (ni=0; ni<cliente.listaCompra.length; ni++) {
        item = cliente.listaCompra[ni]
        const selMarca = document.getElementById('selMarca'+item.produto.id)
        const selMercado = document.getElementById('selMercado'+item.produto.id)
        for (np=0; np<listaPrecos[ni].precos.length; np++) {
            item = listaPrecos[ni].precos[np]
            if (item.produtoMarca.marca.marca==selMarca.value && item.mercado.nome==selMercado.value) {
                textoItem  = item.produtoMarca.produto.descricao + ' '
                textoItem += item.produtoMarca.marca.marca + ', '
//              textoItem += item.mercado.nome + ' '
                textoItem += cliente.listaCompra[ni].quantidade
                textoItem += item.produtoMarca.produto.medida + ' por '
                valor = (item.preco * cliente.listaCompra[ni].quantidade / item.produtoMarca.produto.valorMedida)
                listas[0] += valor
                textoItem += 'R$ ' + valor.toFixed(2).replace('.',',') + ' '
                textoItem += '(R$ ' + item.preco.toFixed(2).replace('.',',')
                textoItem += '/' + item.produtoMarca.produto.valorMedida
                textoItem += item.produtoMarca.produto.medida + ')'
                if (listas[item.mercado.id]==null) {
                    listas[item.mercado.id] = []
                }
                listas[item.mercado.id].push(textoItem)
                break
            }
        }
    }
    return listas
}

function mostrarLista() {
    listas = gerarLista()
    divMercados = document.getElementById('melhorDistribuicao')
    divMercados.innerHTML = '<h2>Melhor distribuição</h2>'
    divLista = document.getElementById('listaCompra')
    divLista.innerHTML = ''
    for (nm=0; nm<mercados.length; nm++) {
        if (listas[mercados[nm].id]==null)
            continue
        divMercados.innerHTML += '<p class="melhores-mercados">'+mercados[nm].nome+'</p>'
        divLista.innerHTML += '<h3>'+mercados[nm].nome+'</h3>' //+' (R$ '+total[nm].toFixed(2)+')</h3>'
        for (np=0; np<listas[mercados[nm].id].length; np++)
            divLista.innerHTML += '<p>' + listas[mercados[nm].id][np]+'</p>'
    }
    divTotal = document.getElementById('totalPagar')
    divTotal.innerHTML = '<h2>Total a pagar</h2>'
    divTotal.innerHTML += '<p>R$ '+listas[0].toFixed(2).replace('.',',')+'</p>'
    maxVal = Math.max(...totalMercado)
    divEconomia = document.getElementById('economia')
    divEconomia.innerHTML = '<h2>Economia</h2>'
    divEconomia.innerHTML += '<p>R$ '+ (maxVal-listas[0]).toFixed(2).replace('.',',')+'</p>'
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
    texto += '\nLista gerada com o app EconoMarket.\nVisite nosso site: www.economarket.com.br\n'
    navigator.clipboard.writeText(texto)
    window.alert('lista copiada para o clipboard')
}

function limparLista() {
    if (token!=null) {
        cliente.listaCompra.forEach(item => {
            removerItem(item.id)
        })
    } else {
        sessionStorage.setItem(listaCompra, JSON.stringify('[]'))
    }
    window.location.href = "#"
}
