async function alterarProduto(produtoRequest) {
    const token = sessionStorage.getItem("token");

    const resposta = await fetchFallback("/produto/"+produtoRequest.id, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(produtoRequest)
    });
    if (!resposta.ok) {
        console.error("Erro ao alterar produto");
        return;
    }
    const itemDB = await resposta.json();
    return itemDB
}