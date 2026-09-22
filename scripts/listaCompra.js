async function incluirItem(idProduto, idCliente, quantidade) {
    const token = sessionStorage.getItem("token");
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
    const resposta = await fetch("http://localhost:8080/listaCompra/"+idCompra, {
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
    const respostaP = await fetch("http://localhost:8080/listaCompra/"+idCompra, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(item)
    });

    if (!respostaP.ok) {
        console.error("Erro ao cadastrar item");
        return;
    }
}

async function removerItem(idCompra) {
    const token = sessionStorage.getItem("token");
    await fetch("http://localhost:8080/listaCompra/"+idCompra, {
        method: 'DELETE',
        headers: { "Authorization": `Bearer ${token}` }
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

// funções para o frontend
function adicionarQuantidade(clienteId, produtoId, quantidade, medida) {
    if (clienteId==null) {
        adicionarQuantidadeLocal(produtoId, quantidade, medida)
        return
    }
    pQuantidade = document.getElementById('quantidade'+produtoId)
    presente = false
    for (ni=0; ni<cliente.listaCompra.length; ni++) {
        if (cliente.listaCompra[ni].produto.id==produtoId) {
            cliente.listaCompra[ni].quantidade += quantidade
            if (cliente.listaCompra[ni].quantidade % 1 > 0)
                pQuantidade.innerHTML = cliente.listaCompra[ni].quantidade.toFixed(2).replace('.',',') + ' ' + medida
            else
                pQuantidade.innerHTML = cliente.listaCompra[ni].quantidade + ' ' + medida
            presente = true
            alterarItem(cliente.listaCompra[ni].id, produtoId, clienteId, cliente.listaCompra[ni].quantidade)
            break
        }
    }
    if (!presente) {
        cliente.listaCompra.push( {id:produtoId, quantidade:quantidade} )
        if (quantidade % 1 > 0)
            pQuantidade.innerHTML = quantidade.toFixed(2).replace('.',',') + ' ' + medida
        else
            pQuantidade.innerHTML = quantidade + ' ' + medida
        incluirItem(produtoId, cliente.id, quantidade)
    }
    const qtdCarrinho = document.getElementsByClassName('quantidade-carrinho')[0]
    qtdCarrinho.innerHTML = cliente.listaCompra.length
}

function removerQuantidade(clienteId, produtoId, quantidade, medida) {
    if (clienteId==null) {
        removerQuantidadeLocal(produtoId, quantidade, medida)
        return
    }
    pQuantidade = document.getElementById('quantidade'+produtoId)
    for (ni=0; ni<cliente.listaCompra.length; ni++) {
        if (cliente.listaCompra[ni].produto.id==produtoId) {
            cliente.listaCompra[ni].quantidade -= quantidade
            if (cliente.listaCompra[ni].quantidade <=0) {
                removerItem(cliente.listaCompra[ni].id)
                cliente.listaCompra.splice(ni,1)
                pQuantidade.innerHTML = '0 ' + medida
            } else {
                if (quantidade % 1 > 0)
                    pQuantidade.innerHTML = cliente.listaCompra[ni].quantidade.toFixed(2).replace('.',',') + ' ' + medida
                else
                    pQuantidade.innerHTML = cliente.listaCompra[ni].quantidade + ' ' + medida
                alterarItem(cliente.listaCompra[ni].id, produtoId, clienteId, cliente.listaCompra[ni].quantidade)
            }
            break
        }
    }
    const qtdCarrinho = document.getElementsByClassName('quantidade-carrinho')[0]
    qtdCarrinho.innerHTML = cliente.listaCompra.length
}

function adicionarQuantidadeLocal(produtoId, quantidade, medida) {
    pQuantidade = document.getElementById('quantidade'+produtoId)
    presente = false
    for (ni=0; ni<listaCompra.length; ni++) {
        if (listaCompra[ni].id==produtoId) {
            listaCompra[ni].quantidade += quantidade
            if (quantidade % 1 > 0)
                pQuantidade.innerHTML = listaCompra[ni].quantidade.toFixed(2).replace('.',',') + ' ' + medida
            else
                pQuantidade.innerHTML = listaCompra[ni].quantidade + ' ' + medida
            presente = true
            break
        }
    }
    if (!presente) {
        listaCompra.push( {id:produtoId, quantidade:quantidade} )
        if (quantidade % 1 > 0)
            pQuantidade.innerHTML = quantidade.toFixed(2).replace('.',',') + ' ' + medida
        else
            pQuantidade.innerHTML = quantidade + ' ' + medida
    }
    sessionStorage.setItem('listaCompra', JSON.stringify(listaCompra))
    const qtdCarrinho = document.getElementsByClassName('quantidade-carrinho')[0]
    qtdCarrinho.innerHTML = listaCompra.length
}

function removerQuantidadeLocal(produtoId, quantidade, medida) {
    pQuantidade = document.getElementById('quantidade'+produtoId)
    for (ni=0; ni<listaCompra.length; ni++) {
        if (listaCompra[ni].id==produtoId) {
            listaCompra[ni].quantidade -= quantidade
            if (listaCompra[ni].quantidade <=0) {
                listaCompra.splice(ni,1)
                pQuantidade.innerHTML = '0 ' + medida
            } else {
                if (quantidade % 1 > 0)
                    pQuantidade.innerHTML = listaCompra[ni].quantidade.toFixed(2).replace('.',',') + ' ' + medida
                else
                    pQuantidade.innerHTML = listaCompra[ni].quantidade + ' ' + medida
            }
            break
        }
    }
    sessionStorage.setItem('listaCompra', JSON.stringify(listaCompra))
    const qtdCarrinho = document.getElementsByClassName('quantidade-carrinho')[0]
    qtdCarrinho.innerHTML = listaCompra.length
}

