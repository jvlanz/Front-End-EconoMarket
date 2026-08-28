async function preencherProdutos() {
    const resposta = await fetch("http://localhost:8080/produtos");

    if (!resposta.ok) {
        console.error("Erro ao buscar produtos");
        return;
    }

    const produtos = await resposta.json();

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

        const botaoCarrinho = document.createElement("button");
        botaoCarrinho.setAttribute("class", "btn-add");
        botaoCarrinho.setAttribute("onclick", 'incluirnaLista('+produto.id+',1)')  //Cliente: 1
        botaoCarrinho.innerHTML = "+";
        card.appendChild(botaoCarrinho);
        
    });

}