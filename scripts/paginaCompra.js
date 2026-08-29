
async function obterDadosCompra() {
    const respostaC = await fetch("http://localhost:8080/clientes/1");
    if (!respostaC.ok) {
        console.error("Erro ao buscar cliente");
        return;
    }
    const cliente = await respostaC.json();

    const respostaM = await fetch("http://localhost:8080/mercados");
    if (!respostaM.ok) {
        console.error("Erro ao buscar mercados");
        return;
    }
    const mercados = await respostaM.json();

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
    for (n=0; n<cliente.listaCompra.length; n++) {
        item = cliente.listaCompra[n]
        const respostaP = await fetch("http://localhost:8080/precos/"+item.produto.id);
        if (!respostaP.ok) {
            console.error("Erro ao buscar preços");
            return;
        }
        const precos = await respostaP.json();
        tr = document.createElement('tr')
        tbody.appendChild(tr)
        td = document.createElement('td')
        td.innerHTML = '<img src=../imagens/'+item.produto.figura+' height=50px></img>'+item.produto.descricao
        td.style.backgroundColor = 'white'
        td.style.borderRadius = '10px'
        tr.appendChild(td)
        td = document.createElement('td')
        tr.appendChild(td)
        sel = document.createElement('select')
        td.appendChild(sel)
        opt = document.createElement('option')
        opt.value = ''
        sel.appendChild(opt)
        const marcas = []
        mercados.forEach(mercado => {
          if (mercado.id<=nMercados) {
            td = document.createElement('td')
            td.style.textAlign = 'center'
            tr.appendChild(td)
            const mercadoRadio = document.createElement('input')
            mercadoRadio.setAttribute('class', 'checkbox')
            mercadoRadio.type = 'radio'
            mercadoRadio.id = 'rad'+item.id+mercado.id
            mercadoRadio.name = 'rad'+item.id
            mercadoRadio.disabled = true
            label = document.createElement('label')
            label.innerHTML = ''
            td.appendChild(mercadoRadio)
            td.appendChild(label)
            precos.forEach(preco => {
                if (marcas.indexOf(preco.produtoMarca.marca.id)==-1) {
                    marcas.push(preco.produtoMarca.marca.id)
                    var opt = document.createElement('option')
                    opt.value = preco.produtoMarca.produto.id
                    opt.innerHTML = preco.produtoMarca.marca.marca
                    sel.appendChild(opt)
                }
                if (item.produto.id==preco.produtoMarca.produto.id && mercado.id==preco.mercado.id) {
                    label.innerHTML = 'R$'+preco.preco
                    mercadoRadio.disabled = ''
                }
            })
          }
        })
        td = document.createElement('td')
        td.innerHTML = '<button id="remover" onclick="removerItem('+item.id+')">remover</button>'
        tr.appendChild(td)
//    })
    }
}

function removerItem(id) {
    fetch("http://localhost:8080/listaCompra/"+id, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            console.log('item '+id+' removido')
            redistribuir()
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
    tr.innerHTML = '<th>Produto</th><th>Marca</th>'
    tbody = document.createElement('tbody')
    tab.appendChild(tbody)
    obterDadosCompra()
}
