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
//      listaCompra = cliente.listaCompra
    } else {
        cliente = { id: null }
        cliente.listaCompra = JSON.parse(sessionStorage.getItem("listaCompra")) || []
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
                <!--p>Quantidade:</p-->
                <div class="set-quantidade">
                    <button id="menos-button">–</button>
                    <p>
                        <input id="valor-adicionar" value=0>
                        <span> ${precos[0].produtoMarca.produto.medida}</span>
                    </p>
                    <button id="mais-button">+</button>
                </div>
                <input id="adicionar" class="adicionar-carrinho" type="button" value="Adicionar">
            </div>

            <div class="quantidade"> <!-- FIXME MOSTRAR APENAS SE HOUVER QUANTIDADE NO CARRINHO -->
                <p>Quantidade no carrinho:</p>
                <p id="quantidade${produtoId}">0 ${precos[0].produtoMarca.produto.medida}</p>
                <span id="remover" class="material-symbols-outlined">delete</span>
            </div>

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
            mercados = [] // solução temporária, pois o banco de dados possui entradas repetidas para produtos no mesmo mercado
            precos.forEach(preco => {
              if (!mercados.includes(preco.mercado.nome)) {
                mercados.push(preco.mercado.nome)
                const divMercado = document.createElement("div")
                divMercado.setAttribute("class", "mercado")
                divMercados.appendChild(divMercado)
                pMercado = document.createElement("p")
                pMercado.innerHTML = preco.mercado.nome
                pPreco = document.createElement("p")
                if (preco.produtoMarca.produto.valorMedida != 1)
                    pPreco.innerHTML = `R$ ${preco.preco} / ${preco.produtoMarca.produto.valorMedida} ${preco.produtoMarca.produto.medida}`.replaceAll('.',',')
                else
                    pPreco.innerHTML = `R$ ${preco.preco} / ${preco.produtoMarca.produto.medida}`.replaceAll('.',',')
                divMercado.appendChild(pMercado)
                divMercado.appendChild(pPreco)
              }
            })

            let idCompra = null
            pQuantidade = document.getElementById('quantidade'+produtoId)
            for (ni=0; ni<cliente.listaCompra.length; ni++) {
                if (cliente.listaCompra[ni].produto.id==produtoId) {
                    idCompra = cliente.listaCompra[ni].id
                    if (cliente.listaCompra[ni].quantidade % 1 > 0)
                        pQuantidade.innerHTML = cliente.listaCompra[ni].quantidade.toFixed(2).replace('.',',') + ' ' + precos[0].produtoMarca.produto.medida
                    else
                        pQuantidade.innerHTML = cliente.listaCompra[ni].quantidade + ' ' + precos[0].produtoMarca.produto.medida
                    break
                }
            }

            const botaoMais = document.querySelector("#mais-button")
            const botaoMenos = document.querySelector("#menos-button")
            const botaoAdicionar = document.querySelector("#adicionar")
            const inputAdicionar = document.querySelector("#valor-adicionar")
            const botaoRemover = document.querySelector("#remover")
            quantidade = precos[0].produtoMarca.produto.valorMedida
            medida = precos[0].produtoMarca.produto.medida
            if (medida=='kg' && quantidade==1) quantidade = 0.1 // adicionar quantidades fracionadas
            botaoMais.addEventListener("click", () => { inputAdicionar.value = Number(inputAdicionar.value) + quantidade });
            botaoMenos.addEventListener("click", () => { inputAdicionar.value = Math.max(0,Number(inputAdicionar.value) - quantidade) })
            botaoAdicionar.addEventListener("click", async () => { pQuantidade.innerHTML = await adicionarQuantidade(cliente.id, produtoId, Number(inputAdicionar.value), medida) })
            botaoRemover.addEventListener("click", () => {
                spanQuantidade = document.getElementById('quantidade'+produtoId)
                if ( spanQuantidade.innerHTML.split(' ')[0] != '0') {
                    spanQuantidade.innerHTML = '0 '+medida
                    if (idCompra!=null)
                        removerItem(idCompra)
                    else
                        for (ni=0; ni<cliente.listaCompra.length; ni++)
                            if (cliente.listaCompra[ni].produto.id==produtoId) {
                                cliente.listaCompra.splice(ni,1)
                                sessionStorage.setItem("listaCompra", JSON.stringify(cliente.listaCompra))  
                                break
                            }
                }
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


