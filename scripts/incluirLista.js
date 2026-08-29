async function incluirnaLista(idProduto, idCliente, quantidade) {
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
    const qtdCarrinho = document.getElementsByClassName('quantidade-carrinho')[0]
    val = qtdCarrinho.innerHTML
    qtdCarrinho.innerHTML = Number(val)+1
    botaoCarrinho = document.getElementById('bt'+idProduto)
    botaoCarrinho.style.display = 'none'

}