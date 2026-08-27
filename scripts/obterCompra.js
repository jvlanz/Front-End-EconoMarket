async function obterCompra() {
    const respostaC = await fetch("http://localhost:8080/compras/1");
    if (!respostaC.ok) {
        console.error("Erro ao buscar carrinho");
        return;
    }
    const compras = await respostaC.json();
    console.log(compras)

    const respostaM = await fetch("http://localhost:8080/mercados");
    if (!respostaM.ok) {
        console.error("Erro ao buscar mercados");
        return;
    }
    const mercados = await respostaM.json();
    console.log(mercados)

    const respostaP = await fetch("http://localhost:8080/precos");
    if (!respostaP.ok) {
        console.error("Erro ao buscar preços");
        return;
    }
    const precos = await respostaP.json();
    console.log(precos)

    compras.listaCompra.forEach(compra => {
        mercados.push()
        console.log(compra.produtoMarca.produto.descricao + ' marca ' + compra.produtoMarca.marca.marca + ': ' + compra.produtoMarca.produto.figura)
        precos.forEach(preco => {
            
        })
    })
}