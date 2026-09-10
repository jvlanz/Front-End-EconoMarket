async function uploadFile() {
    const fileInput = document.querySelector("#fileInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Selecione um arquivo");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch("http://localhost:8080/files/upload", {
            method: "POST",
            body: formData
        });
        const result = await response.text();
        alert(result);
    } catch (error) {
        console.error("Upload falhou:", error);
    }
}