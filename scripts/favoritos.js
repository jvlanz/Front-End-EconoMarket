async function incluirFavorito(idProduto, idCliente) {
    const token = sessionStorage.getItem("token");
    const item = {
        idProduto: idProduto,
        idCliente: idCliente
    }

    const resposta = await fetch("http://localhost:8080/favoritos", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(item)
    });

    if (!resposta.ok) {
        console.error("Erro ao favoritar produto");
        return;
    }
    const itemDB = await resposta.json();
    return itemDB
}

async function removerFavorito(idFavorito) {
    const token = sessionStorage.getItem("token");
    await fetch("http://localhost:8080/favoritos/"+idFavorito, {
        method: 'DELETE',
        headers: { "Authorization": `Bearer ${token}` }
    })
    .then(response => {
        if (response.ok) {
            console.log('favorito '+idFavorito+' removido')
        } else {
            console.error('erro ao remover favorito:', response.status);
        }
    })
    .catch(error => console.error('erro com a operação fetch:', error))
}
