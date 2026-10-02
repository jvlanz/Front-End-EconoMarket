async function incluirFavorito(idProduto, idCliente) {
    const token = sessionStorage.getItem("token");
    const item = {
        idProduto: idProduto,
        idCliente: idCliente
    }

    const resposta = await fetchFallback("/favoritos", {
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
    await fetchFallback("/favoritos/"+idFavorito, {
        method: 'DELETE',
        headers: { "Authorization": `Bearer ${token}` }
    })
    .then(resposta => {
        if (resposta.ok) {
            console.log('Favorito '+idFavorito+' removido')
        } else {
            console.error('Erro ao remover favorito:', resposta.status);
        }
    })
    .catch(erro => console.error('Erro com a operação fetch:', erro))
}
