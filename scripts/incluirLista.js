async function incluirLista(idProduto, idCliente, quantidade) {
//  const obterCarrinho = await fetch("http://localhost:8080/compras/"+idCliente);
//  const compras = await obterCarrinho.json();
    const item = {
        idProduto: idProduto,
        idCliente: idCliente,
        quantidade: quantidade
    }

    const resposta = await fetch("http://localhost:8080/listaCompra", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(item)
    });

    if (!resposta.ok) {
        console.error("Erro ao cadastrar produto");
        return;
    }
    const itemDB = await resposta.json();
//  console.log(itemDB)
    const qtdCarrinho = document.getElementsByClassName('quantidade-carrinho')[0]
    val = qtdCarrinho.innerHTML
    qtdCarrinho.innerHTML = Number(val)+1

    botaoAddCarrinho = document.getElementById('add'+idProduto)
    botaoRemCarrinho = document.getElementById('rem'+idProduto)
    botaoRemCarrinho.style.display = ''
    botaoAddCarrinho.setAttribute("onclick", 'alterarQuantidade('+itemDB.id+','+itemDB.produto.valorMedida+')')
    botaoRemCarrinho.setAttribute("onclick", 'alterarQuantidade('+itemDB.id+','+(-itemDB.produto.valorMedida)+')')

}

async function alterarQuantidade(idCompra, quantidade) {
    const respostaG = await fetch("http://localhost:8080/listaCompra/"+idCompra);
    if (!respostaG.ok) {
        console.error("Erro ao buscar item da lista");
        return;
    }
    const item = await respostaG.json();
    item.quantidade += quantidade
    if (item.quantidade<=0) { // remover produto da lista
        removerdaLista(idCompra)
        botaoRemCarrinho.style.display = ''
        botaoAddCarrinho.setAttribute("onclick", 'incluirLista('+item.idProduto+',1,'+quantidade+')')  //Cliente: 1
        return
    }
    item.idCliente = 1
//  console.log(item)
    const respostaP = await fetch("http://localhost:8080/listaCompra/"+idCompra, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item)
    });

    if (!respostaP.ok) {
        console.error("Erro ao cadastrar item");
        return;
    }
}

async function removerItemLista(idCompra) {
    fetch("http://localhost:8080/listaCompra/"+idCompra, {  // FIXME consolidar com função em paginaCarrinho.js
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            console.log('item '+idCompra+' removido')
            gerarTabelaCarrinho()
        } else {
            console.error('erro ao remover produto:', response.status);
        }
    })
    .catch(error => console.error('erro com a operação fetch:', error))
}
