<%@page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@page import="modelos.Categoria"%>
<%@page import="modelos.Produto"%>
<%@page import="dao.CategoriaDao"%>
<%@page import="dao.ProdutoDao"%>
<%@page import="java.util.List"%>
<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EconoMarket</title>
    <link rel="stylesheet" href="../estilos/index.css">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>

<body>
    <jsp:include page="header.jsp" />
    <%
    CategoriaDao catDao = new CategoriaDao();
    List<Categoria> categorias = catDao.consultar();
    ProdutoDao prodDao = new ProdutoDao();
    List<Produto> produtos = prodDao.consultar();
    for (Categoria cat : categorias) {
        out.print("<h2>"+cat.getCategoria()+"</h2>");
        out.print("<div class=\"container1\", id="+cat.getCategoria()+">");
        for (Produto prod : produtos) {
            if (prod.getIdCategoria()==cat.getId()) {
                out.print("<div class=\"card-produto\"> <img src=\"../imagens/"+prod.getDescricao().split(" ")[0].toLowerCase()+".jpg\">"); // FIXME: definir como chamar figuras
                out.print("<div class=\"preco-produto\">R$99,99/"+prod.getMedida()+"</div>"); // FIXME: falta obter faixa de preços do banco de dados
                out.print("<div class=\"nome-produto\">"+prod.getDescricao()+"</div> <button class=\"btn-add\">+</button>");
                out.print("</div>");
            }
        }
        out.print("</div>");
    }
    %>
    <!-- SOBRE -->
    <div id="sobre" class="secao-info">
        <h1>Sobre nós</h1>
        <p> O <span class="destaque">EconoMarket</span> é um protótipo desenvolvido no programa Entra21, a ideia do
            nosso projeto é ser um comparador de preços de diferentes mercados. </p>
      
    </div>
    <!-- CONTATO -->
    <div id="contato" class="secao-info">
        <h1>Contato</h1>
        <p>Ficou com alguma dúvida ou sugestão?</p>
        <p>📧 Email: <span class="destaque">economarket@gmail.com</span></p>
    </div>
    <footer class="footer-nav">
        <a href="#">Home</a>
        <a href="#">Produtos</a>
        <a href="#">Carrinho</a>
        <a href="#">Perfil</a>
    </footer>
    
</body>

</html>

