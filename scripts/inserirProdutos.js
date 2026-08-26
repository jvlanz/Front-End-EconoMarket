async function preencherProdutos(id = null) {

    const resposta = await fetch("http://localhost:8080/produtos");

    if (!resposta.ok) {
        console.error("Erro ao buscar produtos");
        return;
    }

    const produtos = await resposta.json();

    const container = document.createElement("div");
    container.setAttribute("class", "container1");
    document.body.appendChild(container);

    produtos.forEach(produto => {

        if (id != null && id != produto.idCategoria) return;

        const card = document.createElement("div");
        card.setAttribute("class", "card-produto");
        container.appendChild(card);

        const imagem = document.createElement("img");
        imagem.src = produto.imagem;
        card.appendChild(imagem);

        const preco = document.createElement("div");
        preco.setAttribute("class", "preco-produto");
        preco.innerHTML = produto.preco + " – " + produto.preco;
        card.appendChild(preco);

        const nome = document.createElement("div");
        nome.setAttribute("class", "nome-produto");
        nome.innerHTML = produto.descricao;
        card.appendChild(nome);
    });
}