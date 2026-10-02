async function fetchFallback(path, opcoes = {}) {
	try {
		const resposta = await fetch(`http://localhost:8080${path}`, opcoes);
		if (!resposta.ok) {
			throw new Error("Servidor local retornou erro");
		}
		return resposta;
	} catch {
		return fetch(`https://api-economarket.onrender.com${path}`, opcoes);
	}
}
