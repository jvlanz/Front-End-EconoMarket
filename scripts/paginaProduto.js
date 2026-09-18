async function inserirProduto(produtoId) {
    const token = sessionStorage.getItem("token");

    const resposta = await fetch("http://localhost:8080/produtos");
    if (!resposta.ok) {
        console.error("Erro ao buscar produtos");
        return;
    }

    const produtos = await resposta.json();


    const respostaP = await fetch("http://localhost:8080/precos/"+produtoId);
    if (!respostaP.ok) {
        console.error("Erro ao buscar preços");
        return;
    }
    const precos = await respostaP.json();

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
            var idFav = null;
            if (cliente.id != null) {
                cliente.favoritos.forEach(favorito => {
                    if (favorito.produto.id == produto.id) {
                        idFav = favorito.id;
                    }
                })
            }

            const html = `
    
        <div class="imagem-produto">
            <img src="../imagens/${produto.figura}" alt="">
            <button class="btn-favorito" onclick="toggleFavorito(${produto.id}, ${cliente.id}, ${idFav})">♡</button>
        </div>
        

        <div class="informacoes">

            <div class="nome">
                <p>${produto.descricao}</p>
            </div>

            <div id="mercados" class="comparativo-preco">
            </div>

            <div class="quantidade">
                <p>Quantidade:</p>
                <div class="set-quantidade">
                    <button id="menos-button">-</button>
                    <p id="quantidade-setada">1</p>
                    <button id="mais-button">+</button>
                </div>
            </div>

            <input class="adicionar-carrinho" type="button" value="Adicionar carrinho">
        </div>

 `
            document.querySelector(".paginaProduto").innerHTML = html
            const botaoFav = document.getElementsByClassName("btn-favorito")[0];
            if (idFav != null) {
                botaoFav.innerHTML = "♥";
            }

            if (cliente.id == null) {
                botaoFav.style.display = "none";
            }

            const divMercados = document.getElementById("mercados")
            precos.forEach(preco => {
                const divMercado = document.createElement("div")
                divMercado.setAttribute("class", "mercado")
                divMercados.appendChild(divMercado)
                pMercado = document.createElement("p")
                pMercado.innerHTML = preco.mercado.nome
                pPreco = document.createElement("p")
                pPreco.innerHTML = `R$ ${preco.preco}`.replaceAll('.',',')
                divMercado.appendChild(pMercado)
                divMercado.appendChild(pPreco)
            })

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


function toggleFavorito(idProduto, idCliente, favId) {
    console.log(idProduto + ' ' + idCliente + " " + favId)
    botaoFavorito = document.getElementsByClassName("btn-favorito")[0];
    if (botaoFavorito.innerHTML === "♡") {
        incluirFavorito(idProduto, idCliente)
        botaoFavorito.innerHTML = "♥";
    } else {
        removerFavorito(`${favId}`)
        botaoFavorito.innerHTML = "♡";
    }
}


