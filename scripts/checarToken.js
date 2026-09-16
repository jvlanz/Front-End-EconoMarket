function decodeToken(token) {
	const payload = token.split(".")[1];
// Convert Base64URL to standard Base64
	const base64 = payload
		.replace(/-/g, "+")
		.replace(/_/g, "/")
		.padEnd(Math.ceil(payload.length / 4) * 4, "=");
	return JSON.parse(atob(base64));
}

function checarTokenExpirado(token) {
	try {
		const decoded = decodeToken(token);
		return !decoded.exp || decoded.exp <= Math.floor(Date.now() / 1000);
	} catch {
		return true; // Treat malformed tokens as expired
	}
}

function obterTokenRole(token) {
		const decoded = decodeToken(token);
		return decoded.role;
}

function obterTokenNome(token) {
		const decoded = decodeToken(token);
		return decoded.nome;
}

token = sessionStorage.getItem("token")
console.log(token)
if (token!=null && checarTokenExpirado(token)) {
	window.alert("Token expirado. Faça login novamente.")
	sessionStorage.removeItem("token")
}
