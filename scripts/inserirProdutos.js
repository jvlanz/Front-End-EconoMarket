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
        botaoAddCarrinho.setAttribute("onclick", 'incluirLista('+produto.id+',1,'+produto.valorMedida+')')  //Cliente: 1
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
                break
            }
        }

    });

}