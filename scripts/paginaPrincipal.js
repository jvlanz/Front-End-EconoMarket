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

    cliente = { id: null }
    listaCompra = JSON.parse(sessionStorage.getItem("listaCompra")) || []
    if (token != null) {
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
            if (args.id != null)
                subcontainer.setAttribute("class", "produtos-display-grid")
            else
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

        const link1 = document.createElement("a")
        link1.href = "paginaProduto.html?produto=" + produto.id
        card.appendChild(link1);

        const imagem = document.createElement("img");
        imagem.src = "../imagens/" + produto.figura;
        imagem.setAttribute("class", "formatacao-imagem-card")
        link1.appendChild(imagem);

        const divQtd = document.createElement('div')
        divQtd.setAttribute('class', 'div-quantidade')
        card.appendChild(divQtd)

        const botaoRemCarrinho = document.createElement("button");
        botaoRemCarrinho.setAttribute("class", "btn-rem");
        botaoRemCarrinho.id = 'rem' + produto.id
        botaoRemCarrinho.innerHTML = "–";
        botaoRemCarrinho.onclick = () => { removerQuantidadePagina(cliente.id, produto.id, produto.valorMedida, produto.medida) }
        botaoRemCarrinho.style.display = 'none'
        divQtd.appendChild(botaoRemCarrinho);

        const quant = document.createElement("span")
        quant.setAttribute("class", "quantidade-produto");
        quant.id = 'quantidade' + produto.id
        divQtd.appendChild(quant)

        const botaoAddCarrinho = document.createElement("button");
        botaoAddCarrinho.setAttribute("class", "btn-add");
        botaoAddCarrinho.id = 'add' + produto.id
        botaoAddCarrinho.onclick = () => { adicionarQuantidadePagina(cliente.id, produto.id, produto.valorMedida, produto.medida) }
        botaoAddCarrinho.innerHTML = "+";
        divQtd.appendChild(botaoAddCarrinho);

        for (n = 0; n < listaCompra.length; n++) {
            if (listaCompra[n].produto.id == produto.id) {
                botaoRemCarrinho.style.display = ''
                if ( listaCompra[n].quantidade % 1 > 0)
                    quant.innerHTML = listaCompra[n].quantidade.toFixed(2).replace('.',',') + ' ' +produto.medida
                else
                    quant.innerHTML = listaCompra[n].quantidade + ' ' + produto.medida
                break
            }
        }

        const link2 = document.createElement("a")
        link2.href = "paginaProduto.html?produto=" + produto.id
        card.appendChild(link2);

        const faixaPrecos = document.createElement("div");
        faixaPrecos.setAttribute("class", "preco-produto");
        faixaPrecos.innerHTML = `R$ ${produto.precoMin}–${produto.precoMax}`.replaceAll('.', ',');
        link2.appendChild(faixaPrecos);

        const nome = document.createElement("div");
        nome.setAttribute("class", "nome-produto");
        nome.id = "nome" + produto.id;
        nome.innerHTML = produto.descricao;
        link2.appendChild(nome);

        if (token != null) { // cliente logado
            const botaoFavorito = document.createElement("button");
            botaoFavorito.id = 'fav' + produto.id;
            botaoFavorito.className = "btn-favorito";
            botaoFavorito.innerHTML = "♡";
            card.appendChild(botaoFavorito);
            var idFav = null
            cliente.favoritos.forEach(favorito => {
                if (favorito.produto.id == produto.id) {
                    botaoFavorito.innerHTML = "♥";
                    idFav = favorito.id
                    if (args.id==null) {
                        tituloFav.style.display = ''
                        subcontainerFav.style.display = ''
                        clonarCartao(card, 'fav', subcontainerFav, `${produto.id}`, `${cliente.id}`, `${idFav}`)
                    }
                }
            })
            botaoFavorito.onclick = () => { toggleFavorito(`${produto.id}`, `${cliente.id}`, `${idFav}`) }
        }

        if (args.id==null) {
          promocoes.forEach(promocao => {
            tituloPromo.style.display = ''
            subcontainerPromo.style.display = ''
            if ((promocao.preco.produtoMarca.produto.id == produto.id)) {
                if (document.getElementById('promonome'+produto.id)==null)
                    clonarCartao(card, 'promo', subcontainerPromo, `${produto.id}`, `${cliente.id}`, `${idFav}`)
                nomePromo = document.getElementById('promonome' + produto.id)
                nomePromo.innerHTML += "<br>" + promocao.preco.mercado.nome
            }
          })
        }

    });
}

