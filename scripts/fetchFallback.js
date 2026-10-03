async function fetchFallback(path, opcoes = {}) {
	try {
		const resposta = await fetch(`http://localhost:8080${path}`, opcoes);
		if (!resposta.ok) {
			throw new Error("Servidor local retornou erro");
		}
//		document.getElementById('login').style.background = 'red'
//		document.getElementById('login').style.borderColor = 'orange'
		document.querySelector('.menu-upper').style.backgroundColor = '#324971'
		document.querySelector('.nav-wrapper').style.backgroundColor = '#324971'
		return resposta;
	} catch {
		return fetch(`https://api-economarket.onrender.com${path}`, opcoes);
	}
}
