package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import interfaces.ICRUD;
import modelos.Produto;
import utils.ConectaDB;

public class ProdutoDao implements ICRUD<Produto,Integer> {

	@Override
	public Produto inserir(Produto prod) {
		String sql = "insert into tb_produtos(descricao, medida, id_categoria) values (?, ?,?)";
		try {
			Connection con = ConectaDB.conectar();
			PreparedStatement stm = con.prepareStatement(sql,Statement.RETURN_GENERATED_KEYS);
			stm.setString(1, prod.getDescricao());
			stm.setString(2, prod.getMedida());
			stm.setInt(3, prod.getIdCategoria());
			stm.execute();
			ResultSet rs = stm.getGeneratedKeys();
			if(rs.next()) {
				prod.setId(rs.getInt(1));
			}
			rs.close();
			stm.close();
			con.close();
			return prod;
		} catch (SQLException e) {
			e.printStackTrace();
			return null;
		}
	}

	@Override
	public void deletar(Integer id) {
		String sql = "delete from tb_produtos where id=?";
		try {
			Connection con = ConectaDB.conectar();
			PreparedStatement stm = con.prepareStatement(sql);
			stm.setInt(1,id);
			stm.execute();
			stm.close();
			con.close();
			System.out.println("deletando produto: " + id);
		} catch(Exception e) {
			System.out.println(e.getMessage());
		}
	}

	@Override
	public void alterar(Produto prod) {
		String sql = "update tb_produtos set descricao=?, medida=?, id_categoria=? where id=?";
		try {
			Connection con = ConectaDB.conectar();
			PreparedStatement stm = con.prepareStatement(sql);
			stm.setString(1, prod.getDescricao());
			stm.setString(2, prod.getMedida());
			stm.setInt(3, prod.getIdCategoria());
			stm.setInt(4, prod.getId());
			stm.execute();
			stm.close();
			con.close();
			System.out.println("alterando produto: " + prod.getId());
		} catch(Exception e) {
			System.out.println(e.getMessage());
		}
	}

	@Override
	public Produto consultar(Integer id) {
		Produto prod = null;
		String sql = "select * from tb_produtos where id=?";
		try {
			Connection con = ConectaDB.conectar();
			PreparedStatement stm = con.prepareStatement(sql);
			stm.setInt(1,id);
			ResultSet rs = stm.executeQuery();
			if(rs.next()) {
				prod = new Produto(rs.getInt("id"), rs.getString("descricao"), rs.getString("medida"), rs.getInt("id_categoria"));
			}
			rs.close();
			stm.close();
			con.close();
		} catch(Exception e) {
			System.out.println(e.getMessage());
		}
		return prod;
	}

	@Override
	public List<Produto> consultar() {
		List<Produto> produtos = new ArrayList<Produto>();
		try {
			Connection con = ConectaDB.conectar();
			PreparedStatement stm = con.prepareStatement("select * from tb_produtos");
			ResultSet rs = stm.executeQuery();
			while(rs.next()) {
				Produto prod = new Produto(rs.getInt("id"), rs.getString("descricao"), rs.getString("medida"), rs.getInt("id_categoria"));
				produtos.add(prod);
			}
			rs.close();
			stm.close();
			con.close();
		} catch(Exception e) {
			System.out.println(e.getMessage());
		}
		return produtos;
	}

}
