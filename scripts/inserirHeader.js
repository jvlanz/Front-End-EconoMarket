function inserirHeader(fname, element = document.body) {
    return fetch(fname)
        .then(r => r.ok ? r.text() : Promise.reject(r.status))
        .then(content => {
            element.insertAdjacentHTML('afterbegin', content);
            const divCategoria = document.getElementById('divCategorias')
            /* categorias.reverse().forEach ( item => {
                alink = document.createElement('a')
                alink.href = "paginaCategoria.html?categoria="+item.id
                alink.innerHTML = item.descricao
                divCategoria.insertBefore(alink,divCategoria.firstChild)
            }) */
            return;
        })
        .catch(e => console.error('Include failed:', e));

}
