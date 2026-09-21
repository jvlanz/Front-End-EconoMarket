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
                    <button id="menos-button">–</button>
                    <p id="quantidade${produtoId}">0</p>
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

            pQuantidade = document.getElementById('quantidade'+produtoId)
            for (ni=0; ni<listaCompra.length; ni++) {
                if (listaCompra[ni].id==produtoId) {
                    pQuantidade.innerHTML = listaCompra[ni].quantidade + ' ' + precos[0].produtoMarca.produto.medida
                    break
                }
            }

            const botaoMais = document.querySelector("#mais-button")
            const botaoMenos = document.querySelector("#menos-button")
            if (token!=null) {
                botaoMais.addEventListener("click", () => {
                    for (ni=0; ni<listaCompra.length; ni++) {
                        presente = false
                        if (listaCompra[ni].produto.id==produtoId) {
                            listaCompra[ni].quantidade += listaCompra[ni].produto.valorMedida
                            pQuantidade.innerHTML = listaCompra[ni].quantidade + ' ' + precos[0].produtoMarca.produto.medida
                            presente = true
                            alterarItem(listaCompra[ni].id, produtoId, cliente.id, listaCompra[ni].quantidade)
                            break
                        }
                    }
                    if (!presente) {
                        listaCompra.push( {id:produtoId, quantidade:precos[0].produtoMarca.produto.valorMedida} )
                        pQuantidade.innerHTML = precos[0].produtoMarca.produto.valorMedida + ' ' + precos[0].produtoMarca.produto.medida
                        incluirItem(produtoId, cliente.id, precos[0].produtoMarca.produto.valorMedida)
                    }
                });

                botaoMenos.addEventListener("click", () => {
                    for (ni=0; ni<listaCompra.length; ni++) {
                        if (listaCompra[ni].produto.id==produtoId) {
                            listaCompra[ni].quantidade -= listaCompra[ni].produto.valorMedida
                            if (listaCompra[ni].quantidade <=0) {
                                removerItem(listaCompra[ni].id)
                                listaCompra.splice(ni,1)
                                pQuantidade.innerHTML = '0 ' + precos[0].produtoMarca.produto.medida
                            } else {
                                pQuantidade.innerHTML = listaCompra[ni].quantidade + ' ' + precos[0].produtoMarca.produto.medida
                                alterarItem(listaCompra[ni].id, produtoId, cliente.id, listaCompra[ni].quantidade)
                            }
                            break
                        }
                    }
                })

            } else {
                botaoMais.addEventListener("click", () => {
                    for (ni=0; ni<listaCompra.length; ni++) {
                        presente = false
                        if (listaCompra[ni].id==produtoId) {
                            listaCompra[ni].quantidade += precos[0].produtoMarca.produto.valorMedida
                            pQuantidade.innerHTML = listaCompra[ni].quantidade + ' ' + precos[0].produtoMarca.produto.medida
                            presente = true
                            break
                        }
                    }
                    if (!presente) {
                        listaCompra.push( {id:produtoId, quantidade:precos[0].produtoMarca.produto.valorMedida} )
                        pQuantidade.innerHTML = precos[0].produtoMarca.produto.valorMedida + ' ' + precos[0].produtoMarca.produto.medida
                    }
                    sessionStorage.setItem('listaCompra', JSON.stringify(listaCompra))
                });

                botaoMenos.addEventListener("click", () => {
                    for (ni=0; ni<listaCompra.length; ni++) {
                        if (listaCompra[ni].id==produtoId) {
                            listaCompra[ni].quantidade -= precos[0].produtoMarca.produto.valorMedida
                            if (listaCompra[ni].quantidade <=0) {
                                listaCompra.splice(ni,1)
                                pQuantidade.innerHTML = '0 ' + precos[0].produtoMarca.produto.medida
                            } else {
                                pQuantidade.innerHTML = listaCompra[ni].quantidade + ' ' + precos[0].produtoMarca.produto.medida
                            }
                            break
                        }
                    }
                    sessionStorage.setItem('listaCompra', JSON.stringify(listaCompra))
                })
            }


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


