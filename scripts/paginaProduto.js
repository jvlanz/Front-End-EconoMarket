precos = []
mercados = [] // solução temporária, pois o banco de dados possui entradas repetidas para produtos no mesmo mercado

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
    precos = await respostaP.json();

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

    var produtoNome = ''
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

            document.getElementById('imagem-produto').src = "../imagens/"+produto.figura
            document.getElementById('btn-favorito').onclick = () => { toggleFavorito( produto.id, cliente.id, idFav) }
            document.getElementById('nome-produto').innerHTML = produto.descricao + document.getElementById('nome-produto').innerHTML
            document.querySelector(".quantidade-selecionada").innerHTML = '0 '+precos[0].produtoMarca.produto.medida

            const botaoFav = document.getElementsByClassName("btn-favorito")[0];
            if (idFav != null) {
                botaoFav.innerHTML = "♥";
            }

            if (cliente.id == null) {
                botaoFav.style.display = "none";
            }

            const divMercados = document.getElementById("mercados")
            const selMarca = document.getElementById("selMarca")
            marcas = ['']
            precos.forEach(preco => {
                if (!mercados.includes(preco.mercado.id)) {
                    mercados.push(preco.mercado.id) // FIXME inclui primeiro valor da lista, independente da marca/valor
                    const divMercado = document.createElement("div")
                    divMercado.setAttribute("class", "mercado")
                    divMercados.appendChild(divMercado)
                    pMercado = document.createElement("p")
                    pMercado.innerHTML = preco.mercado.nome
                    pPreco = document.createElement("p")
                    pPreco.id = 'preco'+preco.mercado.id
                    if (preco.produtoMarca.produto.valorMedida != 1)
                        pPreco.innerHTML = `R$ ${preco.preco} / ${preco.produtoMarca.produto.valorMedida} ${preco.produtoMarca.produto.medida}`.replaceAll('.',',')
                    else
                        pPreco.innerHTML = `R$ ${preco.preco} / ${preco.produtoMarca.produto.medida}`.replaceAll('.',',')
                    divMercado.appendChild(pMercado)
                    divMercado.appendChild(pPreco)
                }
                if (!marcas.includes(preco.produtoMarca.marca.marca)) {
                    marcas.push(preco.produtoMarca.marca.marca)
                    optMarca = document.createElement('option')
                    optMarca.value = preco.produtoMarca.marca.marca
                    optMarca.innerHTML = preco.produtoMarca.marca.marca
                    selMarca.appendChild(optMarca)
                }
            })

            let idCompra = null
            const pQuantidade = document.getElementById('quantidadeProduto')
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
            const qtdAdicionar = document.querySelector(".quantidade-selecionada")
            const botaoRemover = document.querySelector(".remover")
            quantidade = precos[0].produtoMarca.produto.valorMedida
            medida = precos[0].produtoMarca.produto.medida
            if (medida=='kg' && quantidade==1) quantidade = 0.1 // adicionar quantidades fracionadas
            botaoMais.addEventListener("click", () => {
                valor = Number(qtdAdicionar.innerHTML.split(' ')[0]) + quantidade
                qtdAdicionar.innerHTML = valor + ' ' + medida
            });
            botaoMenos.addEventListener("click", () => {
                valor = Number(qtdAdicionar.innerHTML.split(' ')[0]) - quantidade
                qtdAdicionar.innerHTML = Math.max(0,valor) + ' ' + medida
            })
            botaoAdicionar.addEventListener("click", async () => { pQuantidade.innerHTML = await adicionarQuantidade(cliente.id, produtoId, Number(inputAdicionar.value), medida) })
            botaoRemover.addEventListener("click", async () => { pQuantidade.innerHTML = await removerQuantidade(cliente.id, produtoId, 99999, medida) })

            produtoNome = produto.descricao.split(' ')[0]
            produtoCategoria = produto.categoria.categoria
        } else {
            return
        }

    })

    divRelacionados = document.getElementById('produtos-relacionados')
    divProdutos = document.getElementById('container1')
    produtos.forEach(produto => {
        if (produto.id === Number(produtoId)) { return }
//      if (produto.categoria.categoria != produtoCategoria) { return }
        nomes = produto.descricao.split(' ')
        for (nn=0; nn<nomes.length; nn++) {
            if(nomes[nn]==produtoNome) {
//      if (produto.descricao.split(' ')[0]==produtoNome) {
                divRelacionados.style.display = ''
                divProdutos.innerHTML += '\
<div class="card-produto">\
    <a href=paginaProduto.html?produto='+produto.id+'>\
        <img src="../imagens/'+produto.figura+'">\
        <div class="nome-produto">'+produto.descricao+'</div>\
    </a>\
</div>'
            }
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

function mostrarValores() {
    const selMarca = document.getElementById("selMarca")
    mercados.forEach(idMercado => {
        document.getElementById('preco'+idMercado).innerHTML = '--'
    })
    precos.forEach(preco => {
        if (preco.produtoMarca.marca.marca==selMarca.value) {
            pPreco = document.getElementById('preco'+preco.mercado.id)
            if (preco.produtoMarca.produto.valorMedida != 1)
                pPreco.innerHTML = `R$ ${preco.preco} / ${preco.produtoMarca.produto.valorMedida} ${preco.produtoMarca.produto.medida}`.replaceAll('.',',')
            else
                pPreco.innerHTML = `R$ ${preco.preco} / ${preco.produtoMarca.produto.medida}`.replaceAll('.',',')
        }
    })
}
