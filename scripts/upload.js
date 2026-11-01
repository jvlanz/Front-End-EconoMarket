async function uploadFile(mercado) {
    const fileInput = document.querySelector("#fileInput"+mercado);
    const file = fileInput.files[0];

    if (!file) {
        alert("Selecione um arquivo");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetchFallback("/upload/"+mercado, {
            method: "POST",
            body: formData
        });
        const result = await response.text();
        alert(result);
    } catch (error) {
        console.error("Upload falhou:", error);
    }
}