function clonarCartao(card, prefixo, subcontainer, idProduto, idCliente, idFav) {
    cloneCard = card.cloneNode(true)
    nome = cloneCard.getElementsByClassName('nome-produto')[0]
    nome.id = prefixo + nome.id
    remover = cloneCard.getElementsByClassName('btn-rem')[0]
    remover.id = prefixo + remover.id
    remover.onclick = document.getElementById('rem'+idProduto).onclick
    quantidade = cloneCard.getElementsByClassName('quantidade-produto')[0]
    quantidade.id = prefixo + quantidade.id
    adicionar = cloneCard.getElementsByClassName('btn-add')[0]
    adicionar.id = prefixo + adicionar.id
    adicionar.onclick = document.getElementById('add'+idProduto).onclick
    if (idCliente != "null") {
        cloneFavorito = cloneCard.getElementsByClassName('btn-favorito')[0]
        cloneFavorito.id = prefixo + cloneFavorito.id
        cloneFavorito.onclick = () => { toggleFavorito(idProduto, idCliente, idFav) }
    }
    subcontainer.appendChild(cloneCard)
}

function toggleFavorito(idProduto, idCliente, favId) {
    botaoFavorito = document.getElementById('fav' + idProduto)
    cloneFavorito = document.getElementById('favfav' + idProduto)
    promoFavorito = document.getElementById('promofav' + idProduto)
    if (botaoFavorito.innerHTML === "♡") {
        incluirFavorito(idProduto, idCliente)
        botaoFavorito.innerHTML = "♥";
        if (cloneFavorito != null)
            cloneFavorito.innerHTML = "♥";
        if (promoFavorito != null)
            promoFavorito.innerHTML = "♥";
    } else {
        removerFavorito(`${favId}`)
        botaoFavorito.innerHTML = "♡";
        if (cloneFavorito != null)
            cloneFavorito.innerHTML = "♡";
        if (promoFavorito != null)
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

function adicionarQuantidadePagina(idCliente, idProduto, quantidade, medida) {
    adicionarQuantidade(idCliente, idProduto, quantidade, medida)
    quant = document.getElementById('quantidade' + idProduto)
    fquant = document.getElementById('favquantidade' + idProduto) || quant
    pquant = document.getElementById('promoquantidade' + idProduto) || quant
    fquant.innerHTML = quant.innerHTML
    pquant.innerHTML = quant.innerHTML
    botaoRemCarrinho = document.getElementById('rem' + idProduto)
    fbotaoRemCarrinho = document.getElementById('favrem' + idProduto) || botaoRemCarrinho
    pbotaoRemCarrinho = document.getElementById('promorem' + idProduto) || botaoRemCarrinho
    botaoRemCarrinho.style.display = ''
    fbotaoRemCarrinho.style.display = ''
    pbotaoRemCarrinho.style.display = ''
}

function removerQuantidadePagina(idCliente, idProduto, quantidade, medida) {
    removerQuantidade(idCliente, idProduto, quantidade, medida)
    quant = document.getElementById('quantidade' + idProduto)
    fquant = document.getElementById('favquantidade' + idProduto) || quant
    pquant = document.getElementById('promoquantidade' + idProduto) || quant
    fquant.innerHTML = quant.innerHTML
    pquant.innerHTML = quant.innerHTML
    if (quant.innerHTML=='') {
        botaoRemCarrinho = document.getElementById('rem' + idProduto)
        fbotaoRemCarrinho = document.getElementById('favrem' + idProduto) || botaoRemCarrinho
        pbotaoRemCarrinho = document.getElementById('promorem' + idProduto) || botaoRemCarrinho
        botaoRemCarrinho.style.display = 'none'
        fbotaoRemCarrinho.style.display = 'none'
        pbotaoRemCarrinho.style.display = 'none'
    }
}

