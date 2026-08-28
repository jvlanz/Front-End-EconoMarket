
async function obterDadosCompra() {
    const respostaC = await fetch("http://localhost:8080/compras/1");
    if (!respostaC.ok) {
        console.error("Erro ao buscar carrinho");
        return;
    }
    const compras = await respostaC.json();
//  console.log(compras)

    const respostaM = await fetch("http://localhost:8080/mercados");
    if (!respostaM.ok) {
        console.error("Erro ao buscar mercados");
        return;
    }
    const mercados = await respostaM.json();
//  console.log(mercados)

    const respostaP = await fetch("http://localhost:8080/precos");
    if (!respostaP.ok) {
        console.error("Erro ao buscar preços");
        return;
    }
    const precos = await respostaP.json();
//  console.log(precos)

    nMercados = document.getElementById('nMercados').value
    if (nMercados>mercados.length) {
        nMercados = mercados.length
        document.getElementById('nMercados').value = mercados.length
    }
    tr = document.getElementsByTagName('tr')[0]
    for (n=0; n<nMercados; n++) {
        tr.innerHTML += '<th>'+mercados[n].nome+'</th>'
    }
    tr.innerHTML += '<th></th>'    // coluna extra para botão remover
    tbody = document.getElementsByTagName('tbody')[0]
    compras.listaCompra.forEach(compra => {
        tr = document.createElement('tr')
        tbody.appendChild(tr)
        td = document.createElement('td')
        td.innerHTML = '<img src=../imagens/'+compra.produtoMarca.produto.figura+' height=50px></img>'+compra.produtoMarca.produto.descricao + ' ' + compra.produtoMarca.marca.marca
        tr.appendChild(td)
//      console.log(compra.produtoMarca.produto.descricao + ' marca ' + compra.produtoMarca.marca.marca + ': ' + compra.produtoMarca.produto.figura)
        mercados.forEach(mercado => {
          if (mercado.id<=nMercados) {
            precos.forEach(preco => {
                if (compra.produtoMarca.id==preco.produtoMarca.id && mercado.id==preco.mercado.id) {
                    td = document.createElement('td')
                    tr.appendChild(td)
                    const mercadoRadio = document.createElement('input')
                    mercadoRadio.setAttribute('class', 'checkbox')
                    mercadoRadio.type = 'radio'
                    mercadoRadio.id = 'rad'+compra.id+mercado.id
                    mercadoRadio.name = 'rad'+mercado.id
                    label = document.createElement('label')
                    label.innerHTML = 'R$'+preco.preco
                    td.appendChild(mercadoRadio)
                    td.appendChild(label)
                }
            })
          }
        })
        td = document.createElement('td')
        td.innerHTML = '<button onclick="removerItem('+compra.id+')">remover</button>'
        tr.appendChild(td)
    })
}

function removerItem(id) {
    fetch("http://localhost:8080/listaCompra/"+id, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            console.log('item '+id+' removido')
        } else {
            console.error('erro ao remover produto:', response.status);
        }
    })
    .catch(error => console.error('erro com a operação fetch:', error))
}

function redistribuir() {
    divCompra = document.getElementById('listaCompra')
    divCompra.innerHTML = ''
    tab = document.createElement('table')
    divCompra.appendChild(tab)
    thead = document.createElement('thead')
    tab.appendChild(thead)
    tr = document.createElement('tr')
    thead.appendChild(tr)
    tr.innerHTML = '<th>Produto</th>'
    tbody = document.createElement('tbody')
    tab.appendChild(tbody)
    obterDadosCompra()
}
/*
    <table>
        <thead>
            <tr>
                <th>Id</th>
                <th>Descrição</th>
                <th>R$ unitário</th>
                <th>Qtd. disponível</th>
            </tr>
        </thead>
        <tbody>
            <!-- preenchido pelo javascript -->
        </tbody>
    </table>
    <script>
        fetch('http://localhost:8080/produtos')
            .then(resp => resp.json())
            .then(dados => {
                dados.forEach(e => {
                    linha = `<tr><td>${e.id}</td><td>${e.descricao}</td><td>${e.preco}</td><td>${e.estoque}</td></tr>`
//                  console.log(linha)
                    document.getElementsByTagName('tbody')[0].innerHTML+=linha
                })
            })
    </script>
*/
