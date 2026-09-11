function checarTokenExpirado(token) {
	try {
		const payload = token.split(".")[1];
// Convert Base64URL to standard Base64
		const base64 = payload
			.replace(/-/g, "+")
			.replace(/_/g, "/")
			.padEnd(Math.ceil(payload.length / 4) * 4, "=");
		const decoded = JSON.parse(atob(base64));
		return !decoded.exp || decoded.exp <= Math.floor(Date.now() / 1000);
	} catch {
		return true; // Treat malformed tokens as expired
	}
}

token = sessionStorage.getItem("token")
if (token!=null && checarTokenExpirado(token)) {
	window.alert("Token expirado. Faça login novamente.")
	sessionStorage.removeItem("token")
}
