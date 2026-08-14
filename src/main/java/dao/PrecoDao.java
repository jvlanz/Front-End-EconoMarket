package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import interfaces.ICRUD;
import modelos.Preco;
import utils.ConectaDB;

public class PrecoDao implements ICRUD<Preco,Integer> {

	@Override
	public Preco inserir(Preco pre) {
		String sql = "insert into tb_precos(preco, id_produto, id_mercado) values (?, ?, ?)";
		try {
			Connection con = ConectaDB.conectar();
			PreparedStatement stm = con.prepareStatement(sql,Statement.RETURN_GENERATED_KEYS);
			stm.setFloat(1, pre.getPreco());
			stm.setInt(2, pre.getIdProduto());
			stm.setInt(3, pre.getIdMercado());
			stm.execute();
			ResultSet rs = stm.getGeneratedKeys();
			if(rs.next()) {
				pre.setId(rs.getInt(1));
			}
			rs.close();
			stm.close();
			con.close();
			return pre;
		} catch (SQLException e) {
			e.printStackTrace();
			return null;
		}
	}

	@Override
	public void deletar(Integer id) {
		String sql = "delete from tb_precos where id=?";
		try {
			Connection con = ConectaDB.conectar();
			PreparedStatement stm = con.prepareStatement(sql);
			stm.setInt(1,id);
			stm.execute();
			stm.close();
			con.close();
			System.out.println("deletando preco: " + id);
		} catch(Exception e) {
			System.out.println(e.getMessage());
		}
	}

	@Override
	public void alterar(Preco pre) {
		String sql = "update tb_precos set preco=?, id_produto=?, id_mercado=? where id=?";
		try {
			Connection con = ConectaDB.conectar();
			PreparedStatement stm = con.prepareStatement(sql);
			stm.setFloat(1, pre.getPreco());
			stm.setInt(2, pre.getIdProduto());
			stm.setInt(3, pre.getIdMercado());
			stm.setInt(4, pre.getId());
			stm.execute();
			stm.close();
			con.close();
			System.out.println("alterando preco: " + pre.getId());
		} catch(Exception e) {
			System.out.println(e.getMessage());
		}
	}

	@Override
	public Preco consultar(Integer id) {
		Preco pre = null;
		String sql = "select * from tb_precos inner join tb_produtos inner join tb_mercados where id_produto = tb_produtos.id and id_mercado = tb_mercados.id and id=?";
		try {
			Connection con = ConectaDB.conectar();
			PreparedStatement stm = con.prepareStatement(sql);
			stm.setInt(1,id);
			ResultSet rs = stm.executeQuery();
			if(rs.next()) {
				pre = new Preco(rs.getInt("id"), rs.getFloat("preco"), rs.getInt("id_produto"), rs.getInt("id_mercado"), rs.getString("produto"), rs.getString("mercado"));
			}
			rs.close();
			stm.close();
			con.close();
		} catch(Exception e) {
			System.out.println(e.getMessage());
		}
		return pre;
	}

	@Override
	public List<Preco> consultar() { return null; }

	public List<Float> consultarPrecos(Integer id) {
		List<Float> precos = new ArrayList<Float>();
		String sql = "select * from tb_precos inner join tb_produtos inner join tb_mercados where id_produto = tb_produtos.id and id_mercado = tb_mercados.id and id_produto=?";
		try {
			Connection con = ConectaDB.conectar();
			PreparedStatement stm = con.prepareStatement(sql);
			stm.setInt(1,id);
			ResultSet rs = stm.executeQuery();
			while(rs.next()) {
				Float pre = rs.getFloat("preco");
				precos.add(pre);
			}
			rs.close();
			stm.close();
			con.close();
		} catch(Exception e) {
			System.out.println(e.getMessage());
		}
		return precos;
	}

}
