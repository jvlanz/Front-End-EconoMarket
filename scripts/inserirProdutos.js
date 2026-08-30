async function preencherProdutos() {
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
    produtosID = []
    for (n=0; n<listaCompra.length; n++) {
        produtosID.push(listaCompra[n].produto.id)
    }


    const container = document.getElementById("categoria-geral");

    produtos.forEach(produto => {
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

        //TO DO precos

        const nome = document.createElement("div");
        nome.setAttribute("class", "nome-produto");
        nome.innerHTML = produto.descricao;
        card.appendChild(nome);

        const botaoAddCarrinho = document.createElement("button");
        botaoAddCarrinho.setAttribute("class", "btn-add");
        botaoAddCarrinho.setAttribute("onclick", 'incluirnaLista('+produto.id+',1,'+produto.valorMedida+')')  //Cliente: 1, quantidade: 1unidade
        botaoAddCarrinho.id = 'bt'+produto.id
        botaoAddCarrinho.innerHTML = "+";
        card.appendChild(botaoAddCarrinho);


        const botaoRemCarrinho = document.createElement("button");
        botaoRemCarrinho.setAttribute("class", "btn-rem");
//      botaoRemCarrinho.setAttribute("onclick", 'incluirnaLista('+produto.id+',1,'+produto.valorMedida+')')  //Cliente: 1, quantidade: 1unidade
        botaoRemCarrinho.id = 'rem'+produto.id
        botaoRemCarrinho.innerHTML = "–";
        card.appendChild(botaoRemCarrinho);
        if (produtosID.indexOf(produto.id)==-1)
            botaoRemCarrinho.style.display = 'none'
        
    });

}