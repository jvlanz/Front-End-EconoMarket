async function incluirItem(idProduto, idCliente, quantidade) {
    const token = sessionStorage.getItem("token");
//  const obterCarrinho = await fetch("http://localhost:8080/compras/"+idCliente);
//  const compras = await obterCarrinho.json();
    const item = {
        idProduto: idProduto,
        idCliente: idCliente,
        quantidade: quantidade
    }

    const resposta = await fetchFallback("/listaCompra", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
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
    const token = sessionStorage.getItem("token");
    const resposta = await fetchFallback("/listaCompra/"+idCompra, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    });
    if (!resposta.ok) {
        console.error("Erro ao buscar item da lista");
        return;
    }
    const item = await resposta.json();
    return item
}

async function alterarItem(idCompra, idProduto, idCliente, quantidade) {
    const token = sessionStorage.getItem("token");
    const item = {
        idProduto: idProduto,
        idCliente: idCliente,
        quantidade: quantidade
    }
    const resposta = await fetchFallback("/listaCompra/"+idCompra, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(item)
    });

    if (!resposta.ok) {
        console.error("Erro ao cadastrar item");
        return;
    }
}

async function removerItem(idCompra) {
    const token = sessionStorage.getItem("token");
    await fetchFallback("/listaCompra/"+idCompra, {
        method: 'DELETE',
        headers: { "Authorization": `Bearer ${token}` }
    })
    .then(resposta => {
        if (resposta.ok) {
            console.log('item '+idCompra+' removido')
        } else {
            console.error('erro ao remover produto:', resposta.status);
        }
    })
    .catch(erro => console.error('Erro com a operação fetch:', erro))
}

////////////////////
// funções para o frontend

async function adicionarQuantidade(clienteId, produtoId, quantidade, medida) {
    if (clienteId==null) {
        return adicionarQuantidadeLocal(produtoId, quantidade, medida)
    }
    presente = false
    for (ni=0; ni<cliente.listaCompra.length; ni++) {
        if (cliente.listaCompra[ni].produto.id==produtoId) {
            cliente.listaCompra[ni].quantidade += quantidade
            if (cliente.listaCompra[ni].quantidade % 1 > 0)
                resQuantidade = cliente.listaCompra[ni].quantidade.toFixed(2).replace('.',',') + ' ' + medida
            else
                resQuantidade = cliente.listaCompra[ni].quantidade + ' ' + medida
            presente = true
            alterarItem(cliente.listaCompra[ni].id, produtoId, clienteId, cliente.listaCompra[ni].quantidade)
            break
        }
    }
    if (!presente) {
        itemDB = await incluirItem(produtoId, cliente.id, quantidade)
        cliente.listaCompra.push( {id:itemDB.id, produto:{id:produtoId}, quantidade:quantidade} )
        if (quantidade % 1 > 0)
            resQuantidade = quantidade.toFixed(2).replace('.',',') + ' ' + medida
        else
            resQuantidade = quantidade + ' ' + medida
    }
    const qtdCarrinho = document.getElementsByClassName('quantidade-carrinho')[0]
    qtdCarrinho.innerHTML = cliente.listaCompra.length
    return resQuantidade
}

function removerQuantidade(clienteId, produtoId, quantidade, medida) {
    if (clienteId==null) {
        return removerQuantidadeLocal(produtoId, quantidade, medida)
    }
    for (ni=0; ni<cliente.listaCompra.length; ni++) {
        if (cliente.listaCompra[ni].produto.id==produtoId) {
            cliente.listaCompra[ni].quantidade -= quantidade
            if (cliente.listaCompra[ni].quantidade <=0) {
                removerItem(cliente.listaCompra[ni].id)
                cliente.listaCompra.splice(ni,1)
                resQuantidade = ''
            } else {
                if (quantidade % 1 > 0)
                    resQuantidade = cliente.listaCompra[ni].quantidade.toFixed(2).replace('.',',') + ' ' + medida
                else
                    resQuantidade = cliente.listaCompra[ni].quantidade + ' ' + medida
                alterarItem(cliente.listaCompra[ni].id, produtoId, clienteId, cliente.listaCompra[ni].quantidade)
            }
            break
        }
    }
    const qtdCarrinho = document.getElementsByClassName('quantidade-carrinho')[0]
    qtdCarrinho.innerHTML = cliente.listaCompra.length
    return resQuantidade
}

function adicionarQuantidadeLocal(produtoId, quantidade, medida) {
    presente = false
    for (ni=0; ni<cliente.listaCompra.length; ni++) {
        if (cliente.listaCompra[ni].produto.id==produtoId) {
            cliente.listaCompra[ni].quantidade += quantidade
            if (quantidade % 1 > 0)
                resQuantidade = cliente.listaCompra[ni].quantidade.toFixed(2).replace('.',',') + ' ' + medida
            else
                resQuantidade = cliente.listaCompra[ni].quantidade + ' ' + medida
            presente = true
            break
        }
    }
    if (!presente) {
        cliente.listaCompra.push( {produto:{id:produtoId, categoria:{id:1}}, quantidade:quantidade} ) // FIXME: categoria.id
        if (quantidade % 1 > 0)
            resQuantidade = quantidade.toFixed(2).replace('.',',') + ' ' + medida
        else
            resQuantidade = quantidade + ' ' + medida
    }
    sessionStorage.setItem('listaCompra', JSON.stringify(cliente.listaCompra))
    const qtdCarrinho = document.getElementsByClassName('quantidade-carrinho')[0]
    qtdCarrinho.innerHTML = cliente.listaCompra.length
    return resQuantidade
}

function removerQuantidadeLocal(produtoId, quantidade, medida) {
    for (ni=0; ni<cliente.listaCompra.length; ni++) {
        if (cliente.listaCompra[ni].produto.id==produtoId) {
            cliente.listaCompra[ni].quantidade -= quantidade
            if (cliente.listaCompra[ni].quantidade <=0) {
                cliente.listaCompra.splice(ni,1)
                resQuantidade = ''
            } else {
                if (quantidade % 1 > 0)
                    resQuantidade = cliente.listaCompra[ni].quantidade.toFixed(2).replace('.',',') + ' ' + medida
                else
                    resQuantidade = cliente.listaCompra[ni].quantidade + ' ' + medida
            }
            break
        }
    }
    sessionStorage.setItem('listaCompra', JSON.stringify(cliente.listaCompra))
    const qtdCarrinho = document.getElementsByClassName('quantidade-carrinho')[0]
    qtdCarrinho.innerHTML = cliente.listaCompra.length
    return resQuantidade
}

