async function preencherProdutos(args) { // args é um objeto, que pode ter os parâmetros 'id' e 'busca'
    const token = sessionStorage.getItem("token");

    const resposta = await fetch("http://localhost:8080/produtos");
    if (!resposta.ok) {
        console.error("Erro ao buscar produtos");
        return;
    }
    const produtos = await resposta.json();

    const respostaP = await fetch("http://localhost:8080/promocoes");
    if (!respostaP.ok) {
        console.error("Erro ao buscar promoções");
        return;
    }
    const promocoes = await respostaP.json();

    listaCompra = JSON.parse(sessionStorage.getItem("listaCompra")) || []
    if (token!=null) {
        const respostaC = await fetch("http://localhost:8080/auth/cliente", {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!respostaC.ok) {
            console.error("Erro ao buscar cliente");
        }
        cliente = await respostaC.json();
        listaCompra = cliente.listaCompra
    }

    const container = document.getElementById("categoria-geral");

// subcontainer para favoritos, inicialmente invisível
    subcontainerFav = document.createElement("div");
    subcontainerFav.setAttribute("class", "container1 fundoDestaque")
    tituloFav = document.createElement('h2')
    tituloFav.setAttribute("class", "titulo-secao");
    tituloFav.innerHTML = 'Produtos favoritos'
    container.appendChild(tituloFav)
    container.appendChild(subcontainerFav);
    tituloFav.style.display = 'none'
    subcontainerFav.style.display = 'none'

// subcontainer para promocoes, inicialmente invisível
    subcontainerPromo = document.createElement("div");
    subcontainerPromo.setAttribute("class", "container1 fundoDestaque")
    tituloPromo = document.createElement('h2')
    tituloPromo.setAttribute("class", "titulo-secao promocao");
    tituloPromo.innerHTML = 'Promoções do Dia'
    container.appendChild(tituloPromo)
    container.appendChild(subcontainerPromo);
    tituloPromo.style.display = 'none'
    subcontainerPromo.style.display = 'none'

    produtos.forEach(produto => {

        // filtrar por categoria
        if (args.id != null && args.id != produto.categoria.id) return

        // filtrar por busca
        let subcontainer = document.getElementById("busca"); // usar mesmo subcontainer para todos os resultados da busca
        if (args.busca != null) {
            if (filtrar(produto.descricao, args.busca)) {
                if (subcontainer == null) {
                    subcontainer = document.createElement("div");
                    subcontainer.setAttribute("id", "busca");
                    subcontainer.setAttribute("class", "container1")
                    tituloCat = document.createElement('h2')
                    tituloCat.setAttribute("class", "titulo-secao");
                    tituloCat.innerHTML = 'Resultados da busca'
                    container.appendChild(tituloCat)
                    container.appendChild(subcontainer);
                }
            } else return
        } else {
            subcontainer = document.getElementById("categoria" + produto.categoria.id);
        }

        if (subcontainer == null) {
            subcontainer = document.createElement("div");
            subcontainer.setAttribute("id", "categoria" + produto.categoria.id);
            subcontainer.setAttribute("class", "container1")
            tituloCat = document.createElement('h2')
            tituloCat.setAttribute("class", "titulo-secao");
            tituloCat.innerHTML = produto.categoria.categoria
            container.appendChild(tituloCat)
            container.appendChild(subcontainer);
        }

        const card = document.createElement("div");
        card.setAttribute("class", "card-produto");
        subcontainer.appendChild(card);

        const link = document.createElement("a")
        link.href = "paginaProduto.html?produto="+produto.id
        card.appendChild(link);

        const imagem = document.createElement("img");
        imagem.src = "../imagens/" + produto.figura;
        imagem.setAttribute("class", "formatacao-imagem-card")
        link.appendChild(imagem);

        const faixaPrecos = document.createElement("div");
        faixaPrecos.setAttribute("class", "preco-produto");
        faixaPrecos.innerHTML = `R$ ${produto.precoMin}–${produto.precoMax}`.replaceAll('.',',');
        card.appendChild(faixaPrecos);

        const nome = document.createElement("div");
        nome.setAttribute("class", "nome-produto");
        nome.id = "nome"+produto.id;
        nome.innerHTML = produto.descricao;
        card.appendChild(nome);

        const quant = document.createElement("span")
        quant.setAttribute("class", "quantidade-produto");
        quant.id = 'qtd' + produto.id
        card.appendChild(quant)

        const botaoAddCarrinho = document.createElement("button");
        botaoAddCarrinho.setAttribute("class", "btn-add");
        botaoAddCarrinho.id = 'add' + produto.id
        botaoAddCarrinho.innerHTML = "+";
        card.appendChild(botaoAddCarrinho);

        const botaoRemCarrinho = document.createElement("button");
        botaoRemCarrinho.setAttribute("class", "btn-rem");
        botaoRemCarrinho.id = 'rem' + produto.id
        botaoRemCarrinho.innerHTML = "–";
        botaoRemCarrinho.style.display = 'none'
        card.appendChild(botaoRemCarrinho);

        if (token!=null) { // cliente logado
            botaoAddCarrinho.setAttribute("onclick", 'incluirProduto(' + produto.id + ',' + cliente.id + ',' + produto.valorMedida + ')')
            for (n=0; n<listaCompra.length; n++) {
                if (listaCompra[n].produto.id == produto.id) {
                    botaoRemCarrinho.style.display = ''
                    botaoAddCarrinho.setAttribute("onclick", 'alterarQuantidade(' + listaCompra[n].id + ',' + cliente.id + ',' + produto.valorMedida + ')')
                    botaoRemCarrinho.setAttribute("onclick", 'alterarQuantidade(' + listaCompra[n].id + ',' + cliente.id + ',' + (-produto.valorMedida) + ')')
                    quant.innerHTML = listaCompra[n].quantidade + produto.medida
                    break
                }
            }

            const botaoFavorito = document.createElement("button");
            botaoFavorito.id = 'fav' + produto.id;
            botaoFavorito.className = "btn-favorito";
            botaoFavorito.innerHTML = "♡";
            card.appendChild(botaoFavorito);
            var idFav = null
            cliente.favoritos.forEach(favorito => {
                if (favorito.produto.id==produto.id) {
                    botaoFavorito.innerHTML = "♥";
                    idFav = favorito.id
                    tituloFav.style.display = ''
                    subcontainerFav.style.display = ''
                    clonarCartaoFavorito(card, subcontainerFav, `${produto.id}`, `${cliente.id}`, `${idFav}`)
                    /*
                    favCard = card.cloneNode(true) // clonar dá problemas adicionar quantidade pq cria elementos com mesmo ID; favoritar é adicionado apenas depois...
                    favCard.getElementsByTagName('span')[0].id = 'favqtd'+produto.id
                    cloneFavorito = favCard.getElementsByClassName('btn-favorito')[0]
                    cloneFavorito.id = 'favfav'+produto.id
                    cloneFavorito.onclick = () => { toggleFavorito(`${produto.id}`, `${cliente.id}`, `${favId}`) }
                    subcontainerFav.appendChild(favCard)
                    */
                    botaoFavorito.onclick = () => { toggleFavorito(`${produto.id}`, `${cliente.id}`, `${idFav}`) }
                }
            })
        } else { // cliente não logado
            botaoAddCarrinho.setAttribute("onclick", 'incluirProdutoLocal(' + produto.id + ',' + produto.valorMedida + ', "' + produto.medida + '")')
            for (n=0; n<listaCompra.length; n++) {
                if (listaCompra[n].id == produto.id) {
                    botaoRemCarrinho.style.display = ''
                    botaoAddCarrinho.setAttribute("onclick", 'alterarQuantidadeLocal(' + produto.id + ',' + produto.valorMedida + ', "' + produto.medida + '")')
                    botaoRemCarrinho.setAttribute("onclick", 'alterarQuantidadeLocal(' + produto.id + ',' + (-produto.valorMedida) + ', "' + produto.medida + '")')
                    quant.innerHTML = listaCompra[n].quantidade + produto.medida
                    break
                }
            }
        }

        promocoes.forEach(promocao => {
            tituloPromo.style.display = ''
            subcontainerPromo.style.display = ''
            if (promocao.preco.produtoMarca.produto.id==produto.id) {
                clonarCartao(card, 'promo', subcontainerPromo)
                nomePromo = document.getElementById('promonome'+produto.id)
                nomePromo.innerHTML += "<br>"+promocao.preco.mercado.nome
            }
        })
    });
}

function clonarCartaoFavorito(card, subcontainer, idProduto, idCliente, idFav) {
    cloneCard = clonarCarcao(card, 'fav', subcontainer)
    cloneFavorito = cloneCard.getElementsByClassName('btn-favorito')[0]
    cloneFavorito.id = prefixo+cloneFavorito.id
    cloneFavorito.onclick = () => { toggleFavorito(idProduto, idCliente, idFav) }
    subcontainer.appendChild(cloneCard)
}
function clonarCartao(card, prefixo, subcontainer) {
    cloneCard = card.cloneNode(true)
    quantidade = cloneCard.getElementsByTagName('span')[0]
    quantidade.id = prefixo+quantidade.id
    nome = cloneCard.getElementsByClassName('nome-produto')[0]
    nome.id = prefixo+nome.id
    subcontainer.appendChild(cloneCard)
    return cloneCard
}

function toggleFavorito(idProduto, idCliente, favId) {
    botaoFavorito = document.getElementById('fav'+idProduto)
    cloneFavorito = document.getElementById('favfav'+idProduto)
    if (botaoFavorito.innerHTML === "♡") {
        incluirFavorito(idProduto, idCliente)
        botaoFavorito.innerHTML = "♥";
        cloneFavorito.innerHTML = "♥";
    } else {
        removerFavorito(`${favId}`)
        botaoFavorito.innerHTML = "♡";
        cloneFavorito.innerHTML = "♡";
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

async function incluirProduto(idProduto, idCliente, quantidade) {
    item = await incluirItem(idProduto, idCliente, quantidade)
    const qtdCarrinho = document.getElementsByClassName('quantidade-carrinho')[0]
    val = qtdCarrinho.innerHTML
    qtdCarrinho.innerHTML = Number(val) + 1
    botaoAddCarrinho = document.getElementById('add' + idProduto)
    botaoRemCarrinho = document.getElementById('rem' + idProduto)
    botaoRemCarrinho.style.display = ''
    botaoAddCarrinho.setAttribute("onclick", 'alterarQuantidade(' + item.id + ',' + idCliente + ',' + item.produto.valorMedida + ')')
    botaoRemCarrinho.setAttribute("onclick", 'alterarQuantidade(' + item.id + ',' + idCliente + ',' + (-item.produto.valorMedida) + ')')
    quant = document.getElementById('qtd' + idProduto)
    quant.innerHTML = item.quantidade + item.produto.medida
    fquant = document.getElementById('favqtd' + idProduto) || quant
    fquant.innerHTML = item.quantidade + item.produto.medida
}

async function alterarQuantidade(idCompra, idCliente, quantidade) {
    item = await obterItem(idCompra)
    item.quantidade += quantidade
    botaoAddCarrinho = document.getElementById('add' + item.produto.id)
    botaoRemCarrinho = document.getElementById('rem' + item.produto.id)
    quant = document.getElementById('qtd' + item.produto.id)
    fquant = document.getElementById('favqtd' + item.produto.id) || quant
    if (item.quantidade <= 0) { // remover produto da lista
        removerItem(idCompra)
        botaoRemCarrinho.style.display = 'none'
        botaoAddCarrinho.setAttribute("onclick", 'incluirProduto(' + item.produto.id + ',' + idCliente + ',' + quantidade + ')')
        const qtdCarrinho = document.getElementsByClassName('quantidade-carrinho')[0]
        val = qtdCarrinho.innerHTML
        qtdCarrinho.innerHTML = Number(val) - 1
        quant.innerHTML = ''
        fquant.innerHTML = ''
        return
    }
    botaoRemCarrinho.style.display = '' // se há quantidade, mostrar botão '-'
    alterarItem(idCompra, item.produto.id, idCliente, item.quantidade)
    quant.innerHTML = item.quantidade + item.produto.medida
    fquant.innerHTML = item.quantidade + item.produto.medida
}


// funções para salvar lista de compras em sessionStorage, não no banco de dados

async function incluirProdutoLocal(idProduto, quantidade, medida) {
    item = {id:idProduto, quantidade:quantidade} //, produto:{id:idProduto,medida:medida,valorMedida:quantidade}}
    listaCompra = JSON.parse(sessionStorage.getItem("listaCompra")) || []
    listaCompra.push(item)
    sessionStorage.setItem("listaCompra", JSON.stringify(listaCompra));
    const qtdCarrinho = document.getElementsByClassName('quantidade-carrinho')[0]
    val = qtdCarrinho.innerHTML
    qtdCarrinho.innerHTML = Number(val) + 1
    botaoAddCarrinho = document.getElementById('add' + idProduto)
    botaoRemCarrinho = document.getElementById('rem' + idProduto)
    botaoRemCarrinho.style.display = ''
    botaoAddCarrinho.setAttribute("onclick", 'alterarQuantidadeLocal(' + item.id + ',' + quantidade + ', "' + medida + '")')
    botaoRemCarrinho.setAttribute("onclick", 'alterarQuantidadeLocal(' + item.id + ',' + (-quantidade) + ', "' + medida + '")')
    quant = document.getElementById('qtd' + idProduto)
    quant.innerHTML = item.quantidade + medida
}

async function alterarQuantidadeLocal(idProduto, quantidade, medida) {
    listaCompra = JSON.parse(sessionStorage.getItem("listaCompra")) || []
    for (n=0; n<listaCompra.length; n++) {
        if (listaCompra[n].id==idProduto) {
            item = listaCompra[n]
            item.quantidade += quantidade
            break
        }
    }
    botaoAddCarrinho = document.getElementById('add' + idProduto)
    botaoRemCarrinho = document.getElementById('rem' + idProduto)
    quant = document.getElementById('qtd' + idProduto)
    if (item.quantidade <= 0) { // remover produto da lista
        listaCompra.splice(n,1)
        sessionStorage.setItem("listaCompra", JSON.stringify(listaCompra))
        botaoRemCarrinho.style.display = 'none'
        botaoAddCarrinho.setAttribute("onclick", 'incluirProdutoLocal(' + idProduto + ',' + Math.abs(quantidade) + ', "' + medida + '")')
        const qtdCarrinho = document.getElementsByClassName('quantidade-carrinho')[0]
        val = qtdCarrinho.innerHTML
        qtdCarrinho.innerHTML = Number(val) - 1
        quant.innerHTML = ''
        return
    }
    botaoRemCarrinho.style.display = '' // se há quantidade, mostrar botão '-'
    sessionStorage.setItem("listaCompra", JSON.stringify(listaCompra))
    quant.innerHTML = item.quantidade + medida
}

