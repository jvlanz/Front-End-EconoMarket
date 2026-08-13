<%@page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@page import="dao.CategoriaDao"%>
<%@page import="modelos.Categoria"%>
<%@page import="java.util.List"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
</head>
<body>

<%
	CategoriaDao dao = new CategoriaDao();
	List<Categoria> categorias = dao.consultar();
	for (Categoria cat : categorias) {
		out.print("<p>"+cat.getCategoria()+"</p>");
	}
	out.print("<hr />");
	out.print("<a href='produto.jsp'>novo</a>");
%>

</body>
</html>