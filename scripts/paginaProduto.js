async function inserirProduto(produtoId) {
    const token = sessionStorage.getItem("token");

    const resposta = await fetch("http://localhost:8080/produtos");
    if (!resposta.ok) {
        console.error("Erro ao buscar produtos");
        return;
    }

    const produtos = await resposta.json();

    if (token != null) {
        const respostaC = await fetch("http://localhost:8080/auth/cliente", {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!respostaC.ok) {
            console.error("Erro ao buscar cliente");
        }
        cliente = await respostaC.json();
        listaCompra = cliente.listaCompra
    } else {
        cliente = { id: null }
        listaCompra = JSON.parse(sessionStorage.getItem("listaCompra")) || []
    }

    const container = document.getElementById("categoria-geral");

    produtos.forEach(produto => {
        if (produto.id === Number(produtoId)) {
            const html = `
    
        <div class="imagem-produto">
            <img src="/imagens/${produto.figura}" alt="">
            <button class="btn-favorito">♡</button>
        </div>
        

        <div class="informacoes">

            <div class="nome">
                <p>${produto.descricao}</p>
            </div>

            <div class="comparativo-preco">
                <div class="mercado">
                    <p>Giassi</p>
                    <p>R$20</p>
                </div>
                <div class="mercado">
                    <p>Koch</p>
                    <p>R$15</p>
                </div>
                <div class="mercado">
                    <p>Angeloni</p>
                    <p>R$15</p>
                </div>
            </div>

            <div class="quantidade">
                <p>Quantidade:</p>
                <div class="set-quantidade">
                    <button id="menos-button">-</button>
                    <p id="quantidade-setada">5</p>
                    <button id="mais-button">+</button>
                </div>
            </div>

            <input class="adicionar-carrinho" type="button" value="Adicionar carrinho">
        </div>
 `
            document.querySelector(".paginaProduto").innerHTML = html

            const botaoMais = document.querySelector("#mais-button")
            botaoMais.addEventListener("click", () => {
                const quantidade = Number(document.querySelector("#quantidade-setada")
                    .innerHTML);

                document.querySelector("#quantidade-setada")
                    .innerHTML = quantidade + 1;
            });

            const botaoMenos = document.querySelector("#menos-button")
            botaoMenos.addEventListener("click", () => {
                const quantidade = document.querySelector("#quantidade-setada")
                    .innerHTML;

                document.querySelector("#quantidade-setada")
                    .innerHTML = quantidade - 1;
        })


        } else {
            return
        }
    })
}





