async function preencherProdutos( args ) { // args é um objeto, que pode ter os parâmetros 'id' e 'busca'
    const resposta = await fetch("http://localhost:8080/produtos");

    if (!resposta.ok) {
        console.error("Erro ao buscar produtos");
        return;
    }

    const produtos = await resposta.json();

    const respostaC = await fetch("http://localhost:8080/clientes/1");
    if (!respostaC.ok) {
        console.error("Erro ao buscar cliente");
        return;
    }
    cliente = await respostaC.json();
    listaCompra = cliente.listaCompra

    const container = document.getElementById("categoria-geral");

    produtos.forEach(produto => {

// filtrar por categoria
        if (args.id!=null && args.id!=produto.categoria.id) return

// filtrar por busca
        if (args.busca!=null) {
            sel = true
            args.busca.split(' ').forEach(filtro => {
                if (! produto.descricao.toLowerCase().includes(filtro.toLowerCase()))
                    sel = false
            })
            if (!sel)
                return
        }

        let subcontainer = document.getElementById("categoria" + produto.categoria.id);
        if (subcontainer == null) {
            subcontainer = document.createElement("div");
            subcontainer.setAttribute("id", "categoria" + produto.categoria.id);
            subcontainer.setAttribute("class", "container1")
            container.appendChild(subcontainer);
        }
        //    if (id != null && id != produto.idCategoria) return;

        const card = document.createElement("div");
        card.setAttribute("class", "card-produto");
        subcontainer.appendChild(card);

        const imagem = document.createElement("img");
        imagem.src = "../imagens/"+produto.figura;
        imagem.setAttribute("class", "formatacao-imagem-card")
        card.appendChild(imagem);

        //TODO informar faixa de preços

        const nome = document.createElement("div");
        nome.setAttribute("class", "nome-produto");
        nome.innerHTML = produto.descricao;
        card.appendChild(nome);

        const quant = document.createElement("span")
        quant.setAttribute("class", "quantidade-produto");
        quant.id = 'qtd'+produto.id
        card.appendChild(quant)

        const botaoAddCarrinho = document.createElement("button");
        botaoAddCarrinho.setAttribute("class", "btn-add");
        botaoAddCarrinho.setAttribute("onclick", 'incluirProduto('+produto.id+',1,'+produto.valorMedida+')')  // FIXME Cliente=1
        botaoAddCarrinho.id = 'add'+produto.id
        botaoAddCarrinho.innerHTML = "+";
        card.appendChild(botaoAddCarrinho);

        const botaoRemCarrinho = document.createElement("button");
        botaoRemCarrinho.setAttribute("class", "btn-rem");
        botaoRemCarrinho.id = 'rem'+produto.id
        botaoRemCarrinho.innerHTML = "–";
        botaoRemCarrinho.style.display = 'none'
        card.appendChild(botaoRemCarrinho);
        for (n=0; n<listaCompra.length; n++) {
            if (listaCompra[n].produto.id==produto.id) {
                botaoRemCarrinho.style.display = ''
                botaoAddCarrinho.setAttribute("onclick", 'alterarQuantidade('+listaCompra[n].id+','+produto.valorMedida+')')
                botaoRemCarrinho.setAttribute("onclick", 'alterarQuantidade('+listaCompra[n].id+','+(-produto.valorMedida)+')')
                quant.innerHTML = listaCompra[n].quantidade+produto.medida
                break
            }
        }

    });

}

async function incluirProduto(idProduto, idCliente, quantidade) {
    item = await incluirItem(idProduto, idCliente, quantidade)
    const qtdCarrinho = document.getElementsByClassName('quantidade-carrinho')[0]
    val = qtdCarrinho.innerHTML
    qtdCarrinho.innerHTML = Number(val)+1
    botaoAddCarrinho = document.getElementById('add'+idProduto)
    botaoRemCarrinho = document.getElementById('rem'+idProduto)
    botaoRemCarrinho.style.display = ''
    botaoAddCarrinho.setAttribute("onclick", 'alterarQuantidade('+item.id+','+item.produto.valorMedida+')')
    botaoRemCarrinho.setAttribute("onclick", 'alterarQuantidade('+item.id+','+(-item.produto.valorMedida)+')')
    quant = document.getElementById('qtd'+idProduto)
    quant.innerHTML = item.produto.valorMedida+item.produto.medida
}

async function alterarQuantidade(idCompra, quantidade) {
    item = await obterItem(idCompra)
    item.quantidade += quantidade
    botaoAddCarrinho = document.getElementById('add'+item.produto.id)
    botaoRemCarrinho = document.getElementById('rem'+item.produto.id)
    quant = document.getElementById('qtd'+item.produto.id)
    if (item.quantidade<=0) { // remover produto da lista
        removerItem(idCompra)
        botaoRemCarrinho.style.display = 'none'
        botaoAddCarrinho.setAttribute("onclick", 'incluirProduto('+item.produto.id+',1,'+quantidade+')')  // FIXME Cliente=1
        const qtdCarrinho = document.getElementsByClassName('quantidade-carrinho')[0]
        val = qtdCarrinho.innerHTML
        qtdCarrinho.innerHTML = Number(val)-1
        quant.innerHTML = ''
        return
    }
    botaoRemCarrinho.style.display = '' // se há quantidade, mostrar botão '-'
    alterarItem(idCompra, item.produto.id, 1, item.quantidade)  // FIXME Cliente=1
    quant.innerHTML = item.quantidade+item.produto.medida
}
