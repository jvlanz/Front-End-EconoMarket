<%@page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@page import="dao.CategoriaDao"%>
<%@page import="modelos.Categoria"%>
<%@page import="java.util.List"%>
<header class="topo-wrapper">
    <div class="topo">
        <div id="menu-head">
            <a href="paginaPrincipal.html"><img src="../imagens/LogoEconoMarket.png" alt="IconeLogo"
                    class="icone-logo"></a>

            <div class="container-pesquisa">
                <input type="text" class="pesquisa" placeholder="Buscar Produtos...">
                <img src="../imagens/IconeLupa.png" alt="IconeLupa" class="icone-lupa">
            </div>
            <img src="../imagens/IconeCesta.png" alt="IconeCesta" class="icone-cesta">
            <button id="login" onclick="abrirLogin()">Login</button>
        </div>


        <nav class="menu">
            <div class="todas-categorias">
                <i class="material-icons" id="icons-toc">toc</i>
                <a href="todasCategorias.html">Todas as Categorias</a>
            </div>
            <div class="categorias" id="divCategorias">
                <!-- --- -->
    <%
    CategoriaDao dao = new CategoriaDao();
    List<Categoria> categorias = dao.consultar();
    for (Categoria cat : categorias) {
        out.print("<a href=\"paginaCategoria.html?categoria="+cat.getId()+"\">"+cat.getCategoria()+"</a>");
    }
    %>
                <!-- --- -->
                <a href="paginaSobre.html">Sobre nós</a>
                <a href="#contato">Contato</a>
            </div>
        </nav>
    </div>
</header>
