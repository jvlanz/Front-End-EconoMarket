async function fetchFallback(path, opcoes = {}) {
	try {
		const resposta = await fetch(`http://localhost:8080${path}`, opcoes);
		if (!resposta.ok) {
			throw new Error("Servidor local retornou erro");
		}
//		document.getElementById('login').style.background = 'red'
//		document.getElementById('login').style.borderColor = 'orange'
		menuUpper = document.querySelector('.menu-upper')
		if (menuUpper!=null) menuUpper.style.backgroundColor = '#324971'
		navWrapper = document.querySelector('.nav-wrapper')
		if (navWrapper!=null) navWrapper.style.backgroundColor = '#324971'
		return resposta;
	} catch {
		return fetch(`https://api-economarket.onrender.com${path}`, opcoes);
	}
}
