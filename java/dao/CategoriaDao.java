package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import interfaces.ICRUD;
import modelos.Categoria;
import utils.ConectaDB;

public class CategoriaDao implements ICRUD<Categoria,Integer> {

	@Override
	public Categoria inserir(Categoria cat) {
		String sql = "insert into tb_categorias(categoria) values (?)";
		try {
			Connection con = ConectaDB.conectar();
			PreparedStatement stm = con.prepareStatement(sql,Statement.RETURN_GENERATED_KEYS);
			stm.setString(1, cat.getCategoria());
			stm.execute();
			ResultSet rs = stm.getGeneratedKeys();
			if(rs.next()) {
				cat.setId(rs.getInt(1));
			}
			rs.close();
			stm.close();
			con.close();
			return cat;
		} catch (SQLException e) {
			e.printStackTrace();
			return null;
		}
	}

	@Override
	public void deletar(Integer id) {
		String sql = "delete from tb_categorias where id=?";
		try {
			Connection con = ConectaDB.conectar();
			PreparedStatement stm = con.prepareStatement(sql);
			stm.setInt(1,id);
			stm.execute();
			stm.close();
			con.close();
			System.out.println("deletando categoria: " + id);
		} catch(Exception e) {
			System.out.println(e.getMessage());
		}
	}

	@Override
	public void alterar(Categoria cat) {
		String sql = "update tb_categorias set categoria=? where id=?";
		try {
			Connection con = ConectaDB.conectar();
			PreparedStatement stm = con.prepareStatement(sql);
			stm.setString(1, cat.getCategoria());
			stm.setInt(3, cat.getId());
			stm.execute();
			stm.close();
			con.close();
			System.out.println("alterando categoria: " + cat.getId());
		} catch(Exception e) {
			System.out.println(e.getMessage());
		}
	}

	@Override
	public Categoria consultar(Integer id) {
		Categoria cat = null;
		String sql = "select * from tb_categorias where id=?";
		try {
			Connection con = ConectaDB.conectar();
			PreparedStatement stm = con.prepareStatement(sql);
			stm.setInt(1,id);
			ResultSet rs = stm.executeQuery();
			if(rs.next()) {
				cat = new Categoria(rs.getInt("id"), rs.getString("categoria"));
			}
			rs.close();
			stm.close();
			con.close();
		} catch(Exception e) {
			System.out.println(e.getMessage());
		}
		return cat;
	}

	@Override
	public List<Categoria> consultar() {
		List<Categoria> Categorias = new ArrayList<Categoria>();
		try {
			Connection con = ConectaDB.conectar();
			PreparedStatement stm = con.prepareStatement("select * from tb_categorias");
			ResultSet rs = stm.executeQuery();
			while(rs.next()) {
				Categoria cat = new Categoria(rs.getInt("id"), rs.getString("categoria"));
				Categorias.add(cat);
			}
			rs.close();
			stm.close();
			con.close();
		} catch(Exception e) {
			System.out.println(e.getMessage());
		}
		return Categorias;
	}

}
