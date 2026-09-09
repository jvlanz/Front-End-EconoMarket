function inserirHeader() {
    return fetch('header.html')
        .then(r => r.ok ? r.text() : Promise.reject(r.status))
        .then(content => {
            document.body.insertAdjacentHTML('afterbegin', content);
            /* const divCategoria = document.getElementById('divCategorias')
            categorias.reverse().forEach ( item => {
                alink = document.createElement('a')
                alink.href = "paginaCategoria.html?categoria="+item.id
                alink.innerHTML = item.descricao
                divCategoria.insertBefore(alink,divCategoria.firstChild)
            }) */
            const qtdCarrinho = document.getElementsByClassName('quantidade-carrinho')[0]
            const input = document.getElementById("pesquisa");
            input.addEventListener("keydown", () => { buscar(input) } )

            const token = sessionStorage.getItem("token");
            fetch("http://localhost:8080/auth/cliente", {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            })
            .then(respostaLog => {
                if (!respostaLog.ok) {
                    console.error("Erro ao checar login");
                    return;
                }
                respostaLog.json()
                .then(cliente => {
                    if (cliente.nome!=null) {
                        const login = document.getElementById("login");
                        login.innerHTML = "Olá, "+cliente.nome.split(' ')[0]
                        qtdCarrinho.innerHTML = cliente.listaCompra.length
                    }
                })
            })
        })
        .catch(e => console.error('Include failed:', e));
}

function buscar(input) {
    if (event.key==="Enter") {
        window.open('paginaPrincipal.html?busca='+input.value, '_self')
    }
}

