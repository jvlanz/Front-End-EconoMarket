async function incluirItem(idProduto, idCliente, quantidade) {
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
    return itemDB
}

async function obterItem(idCompra) {
    const resposta = await fetch("http://localhost:8080/listaCompra/"+idCompra);
    if (!resposta.ok) {
        console.error("Erro ao buscar item da lista");
        return;
    }
    const item = await resposta.json();
    return item
}

async function alterarItem(idCompra, idProduto, idCliente, quantidade) {
    const item = {
        idProduto: idProduto,
        idCliente: idCliente,
        quantidade: quantidade
    }
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

async function removerItem(idCompra) {
    await fetch("http://localhost:8080/listaCompra/"+idCompra, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            console.log('item '+idCompra+' removido')
        } else {
            console.error('erro ao remover produto:', response.status);
        }
    })
    .catch(error => console.error('erro com a operação fetch:', error))
}
